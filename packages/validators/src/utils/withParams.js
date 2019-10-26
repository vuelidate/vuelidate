/**
 * Allows attaching parameters to a validator
 * @param {Function | Object} $validator
 * @param {Object} $params
 * @return {{$params: *, $validator: *}}
 */
export default function withParams ($validator, $params) {
  if (typeof $validator === 'function') {
    // merge
  }
  return {
    $validator,
    $params: Object.assign($validator.$params, $params) // Maybe we can merge into the already existing params, augmenting the reference instead of copying the properties.
  }
}
