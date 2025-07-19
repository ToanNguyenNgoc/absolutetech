<template>
  <button class="icon-button" @click="$emit('click')">
    <img v-if="src" :src="src" :alt="alt" class="icon-img" />
    <slot v-else />
  </button>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  src: String,
  alt: {
    type: String,
    default: 'icon',
  },
})

// eslint-disable-next-line no-undef
defineEmits(['click'])
</script>

<style scoped>
.icon-button {
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  cursor: pointer;
  margin: 4px;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>
