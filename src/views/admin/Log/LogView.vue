<template>
  <PageContainer title="Sync Data Log">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Sync Data Log" name="sync-data-logs" />
      <!-- <el-tab-pane label="Request Log" name="request-logs" /> -->
    </el-tabs>
    <router-view />
  </PageContainer>
</template>

<script setup>
import PageContainer from '@/components/common/PageContainer.vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const activeName = ref('')

const handleClick = (tab) => {
  router.push(`/admin/log/${tab.props.name}`)
}
watch(
  () => route.path,
  () => {
    const segment = route.path.split('/').pop()
    activeName.value = segment
  },
  { immediate: true }
)
</script>