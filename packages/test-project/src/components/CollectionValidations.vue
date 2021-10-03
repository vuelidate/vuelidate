<template>
  <div class="EachForm">
    <h3>Validate Each component</h3>
    <ValidateEach
      v-for="(item, index) in collectionValidateEach"
      :key="index"
      :state="item"
      :rules="collectionRules"
      :options="{ $registerAs: `ValidateEach_${index}`, $autoDirty: true }"
    >
      <template #default="{ v }">
        <input
          v-model="v.name.$model"
          type="text"
        >
        <div
          v-for="(error, errorIndex) in v.name.$errors"
          :key="errorIndex"
        >
          {{ error.$message }}
        </div>
      </template>
    </ValidateEach>
    <hr>
    <h3>forEach helper</h3>
    <div
      v-for="(input, index) in v$.collectionForEach.$model"
      :key="index"
      :class="{
        error: v$.collectionForEach.$each.$response.$errors[index].name.length,
      }"
    >
      <input
        v-model="input.name"
        type="text"
      >
      <div
        v-for="error in v$.collectionForEach.$each.$response.$errors[index].name"
        :key="error"
      >
        {{ error.$message }}
      </div>
    </div>
    <button @click="addItems">
      Add Item
    </button>
    <button @click="validate">
      Validate
    </button>
    <button @click="v$.$touch">
      $touch
    </button>
    <button @click="v$.$reset">
      $reset
    </button>
    <div
      v-if="v$.$error"
      style="background: rgba(219, 53, 53, 0.62); color: #ff9090; padding: 10px 15px"
    >
      <p
        v-for="(error, index) of v$.$errors"
        :key="index"
        style="padding: 0; margin: 5px 0"
      >
        {{ error.$message }}
      </p>
    </div>
    <pre>{{ v$ }}</pre>
  </div>
</template>

<script>
import { reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { ValidateEach } from '@vuelidate/components'

const { forEach } = helpers
export default {
  name: 'CollectionValidations',
  components: { ValidateEach },
  setup () {
    const collectionForEach = reactive([])
    const collectionValidateEach = reactive([])

    const collectionRules = {
      name: {
        required,
        minLength: minLength(10)
      }
    }

    function addItems () {
      collectionForEach.push({ name: '' })
      collectionValidateEach.push({ name: '' })
    }

    let v$ = useVuelidate(
      {
        collectionForEach: {
          $each: forEach(collectionRules)
        }
      },
      { collectionForEach },
      { $autoDirty: true }
    )
    return { name, v$, collectionRules, addItems, collectionForEach, collectionValidateEach }
  },
  methods: {
    validate () {
      this.v$.$validate({ silent: true }).then((result) => {
        console.log('Result is', result)
      })
    }
  }
}
</script>
