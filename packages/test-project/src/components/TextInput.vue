<template>
  <div class="form-input">
    <label :for="label">{{ label }}</label>
    <input
      :id="label"
      type="text"
      :name="label"
      :value="modelValue"
      style="max-width: 300px"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    {{ errors }}
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>
.form-input {
  display: flex;
  flex-direction: column;
}
</style>
