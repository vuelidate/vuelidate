<template>
  <div>
    <div class="row">
      <div>
        <div>v1$ control</div>
        <div :class="{ valid: !v1$.$error && v1$.$dirty, error: v1$.$error }">
          <input
            v-model="v1$.number.$model"
            type="text"
          >
        </div>
        <div
          v-for="(error, index) in v1$.number.$errors"
          :key="index"
        >
          {{ error.$message }}
        </div>
        <button @click="onToggle">
          Toggle All Ouput
        </button>
        <pre v-show="showAll">{{ v1$ }}</pre>
      </div>

      <div>
        <div>v2$ control</div>
        <div :class="{ valid: !v2$.$error && v2$.$dirty, error: v2$.$error }">
          <input
            v-model="v2$.secondNumber.$model"
            type="text"
          >
        </div>
        <div
          v-for="(error, index) in v2$.secondNumber.$errors"
          :key="index"
        >
          {{ error.$message }}
        </div>
        <button @click="onToggle">
          Toggle All Ouput
        </button>
        <pre v-show="showAll">{{ v2$ }}</pre>
      </div>
      <child-component v-if="showChild" />
    </div>
    <button @click.prevent="showChild = !showChild">
      Toggle child on/off
    </button>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import ChildComponent from './ChildWithScope.vue'

export default {
  name: 'App',
  components: {
    ChildComponent
  },
  setup () {
    const showAll = ref(false)
    const showChild = ref(false)
    const rules1 = {
      number: {
        required
      }
    }
    const state1 = reactive({
      number: 1
    })

    const rules2 = {
      secondNumber: {
        required
      }
    }
    const state2 = reactive({
      secondNumber: 1
    })

    const v1$ = useVuelidate(rules1, state1, { $registerAs: 'v1' })
    const v2$ = useVuelidate(rules2, state2, { $registerAs: 'v2' })

    async function onToggle () {
      showAll.value = !showAll.value
      const valid1 = await v1$.value.$validate()
      const valid2 = await v2$.value.$validate()
      console.warn(`v1$: ${valid1}`, `v2$: ${valid2}`)
      console.warn(v1$.value, v2$.value)
    }

    return { v1$, v2$, showAll, showChild, onToggle }
  }
}
</script>

<style scoped>
.row {
  display: flex;
  flex-flow: row wrap;
}

.valid input {
  border: 1px solid green;
}

.error input {
  border: 1px solid red;
}
</style>
