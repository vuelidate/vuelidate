import maxLength from '../raw/maxLength'
// import { withMessage, withParams } from '../common'

export default (max) => ({
  $validator: maxLength(max),
  $message: ({ $params }) => `The maximum length allowed is ${$params.max}`,
  $params: { max }
})

// Still figuring out which is less error prone

// export default (max) => withMessage(
//   withParams({ max }, maxLength),
//   ({ $params }) => `The maximum length allowed is ${$params.max}`
// )
