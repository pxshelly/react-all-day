import * as React from "react";
import { connect } from "react-redux";
import { Store } from "redux";
import { actionCreators as asyncActions } from "./redux/actions/async";
import { RootState } from "./redux/reducers";
import { AsyncStatus } from "./redux/reducers/async";
import {
  selectAsyncRefCount,
  selectAsyncStatus
} from "./redux/selectors/async";

export interface AsyncTrackerProps {
  /** Potentially invoke `on*` methods on mount. This may cause unexpected results and is off by default. */
  callbackOnMount?: boolean;
  /**
   * The ID of the async call to track. May be initially left undefined when tracking async calls that use an
   * auto-generated ID.
   */
  id?: string;
  /** Content to render before the async call is started (AsyncStatus.NOT_STARTED). */
  initialContent?: JSX.Element;
  /** Function to call when the async call is cancelled. */
  onCancel?: () => void;
  /** Function to call when the async call is rejected. */
  onReject?: () => void;
  /** Function to call when the async call is resolved. */
  onResolve?: () => void;
  /** Function to call when the async call enters the PENDING status. It will never be called on mount. */
  onStart?: () => void;
  /** Rendered when the async call is pending (AsyncStatus.PENDING). */
  pendingContent?: JSX.Element;
  /**
   * Rendered when the async call is rejected (AsyncStatus.REJECTED). Nice for error messages that don't really
   * depend on the specific nature of the error.
   */
  rejectedContent?: JSX.Element;
  /**
   * Release the async state when unmounting this component. This will not affect pending async calls, which will
   * be cleaned up automatically after they finish. Use care when explicitly setting this to false; `releaseAsyncState`
   * must eventually be called or you will have a memory leak!
   */
  releaseOnUnmount?: boolean;
  /** Content to render when the async call is resolved (AsyncStatus.RESOLVED). */
  resolvedContent?: JSX.Element;
}

interface ConnectProps {
  status: AsyncStatus;
  refCount: number;
  releaseAsyncState: typeof asyncActions.releaseAsyncState;
  retainAsyncState: typeof asyncActions.retainAsyncState;
  store?: Store<RootState>;
}

type Props = AsyncTrackerProps & ConnectProps;

/**
 * A component for tracking asynchronous activity in the redux layer.
 *
 * This leverages the async actions and reducer to invoke callbacks as the state of a particular async call changes.
 *
 * A typical use-case for this would be invoking a callback (like a route transition) after the successful completion of
 * an API call.
 *
 * ```
 * <AsyncTracker id="login" onResolve={() => this.transitionTo('home')} />
 * ```
 *
 * Normally, without calling `retainAsyncState`, the status of an async call will only persist for a short time.
 * Under the hood, this component will retain the state of the async call while it's mounted and release it once
 * unmounted.
 */
class AsyncTracker extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    releaseOnUnmount: true
  };

  cancelTimeout?: number;
  /** This will be set to the call ID this component instance is watching once retainAsyncState is called. */
  retainedId?: string;
  rejectTimeout?: number;
  releaseTimeout?: number;
  resolveTimeout?: number;
  startTimeout?: number;

  componentDidMount() {
    const {
      callbackOnMount,
      onCancel,
      onReject,
      onResolve,
      onStart,
      status
    } = this.props;

    if (!callbackOnMount) return;

    if (onCancel && status === AsyncStatus.CANCELLED) {
      this.cancelTimeout = setTimeout(onCancel);
    } else if (onReject && status === AsyncStatus.REJECTED) {
      this.rejectTimeout = setTimeout(onReject);
    } else if (onResolve && status === AsyncStatus.RESOLVED) {
      this.resolveTimeout = setTimeout(onResolve);
    } else if (onStart && status === AsyncStatus.PENDING) {
      this.startTimeout = setTimeout(onStart);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      id,
      onCancel,
      onStart,
      onResolve,
      onReject,
      refCount,
      releaseAsyncState,
      retainAsyncState,
      status
    } = this.props;
    const {
      id: prevId,
      releaseOnUnmount: prevReleaseOnUnmount,
      status: prevStatus
    } = prevProps;

    if (prevStatus !== status) {
      if (onCancel && status === AsyncStatus.CANCELLED && prevId === id) {
        this.cancelTimeout = setTimeout(onCancel);
      } else if (onStart && status === AsyncStatus.PENDING) {
        this.startTimeout = setTimeout(onStart);
      } else if (onResolve && status === AsyncStatus.RESOLVED) {
        this.resolveTimeout = setTimeout(onResolve);
      } else if (onReject && status === AsyncStatus.REJECTED) {
        this.rejectTimeout = setTimeout(onReject);
      }
    }

    // When changing the ID we want to make sure we release the previous call if we were tracking something else.
    if (
      prevId !== id &&
      prevId !== undefined &&
      prevReleaseOnUnmount &&
      this.retainedId === prevId
    ) {
      releaseAsyncState(prevId);
      this.retainedId = undefined;
    }

    // This shouldn't happen!
    /* istanbul ignore if */
    if (refCount === 0 && this.retainedId === id) {
      this.retainedId = undefined;
      // tslint:disable-next-line no-console
      console.warn(
        `Incorrectly presumed retain was obtained, but refCount is zero for async call id ${id}`
      );
    }

    if (id !== this.retainedId) {
      // Retain the async state - this has to be careful not to call retain again once we've got the lock.
      if (id) retainAsyncState(id);
      this.retainedId = id;
    }
  }

  componentWillMount() {
    if (this.props.id) this.props.retainAsyncState(this.props.id);
    this.retainedId = this.props.id;
  }

  componentWillUnmount() {
    const { releaseOnUnmount, id, releaseAsyncState } = this.props;
    if (id && releaseOnUnmount) releaseAsyncState(id);
    clearTimeout(this.cancelTimeout);
    clearTimeout(this.rejectTimeout);
    clearTimeout(this.releaseTimeout);
    clearTimeout(this.resolveTimeout);
    clearTimeout(this.startTimeout);
  }

  render() {
    let content = null;

    switch (this.props.status) {
      case AsyncStatus.REJECTED:
        content = this.props.rejectedContent;
        break;
      case AsyncStatus.PENDING:
        content = this.props.pendingContent;
        break;
      case AsyncStatus.RESOLVED:
        content = this.props.resolvedContent;
        break;
      default:
        content = this.props.initialContent;
    }

    // Typescript gets mad if you return undefined. Boo.
    return content || null;
  }
}

const mapStateToProps = (state: RootState, props: AsyncTrackerProps) => ({
  refCount: selectAsyncRefCount(state, props.id || ""),
  status: selectAsyncStatus(state, props.id || "")
});

const mapDispatchToProps = {
  releaseAsyncState: asyncActions.releaseAsyncState,
  retainAsyncState: asyncActions.retainAsyncState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AsyncTracker);
