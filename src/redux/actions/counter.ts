import * as Bluebird from "bluebird";
import { INCREMENT } from "../constants";
import { PayloadAction, ThunkAction } from "./interfaces";

export interface IncrementAction extends PayloadAction<number> {
  type: typeof INCREMENT;
}

export type CounterAction = IncrementAction;

export const actionCreators = {
  delayIncrement(amount: number = 1): ThunkAction<Bluebird<void>> {
    return dispatch => {
      return Bluebird.delay(1000).then(() => {
        dispatch(actionCreators.increment(amount));
      });
    };
  },

  increment(amount: number = 1): IncrementAction {
    return { payload: amount, type: INCREMENT };
  }
};
