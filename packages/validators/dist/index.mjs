import { unref } from 'vue';

function isFunction (val) {
  return typeof val === 'function'
}

function isObject (o) {
  return o !== null && typeof o === 'object' && !Array.isArray(o)
}

/**
 * Returns a standard ValidatorObject
 * Wraps a plain function into a ValidatorObject
 * @param {NormalizedValidator|Function} validator
 * @return {NormalizedValidator}
 */
function normalizeValidatorObject (validator) {
  return isFunction(validator.$validator)
    ? { ...validator }
    : {
      $validator: validator
    }
}

function isPromise (object) {
  return isObject(object) && isFunction(object.then)
}

/**
 * Unwraps a ValidatorResponse object, into a boolean.
 * @param {ValidatorResponse} result
 * @return {boolean}
 */
function unwrapValidatorResponse (result) {
  if (typeof result === 'object') return result.$valid
  return result
}

/**
 * Unwraps a `NormalizedValidator` object, returning its validator function.
 * @param {NormalizedValidator | Function} validator
 * @return {function}
 */
function unwrapNormalizedValidator (validator) {
  return validator.$validator || validator
}

/**
 * Allows attaching parameters to a validator
 * @param {Object} $params
 * @param {NormalizedValidator|Function} $validator
 * @return {NormalizedValidator}
 */
function withParams ($params, $validator) {
  if (!isObject($params)) throw new Error(`[@vuelidate/validators]: First parameter to "withParams" should be an object, provided ${typeof $params}`)
  if (!isObject($validator) && !isFunction($validator)) throw new Error(`[@vuelidate/validators]: Validator must be a function or object with $validator parameter`)

  const validatorObj = normalizeValidatorObject($validator);

  validatorObj.$params = {
    ...(validatorObj.$params || {}),
    ...$params
  };

  return validatorObj
}

/**
 * @callback MessageCallback
 * @param {Object} params
 * @return String
 */

/**
 * Attaches a message to a validator
 * @param {MessageCallback | String} $message
 * @param {NormalizedValidator|Function} $validator
 * @return {NormalizedValidator}
 */
function withMessage ($message, $validator) {
  if (!isFunction($message) && typeof unref($message) !== 'string') throw new Error(`[@vuelidate/validators]: First parameter to "withMessage" should be string or a function returning a string, provided ${typeof $message}`)
  if (!isObject($validator) && !isFunction($validator)) throw new Error(`[@vuelidate/validators]: Validator must be a function or object with $validator parameter`)

  const validatorObj = normalizeValidatorObject($validator);
  validatorObj.$message = $message;

  return validatorObj
}

/**
 * @typedef {function(*): Promise<boolean|ValidatorResponse>} asyncValidator
 */

/**
 * @typedef {Ref<*>[]|function(*): *} watchTargets
 */

/**
 * Wraps validators that returns a Promise.
 * @param {asyncValidator} $validator
 * @param {watchTargets} $watchTargets
 * @return {{$async: boolean, $validator: asyncValidator, $watchTargets: watchTargets}}
 */
function withAsync ($validator, $watchTargets = []) {
  const validatorObj = normalizeValidatorObject($validator);
  return {
    ...validatorObj,
    $async: true,
    $watchTargets
  }
}

