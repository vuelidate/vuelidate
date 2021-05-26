export const T = () => true
export const F = () => false
export const ValidatorResponseT = () => ({ $valid: true })
export const ValidatorResponseF = () => ({ $valid: false })
export const NormalizedT = { $validator: T }
export const NormalizedF = { $validator: F }
export const NormalizedValidatorResponseT = { $validator: ValidatorResponseT }
export const NormalizedValidatorResponseF = { $validator: ValidatorResponseF }
export const asyncT = () => Promise.resolve(true)
export const asyncF = () => Promise.resolve(false)
export const NormalizedAsyncT = { $validator: asyncT, $async: true }
export const NormalizedAsyncF = { $validator: asyncF, $async: true }
export const NormalizedAsyncValidatorResponseT = { $validator: () => Promise.resolve({ $valid: true }), $async: true }
export const NormalizedAsyncValidatorResponseF = { $validator: () => Promise.resolve({ $valid: false }), $async: true }
