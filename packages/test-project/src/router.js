import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes.js'

export const router = createRouter({
  history: createWebHistory(),
  routes: __DEV__ ? [] : routes
})

if (import.meta.hot) {
  let removeRoutes = []

  for (let route of routes) {
    removeRoutes.push(router.addRoute(route))
  }

  import.meta.hot.acceptDeps('./routes.js', ({ routes }) => {
    for (let removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (let route of routes) {
      removeRoutes.push(router.addRoute(route))
    }
    router.replace('')
  })
}