function forEach (validators) {
  return {
    $validator (collection, ...others) {
      // go over the collection. It can be a ref as well.
      return unref(collection).reduce((previous, collectionItem, index) => {
        // go over each property
        const collectionEntryResult = Object.entries(collectionItem).reduce((all, [property, $model]) => {
          // get the validators for this property
          const innerValidators = validators[property] || {};
          // go over each validator and run it
          const propertyResult = Object.entries(innerValidators).reduce((all, [validatorName, currentValidator]) => {
            // extract the validator. Supports simple and extended validators.
            const validatorFunction = unwrapNormalizedValidator(currentValidator);
            // Call the validator, passing the VM as this, the value, current iterated object and the rest.
            const $response = validatorFunction.call(this, $model, collectionItem, index, ...others);
            // extract the valid from the result
            const $valid = unwrapValidatorResponse($response);
            // store the entire response for later
            all.$data[validatorName] = $response;
            all.$data.$invalid = !$valid || !!all.$data.$invalid;
            all.$data.$error = all.$data.$invalid;
            // if not valid, get the $message
            if (!$valid) {
              let $message = currentValidator.$message || '';
              const $params = currentValidator.$params || {};
              // If $message is a function, we call it with the appropriate parameters
              if (typeof $message === 'function') {
                $message = $message({
                  $pending: false,
                  $invalid: !$valid,
                  $params,
                  $model,
                  $response
                });
              }
              // save the error object
              all.$errors.push({
                $property: property,
                $message,
                $params,
                $response,
                $model,
                $pending: false,
                $validator: validatorName
              });
            }
            return {
              $valid: all.$valid && $valid,
              $data: all.$data,
              $errors: all.$errors
            }
          }, { $valid: true, $data: {}, $errors: [] });

          all.$data[property] = propertyResult.$data;
          all.$errors[property] = propertyResult.$errors;

          return {
            $valid: all.$valid && propertyResult.$valid,
            $data: all.$data,
            $errors: all.$errors
          }
        }, { $valid: true, $data: {}, $errors: {} });

        return {
          $valid: previous.$valid && collectionEntryResult.$valid,
          $data: previous.$data.concat(collectionEntryResult.$data),
          $errors: previous.$errors.concat(collectionEntryResult.$errors)
        }
      }, { $valid: true, $data: [], $errors: [] })
    },
    // collect all the validation errors into a 2 dimensional array, for each entry in the collection, you have an array of error messages.
    $message: ({ $response }) => ($response
      ? $response.$errors.map((context) => {
        return Object.values(context).map(errors => errors.map(error => error.$message)).reduce((a, b) => a.concat(b), [])
      })
      : [])
  }
}

// "required" core, used in almost every validator to allow empty values


const req = (value) => {
  value = unref(value);
  if (Array.isArray(value)) return !!value.length
  if (value === undefined || value === null) {
    return false
  }

  if (value === false) {
    return true
  }

  if (value instanceof Date) {
    // invalid date won't pass
    return !isNaN(value.getTime())
  }

  if (typeof value === 'object') {
    for (let _ in value) return true
    return false
  }

  return !!String(value).length
};

/**
 * Returns the length of an arbitrary value
 * @param {Array|Object|String} value
 * @return {number}
 */
const len = (value) => {
  value = unref(value);
  if (Array.isArray(value)) return value.length
  if (typeof value === 'object') {
    return Object.keys(value).length
  }
  return String(value).length
};

/**
 * Regex based validator template
 * @param {RegExp} expr
 * @return {function(*=): boolean}
 */
function regex (...expr) {
  return (value) => {
    value = unref(value);
    return !req(value) || expr.every((reg) => {
      reg.lastIndex = 0;
      return reg.test(value)
    })
  }
}

var common = /*#__PURE__*/Object.freeze({
  __proto__: null,
  forEach: forEach,
  len: len,
  normalizeValidatorObject: normalizeValidatorObject,
  regex: regex,
  req: req,
  unwrap: unref,
  unwrapNormalizedValidator: unwrapNormalizedValidator,
  unwrapValidatorResponse: unwrapValidatorResponse,
  withAsync: withAsync,
  withMessage: withMessage,
  withParams: withParams
});

var alpha$1 = regex(/^[a-zA-Z]*$/);

/**
 * Validate if value is alphabetical string.
 * @type {NormalizedValidator}
 */
var alpha = {
  $validator: alpha$1,
  $message: 'The value is not alphabetical',
  $params: {
    type: 'alpha'
  }
};

var alphaNum$1 = regex(/^[a-zA-Z0-9]*$/);

/**
 * Validate if value is alpha-numeric string.
 * @type {NormalizedValidator}
 */
var alphaNum = {
  $validator: alphaNum$1,
  $message: 'The value must be alpha-numeric',
  $params: {
    type: 'alphaNum'
  }
};

var numeric$1 = regex(/^\d*(\.\d+)?$/);

/**
 * Check whether a value is numeric.
 * @type NormalizedValidator
 */
var numeric = {
  $validator: numeric$1,
  $message: 'Value must be numeric',
  $params: {
    type: 'numeric'
  }
};

/**
 * Check if a numeric value is between two values.
 * @param {Ref<Number> | Number} min
 * @param {Ref<Number> | Number} max
 * @return {function(*=): boolean}
 */
function between$1 (min, max) {
  return (value) =>
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) &&
      +unref(min) <= +value &&
      +unref(max) >= +value)
}

/**
 * Checks if a value is between two values.
 * @param {Ref<Number> | Number} min
 * @param {Ref<Number> | Number} max
 * @return {NormalizedValidator}
 */
function between (min, max) {
  return {
    $validator: between$1(min, max),
    $message: ({ $params }) => `The value must be between ${$params.min} and ${$params.max}`,
    $params: { min, max, type: 'between' }
  }
}

const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

