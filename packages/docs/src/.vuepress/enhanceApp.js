import Composition from '@vue/composition-api'
import { VuelidatePlugin } from '@vuelidate/core/src'

export default ({ Vue, options, router, siteData }) => {
  Vue.use(Composition)
  Vue.use(VuelidatePlugin)
}
