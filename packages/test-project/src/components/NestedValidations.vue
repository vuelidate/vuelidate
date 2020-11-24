<template>
  <div style="padding-top: 2rem;">
    <div style="float: right">
      <pre>{{ vv }}</pre>
    </div>
    <div style="margin-bottom: 20px">
      <label>Number X</label>
      <input
        v-model.number="vv.numberX.$model"
        type="number"
      >
    </div>
    <div style="margin-bottom: 20px">
      <label>Optional if previous is less than 5</label>
      <input
        v-model.number="optionalNumber"
        type="number"
      >
      <div
        v-if="vv.optionalNumber"
        style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px"
      >
        <p
          v-for="(error, index) of vv.optionalNumber.$errors"
          :key="index"
          style="padding: 0; margin: 5px 0"
        >
          {{ error.$message }}
        </p>
      </div>
    </div>
    <NestedA />
    <div style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px">
      <p
        v-for="(error, index) of vv.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import NestedA from './NestedA.vue'

export default {
  components: { NestedA },
  setup () {
    const numberX = ref(0)
    const optionalNumber = ref(0)

    const validations = computed(() => {
      const v = { numberX: { required, minValue: minValue(3) } }
      if (numberX.value > 5) {
        v.optionalNumber = { required, minValue: minValue(numberX), $autoDirty: true }
      }
      return v
    })

    let vv = useVuelidate(
      validations,
      { numberX, optionalNumber }
    )

    return { vv, numberX, optionalNumber }
  }
}
</script>