var email$1 = regex(emailRegex);

/**
 * Validate if value is an email.
 * @type {NormalizedValidator}
 */
var email = {
  $validator: email$1,
  $message: 'Value is not a valid email address',
  $params: { type: 'email' }
};

/**
 * Check if a string is an IP Address
 * @param {String} value
 * @returns {boolean}
 */
function ipAddress$1 (value) {
  if (!req(value)) {
    return true
  }

  if (typeof value !== 'string') {
    return false
  }

  const nibbles = value.split('.');
  return nibbles.length === 4 && nibbles.every(nibbleValid)
}

const nibbleValid = (nibble) => {
  if (nibble.length > 3 || nibble.length === 0) {
    return false
  }

  if (nibble[0] === '0' && nibble !== '0') {
    return false
  }

  if (!nibble.match(/^\d+$/)) {
    return false
  }

  const numeric = +nibble | 0;
  return numeric >= 0 && numeric <= 255
};

/**
 * Validate if value is an ipAddress string.
 * @type {NormalizedValidator}
 */
var ipAddress = {
  $validator: ipAddress$1,
  $message: 'The value is not a valid IP address',
  $params: { type: 'ipAddress' }
};

/**
 * Check if value is a properly formatted Mac Address.
 * @param {String | Ref<String>} [separator]
 * @returns {function(*): boolean}
 */
function macAddress$1 (separator = ':') {
  return value => {
    separator = unref(separator);

    if (!req(value)) {
      return true
    }

    if (typeof value !== 'string') {
      return false
    }

    const parts =
      typeof separator === 'string' && separator !== ''
        ? value.split(separator)
        : value.length === 12 || value.length === 16
          ? value.match(/.{2}/g)
          : null;

    return (
      parts !== null &&
      (parts.length === 6 || parts.length === 8) &&
      parts.every(hexValid)
    )
  }
}

const hexValid = (hex) => hex.toLowerCase().match(/^[0-9a-f]{2}$/);

/**
 * Validate if value is a valid Mac Address string.
 * @returns {NormalizedValidator}
 */
function macAddress (separator) {
  return {
    $validator: macAddress$1(separator),
    $message: 'The value is not a valid MAC Address',
    $params: { type: 'macAddress' }
  }
}

/**
 * Check if provided value has a maximum length
 * @param {Number | Ref<Number>} length
 * @returns {function(Array|Object|String): boolean}
 */
function maxLength$1 (length) {
  return (value) => !req(value) || len(value) <= unref(length)
}

/**
 * Validate the max length of a string.
 * @param {Number} max
 * @return {NormalizedValidator}
 */
function maxLength (max) {
  return {
    $validator: maxLength$1(max),
    $message: ({ $params }) => `The maximum length allowed is ${$params.max}`,
    $params: { max, type: 'maxLength' }
  }
}

/**
 * Check if value is above a threshold.
 * @param {Number | Ref<Number>} length
 * @returns {function(Array|Object|String): boolean}
 */
function minLength$1 (length) {
  return value => !req(value) || len(value) >= unref(length)
}

/**
 * Check if value is above a threshold.
 * @param {Number | Ref<Number>} min
 * @returns {NormalizedValidator}
 */
function minLength (min) {
  return {
    $validator: minLength$1(min),
    $message: ({ $params }) => `This field should be at least ${$params.min} characters long`,
    $params: { min, type: 'minLength' }
  }
}

/**
 * Validates if a value is empty.
 * @param {String | Array | Date | Object} value
 * @returns {boolean}
 */
function required$1 (value) {
  if (typeof value === 'string') {
    value = value.trim();
  }
  return req(value)
}

/**
 * Check if a value is empty or not.
 * @type {NormalizedValidator}
 */
var required = {
  $validator: required$1,
  $message: 'Value is required',
  $params: {
    type: 'required'
  }
};

const validate$1 = (prop, val) => prop ? req(typeof val === 'string' ? val.trim() : val) : true;
/**
 * Returns required if the passed property is truthy
 * @param {Boolean | String | function(any): Boolean | Ref<string | boolean>} propOrFunction
 * @return {function(value: *, parentVM: object): Boolean}
 */
function requiredIf$1 (propOrFunction) {
  return function (value, parentVM) {
    if (typeof propOrFunction !== 'function') {
      return validate$1(unref(propOrFunction), value)
    }
    const result = propOrFunction.call(this, value, parentVM);
    return validate$1(result, value)
  }
}

/**
 * Returns required if the passed property is truthy
 * @param {Boolean | String | function(): (Boolean | Promise<boolean>)} prop
 * @return {NormalizedValidator}
 */
