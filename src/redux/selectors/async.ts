import { createSelector } from "reselect";
import { RootState } from "../reducers";
import { AsyncCall, AsyncStatus, emptyAsyncCall } from "../reducers/async";

export function selectAsyncCall(state: RootState, id: string): AsyncCall {
  return state.async[id] || emptyAsyncCall;
}

export function selectAsyncStatus(state: RootState, id: string): AsyncStatus {
  return selectAsyncCall(state, id).status;
}

export function selectAsyncRefCount(state: RootState, id: string): number {
  return selectAsyncCall(state, id).refCount;
}

export const hasPendingAsyncCall = createSelector(
  (state: RootState) => state.async,
  async =>
    Object.keys(async).some(k => {
      const call = async[k];
      return call !== undefined && call.status === AsyncStatus.PENDING;
    })
);
