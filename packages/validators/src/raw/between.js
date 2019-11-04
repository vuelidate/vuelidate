import { req } from '../common'
import { unwrap } from '../utils/common'

export default (min, max) =>
  (value) =>
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) &&
      +unwrap(min) <= +value &&
      +unwrap(max) >= +value)
