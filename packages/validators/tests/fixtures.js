export const T = () => true
export const F = () => false
export const ValidatorResponseT = () => ({ $valid: true })
export const ValidatorResponseF = () => ({ $valid: false })
export const NormalizedT = { $validator: T }
export const NormalizedF = { $validator: F }
export const NormalizedValidatorResponseT = { $validator: ValidatorResponseT }
export const NormalizedValidatorResponseF = { $validator: ValidatorResponseF }
