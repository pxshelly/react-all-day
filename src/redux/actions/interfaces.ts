/**
 * These interfaces make it easy for reducer functions to take advantage of fully-typed Action payloads through the use
 * of discriminated unions and switch statements in Typescript:
 * http://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { AsyncAction } from "./async";

import { RootState } from "../reducers";
import { CounterAction } from "./counter";

/**
 * A generic action type. Prefer using the more specific PayloadAction, Action, or MetaAction interfaces instead.
 */
export interface GenericAction<P, M> {
  error?: boolean;
  payload?: P;
  meta?: M;
  type: string;
}

/** An action with a non-optional payload and metadata. */
export interface Action<P, M> extends GenericAction<P, M> {
  payload: P;
  meta: M;
}

/** An action with a non-optional payload. */
export interface PayloadAction<P> extends GenericAction<P, void> {
  payload: P;
}

/** An action without a payload but with non-optional metadata. */
export interface MetaAction<M> extends GenericAction<void, M> {
  meta: M;
}

/** No payload, no metadata, just an action type. */
export type VoidAction = GenericAction<void, void>;

// tslint:disable-next-line no-any
export type AnyAction = GenericAction<any, any>;

/** All action types that may be dispatched by the application. */
export type RootAction = AsyncAction | CounterAction;

export type RootDispatch = Dispatch<RootAction>;

export type ThunkAction<R> = ThunkAction<R, RootState, {}, RootAction>;
