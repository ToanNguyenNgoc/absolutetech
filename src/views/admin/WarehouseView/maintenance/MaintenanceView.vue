<template>
  <PageContainer title="Clusters / Cabinets / Bins / Items">
    <CardContainer style="margin-bottom: 12px;">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="Clusters" name="clusters" />
        <el-tab-pane label="Cabinets" name="cabinets" />
        <el-tab-pane label="Bins" name="bins" />
        <el-tab-pane label="Items" name="items-configure" />
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

const activeName = ref('')

const handleClick = (tab) => {
  router.push(`/admin/maintenance/${tab.props.name}`)
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
