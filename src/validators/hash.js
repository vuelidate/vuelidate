import isHash from 'validator/lib/isHash'
import { withParams, req } from './common'

/**
 * The algorithm type
 * @typedef {('md4' | 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'ripemd128' | 'ripemd160' | 'tiger128' | 'tiger160' | 'tiger192' | 'crc32' | 'crc32b')} Algorithm
 */

/**
 * Check if the string is a hash of type algorithm
 *
 * @param {Algorithm} algorithm - The algorithm type
 */
export default (algorithm) =>
  withParams(
    { type: 'hash', algorithm },
    (value) => !req(value) || isHash(value, algorithm)
  )
