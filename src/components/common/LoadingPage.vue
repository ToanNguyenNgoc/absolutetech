<template>
  <div></div>
</template>

<script setup>
import { AppLoading } from '@/utils/common';
import { watch } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps({
  loading: { type: Boolean, default: false }
});
watch(
  () => props.loading,
  (newVal) => {
    if (newVal) {
      AppLoading.show();
    } else {
      AppLoading.hide();
    }
  },
  { immediate: true }
);
</script>
