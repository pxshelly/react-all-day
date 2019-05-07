import { combineReducers } from "redux";
import { reducer as counter, State as CounterState } from "./counter";

export interface RootState {
  counter: CounterState;
}

export const rootReducer = combineReducers<RootState>({
  counter
});
