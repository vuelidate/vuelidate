import Vue from 'vue'
import { withParams } from 'src'

const isEven = withParams({ type: 'isEven' }, (v) => {
  return v % 2 === 0
})

const isOdd = withParams({ type: 'isOdd' }, (v) => {
  return v % 2 === 1
})

const noUndef = withParams({type: 'noUndef'}, (v) => v !== undefined)

const T = () => true
const F = () => false

const base = {
  data () {
    return {
      value: 4
    }
  }
}

const baseGroup = {
  data () {
    return {
      value1: 1,
      value2: 2,
      nested: {
        value3: 3,
        value4: 4
      }
    }
  }
}

describe('Validation plugin', () => {
  it('should not have a $v key if not used', () => {
    const vm = new Vue(base)
    expect(vm.$v).to.not.exist
  })

  it('should have a $v key defined if used', () => {
    const vm = new Vue({
      ...base,
      validations: {
        value: { isEven }
      }
    })
    expect(vm.$v).to.exist
  })

  it('should not leak vue instances on destroy', () => {
    const vm = new Vue({
      ...base,
      validations: {
        value: { isEven }
      }
    })

    vm.$v
    const vRef = vm._vuelidate
    vm.$destroy()
    expect(vRef._isDestroyed).to.be.true
    expect(vm._vuelidate).to.be.null
  })

  it('should allow watching a $v state', (done) => {
    const vm = new Vue({
      ...base,
      validations: {
        value: { isEven }
      },
      watch: {
        '$v.value.$invalid' (v, oldv) {
          expect(v).to.be.true
          expect(oldv).to.be.false
          done()
        }
      }
    })
    vm.value = 123
  })

  it('should have a $v key while not overriding existing computed', () => {
    const vm = new Vue({
      ...base,
      validations: {
        value: { isEven }
      },
      computed: {
        x () {
          return 1
        }
      }
    })
    expect(vm.$v).to.exist
    expect(vm.x).to.equal(1)
  })

  it('should have a $v key defined if used as function', () => {
    const vm = new Vue({
      ...base,
      validations () {
        return {
          value: { isEven }
        }
      }
    })
    expect(vm.$v).to.exist
  })

  it('should not interfere with lifecycle hooks', () => {
    const createSpy = sinon.spy()
    const Ctor = Vue.extend({
      created: createSpy,
      ...base,
      validations: {}
    })
    const vm = new Ctor()
    expect(vm.$v).to.exist
    expect(createSpy).to.have.been.calledOnce
  })

  describe('Async', () => {
    function setupAsync () {
      let resolvePromise = {resolve: null, reject: null}
      const asyncVal = (val) => {
        if (val === '') return true
        return new Promise((resolve, reject) => {
          resolvePromise.resolve = resolve
          resolvePromise.reject = reject
        })
      }

      const vm = new Vue({
        data: { value: '' },
        validations: {
          value: { asyncVal }
        }
      })
      return { resolvePromise, vm }
    }

    it('$pending should be false on initialization for empty value', () => {
      const { vm } = setupAsync()
      expect(vm.$v.value.$pending).to.be.false
    })

    it('$pending should be true immediately after value change', () => {
      const { vm } = setupAsync()
      vm.value = 'x1'
      expect(vm.$v.value.$pending).to.be.true
    })

    it('$pending should cascade to root $v', () => {
      const { vm } = setupAsync()
      vm.value = 'x1'
      expect(vm.$v.$pending).to.be.true
    })

    it('should not be computed without getter evaluation', () => {
      const { resolvePromise, vm } = setupAsync()
      vm.value = 'x1'
      expect(resolvePromise.resolve).to.equal(null)
    })

    it('$pending should be false tick after promise resolve', (done) => {
      const { resolvePromise, vm } = setupAsync()
      vm.value = 'x1'
      vm.$v.value.asyncVal // execute getter
      resolvePromise.resolve(true)
      Promise.resolve().then(() => {
        expect(vm.$v.value.$pending).to.be.false
        done()
      })
    })

    it('asyncVal value should be false just after value change', () => {
      const { vm } = setupAsync()
      vm.value = 'x1'
      expect(vm.$v.value.asyncVal).to.be.false
    })

    it('asyncVal value should be true after promise resolve', (done) => {
      const { resolvePromise, vm } = setupAsync()
      vm.value = 'x1'
      vm.$v.value.asyncVal // execute getter
      resolvePromise.resolve(true)
      Promise.resolve().then(() => {
        expect(vm.$v.value.asyncVal).to.be.true
        done()
      })
    })

    it('asyncVal value should be false after promise reject', (done) => {
      const { resolvePromise, vm } = setupAsync()
      vm.value = 'x1'
      vm.$v.value.asyncVal // execute getter
      resolvePromise.reject(new Error('test reject'))
      Promise.resolve().then(() => {
        expect(vm.$v.value.asyncVal).to.be.false
        done()
      })
    })
  })

  describe('$v.value.$dirty', () => {
    it('should have a $dirty set to false on initialization', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: { isEven }
        }
      })
      expect(vm.$v.value.$dirty).to.be.false
    })

    it('should preserve $dirty flag on validation recomputation', () => {
      const vm = new Vue({
        data: {
          out: false,
          value: 1,
          value2: 2
        },
        validations () {
          return {
            value: { fn: this.out ? T : F },
            value2: { fn: this.out ? T : F }
          }
        }
      })

      vm.$v.value.$touch()
      vm.out = true
      expect(vm.$v.value.$dirty).to.be.true
      expect(vm.$v.value2.$dirty).to.be.false
    })

    it('should have a $error set to false on initialization', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: { isEven }
        }
      })
      expect(vm.$v.value.$error).to.be.false
    })
    it('should have a $error false on dirty valid', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: { isEven }
        }
      })
      vm.$v.value.$touch()
      expect(vm.$v.value.$error).to.be.false
    })
    it('should have a $error true on dirty invalid', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: { isOdd }
        }
      })
      vm.$v.value.$touch()
      expect(vm.$v.value.$error).to.be.true
    })
    it('should have a $error false on clean invalid', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: { isOdd }
        }
      })
      expect(vm.$v.value.$error).to.be.false
    })
    it('should have a $dirty set to true after $touch', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: { isEven }
        }
      })
      vm.$v.value.$touch()
      expect(vm.$v.value.$dirty).to.be.true
    })
    it('should have a $dirty set to false after $reset', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: { isEven }
        }
      })
      vm.$v.value.$touch()
      vm.$v.value.$reset()
      expect(vm.$v.value.$dirty).to.be.false
    })
    describe('for nested validators', () => {
      it('should have nested $dirty false on initialization', () => {
        const vm = new Vue({
          ...baseGroup,
          validations: {
            nested: {
              value1: { T },
              value2: { T }
            }
          }
        })
        expect(vm.$v.nested.$dirty).to.be.false
      })
      it('should have nested.$dirty false when only one value is $dirty', () => {
        const vm = new Vue({
          ...baseGroup,
          validations: {
            nested: {
              value1: { T },
              value2: { T }
            }
          }
        })
        vm.$v.nested.value1.$touch()
        expect(vm.$v.nested.$dirty).to.be.false
      })
      it('should have nested.$dirty true when all values are $dirty', () => {
        const vm = new Vue({
          ...baseGroup,
          validations: {
            nested: {
              value1: { T },
              value2: { T }
            }
          }
        })
        vm.$v.nested.value1.$touch()
        vm.$v.nested.value2.$touch()
        expect(vm.$v.nested.$dirty).to.be.true
      })
      it('should propagate nested.$touch to all nested values', () => {
        const vm = new Vue({
          ...baseGroup,
          validations: {
            nested: {
              value1: { T },
              value2: { T }
            }
          }
        })
        vm.$v.nested.$touch()
        expect(vm.$v.nested.value1.$dirty).to.be.true
        expect(vm.$v.nested.value2.$dirty).to.be.true
      })
      it('should propagate nested.$reset to all nested values', () => {
        const vm = new Vue({
          ...baseGroup,
          validations: {
            nested: {
              value1: { T },
              value2: { T }
            }
          }
        })
        vm.$v.nested.value1.$touch()
        vm.$v.nested.$reset()
        expect(vm.$v.nested.value1.$dirty).to.be.false
        expect(vm.$v.nested.value2.$dirty).to.be.false
      })
    })
  })

  describe('$v.value', () => {
    describe('when validations pass', () => {
      it('should have $invalid value set to false', () => {
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$v.value.$invalid).to.be.false
      })
      it('should have validator name value set to true', () => {
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$v.value.isEven).to.be.true
      })
    })
    describe('when validations did not pass', () => {
      it('should have $invalid value set to true', () => {
        const vm = new Vue({
          ...base,
          data () {
            return {
              value: 5
            }
          },
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$v.value.$invalid).to.be.true
      })
      it('should have validator name value set to false', () => {
        const vm = new Vue({
          ...base,
          data () {
            return {
              value: 5
            }
          },
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$v.value.isEven).to.be.false
      })
    })
    describe('when multiple validations exist', () => {
      it('should have the $invalid key set to true', () => {
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven, isOdd }
          }
        })
        expect(vm.$v.value.$invalid).to.be.true
        expect(vm.$v.value.isEven).to.be.true
        expect(vm.$v.value.isOdd).to.be.false
      })
    })
  })

  describe('nested fields', () => {
    it('should have accessible subvalidators with appropriate $invalid field', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          nested: {
            value3: { T },
            value4: { F }
          }
        }
      })
      expect(vm.$v.nested.value3.$invalid).to.be.false
      expect(vm.$v.nested.value4.$invalid).to.be.true
    })

    it('should have $invalid value set to true on single nested fail', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          nested: {
            value3: { T },
            value4: { F }
          }
        }
      })
      expect(vm.$v.nested.$invalid).to.be.true
    })

    it('should have $invalid value set to false when all nested pass', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          nested: {
            value3: { isOdd },
            value4: { isEven }
          }
        }
      })
      expect(vm.$v.nested.$invalid).to.be.false
    })
  })

  describe('validator groups', () => {
    it('should have $invalid value set to true when value1 fail', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          group: ['value1', 'nested.value3', 'nested.value4'],
          value1: { isEven },
          nested: {
            value3: { isOdd },
            value4: { isEven }
          }
        }
      })
      expect(vm.$v.group.$invalid).to.be.true
    })
    it('should allow groups defined by paths', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          group: [['nested', 'value3']],
          nested: {
            value3: { isOdd }
          }
        }
      })
      expect(vm.$v.group['nested.value3'].$invalid).to.be.false
    })
    it('should have $invalid value set to true when nested.value3 fail', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          group: ['value1', 'nested.value3', 'nested.value4'],
          value1: { isOdd },
          nested: {
            value3: { isEven },
            value4: { isEven }
          }
        }
      })
      expect(vm.$v.group.$invalid).to.be.true
    })
    it('should have $invalid value set to false when all grouped pass', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          group: ['value1', 'nested.value3', 'nested.value4'],
          value1: { isOdd },
          nested: {
            value3: { isOdd },
            value4: { isEven }
          }
        }
      })
      expect(vm.$v.group.$invalid).to.be.false
    })
    it('should have $invalid value set to true when grouping undefined validators', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          group: ['value1', 'nested.value3', 'nested.value4', 'abc.def', 'abc.def.ghi'],
          value1: { isOdd },
          nested: {
            value4: { isEven }
          }
        }
      })
      expect(vm.$v.group['abc.def.ghi']).to.be.false
      expect(vm.$v.group.$invalid).to.be.true
    })
  })
  describe('validating collections with $each', () => {
    const vmDef = (validator, tracker) => ({
      data () {
        return {
          list: [{
            value: 1
          }, {
            value: 2
          }]
        }
      },
      validations: {
        list: {
          $each: {
            $trackBy: tracker,
            value: {
              validator
            }
          }
        }
      }
    })

    it('should allow changing the array to a non array value and back', () => {
      const vm = new Vue(vmDef(isEven))
      vm.list = undefined
      expect(vm.$v.list.$invalid).to.be.false
      vm.list = null
      expect(vm.$v.list.$invalid).to.be.false
      vm.list = false
      expect(vm.$v.list.$invalid).to.be.false
      vm.list = ''
      expect(vm.$v.list.$invalid).to.be.false
      vm.list = 1
      expect(vm.$v.list.$invalid).to.be.false
      vm.list = function () {}
      expect(vm.$v.list.$invalid).to.be.false
      vm.list = [{value: 2}]
      expect(vm.$v.list.$invalid).to.be.false
      expect(vm.$v.list.$each[0]).to.exist
      expect(vm.$v.list.$each[1]).to.not.exist
    })
    it('should allow parent object to be non object', function () {
      const vm = new Vue({
        data () {
          return {
            obj: {
              value: 1
            }
          }
        },
        validations: {
          obj: {
            value: {
              noUndef
            }
          }
        }
      })
      vm.obj = undefined
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = null
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = false
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = 1
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = 'string'
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = function () {}
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = []
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = {}
      expect(vm.$v.obj.$invalid).to.be.true
      vm.obj = {value: 1}
      expect(vm.$v.obj.$invalid).to.be.false
    })
    it('should create validators for list items', () => {
      const vm = new Vue(vmDef(isEven))
      expect(vm.$v.list.$each[0]).to.exist
      expect(vm.$v.list.$each[1]).to.exist
      expect(vm.$v.list.$each[2]).to.not.exist
    })
    it('should validate all items in list', () => {
      const vm = new Vue(vmDef(isEven))
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.false
    })
    it('should be $invalid when some elements are invalid', () => {
      const vm = new Vue(vmDef(isEven))
      expect(vm.$v.list.$invalid).to.be.true
    })
    it('should not be $invalid when all elements are valid', () => {
      const vm = new Vue(vmDef(T))
      expect(vm.$v.list.$invalid).to.be.false
    })
    it('should track additions and validate immediately', () => {
      const vm = new Vue(vmDef(isEven))
      vm.list.push({value: 3})
      vm.list.push({value: 4})
      expect(vm.$v.list.$each[0]).to.exist
      expect(vm.$v.list.$each[1]).to.exist
      expect(vm.$v.list.$each[2]).to.exist
      expect(vm.$v.list.$each[3]).to.exist
      expect(vm.$v.list.$each[4]).to.not.exist
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.false
      expect(vm.$v.list.$each[2].$invalid).to.be.true
      expect(vm.$v.list.$each[3].$invalid).to.be.false
    })
    it('should not loose $dirty after insertion based by index', () => {
      const vm = new Vue(vmDef(isEven))
      vm.$v.list.$each[0].$touch()
      vm.list.unshift({value: 0})
      expect(vm.$v.list.$each[0].$dirty).to.be.true
      expect(vm.$v.list.$each[1].$dirty).to.be.false
      expect(vm.$v.list.$each[2].$dirty).to.be.false
    })
    it('should not loose $dirty after insertion based by $trackBy', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      vm.$v.list.$each[0].$touch()
      vm.list.unshift({value: 0})
      expect(vm.$v.list.$each[0].$dirty).to.be.false
      expect(vm.$v.list.$each[1].$dirty).to.be.true
    })
    it('should share validators when $trackBy overlap', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      vm.list.unshift({value: 1})
      expect(vm.$v.list.$each[0]).to.be.equal(vm.$v.list.$each[1])
      expect(vm.$v.list.$each[0].$dirty).to.be.false
    })
    it('should share validators when functional $trackBy overlap', () => {
      const vm = new Vue(vmDef(isEven, x => x.value))
      vm.list.unshift({value: 1})
      expect(vm.$v.list.$each[0]).to.be.equal(vm.$v.list.$each[1])
      expect(vm.$v.list.$each[0].$dirty).to.be.false
    })
    it('should share validators when $trackBy overlap after initial get', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      vm.$v.list.$each[0].$touch()
      vm.list.unshift({value: 1})
      expect(vm.$v.list.$each[0]).to.be.equal(vm.$v.list.$each[1])
      expect(vm.$v.list.$each[0].$dirty).to.be.true
    })

    it('should allow deleting first child', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      vm.list.shift()
      expect(vm.$v.list.$each[0].$invalid).to.be.false
    })
    it('should allow deleting last child', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      expect(vm.$v.list.$each[1].$invalid).to.be.false
      vm.list.pop()
      expect(vm.$v.list.$each[1]).to.not.exist
    })
    it('should allow swapping children', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.false
      vm.list[0].value = 2
      vm.list[1].value = 1
      expect(vm.$v.list.$each[0].$invalid).to.be.false
      expect(vm.$v.list.$each[1].$invalid).to.be.true
    })
    it('should allow reordering with insertion children', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      vm.list.push(
        {value: 3},
        {value: 4},
        {value: 5}
      )
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[4].$invalid).to.be.true
      vm.list[0].value = 1
      vm.list[1].value = 5
      vm.list[2].value = 6
      vm.list[3].value = 2
      vm.list[4].value = 4
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[4].$invalid).to.be.false
      expect(vm.$v.list.$each[2].$invalid).to.be.false
    })
    it('should allow reordering with different beginning and ending', () => {
      const vm = new Vue(vmDef(isEven, 'value'))
      vm.list.push(
        {value: 3},
        {value: 4},
        {value: 5},
        {value: 6}
      )
      vm.$v.list.$each[0]
      vm.list[0].value = 5
      vm.list[1].value = 6
      vm.list[2].value = 2
      vm.list[3].value = 1
      vm.list[4].value = 4
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.false
      expect(vm.$v.list.$each[2].$invalid).to.be.false
      expect(vm.$v.list.$each[3].$invalid).to.be.true
      expect(vm.$v.list.$each[4].$invalid).to.be.false
    })
  })

  describe('validating direct values with $each', () => {
    const vmDef = (validator, tracker) => ({
      data () {
        return {
          external: true,
          list: [1, 2, 3]
        }
      },
      validations: {
        list: {
          $each: {
            $trackBy: tracker,
            validator
          }
        }
      }
    })

    it('should validate all items in list', () => {
      const vm = new Vue(vmDef(isEven))
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.false
      expect(vm.$v.list.$each[2].$invalid).to.be.true
    })

    it('should not loose $dirty after insertion based by index', () => {
      const vm = new Vue(vmDef(isEven))
      vm.$v.list.$each[0].$touch()
      vm.list.unshift(5)
      expect(vm.$v.list.$each[0].$dirty).to.be.true
      expect(vm.$v.list.$each[1].$dirty).to.be.false
      expect(vm.$v.list.$each[2].$dirty).to.be.false
    })

    it('should revalidate only changed items', () => {
      const spy = sinon.spy(isEven)
      const vm = new Vue(vmDef(spy))

      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.false
      expect(vm.$v.list.$each[2].$invalid).to.be.true

      expect(spy).to.have.been.calledWith(1)
      expect(spy).to.have.been.calledWith(2)
      expect(spy).to.have.been.calledWith(3)
      expect(spy).to.have.been.calledThrice
      spy.reset()

      vm.$set(vm.list, 1, 15)
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.true
      expect(vm.$v.list.$each[2].$invalid).to.be.true
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith(15)
    })

    it('should revalidate all items with updated dependency', () => {
      const spy = sinon.spy(function (val, arr, rootVm) {
        return val > 2 ? !isEven(val) : this.external
      })
      const vm = new Vue(vmDef(spy))

      expect(vm.$v.list.$each[0].$invalid).to.be.false
      expect(vm.$v.list.$each[1].$invalid).to.be.false
      expect(vm.$v.list.$each[2].$invalid).to.be.false
      expect(spy).to.have.been.calledThrice
      spy.reset()

      vm.external = false
      expect(vm.$v.list.$each[0].$invalid).to.be.true
      expect(vm.$v.list.$each[1].$invalid).to.be.true
      expect(vm.$v.list.$each[2].$invalid).to.be.false
      expect(spy).to.have.been.calledWith(1)
      expect(spy).to.have.been.calledWith(2)
      expect(spy).to.have.been.calledTwice
    })
  })

  describe('validator $params', () => {
    it('should have default null $params object', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: {
            isOdd (v) {
              return v % 2 === 1
            }
          }
        }
      })
      expect(vm.$v.value.$params.isOdd).to.be.equal(null)
    })

    it('should pass $params from validation function', () => {
      const fn = withParams({type: 'alwaysTrue'}, () => true)
      const vm = new Vue({
        ...base,
        validations: {
          value: { fn }
        }
      })
      expect(vm.$v.value.$params.fn).to.deep.equal({type: 'alwaysTrue'})
    })

    it('should pass $params from validation object', () => {
      const vm = new Vue({
        ...base,
        validations: {
          value: {
            $params: {test: true},
            T
          }
        }
      })
      expect(vm.$v.$params.value).to.deep.equal({test: true})
      expect(vm.$v.value.$params).to.deep.equal({T: null})
    })

    it('should default $params for nested validation object to set of nulls', () => {
      const vm = new Vue({
        ...baseGroup,
        validations: {
          nested: {
            value3: { isOdd },
            value4: { isOdd }
          }
        }
      })
      expect(vm.$v.nested.$params).to.be.eql({value3: null, value4: null})
    })

    it('should return $sub $params on combined validators', () => {
      const tr = withParams({type: 'alwaysTrue'}, () => true)
      const fl = withParams({type: 'alwaysFalse'}, () => false)
      const combo = withParams({type: 'combo'}, v => tr(v) && fl(v))
      const vm = new Vue({
        ...baseGroup,
        validations: {
          value: { combo }
        }
      })
      expect(vm.$v.value.$params.combo).to.be.eql({
        type: 'combo',
        $sub: [
          {type: 'alwaysTrue'},
          {type: 'alwaysFalse'}
        ]
      })
    })

    it('should return $sub $params on multiple direct validators', () => {
      const tr = withParams({type: 'alwaysTrue'}, () => true)
      const fl = withParams({type: 'alwaysFalse'}, () => false)
      const comboDirect = v => tr(v) && fl(v)
      const vm = new Vue({
        ...baseGroup,
        validations: {
          value: { comboDirect }
        }
      })
      expect(vm.$v.value.$params.comboDirect).to.be.eql({
        $sub: [
          {type: 'alwaysTrue'},
          {type: 'alwaysFalse'}
        ]
      })
    })
  })

  describe('$v.$flattenParams', () => {
    const vm = new Vue({
      ...base,
      data () {
        return {
          value: 5
        }
      },
      validations: {
        value: { isEven }
      }
    })

    it('should return a list', () => {
      expect(vm.$v.$flattenParams().length).to.be.equal(1)
    })

    it('should return validator params', () => {
      expect(vm.$v.$flattenParams()).to.be.deep.equal([
        { path: ['value'], name: 'isEven', params: { type: 'isEven' } }
      ])
    })

    describe('for no validators', () => {
      const vm = new Vue({
        ...base,
        data () {
          return {
            value: 5
          }
        },
        validations: {
          value: {}
        }
      })

      it('should return an empty array', () => {
        expect(vm.$v.$flattenParams()).to.be.empty
      })
    })

    describe('for nested validators', () => {
      const vm = new Vue({
        ...base,
        data () {
          return {
            first: {
              foo: 5,
              bar: 6
            },
            second: {
              foo: 7,
              bar: 8
            }
          }
        },
        validations: {
          first: {
            foo: { isEven },
            bar: { isEven }
          },
          second: {
            foo: { isEven },
            bar: { isEven }
          }
        }
      })

      it('should work at the deepest validation level', () => {
        expect(vm.$v.first.foo.$flattenParams()).to.be.deep.equal([
          { path: [], name: 'isEven', params: { type: 'isEven' } }
        ])
      })

      it('should return params of all leaves', () => {
        expect(vm.$v.first.$flattenParams()).to.be.deep.equal([
          { path: ['foo'], name: 'isEven', params: { type: 'isEven' } },
          { path: ['bar'], name: 'isEven', params: { type: 'isEven' } }
        ])
      })

      it('should flatten results from all children', () => {
        expect(vm.$v.$flattenParams()).to.be.deep.equal([
          { path: ['first', 'foo'], name: 'isEven', params: { type: 'isEven' } },
          { path: ['first', 'bar'], name: 'isEven', params: { type: 'isEven' } },
          { path: ['second', 'foo'], name: 'isEven', params: { type: 'isEven' } },
          { path: ['second', 'bar'], name: 'isEven', params: { type: 'isEven' } }
        ])
      })
    })
  })
})
