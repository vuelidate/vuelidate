import { unwrap } from '../utils/common'

export default equalTo => value => value === unwrap(equalTo)
