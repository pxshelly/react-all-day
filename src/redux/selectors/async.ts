import { emptyAsyncCall, AsyncCallState, State as AsyncState, AsyncStatus } from '../reducers/async';
import { RootState } from '../reducers';
import { createSelector } from 'reselect';

export function selectAsyncState(state: RootState): AsyncState {
  return state.async;
}

export function selectAsyncCall(state: RootState, id: string): AsyncCallState {
  return selectAsyncState(state).get(id, emptyAsyncCall);
}

export function selectAsyncStatus(state: RootState, id: string): AsyncStatus {
  return selectAsyncCall(state, id).status;
}

export function selectAsyncRefCount(state: RootState, id: string): number {
  return selectAsyncCall(state, id).refCount;
}

export const hasPendingAsyncCall = createSelector(
  selectAsyncState,
  (async) => async.some((s) => !!s && s.status === AsyncStatus.PENDING)
);
