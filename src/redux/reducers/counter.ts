import { CounterAction } from "../actions/counter";
import { INCREMENT } from "../constants";

export type State = Readonly<{
  value: number;
}>;

export const initialState: State = {
  value: 1
};

export const reducer = (state = initialState, action: CounterAction): State => {
  switch (action.type) {
    case INCREMENT:
      // The following antipattern is not allowed thanks to the Readonly type:
      // state.value += action.payload;
      // return state;
      return { ...state, value: state.value + action.payload };
    default:
      return state;
  }
};
