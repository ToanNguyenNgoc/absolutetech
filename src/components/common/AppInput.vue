<template>
  <div class="form-group">
    <label v-if="label" class="label">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
    />
    <div v-if="error" class="error-text">{{ error }}</div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  error: String,
  modelValue: String,
})

// eslint-disable-next-line no-undef
defineEmits(['update:modelValue'])
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.label {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 4px;
}

.input {
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: box-shadow 0.2s;
}

.input::placeholder {
  color: #ccc;
}

.input:focus {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.error-text {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
</style>
