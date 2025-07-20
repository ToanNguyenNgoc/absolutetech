<template>
  <div class="container">
    <h1 class="title">{{ title || '' }}</h1>
    <div class="wrapper">
      <slot></slot>
    </div>
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
  height: calc(100vh - 218px);
  overflow: hidden;
}

.title {
  margin-bottom: 16px;
}

.wrapper {
  height: calc(100% - 10px);
  overflow-y: scroll;
}
</style>