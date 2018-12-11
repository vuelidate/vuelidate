import { regex } from './common'
const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-ZåÅäÄöÖ\-0-9]+\.)+[a-zA-Z]{2,}))$)/

export default regex('email', emailRegex)
