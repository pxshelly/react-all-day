/**
 * This is dispatched after the promise for an async call either resolves _or_
 * rejects.
 * If Bluebird is being used and the async call is still pending at this point
 * that means the promise was cancelled. Otherwise (especially with ordinary
 * Promises) this has no effect.
 */
export const ASYNC_FINISHED = "ASYNC_FINISHED";
/** The promise for an async call was rejected with an Error. */
export const ASYNC_REJECTED = "ASYNC_REJECTED";
/** The promise for an async call resolved successfully. */
export const ASYNC_RESOLVED = "ASYNC_RESOLVED";
/** This action is dispatched **before** an async call starts. */
export const ASYNC_STARTED = "ASYNC_STARTED";
/**
 * Drop the state if there are no containers retaining it, otherwise do nothing.
 * This should only ever be dispatched after a promise finishes. If another
 * promise starts with the same ID any pending calls to `cleanAsyncState` must
 * be aborted. This is not typically dispatched by components.
 */
export const CLEAN_ASYNC_STATE = "CLEAN_ASYNC_STATE";
export const INCREMENT = "INCREMENT";
/**
 * This is dispatched to indicate that a container is no longer interested in
 * the results of this async call (i.e. it has been unmounted).
 * When the async call is "finished" it is now eligible for deletion; otherwise
 * this action will just decrement the refCount. Importantly, it must not drop
 * the state for a pending async call!
 */
export const RELEASE_ASYNC_STATE = "RELEASE_ASYNC_STATE";
/**
 * This is dispatched to indicate that a container is interested in the results
 * of this async call.
 * The outcome of this action is pretty simple, just increment the refCount to
 * indicate that there's a container interested in this call.
 */
export const RETAIN_ASYNC_STATE = "RETAIN_ASYNC_STATE";
/**
 * This is dispatched after a fixed delay to garbage collect the results of
 * "fire and forget" async calls that are never retained. If the async call has
 * a nonzero refCount then the state will remain until the refCount hits zero.
 */
export const RESET_ASYNC_STATE = "RESET_ASYNC_STATE";
