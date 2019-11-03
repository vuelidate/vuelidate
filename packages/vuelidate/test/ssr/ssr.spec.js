import Vue from 'vue'
import { VuelidatePlugin } from '../../src'
import { helpers } from '@vuelidate/validators'
import { createRenderer } from 'vue-server-renderer'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)
Vue.use(VuelidatePlugin)

const { withParams } = helpers

const isEven = withParams({ type: 'isEven' }, (v) => {
  return v % 2 === 0
})

const mkVm = (render) =>
  new Vue({
    data: { val: 0 },
    validations: { val: { isEven } },
    render (h) {
      return render(h, this)
    }
  })

describe('SSR', () => {
  const renderer = createRenderer()

  const makeAsyncRenderTester = (vm) => new Promise((resolve, reject) => {
    renderer.renderToString(vm, (err, str) => {
      if (err) reject(str)
      else resolve(str)
    })
  })

  it('Should not throw on render when plugin is loaded', async () => {
    const vm = mkVm((h, vm) => h('div', 'hello'))
    const rendered = await makeAsyncRenderTester(vm)
    expect(rendered).toStrictEqual(expect.any(String))
  })

  it('Should not throw on render when referencing $v', async () => {
    const vm = mkVm((h, vm) => h('div', vm._s(vm.$v)))
    const rendered = await makeAsyncRenderTester(vm)
    expect(rendered).toStrictEqual(expect.any(String))
  })

  // TODO: Devise a better test
  it('Should not throw on render when referencing $v.val.isEven', async () => {
    const vm = mkVm((h, vm) => h('div', vm._s(vm.$v.val.isEven.$invalid)))
    const rendered = await makeAsyncRenderTester(vm)
    expect(rendered).toMatchSnapshot()
  })
})
