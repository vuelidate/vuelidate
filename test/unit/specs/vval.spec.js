import Vue from 'vue'
import {patchChildren, h} from 'src/vval'

describe('Virtual validation', () => {
  it('should do nothing when same vdom passed', () => {
    const mk = k => h(Vue, '' + k, {})
    const vdom = [1, 2, 3, 4, 5].map(mk)
    patchChildren(vdom, vdom)
    expect(vdom[0].vm).to.not.exist
  })

  it('should do nothing when same vdom element passed', () => {
    const mk = k => h(Vue, '' + k, {arg: 1})
    const vdom1 = [1, 2, 3, 4, 5].map(mk)
    const vdom2 = [1, 2, 3, 4, 5].map(mk)
    vdom2[1] = vdom1[1]
    patchChildren(null, vdom1)
    vdom2[1].vm = null
    patchChildren(vdom1, vdom2)
    expect(vdom2[1].vm).to.not.exist
  })

  it('should not crash when two nulls passed', () => {
    expect(() => patchChildren(null, null)).not.to.throw()
  })

  it('should allow left move', () => {
    const spy = sinon.spy()
    const Vm = Vue.extend({
      created: spy
    })

    const mk = k => h(Vm, '' + k, {})

    const vdom1 = [1, 2, 3, 4, 5].map(mk)
    const vdom2 = [4, 1, 2, 3, 6].map(mk)

    patchChildren(null, vdom1)
    spy.reset()
    patchChildren(vdom1, vdom2)
    expect(spy).to.have.been.calledOnce
  })

  it('should correctly build a vm for new key insert in the middle', () => {
    const spy = sinon.spy()
    const Vm = Vue.extend({
      data () { return {k: null} },
      created () { spy(this.k) }
    })

    const vdom1 = [
      h(Vm, '1', {k: 1}),
      h(Vm, '3', {k: 3}),
      h(Vm, '5', {k: 5})
    ]

    const vdom2 = [
      h(Vm, '1', {k: 1}),
      h(Vm, '6', {k: 6}),
      h(Vm, '4', {k: 4})
    ]

    patchChildren(null, vdom1)
    spy.reset()
    patchChildren(vdom1, vdom2)
    expect(vdom2[1].vm).to.exist
    expect(vdom2[1].vm.k).to.equal(6)
    expect(spy).to.have.been.calledWith(6)
  })

  it('should correctly replace a different vm for same key in the middle', () => {
    const spy = sinon.spy()
    const Vm = Vue.extend()
    const Vm2 = Vue.extend({
      data () { return {k: null} },
      created () { spy(this.k) }
    })

    const vdom1 = [
      h(Vm, '1', {k: 1}),
      h(Vm, '3', {k: 3}),
      h(Vm, '6', {k: 6}),
      h(Vm, '5', {k: 5})
    ]

    const vdom2 = [
      h(Vm, '1', {k: 1}),
      h(Vm2, '6', {k: 6}),
      h(Vm, '4', {k: 4})
    ]

    patchChildren(null, vdom1)
    spy.reset()
    patchChildren(vdom1, vdom2)
    expect(spy).to.have.been.calledWith(6)
  })
})
