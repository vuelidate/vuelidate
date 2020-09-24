import theme from 'vitepress/dist/client/theme-default'
//
// import NestedValidations from './components/NestedValidations.vue'
// import AsObject from './components/AsObject.vue'
// import { VuelidatePlugin } from '@vuelidate/core'
import AsComposition from './components/AsComposition.vue'

export default {
  ...theme,
  enhanceApp ({ app, router, siteData }) {
    // app.use(VuelidatePlugin)
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
    // app.component(NestedValidations.name, NestedValidations)
    // app.component(AsObject.name, AsObject)
    app.component(AsComposition.name, AsComposition)
  }
}
