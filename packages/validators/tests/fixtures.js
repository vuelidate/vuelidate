export const trueValidatorResponse = { $valid: true, $data: {} }
export const falseValidatorResponse = { $valid: false, $data: {} }
export const T = () => true
export const F = () => false
export const ValidatorResponseT = () => (trueValidatorResponse)
export const ValidatorResponseF = () => (falseValidatorResponse)
export const NormalizedT = { $validator: T }
export const NormalizedF = { $validator: F }
export const NormalizedValidatorResponseT = { $validator: ValidatorResponseT }
export const NormalizedValidatorResponseF = { $validator: ValidatorResponseF }
export const asyncT = () => Promise.resolve(true)
export const asyncF = () => Promise.resolve(false)
export const NormalizedAsyncT = { $validator: asyncT, $async: true }
export const NormalizedAsyncF = { $validator: asyncF, $async: true }
export const NormalizedAsyncValidatorResponseT = { $validator: () => Promise.resolve(trueValidatorResponse), $async: true }
export const NormalizedAsyncValidatorResponseF = { $validator: () => Promise.resolve(falseValidatorResponse), $async: true }
