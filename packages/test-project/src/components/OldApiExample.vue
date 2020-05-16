<template>
  <div>
    <label>Number X</label>
    <input
      v-model="x"
      type="number"
    >
    <br>
    <label>Number Y</label>
    <input
      v-model="y"
      type="number"
    >
    <br>
    <p>X + Y = {{ xPlusY }}</p>
    <div style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="error of v$.$errors"
        :key="error.$propertyPath"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>
    <button @click="v$.$touch">
      $touch!
    </button>
    <pre style="color: white">{{ v$ }}</pre>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useVuelidateOptions } from '@vuelidate/core/src'
import { minValue } from '@vuelidate/validators/src/withMessages'

export default {
  setup (props, context) {
    const v$ = useVuelidateOptions()
    const x = ref(1)

    return { v$, x }
  },
  data () {
    return {
      y: 1
    }
  },
  computed: {
    xPlusY () {
      return this.x + this.y
    }
  },
  validations () {
    return {
      x: {
        minValue: minValue(2)
      },
      y: {
        minValue: minValue(4)
      },
      xPlusY: {
        minValue: minValue(6),
        isEven: {
          $validator: (v) => v % 2 === 0,
          $message: 'Sum must be an even number'
        }
      }
    }
  }
}
</script>
