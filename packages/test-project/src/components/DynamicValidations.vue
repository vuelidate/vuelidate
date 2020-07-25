<template>
  <div class="SimpleForm">
    <div class="">
      <label>x</label>
      <input
        v-model="x"
        type="number"
      >
    </div>
    <div class="">
      <label>y</label>
      <input
        v-model="v$.y.$model"
        type="text"
      >
    </div>
    <div class="">
      <label>a</label>
      <input
        v-model="a"
        type="number"
      >
    </div>
    <div class="">
      <label>y</label>
      <input
        v-model="$v.b.$model"
        type="text"
      >
    </div>
    <button @click="$v.$touch">
      touch
    </button>
    <div style="background: rgba(53, 219, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="(error, index) of $v.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>
    <div style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="(error, index) of v$.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>
    <pre>{{ v$ }}</pre>
    <pre>{{ $v }}</pre>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { VuelidateMixin, useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

export default {
  name: 'SimpleForm',
  mixins: [VuelidateMixin],
  setup () {
    const x = ref(5)
    const y = ref('a')

    const rules = computed(() => {
      return x.value >= 6
        ? { y: { minLength: minLength(x) } }
        : { y: { minLength: minLength(3), required } }
    })

    const v$ = useVuelidate(
      rules,
      { x, y }
    )
    return { x, y, v$, $a: 5 }
  },
  data () {
    return {
      a: 1,
      b: 2
    }
  },
  computed: {
    c () {
      return 5
    }
  },
  validations () {
    if (this.a > 5) {
      return {
        b: {
          minLength: minLength(this.a),
          $autoDirty: true
        }
      }
    } else {
      return {
        b: {
          minLength: minLength(2),
          $autoDirty: true
        }
      }
    }
  }
}
</script>
