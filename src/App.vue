<template>
  <div id="app">
    <div class>
      <label>Name:</label>
      <input type="text" v-model="name">
      <p v-if="!$v.name.required">Name is required</p>
      <p v-if="!$v.name.minLength">Name must be at least 4 characters long</p>
    </div>
    <div class>
      <label>Age:</label>
      <input type="number" v-model="age">
      <p v-if="!$v.age.between">Must be between 20 and 30</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { required, minLength, between } from "../src/validators";
import Vuelidate from "../src/index";

Vue.use(Vuelidate);

export default Vue.extend({
  data() {
    return {
      name: "",
      age: 0
      // email: '',
      // password: '',
      // repeatPassword: '',
      // form: {
      //   nestedA: '',
      //   nestedB: ''
      // },
      // flatA: '',
      // flatB: '',
      // forGroup: {
      //   nested: ''
      // }
    };
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    age: {
      between: between(20, 30)
    }
    // password: {
    //   required,
    //   minLength: minLength(6)
    // },
    // repeatPassword: {
    //   sameAsPassword: sameAs('password')
    // },
    //
    // form: {
    //   nestedA: {
    //     required
    //   },
    //   nestedB: {
    //     required
    //   }
    // },
    //
    // flatA: { required },
    // flatB: { required },
    // forGroup: {
    //   nested: { required }
    // },
  }
});
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
