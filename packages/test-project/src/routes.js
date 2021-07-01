import SimpleForm from './components/SimpleForm.vue'
import NestedValidations from './components/NestedValidations.vue'
import OldApiExample from './components/OldApiExample.vue'
import ChainOfRefs from './components/ChainOfRefs.vue'
import CollectionValidations from './components/CollectionValidations.vue'
import I18nSimpleForm from './components/I18nSimpleForm.vue'

export const routes = [
  {
    path: '/',
    component: SimpleForm
  },
  {
    path: '/i18n-simple',
    component: I18nSimpleForm
  },
  {
    path: '/nested-validations',
    component: NestedValidations
  },
  {
    path: '/old-api',
    component: OldApiExample
  },
  {
    path: '/nested-ref',
    component: ChainOfRefs
  },
  {
    path: '/collection-validations',
    component: CollectionValidations
  }
]
