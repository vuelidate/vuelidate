import requiredIf from '../requiredIf'

const T = () => true
const F = () => false
const promiseT = () => Promise.resolve(true)
const promiseF = () => Promise.resolve(false)

describe('requiredIf validator', () => {
  it('should not validate empty string when functional condition is met', () => {
    expect(requiredIf(T)('')).toBe(false)
  })

  it('should validate empty string when functional condition not met', () => {
    expect(requiredIf(F)('')).toBe(true)
  })

  it('should not validate empty string when simple boolean condition is met', () => {
    expect(requiredIf('prop')('')).toBe(false)
  })

  it('should validate empty string when simple boolean condition not met', () => {
    expect(requiredIf('')('')).toBe(true)
  })

  it('should return a promise when passed a promise condition', () => {
    const response = requiredIf(promiseT)('')
    expect(response).toHaveProperty('then') // is a promise
  })

  it('should validate value if condition is a truthy promise', async () => {
    expect(await requiredIf(promiseT)('')).toBe(false)
    expect(await requiredIf(promiseT)('someValue')).toBe(true)
  })

  it('should NOT validate value if condition is a falsy promise', async () => {
    expect(await requiredIf(promiseF)('')).toBe(true)
  })
})
