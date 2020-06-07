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
import { VuelidateMixin } from '@vuelidate/core'
import { minValue } from '@vuelidate/validators'

export default {
  mixins: [VuelidateMixin],
  setup (props, context) {
    const x = ref(1)

    return { x }
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
        minValue: minValue(2),
        isEven: {
          $validator: (v) => {
            console.log('isEven', 'x', v)
            return v % 2 === 0
          },
          $message: 'Sum must be an even number'
        }
      },
      y: {
        minValue: minValue(4),
        isEven: {
          $validator: (v) => {
            console.log('isEven', 'y', v)
            return v % 2 === 0
          },
          $message: 'Sum must be an even number'
        }
      },
      xPlusY: {
        minValue: minValue(6),
        isEven: {
          $validator: (v) => {
            console.log('isEven', 'xPlusY', v)
            return v % 2 === 0
          },
          $message: 'Sum must be an even number'
        }
      }
    }
  }
}
</script>
