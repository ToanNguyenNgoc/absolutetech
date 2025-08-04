<template>
  <div>
    <el-table :data="logs" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
      <el-table-column label="No." width="57">
        <template #default="{ $index }">
          <span class="item-name">{{ getIndexTable(params.page, params.limit, $index) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="device_id" label="Device Id" />
      <el-table-column prop="timestamp_fetch" label="Timestamp Fetch" />
      <el-table-column label="Created">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>
    </el-table>
    <div v-if="response">
      <AppPagination :limit="params.limit" :page="params.page" :total-items="response?.total"
        :total-pages="response?.totalPages" @current-change="(page) => params.page = page" />
    </div>
  </div>
</template>

<script setup>
import AppPagination from '@/components/common/AppPagination.vue';
import { useGetSyncDataLogs } from '@/hooks';
import { formatDateTime, getIndexTable } from '@/utils/common';
import { reactive } from 'vue';

const params = reactive({
  page: 1,
  limit: 10,
  sort: '-createdAt'
});
const { logs, response, isLoading } = useGetSyncDataLogs(params)
</script>