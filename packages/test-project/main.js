import { createApp } from 'vue'
import App from './src/App.vue'
import { router } from './src/router.js'
import { i18n } from './src/i18n'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.mount('#app')
