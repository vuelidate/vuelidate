import SimpleForm from './components/SimpleForm.vue'
import NestedValidations from './components/NestedValidations.vue'
import OldApiExample from './components/OldApiExample.vue'
import ChainOfRefs from './components/ChainOfRefs.vue'
import CollectionValidations from './components/CollectionValidations.vue'
import I18nSimpleForm from './components/I18nSimpleForm.vue'
import ExternalValidationsForm from './components/ExternalValidationsForm.vue'
import AsyncValidators from './components/AsyncValidators.vue'
import NestedValidationsWithScopes from './components/NestedValidationsWithScopes/ParentValidator.vue'
import RewardEarly from './components/RewardEarly.vue'

export const routes = [
  {
    path: '/',
    component: SimpleForm
  },
  {
    path: '/async-simple',
    component: AsyncValidators
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
  },
  {
    path: '/external-validations',
    component: ExternalValidationsForm
  },
  {
    path: '/nested-validations-with-scopes',
    component: NestedValidationsWithScopes
  },
  {
    path: '/reward-early',
    component: RewardEarly
  }
]
