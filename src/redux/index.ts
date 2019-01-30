import { applyMiddleware, compose, createStore, Middleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers";

const composeEnhancers =
  (process.env.NODE_ENV === "development" &&
    window &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // tslint:disable-line no-any
  compose;

export function configureStore(opts?: { enableLogger: boolean }) {
  // configure middlewares
  const middlewares: Middleware[] = [thunk];

  /* istanbul ignore if */
  if (opts && opts.enableLogger) {
    middlewares.push(
      createLogger({
        collapsed: true,
        duration: true,
        diff: true
      })
    );
  }

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  // create store
  return createStore(rootReducer, enhancer);
}
