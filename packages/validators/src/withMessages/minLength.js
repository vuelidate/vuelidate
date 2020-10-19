import minLength from '../raw/minLength'

export default (min) => ({
  $validator: minLength(min),
  $message: ({ $params }) => `This field should be at least ${$params.min} long.`,
  $params: { min }
})
