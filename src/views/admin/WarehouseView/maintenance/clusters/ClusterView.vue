<template>
  <div>
    <el-table :data="clusters" class="custom-table" border style="margin-top: 16px;">
      <el-table-column type="index" label="No." width="57" />
      <el-table-column prop="name" label="Cluster" />
      <el-table-column prop="code" label="Code" />
      <el-table-column label="Status">
        <template #default="{ row }">
          {{ row.status ? 'Online' : 'Offline' }}
        </template>
      </el-table-column>
      <el-table-column label="Is RFID">
        <template #default="{ row }">
          {{ row.is_rfid ? 'Yes' : 'No' }}
        </template>
      </el-table-column>
      <el-table-column label="Is Virtual">
        <template #default="{ row }">
          <el-button :type="row.is_virtual ? 'success' : 'danger'" :icon="row.is_virtual ? Check : Delete" circle />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ClusterApi } from '@/api';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { Check, Delete } from '@element-plus/icons-vue'


const params = {
  page: 1,
  limit: 15
}

const { data } = useQuery({
  queryKey: ['clusters', params],
  queryFn: () => ClusterApi.get(params)
});

const response = computed(() => data.value?.data);
const clusters = computed(() => response.value?.list || []);
console.log(response, clusters);

</script>