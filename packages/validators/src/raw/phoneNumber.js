import { regex } from '../common'

const phoneRegex = /^\+?\d{0,3}[\(\- ]?\d{3}\)?[\- ]?\d{3,4}[\- ]?\d{4}/

export default regex(phoneRegex)
