<template>
  <div>
    <label>Number X ($model: {{ vv.x.$model }})</label>
    <input
      v-model.number="x"
      type="number"
    >
    <br>
    <label>Number Y ($model: {{ vv.y.$model }})</label>
    <input
      v-model.number="y"
      type="number"
    >
    <br>
    <p>X + Y = {{ xPlusY }}</p>

    <label>Number Y+X ($model: {{ vv.xPlusY.$model }})</label>
    <div style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="(error, index) of vv.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>

    <h3>Dims</h3>
    <label>
      x ($model: {{ vv.dims.w.$model }})
      <input
        v-model.number="dims.w"
        type="number"
      >
    </label>
    |
    <label>
      <input
        v-model.number="dims.h"
        type="number"
      >
    </label>
    |
    <label>
      l ($model: {{ vv.dims.l.$model }})
      <input
        v-model.number="dims.l"
        type="number"
      >
    </label>

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
import { computed } from 'vue-demi'

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
    // console.log('validation fn', this)
    return {
      x: {
        $autoDirty: true,
        minValue: minValue(computed(() => this.y)),
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
      },
      dims: {
        maxVolume: {
          $validator: (dims) => dims && dims.h ? (dims.h * dims.w * dims.l) > 0 : false,
          $message: 'Volume must be greater than zero'
        },
        minVolume: {
          $validator: (dims) => dims && dims.h ? (dims.h * dims.w * dims.l) < 12 : false,
          $message: 'Volume must be less than 12'
        },
        w: {
          $autoDirty: true,
          minValue: minValue(2)
        },
        l: {
          minValue: minValue(4)
        }
      }
    }
  }
}
</script>
