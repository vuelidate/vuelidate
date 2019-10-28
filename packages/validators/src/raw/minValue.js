import { req } from '../common'
import { unwrap } from '../utils/common'

export default (min) =>
  (value) =>
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value >= +unwrap(min))