function requiredIf (prop) {
  return {
    $validator: requiredIf$1(prop),
    $message: 'The value is required',
    $params: { type: 'requiredIf', prop }
  }
}

const validate = (prop, val) => !prop ? req(typeof val === 'string' ? val.trim() : val) : true;
/**
 * Returns required if the passed property is falsy.
 * @param {Boolean | String | function(any): Boolean | Ref<string | boolean>} propOrFunction
 * @return {function(value: *, parentVM: object): Boolean}
 */
function requiredUnless$1 (propOrFunction) {
  return function (value, parentVM) {
    if (typeof propOrFunction !== 'function') {
      return validate(unref(propOrFunction), value)
    }
    const result = propOrFunction.call(this, value, parentVM);
    return validate(result, value)
  }
}

/**
 * Returns required unless the passed property is truthy
 * @param {Boolean | String | function(): (Boolean | Promise<boolean>)} prop
 * @return {NormalizedValidator}
 */
function requiredUnless (prop) {
  return {
    $validator: requiredUnless$1(prop),
    $message: 'The value is required',
    $params: { type: 'requiredUnless', prop }
  }
}

/**
 * Check if two values are identical.
 * @param {*} equalTo
 * @return {function(*=): boolean}
 */
function sameAs$1 (equalTo) {
  return value => unref(value) === unref(equalTo)
}

/**
 * Check if two values are identical
 * @param {*} equalTo
 * @param {String} [otherName]
 * @return {NormalizedValidator}
 */
function sameAs (equalTo, otherName = 'other') {
  return {
    $validator: sameAs$1(equalTo),
    $message: ({ $params }) => `The value must be equal to the ${otherName} value`,
    $params: { equalTo, otherName, type: 'sameAs' }
  }
}

/**
 * Regex taken from {@link https://gist.github.com/dperini/729294}
 */
const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

var url$1 = regex(urlRegex);

/**
 * Check if a value is a url
 * @type {NormalizedValidator}
 */
var url = {
  $validator: url$1,
  $message: 'The value is not a valid URL address',
  $params: {
    type: 'url'
  }
};

function syncOr (validators) {
  return function (...args) {
    return validators.reduce((valid, fn) => {
      if (unwrapValidatorResponse(valid)) return valid
      return unwrapNormalizedValidator(fn).apply(this, args)
    }, false)
  }
}

function asyncOr (validators) {
  return function (...args) {
    return validators
      .reduce(async (valid, fn) => {
        const r = await valid;
        if (unwrapValidatorResponse(r)) return r
        return unwrapNormalizedValidator(fn).apply(this, args)
      }, Promise.resolve(false))
  }
}

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {{$validator: function(...[*]=): (boolean | Promise<boolean>), $async: boolean, $watchTargets: any[]}}
 */
function or$1 (...validators) {
  const $async = validators.some(v => v.$async);
  const $watchTargets = validators.reduce((all, v) => {
    if (!v.$watchTargets) return all
    return all.concat(v.$watchTargets)
  }, []);
  let $validator = () => false;
  if (validators.length) $validator = $async ? asyncOr(validators) : syncOr(validators);
  return {
    $async,
    $validator,
    $watchTargets
  }
}

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {NormalizedValidator}
 */
function or (...validators) {
  return withParams({ type: 'or' },
    withMessage('The value does not match any of the provided validators',
      or$1(...validators))
  )
}

function syncAnd (validators) {
  return function (...args) {
    return validators.reduce((valid, fn) => {
      if (!unwrapValidatorResponse(valid)) return valid
      return unwrapNormalizedValidator(fn).apply(this, args)
    }, true)
  }
}

/**
 *
 * @param validators
 * @return {function(...[*]=): Promise<boolean>}
 */
function asyncAnd (validators) {
  return function (...args) {
    return validators.reduce(async (valid, fn) => {
      const r = await valid;
      if (!unwrapValidatorResponse(r)) return r
      return unwrapNormalizedValidator(fn).apply(this, args)
    }, Promise.resolve(true))
  }
}

/**
 * Returns true when all validators are truthy
 * @param {...(NormalizedValidator | Function)} validators
 * @return {{$validator: function(...[*]=): (boolean | Promise<boolean>), $async: boolean, $watchTargets: any[]}}
 */
