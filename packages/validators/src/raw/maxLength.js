import { req, len } from '../common'
import { unwrap } from '../utils/common'

export default (length) =>
  (value) => !req(value) || len(value) <= unwrap(length)
