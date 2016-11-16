<template lang="pug">
  div.switcher
    button.switchbutton(
      v-for="lang in langs"
      v-bind:class="{'selected': lang === current}"
      @click="select(lang)"
    ) {{lang}}
</template>

<script>
export default {
  props: ['langs', 'current'],
  methods: {
    select (lang) {
      this.$emit('select', lang)
    }
  }
}
</script>

<style scoped>
  .switcher {
    display: inline-block;
    border-radius: 2px;
    overflow:hidden;
  }

  .switchbutton {
    border: none;
    background-color: #EAEAEA;
    color: #848484;
    padding: 1px 10px;
    text-transform: capitalize;
  }

  .switcher > * + * {
    border-left: 1px solid #CCC;
  }

  .switchbutton:focus {
    outline: none;
    box-shadow: inset 0 0 4px -1px black;
  }

  .switchbutton.selected {
    background-color: #CFCFCF;
    color: #707070;
  }
</style>
