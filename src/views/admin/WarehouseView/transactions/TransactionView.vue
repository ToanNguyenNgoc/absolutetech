<template>
  <PageContainer title="Transactions">
    <div style="display: flex;justify-content: space-between;">
      <div class="left">
      </div>
      <div class="right">
        <el-input v-model="search_text" style="width: 260px" placeholder="Search Job number, Item name..."
          :suffix-icon="Search" @input="onInputSearch" clearable />
      </div>
    </div>
    <el-table :data="transactions" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
      <el-table-column label="No." width="57">
        <template #default="{ $index }">
          <span class="item-name">{{ getIndexTable(params.page, params.limit, $index) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Trans Date">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="job_number.code" label="Job Number" />
      <el-table-column label="Item Details">
        <template #default="{ row }">
          {{ genItemDetails(row.transaction_details) }}
        </template>
      </el-table-column>
      <el-table-column label="Quantity">
        <template #default="{ row }">
          {{ genQuantity(row.transaction_details) }}
        </template>
      </el-table-column>
      <el-table-column prop="taker.full_name" label="Issue" />
      <el-table-column prop="type" label="Type" />
    </el-table>
    <div v-if="response">
      <AppPagination :limit="params.limit" :page="params.page" :total-items="response?.total"
        :total-pages="response?.totalPages" @current-change="(page) => params.page = page" />
    </div>
  </PageContainer>
</template>

<script setup>
import AppPagination from '@/components/common/AppPagination.vue';
import PageContainer from '@/components/common/PageContainer.vue';
import { useGetTransactions } from '@/hooks';
import { formatDate, getIndexTable } from '@/utils/common';
import { reactive, ref } from 'vue';
import { debounce } from 'lodash';
import { Search } from '@element-plus/icons-vue'

const params = reactive({
  page: 1,
  limit: 10,
  sort: '-createdAt',
  search: '',
  // start_date:'2025-07-25',
  // end_date:'2025-07-26'
});
const search_text = ref();
const onInputSearch = debounce((val) => { params.search = val }, 800);
const { transactions, isLoading, response } = useGetTransactions(params);
const genItemDetails = (details = []) => {
  return details.map(i => i.issue?.bin_configure?.spare?.name).filter(Boolean).join(', ')
}
const genQuantity = (details = []) => {
  if (details.length == 0) return 'N/A';
  return details.reduce((total, item) => total += Number(item.quantity || 0), 0);
}
</script>