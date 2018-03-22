import { CounterAction } from '../actions/counter';
import { INCREMENT } from '../constants';
import { recordify, TypedRecord } from 'typed-immutable-record';

interface CounterState {
  value: number;
}

const counterDefaults: CounterState = {
  value: 1
};

export interface State extends TypedRecord<State>, CounterState { }

export const initialState = recordify<CounterState, State>(counterDefaults);

export const reducer = (state = initialState, action: CounterAction): State => {
  switch (action.type) {
    case INCREMENT:
      return state.set('value', state.value + action.payload);
    default:
      return state;
  }
};
