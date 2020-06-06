<template>
  <div id="app">
    <!--    <OldApiExample />-->
    <!--    <nested-validations />-->
    <simple-form />
  </div>
</template>

<script>
// import OldApiExample from '@/components/OldApiExample'
// import NestedValidations from './components/NestedValidations.vue'
import SimpleForm from './components/SimpleForm'

export default {
  name: 'App',
  components: {
    SimpleForm
    // NestedValidations,
    // OldApiExample
  }
}
</script>

<style>
body {
  background: #203041;
  color: #f6f6f6;
}

pre {
  background: #1b2637;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}
</style>
