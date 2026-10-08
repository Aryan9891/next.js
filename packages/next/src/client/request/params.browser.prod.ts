import type { Params } from '../../server/request/params'

// The fields React sets on a thenable once it has been tracked by `use()`.
type FulfilledPromise<T> = Promise<T> & { status?: 'fulfilled'; value?: T }

interface CacheLifetime {}
const CachedParams = new WeakMap<CacheLifetime, Promise<Params>>()

function makeUntrackedParams(underlyingParams: Params): Promise<Params> {
  const cachedParams = CachedParams.get(underlyingParams)
  if (cachedParams) {
    return cachedParams
  }

  const promise = Promise.resolve(underlyingParams)
  // Mark it as fulfilled the way React does once it has tracked it, so `use()`
  // can unwrap it without suspending.
  ;(promise as FulfilledPromise<Params>).status = 'fulfilled'
  ;(promise as FulfilledPromise<Params>).value = underlyingParams
  CachedParams.set(underlyingParams, promise)

  return promise
}

export function createRenderParamsFromClient(
  clientParams: Params
): Promise<Params> {
  return makeUntrackedParams(clientParams)
}
