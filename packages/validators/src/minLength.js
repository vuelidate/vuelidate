import minLength from './raw/minLength'

export default length => ({
  $validator: minLength,
  $message: ({ $params }) => `This field should be at least ${$params.length} long.`,
  $params: { length }
})
