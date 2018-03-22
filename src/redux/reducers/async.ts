import { Map } from 'immutable';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';
import {
  ASYNC_FINISHED,
  ASYNC_REJECTED,
  ASYNC_RESOLVED,
  ASYNC_STARTED,
  CLEAN_ASYNC_STATE,
  RELEASE_ASYNC_STATE,
  RESET_ASYNC_STATE,
  RETAIN_ASYNC_STATE
} from '../constants';
import { RootAction } from '../actions';

export enum AsyncStatus {
  NOT_STARTED,
  PENDING,
  RESOLVED,
  REJECTED,
  CANCELLED
}

interface AsyncCall {
  refCount: number;
  status: AsyncStatus;
}

const asyncCallDefaults: AsyncCall = {
  refCount: 0,
  status: AsyncStatus.NOT_STARTED
};

export interface AsyncCallState extends TypedRecord<AsyncCallState>, AsyncCall { }

export const createAsyncCall = makeTypedFactory<AsyncCall, AsyncCallState>(asyncCallDefaults);

export const emptyAsyncCall = createAsyncCall(asyncCallDefaults);

export type State = Map<string, AsyncCallState>;

export const initialState: State = Map();

export const reducer = (state = initialState, action: RootAction) => {
  let id: string;
  let asyncCall;

  switch (action.type) {
    case ASYNC_FINISHED:
      // If the async call is still pending at this point that means the promise was cancelled. Otherwise, this means
      // nothing.
      id = action.meta.asyncId;
      asyncCall = state.get(id, emptyAsyncCall);
      return asyncCall.status === AsyncStatus.PENDING
        ? state.setIn([id, 'status'], AsyncStatus.CANCELLED)
        : state;

    case ASYNC_REJECTED:
      id = action.meta.asyncId;
      if (!state.has(id)) throw new Error(`Attempted to reject an untracked async call (${id}.`);
      return state.setIn([id, 'status'], AsyncStatus.REJECTED);

    case ASYNC_RESOLVED:
      id = action.meta.asyncId;
      if (!state.has(id)) throw new Error(`Attempted to resolve an untracked async call (${id}).`);
      return state.setIn([id, 'status'], AsyncStatus.RESOLVED);

    case ASYNC_STARTED:
      id = action.meta.asyncId;
      asyncCall = state.get(id, emptyAsyncCall);
      return state.set(id, createAsyncCall({ refCount: asyncCall.refCount, status: AsyncStatus.PENDING }));

    case CLEAN_ASYNC_STATE:
      id = action.meta.asyncId;
      asyncCall = state.get(id, emptyAsyncCall);

      // Drop the state if there are no containers retaining it, otherwise do nothing.
      if (!state.has(id)) return state;

      // This should only ever be dispatched after a promise finishes. If another promise starts with the same ID any
      // pending calls to `cleanAsyncState` must be aborted.
      if (asyncCall.status === AsyncStatus.PENDING) {
        throw new Error(`Attempted to clean an async call (${id}) in pending status.`);
      }

      return asyncCall.refCount <= 0 ? state.remove(id) : state;

    case RELEASE_ASYNC_STATE:
      id = action.meta.asyncId;
      asyncCall = state.get(id, emptyAsyncCall);
      const { refCount, status } = asyncCall;

      if (refCount <= 0) console.warn(`Attempted to release an async call (id ${id}) while refcount is less than 1.`);

      // When the async call is "finished" it is now eligible for deletion; otherwise just decrement the refCount.
      // Importantly, we cannot drop the state for a pending async call!
      return status !== AsyncStatus.PENDING && refCount <= 1
        ? state.remove(id)
        : state.set(id, asyncCall.set('refCount', refCount - 1));

    case RESET_ASYNC_STATE:
      id = action.meta.asyncId;
      const curStatus = state.getIn([id, 'status']);
      return (curStatus === AsyncStatus.REJECTED || curStatus === AsyncStatus.RESOLVED)
        ? state.setIn([id, 'status'], AsyncStatus.NOT_STARTED)
        : state;

    case RETAIN_ASYNC_STATE:
      id = action.meta.asyncId;
      asyncCall = state.get(id, emptyAsyncCall);
      // Pretty simple, just increment the refCount to indicate that there's a container interested in this call.
      return state.set(id, asyncCall.set('refCount', asyncCall.refCount + 1));

    default:
      return state;
  }
};
