
<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import { reactive, computed, version } from 'vue'

function Contact () {
  return {
    id: Date.now(),
    name: '',
    email: ''
  }
}

const asyncName = helpers.withAsync({
  $validator: (value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (value === 'renato') {
          resolve({ $valid: true })
        } else {
          resolve({ $valid: false })
        }
      }, 100)
    })
  },
  $message: 'Name must be renato'
})

const contactValidationSchema = {
  name: { required, minLength: minLength(3) },
  email: { email }
}

const defaultContact = new Contact()
const state = reactive({
  name: '',
  address: '',
  contacts: {
    [defaultContact.id]: defaultContact
  }
})

function addContact () {
  const newContact = new Contact()
  state.contacts[newContact.id] = newContact
}

function removeContact (id) {
  delete state.contacts[id]
}

const rules = computed(() => ({
  name: { required, m: minLength(3), asyncName },
  address: { required },
  contacts: Object.keys(state.contacts).reduce((acc, key) => {
    acc[key] = contactValidationSchema
    return acc
  }, {})
}))

const v$ = useVuelidate(rules, state, { $rewardEarly: true })
</script>

<template>
  <div>
    <div class="field">
      <label>
        Name
        <input
          v-model="v$.name.$model"
          @blur="v$.name.$commit"
        >
      </label>
      <p
        v-for="error of v$.name.$errors"
        :key="error.$uid"
      >
        {{ error.$message }}
      </p>
    </div>

    <div class="field">
      <label>
        Address
        <input
          v-model="v$.address.$model"
          @blur="v$.address.$commit"
        >
      </label>
      <p
        v-for="error of v$.address.$errors"
        :key="error.$uid"
      >
        {{ error.$message }}
      </p>
    </div>

    <fieldset
      v-for="(contact, id) in v$.contacts.$model"
      :key="id"
    >
      <legend>Contact {{ id }}</legend>
      <div>
        <label>
          name
          <input
            v-model="v$.contacts[id].name.$model"
            @blur="v$.contacts[id].name.$commit"
          >
        </label>
        <p
          v-for="error of v$.contacts[id].name.$errors"
          :key="error.$uid"
        >
          {{ error.$message }}
        </p>
      </div>
      <div>
        <label>
          email
          <input
            v-model="v$.contacts[id].email.$model"
            @blur="v$.contacts[id].email.$commit"
          >
        </label>
        <p
          v-for="error of v$.contacts[id].email.$errors"
          :key="error.$uid"
        >
          {{ error.$message }}
        </p>
      </div>
      <button @click="removeContact(id)">
        X
      </button>
    </fieldset>
    <button @click="addContact">
      Add contact
    </button>

    <pre><code>{{ { vue: version, $silentErrors: v$.$silentErrors, $silentInvalids: v$.$silentInvalids } }}</code></pre>
  </div>
</template>