function and$1 (...validators) {
  const $async = validators.some(v => v.$async);
  const $watchTargets = validators.reduce((all, v) => {
    if (!v.$watchTargets) return all
    return all.concat(v.$watchTargets)
  }, []);
  let $validator = () => false;
  if (validators.length) $validator = $async ? asyncAnd(validators) : syncAnd(validators);
  return {
    $async,
    $validator,
    $watchTargets
  }
}

/**
 * Validate if all validators match.
 * @param {...*} validators
 * @returns {NormalizedValidator}
 */
function and (...validators) {
  return withParams({ type: 'and' },
    withMessage('The value does not match all of the provided validators',
      and$1(...validators)
    )
  )
}

/**
 * Swaps the result of a value
 * @param {NormalizedValidator|Function} validator
 * @returns {function(*=, *=): boolean}
 */
function not$1 (validator) {
  return function (value, vm) {
    if (!req(value)) return true
    const response = unwrapNormalizedValidator(validator).call(this, value, vm);
    if (!isPromise(response)) return !unwrapValidatorResponse(response)
    return response.then(r => !unwrapValidatorResponse(r))
  }
}

/**
 * Swaps the result of a value
 * @param {NormalizedValidator|Function} validator
 * @returns {NormalizedValidator}
 */
function not (validator) {
  return {
    $validator: not$1(validator),
    $message: `The value does not match the provided validator`,
    $params: {
      type: 'not'
    }
  }
}

/**
 * Check if a value is above a threshold.
 * @param {String | Number | Ref<Number> | Ref<String>} min
 * @returns {function(*=): boolean}
 */
function minValue$1 (min) {
  return (value) =>
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value >= +unref(min))
}

/**
 * Check if a value is above a threshold.
 * @param {String | Number | Ref<Number> | Ref<String>} min
 * @returns {NormalizedValidator}
 */
function minValue (min) {
  return {
    $validator: minValue$1(min),
    $message: ({ $params }) => `The minimum value allowed is ${$params.min}`,
    $params: { min, type: 'minValue' }
  }
}

/**
 * Check if value is below a threshold.
 * @param {Number | Ref<Number> | Ref<String>} max
 * @returns {function(*=): boolean}
 */
function maxValue$1 (max) {
  return value =>
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value <= +unref(max))
}

/**
 * Check if value is below a threshold.
 * @param {Number | Ref<Number> | Ref<String>} max
 * @return {NormalizedValidator}
 */
var maxValue = max => ({
  $validator: maxValue$1(max),
  $message: ({ $params }) => `The maximum value allowed is ${$params.max}`,
  $params: { max, type: 'maxValue' }
});

// ^[0-9]*$ - for empty string and positive integer
// ^-[0-9]+$ - only for negative integer (minus sign without at least 1 digit is not a number)
var integer$1 = regex(/(^[0-9]*$)|(^-[0-9]+$)/);

/**
 * Validate if value is integer.
 * @type {NormalizedValidator}
 */
var integer = {
  $validator: integer$1,
  $message: 'Value is not an integer',
  $params: { type: 'integer' }
};

var decimal$1 = regex(/^[-]?\d*(\.\d+)?$/);

/**
 * Validate if value is decimal number.
 * @type {NormalizedValidator}
 */
var decimal = {
  $validator: decimal$1,
  $message: 'Value must be decimal',
  $params: { type: 'decimal' }
};

/**
 * Creates a translatable version of `withMessage` helper.
 * @param {function} t - the translation function of your choice
 * @param {function} [messagePath] - a function to generate the message path, passed to `t` for each message. By default it is `validations.${$validator}`
 * @param {function} [messageParams] - a function to augment the params, passed to `t` for each message.
 */
function createI18nMessage ({
  t,
  messagePath = ({ $validator }) => `validations.${$validator}`,
  messageParams = (params) => params
}) {
  return function withI18nMessage (
    validator,
    {
      withArguments = false,
      messagePath: localMessagePath = messagePath,
      messageParams: localMessageParams = messageParams
    } = {}
  ) {
    function message (props) {
      return t(localMessagePath(props), localMessageParams({
        model: props.$model,
        property: props.$property,
        pending: props.$pending,
        invalid: props.$invalid,
        response: props.$response,
        validator: props.$validator,
        propertyPath: props.$propertyPath,
        ...props.$params
      }))
    }

    if (withArguments && typeof validator === 'function') {
      return (...args) => withMessage(message, validator(...args))
    }

    return withMessage(message, validator)
  }
}

export { alpha, alphaNum, and, between, createI18nMessage, decimal, email, common as helpers, integer, ipAddress, macAddress, maxLength, maxValue, minLength, minValue, not, numeric, or, required, requiredIf, requiredUnless, sameAs, url };
