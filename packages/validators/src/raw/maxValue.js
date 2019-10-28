import { req } from '../common'
import { unwrap } from '../utils/common'

export default (max) =>
  (value) =>
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value <= +unwrap(max))
