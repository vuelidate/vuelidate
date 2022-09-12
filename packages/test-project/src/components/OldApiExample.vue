<template>
  <div>
    <button @click="vv.$touch()">
      $touch!
    </button>
    <button @click="vv.$reset()">
      $reset!
    </button>
    <br>
    <label>Number X</label>
    <input
      v-model.number="x"
      type="number"
    > ($model: {{ vv.x.$model }})
    <br>
    <label>Number Y</label>
    <input
      v-model.number="y"
      type="number"
    > ($model: {{ vv.y.$model }})
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

    <label>
      <input
        v-model="hasDims"
        type="checkbox"
      >
      has dims</label>
    <div v-if="hasDims">
      <h3>Dims</h3>
      <label>
        width
        <input
          v-model.number="dims.w"
          type="number"
        >
      </label>
      |
      <label>
        height
        <input
          v-model.number="dims.h"
          type="number"
        >
      </label>
      |
      <label>
        length
        <input
          v-model.number="dims.l"
          type="number"
        >
      </label>
      <br><br>
      <span>width ($model: {{ vv.dims.w.$model }}, dirtyAndInvalid: {{ dirtyAndInvalid }})</span> <br>
      <span>length ($model: {{ vv.dims.l.$model }})</span>
    </div>
    <pre style="color: white">{{ vv }}</pre>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minValue } from '@vuelidate/validators'

export default {
  setup (props, context) {
    const x = ref(1)
    const vv = useVuelidate()

    return { x, vv }
  },
  data () {
    return {
      hasDims: true,
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
    },
    // example of a computed value using the validation object
    dirtyAndInvalid () {
      return this.vv.dims.w.$dirty && this.vv.dims.w.$invalid
    }
  },
  // validationsConfig: {
  //   $autoDirty: true
  //
  // },
  validations (vm) {
    const validations = {
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
      }
    }

    if (this.hasDims) {
      validations.x.minValue = minValue(computed(() => this.dims.w))
      validations.dims = {
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

    return validations
  }
}
</script>
