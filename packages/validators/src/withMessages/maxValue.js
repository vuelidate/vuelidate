import maxValue from '../raw/maxValue'

export default max => ({
  $validator: maxValue(max),
  $message: ({ $params }) => `The maximum value is ${$params.max}`,
  $params: { max }
})
