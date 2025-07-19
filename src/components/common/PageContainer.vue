<template>
  <div class="container">
    <h1 class="title">{{ title || '' }}</h1>
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
.container {
  padding: 32px 24px;
  border-radius: 4px;
}
.title{
  margin-bottom: 16px;
}
</style>