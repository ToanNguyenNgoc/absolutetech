<template>
  <PageContainer title="Daily Timesheet">
    <div style="display: flex;justify-content: space-between; margin-bottom: 16px;">
      <div class="left">
      </div>
      <div class="right">
        <el-input v-model="search_text" style="width: 260px" placeholder="Search name..." :suffix-icon="Search"
          @input="onInputSearch" clearable />
        <el-date-picker v-model="params.range_date" type="daterange" range-separator="To" start-placeholder="Start date"
          end-placeholder="End date" size="default" @change="onChangeRangeDate" value-format="YYYY-MM-DD" />
      </div>
    </div>
    <div class="table-h-scroll">
      <el-table :data="salaryTimesheets" class="custom-table" border :fit="false" v-loading="isLoading"
        style="width: 100%">
        <el-table-column label="No." width="80">
          <template #default="{ $index }">
            <span class="item-name">{{ getIndexTable(params.page, params.limit, $index) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="CODE" min-width="140">
          <template #default="{ row }">{{ row.jobnumber?.code }}</template>
        </el-table-column>

        <el-table-column label="NAME" min-width="200">
          <template #default="{ row }">{{ row.timesheet_detail?.attendance?.full_name }}</template>
        </el-table-column>

        <el-table-column label="CLIENT" min-width="180">
          <template #default="{ row }">{{ row.jobnumber?.client }}</template>
        </el-table-column>

        <el-table-column label="LOCATION" min-width="180">
          <template></template>
        </el-table-column>

        <el-table-column label="JOB" min-width="220">
          <template #default="{ row }">{{ row.jobnumber?.project }}</template>
        </el-table-column>

        <el-table-column label="SUPERVISOR" min-width="200">
          <template #default="{ row }">{{ row.timesheet?.office_supervisor?.full_name }}</template>
        </el-table-column>

        <el-table-column label="DATE" min-width="140">
          <template #default="{ row }">{{ formatDate(row.date_record) }}</template>
        </el-table-column>

        <el-table-column label="TIME IN" min-width="120">
          <template #default="{ row }">{{ formattedTime(row.timesheet_detail?.time_in) }}</template>
        </el-table-column>

        <el-table-column label="TIME OUT" min-width="120">
          <template #default="{ row }">{{ formattedTime(row.timesheet_detail?.time_out) }}</template>
        </el-table-column>

        <el-table-column label="SALARY" min-width="140">
          <template #default="{ row }">$ {{ row.total_allowance_salary }}</template>
        </el-table-column>

        <el-table-column label="OVERTIME" min-width="140">
          <template #default="{ row }">{{ row.overtime_salary !== 0 ? `$ ${row.overtime_salary}` : '' }}</template>
        </el-table-column>

        <el-table-column label="TOTAL" min-width="140">
          <template #default="{ row }">$ {{ getTotalSalary(row) }}</template>
        </el-table-column>

        <el-table-column label="REMARK 2" min-width="220">
          <template #default="{ row }">{{ row.timesheet_detail?.remarks }}</template>
        </el-table-column>

        <el-table-column label="JOB NUMBER" min-width="220">
          <template #default="{ row }">{{ row.jobnumber?.project }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="response">
      <AppPagination :limit="params.limit" :page="params.page" :total-items="response?.total"
        :total-pages="response?.totalPages" @current-change="(page) => params.page = page" />
    </div>
  </PageContainer>
</template>

<script setup>
import AppPagination from '@/components/common/AppPagination.vue';
import PageContainer from '@/components/common/PageContainer.vue';
import { useGetSalaryTimesheets } from '@/hooks';
import { AppLoading, formatDate, formattedTime, getIndexTable } from '@/utils/common';
import { reactive, ref } from 'vue';
import { debounce } from 'lodash';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const params = reactive({
  page: 1,
  limit: 15,
  sort: 'date_record',
  search: '',
  start_date_record: null,
  end_date_record: null,
});


const search_text = ref();
const onInputSearch = debounce((val) => { params.search = val; AppLoading.show() }, 800);
const onChangeRangeDate = (value) => {
  AppLoading.show();
  if (value?.length == 2) {
    params.start_date_record = value[0];
    params.end_date_record = value[1];
  } else {
    params.start_date_record = null;
    params.end_date_record = null;
  }
};
const { salaryTimesheets, response, isLoading } = useGetSalaryTimesheets(params, {
  onSuccess: () => AppLoading.hide(),
  onError: () => { AppLoading.hide(); ElMessage.error('Cannot get data') }
});
const getTotalSalary = (row) => {
  return Number(row.total_allowance_salary || 0) + Number(row.overtime_salary);
};

</script>

<style scoped>
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-h-scroll {
  width: calc(100vw - 120px);
}

.custom-table :deep(.cell) {
  white-space: nowrap;
}

@media (max-width: 767px) {
  .table-h-scroll {
    width: 100vw;
  }
}
</style>