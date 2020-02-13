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
