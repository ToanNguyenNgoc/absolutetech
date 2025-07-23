<template>
  <el-tag :type="renderStatus().primary">{{ renderStatus().status }}</el-tag>
</template>

<script setup>
import { PROJECT_REQUEST_STATUS } from '@/utils/constants';
import { computed } from 'vue';


// eslint-disable-next-line no-undef
const props = defineProps({
  status: String,
})

const status = computed(() => props.status);

const renderStatus = () => {
  let data = { primary: 'info', status: 'New' }
  if(status.value === PROJECT_REQUEST_STATUS.IN_PROGRESS.value) {data.primary = 'warning'; data.status = PROJECT_REQUEST_STATUS.IN_PROGRESS.name}
  if(status.value === PROJECT_REQUEST_STATUS.ISSUE.value) {data.primary = 'success'; data.status = PROJECT_REQUEST_STATUS.ISSUE.name}
  return data
}

</script>