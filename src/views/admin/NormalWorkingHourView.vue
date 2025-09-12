<template>
  <PageContainer title="Normal Working Hours">
    <el-table :data="normalWorkingHours" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
      <el-table-column label="No." width="57">
        <template #default="{ $index }">
          <span class="item-name">{{ getIndexTable(params.page, params.limit, $index) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="weekday" label="Weekday" />
      <el-table-column label="Time start">
        <template #default="{ row }">
          <el-time-picker v-model="row.time_start" value-format="HH:mm" :format="'HH:mm'" placeholder="Time start"
            :clearable="false" @change="(val) => onTimeConfirm(row, 'time_start', val)" />
        </template>
      </el-table-column>
      <el-table-column label="Time end">
        <template #default="{ row }">
          <el-time-picker v-model="row.time_end" value-format="HH:mm" :format="'HH:mm'" placeholder="Time end"
            :clearable="false" @change="(val) => onTimeConfirm(row)" />
        </template>
      </el-table-column>
    </el-table>
  </PageContainer>
</template>

<script setup>
import PageContainer from '@/components/common/PageContainer.vue';
import { useGetNormalWorkingHours } from '@/hooks';
import { reactive } from 'vue';
import { getIndexTable } from '@/utils/common';
import { NormalWorkingHourApi } from '@/api';
import { ElMessage } from 'element-plus';

const params = reactive({});
const { normalWorkingHours, isLoading } = useGetNormalWorkingHours(params);
const onTimeConfirm = (row) => {
  NormalWorkingHourApi.update(row.id, {
    time_start: row.time_start,
    time_end: row.time_end,
  })
    .then(() => ElMessage.success('Successes to save item'))
    .catch(() => ElMessage.error("Failed to save item"))
}
</script>

<style scoped>

</style>
