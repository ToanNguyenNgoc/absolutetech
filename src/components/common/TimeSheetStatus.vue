<template>
  <el-tag type="primary">{{ status?.toUpperCase() }}</el-tag>
</template>

<script setup>


// eslint-disable-next-line no-undef
defineProps({
  status: String,
})
</script>