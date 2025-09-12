<template>
  <PageContainer title="Holidays">
    <el-table :data="holidays" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
      <el-table-column label="No." width="57">
        <template #default="{ $index }">
          <span class="item-name">{{ getIndexTable(params.page, params.limit, $index) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template #default="{ row }">
          <el-input v-model="row.name" placeholder="Name" />
        </template>
      </el-table-column>
      <el-table-column label="Date">
        <template #default="{ row }">
          <el-date-picker v-model="row.date" type="date" placeholder="dd/mm" format="DD/MM"
            value-format="YYYY-MM-DD" :clearable="false" />
        </template>
      </el-table-column>
      <el-table-column label="Created at">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default="{ row, $index }">
          <el-button type="success" :icon="Check" circle @click="onSaveItem(row)" />
          <el-button type="danger" :icon="Delete" circle @click="onDeleteItem(row, $index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="onAddItem" :icon="Plus" type="primary" plain style="margin-top: 12px;">Add new</el-button>
  </PageContainer>
</template>


<script setup>
import PageContainer from '@/components/common/PageContainer.vue';
import { useGetHolidays } from '@/hooks';
import { AppConfirm, AppLoading, formatDateTime, getIndexTable } from '@/utils/common';
import { Plus, Delete, Check } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import moment from 'moment';
import { HolidayApi } from '@/api/holiday';
import { ElMessage } from 'element-plus';

const params = reactive({
  page: 1,
  limit: 200,
  sort: '-createAt'
});
const holidays = ref([]);
const { isLoading, refetch } = useGetHolidays(params, {
  onSuccess: (data) => holidays.value = data.data?.list || [],
});
const onAddItem = () => {
  holidays.value.push({
    name: '',
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  })
};
const onSaveItem = async (row) => {
  AppLoading.show();
  try {
    if (row._id) {
      await HolidayApi.put(row._id, row);
    } else {
      await HolidayApi.post(row);
    }
    ElMessage.success('Successes to save item');
  } catch (error) {
    ElMessage.error(error?.response?.data?.message || 'Failed to save item');
  } finally {
    AppLoading.hide();
  }
};
const onDeleteItem = (item, $index) => {
  AppConfirm.open({
    title: 'Do you want to confirm ?',
    callback: () => {
      if (!item._id) {
        holidays.value.splice($index, 1);
      } else {
        AppLoading.show();
        HolidayApi.delete(item._id)
          .then(() => { ElMessage.success('Delete success'); refetch() })
          .catch(() => ElMessage.error('Delete error'))
          .finally(() => AppLoading.hide())
      }
    }
  })
};
</script>