<template>
  <div class="card">
    <div class="container">
      <p class="title">{{ title }}</p>
      <span class="content">{{ content }}</span>
      <div class="wrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>

// eslint-disable-next-line no-undef
defineProps({
  title: { type: String, default: 'Chart title' },
  content: { type: String}
})

</script>

<style scoped>
.card{
  width: 100%;
  height: 100%;
  padding: 6px;
}
.container{
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 16px #ccc;
  padding: 8px;
}
.title{
  font-size: 16px;
  font-weight: 600;
}
.content{
  font-size: 14px;
  font-weight: 400;
}
</style>