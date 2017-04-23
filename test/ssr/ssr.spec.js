import Vue from 'vue'
import { withParams } from '../../src'
import { createRenderer } from 'vue-server-renderer'
import { expect } from 'chai'

const isEven = withParams({ type: 'isEven' }, (v) => {
  return v % 2 === 0
})

const mkVm = render =>
  new Vue({
    data: { val: 0 },
    validations: { val: { isEven } },
    render (h) {
      return render(h, this)
    }
  })

describe('SSR', (done) => {
  const renderer = createRenderer()
  const makeRenderTester = expStr => (vm, done) => {
    renderer.renderToString(vm, (err, str) => {
      expect(err).to.be.null
      expStr(str)
      done()
    })
  }

  const testString = makeRenderTester(str => expect(str).to.be.string)

  it('Should not throw on render when plugin is loaded', (done) => {
    const vm = mkVm((h, vm) => h('div', 'hello'))
    testString(vm, done)
  })

  it('Should not throw on render when referencing $v', (done) => {
    const vm = mkVm((h, vm) => h('div', vm._s(vm.$v)))
    testString(vm, done)
  })

  it('Should not throw on render when referencing $v.val.isEven', (done) => {
    const vm = mkVm((h, vm) => h('div', vm._s(vm.$v.val.isEven)))
    testString(vm, done)
  })
})
