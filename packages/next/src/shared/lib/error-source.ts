const symbolError = Symbol.for('NextjsError')

// An error that may have been tagged by `decorateServerError`.
type DecoratedError = Error & { [symbolError]?: ErrorSourceType }

export function getErrorSource(error: Error): 'server' | 'edge-server' | null {
  return (error as DecoratedError)[symbolError] || null
}

export type ErrorSourceType = 'edge-server' | 'server'

export function decorateServerError(error: Error, type: ErrorSourceType) {
  Object.defineProperty(error, symbolError, {
    writable: false,
    enumerable: false,
    configurable: false,
    value: type,
  })
}
