<template>
  <div>
    <label>Number X</label>
    <input
      v-model.number="x"
      type="number"
    >
    <br>
    <label>Number Y</label>
    <input
      v-model.number="y"
      type="number"
    >
    <br>
    <p>X + Y = {{ xPlusY }}</p>
    <div style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="(error, index) of vv.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>

    <label>Dims</label>
    <input
      v-model.number="dims.w"
      type="number"
    >
    <input
      v-model.number="dims.h"
      type="number"
    >
    <input
      v-model.number="dims.l"
      type="number"
    >

    <button @click="vv.$touch()">
      $touch!
    </button>
    <button @click="vv.$reset()">
      $reset!
    </button>
    <pre style="color: white">{{ vv }}</pre>
  </div>
</template>

<script>
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { minValue } from '@vuelidate/validators'

export default {
  setup (props, context) {
    const x = ref(1)
    const vv = useVuelidate()

    return { x, vv }
  },
  data () {
    return {
      y: 3,
      dims: {
        w: 1,
        h: 1,
        l: 1
      }
    }
  },
  computed: {
    xPlusY () {
      return this.x + this.y
    }
  },
  // validationsConfig: {
  //   $autoDirty: true
  //
  // },
  validations () {
    console.log(this)
    return {
      x: {
        $autoDirty: true,
        minValue: minValue(this.y),
        isEven: {
          $validator: (v) => v % 2 === 0,
          $message: 'X must be an even number'
        }
      },
      y: {
        $autoDirty: true,
        minValue: minValue(4),
        isEven: {
          $validator: (v) => v % 2 === 0,
          $message: 'Y must be an even number'
        }
      },
      xPlusY: {
        minValue: minValue(6),
        isEven: {
          $validator: (v) => v % 2 === 0,
          $message: 'Sum must be an even number'
        }
      }
      // dims: {
      //   volume: {
      //     $validator: (dims) => (dims.h * dims.w * dims.l) > 0,
      //     $message: 'Volume must be greater than zero'
      //   },
      //   w: {
      //     minValue: minValue(2)
      //   },
      //   l: {
      //     minValue: minValue(4)
      //   }
      // }
    }
  }
}
</script>
