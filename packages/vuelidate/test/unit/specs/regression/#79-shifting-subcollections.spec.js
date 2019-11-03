import Vue from 'vue'

const T = () => true

describe('#79 Error when validating a collection after removing an item', () => {
  it('should correctly recalculate one-level nested $each count on remove', () => {
    const vm = new Vue({
      data: {
        items: [{ subs: [1, 2] }, { subs: [3, 4, 5] }]
      },
      validations: {
        items: {
          $each: {
            subs: {
              $each: { T }
            }
          }
        }
      }
    })
    expect(vm.$v.items.$each[0].subs.$each[1]).toBeDefined()
    expect(vm.$v.items.$each[0].subs.$each[2]).toBeFalsy()
    vm.items.splice(0, 1)
    expect(vm.$v.items.$each[0].subs.$each[2]).toBeDefined()
    expect(vm.$v.items.$each[0].subs.$each[3]).toBeFalsy()
  })
})
