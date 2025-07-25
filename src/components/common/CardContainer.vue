<template>
  <div class="card-container">
    <div v-if="title" class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>
<script setup>
// eslint-disable-next-line no-undef
defineProps({
  title: String,
})
</script>
<style scoped>
.card-container {
  background: #fff;
  margin: 0 auto;
  max-width: 1200px;
  box-shadow: 0 2px 16px #ccc;
  border-radius: 12px;
  padding: 22px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>