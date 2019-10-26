import { req, len } from './core'
import { unwrap } from '../utils/common'

export default value => !req(value) || len(value) >= unwrap(length)
