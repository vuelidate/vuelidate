import { unwrap } from '../utils/common'

export default equalTo => value => unwrap(value) === unwrap(equalTo)
