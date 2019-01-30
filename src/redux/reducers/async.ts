import { RootAction } from "../actions";
import {
  ASYNC_FINISHED,
  ASYNC_REJECTED,
  ASYNC_RESOLVED,
  ASYNC_STARTED,
  CLEAN_ASYNC_STATE,
  RELEASE_ASYNC_STATE,
  RESET_ASYNC_STATE,
  RETAIN_ASYNC_STATE
} from "../constants";

export enum AsyncStatus {
  NOT_STARTED,
  PENDING,
  RESOLVED,
  REJECTED,
  CANCELLED
}

export type AsyncCall = Readonly<{
  refCount: number;
  status: AsyncStatus;
}>;

export const emptyAsyncCall: AsyncCall = {
  refCount: 0,
  status: AsyncStatus.NOT_STARTED
};

export interface State {
  readonly [asyncId: string]: AsyncCall | undefined;
}

export const initialState: State = {};

export const reducer = (state = initialState, action: RootAction) => {
  let id: string;
  let asyncCall;

  switch (action.type) {
    case ASYNC_FINISHED:
      id = action.meta.asyncId;
      asyncCall = state[id] || emptyAsyncCall;
      if (asyncCall.status !== AsyncStatus.PENDING) return state;
      asyncCall = { ...asyncCall, status: AsyncStatus.CANCELLED };
      return { ...state, [id]: asyncCall };

    case ASYNC_REJECTED:
      id = action.meta.asyncId;
      asyncCall = state[id];
      if (asyncCall === undefined)
        throw new Error(`Attempted to reject an untracked async call (${id}.`);
      asyncCall = { ...asyncCall, status: AsyncStatus.REJECTED };
      return { ...state, [id]: asyncCall };

    case ASYNC_RESOLVED:
      id = action.meta.asyncId;
      asyncCall = state[id];
      if (asyncCall === undefined)
        throw new Error(
          `Attempted to resolve an untracked async call (${id}).`
        );
      asyncCall = { ...asyncCall, status: AsyncStatus.RESOLVED };
      return { ...state, [id]: asyncCall };

    case ASYNC_STARTED:
      id = action.meta.asyncId;
      asyncCall = state[id] || emptyAsyncCall;
      asyncCall = { ...asyncCall, status: AsyncStatus.PENDING };
      return { ...state, [id]: asyncCall };

    case CLEAN_ASYNC_STATE:
      id = action.meta.asyncId;
      asyncCall = state[id];

      if (asyncCall === undefined) return state;

      if (asyncCall.status === AsyncStatus.PENDING) {
        throw new Error(
          `Attempted to clean an async call (${id}) in pending status.`
        );
      }

      return asyncCall.refCount <= 0 ? { ...state, [id]: undefined } : state;

    case RELEASE_ASYNC_STATE:
      id = action.meta.asyncId;
      asyncCall = state[id] || emptyAsyncCall;
      const { refCount, status } = asyncCall;

      if (refCount <= 0)
        console.warn(
          `Attempted to release an async call (id ${id}) while refcount is less than 1.`
        );

      if (status !== AsyncStatus.PENDING && refCount <= 1) {
        return { ...state, [id]: undefined };
      }
      asyncCall = { ...asyncCall, refCount: asyncCall.refCount - 1 };
      return { ...state, [id]: asyncCall };

    case RESET_ASYNC_STATE:
      id = action.meta.asyncId;
      asyncCall = state[id] || emptyAsyncCall;
      const curStatus = asyncCall.status;
      if (
        curStatus === AsyncStatus.REJECTED ||
        curStatus === AsyncStatus.RESOLVED
      ) {
        asyncCall = { ...asyncCall, status: AsyncStatus.NOT_STARTED };
        return { ...state, [id]: asyncCall };
      }
      return state;

    case RETAIN_ASYNC_STATE:
      id = action.meta.asyncId;
      asyncCall = state[id] || emptyAsyncCall;
      asyncCall = { ...asyncCall, refCount: asyncCall.refCount + 1 };
      return { ...state, [id]: asyncCall };

    default:
      return state;
  }
};
