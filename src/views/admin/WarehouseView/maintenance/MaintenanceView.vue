<template>
  <PageContainer title="Clusters / Cabinets / Bins / Items Configure">
    <CardContainer style="margin-bottom: 12px;">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="Clusters" name="clusters" />
        <el-tab-pane label="Cabinets" name="cabinets" />
        <el-tab-pane label="Bins" name="bins" />
        <el-tab-pane label="Items Configure" name="items-configure" />
      </el-tabs>
      <router-view />
    </CardContainer>
  </PageContainer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import CardContainer from '@/components/common/CardContainer.vue'
import PageContainer from '@/components/common/PageContainer.vue'

const router = useRouter()
const route = useRoute()

// Sync tab with route
const activeName = ref('')

// Handle tab click → push route
const handleClick = (tab) => {
  router.push(`/admin/maintenance/${tab.props.name}`)
}

// Watch route to update active tab
watch(
  () => route.path,
  () => {
    // parse last segment
    const segment = route.path.split('/').pop()
    activeName.value = segment
  },
  { immediate: true }
)
</script>
