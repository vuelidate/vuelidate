<template>
  <div id="app">
    <nested-validations />
  </div>
</template>

<script>
import NestedValidations from '@/components/NestedValidations'

export default {
  name: 'App',
  components: {
    NestedValidations
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
