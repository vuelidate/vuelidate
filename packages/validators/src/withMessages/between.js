import between from '../raw/between'

export default (min, max) => ({
  $validator: between(min, max),
  $message: ({ $params }) => `The value must be between ${$params.min} and ${$params.max}`,
  $params: { min, max }
})
