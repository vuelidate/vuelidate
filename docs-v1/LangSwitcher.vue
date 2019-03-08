<template lang="pug">
  div.tabs
    a.tabs__link(
      v-for="lang in langs",
      v-bind:class="{'tabs__link--active': lang === current}"
      @click="select(lang)"
    ) {{lang}}
</template>

<script>
export default {
  props: {
    langs: {
      type: Array,
      required: true
    },
    current: {
      type: String,
      required: true
    }
  },
  methods: {
    select(lang) {
      this.$emit('select', lang)
    }
  }
}
</script>
