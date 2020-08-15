import { computed, ref } from 'vue'
import { isEven, isOdd } from './validators.fixture'

export function dynamicValidationWithRefs () {
  const conditional = ref(0)
  const number = ref(0)
  const validations = computed(() => {
    return conditional.value > 5
      ? {}
      : { number: { isOdd } }
  })
  return {
    state: {
      number, conditional
    },
    validations
  }
}
