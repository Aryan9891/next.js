// The fields React sets on a thenable once it has been tracked by `use()`.
type FulfilledPromise<T> = Promise<T> & { status?: 'fulfilled'; value?: T }

// A fulfilled thenable that React can unwrap synchronously via `use()` without
// ever suspending. Reusing a single instance avoids allocating on every call.
const resolvedIOPromise: Promise<void> = Promise.resolve(undefined)
;(resolvedIOPromise as FulfilledPromise<void>).status = 'fulfilled'
;(resolvedIOPromise as FulfilledPromise<void>).value = undefined

/**
 * Browser implementation of io(). On the client there is no
 * prerender context so we always resolve immediately.
 */
export function io(): Promise<void> {
  return resolvedIOPromise
}
