import { combineReducers } from 'redux';
import { reducer as async, State as AsyncState } from './async';
import { reducer as counter, State as CounterState } from './counter';

export interface RootState {
  async: AsyncState;
  counter: CounterState;
}

export const rootReducer = combineReducers<RootState>({
  async,
  counter
});
