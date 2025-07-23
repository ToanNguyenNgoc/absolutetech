<template>
  <div>
    <div>
      <div class="left">
        <el-button type="primary" @click="isOpenForm = true">Add Item</el-button>
      </div>
      <div class="right">

      </div>
    </div>
    <el-table :data="spares" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
      <el-table-column type="index" label="No." width="57" />
      <el-table-column label="Item Name">
        <template #default="{ row }">
          <span class="item-name">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type" />
      <el-table-column prop="part_no" label="P/N" />
      <el-table-column prop="material_no" label="Mat’l No" />
      <el-table-column prop="description" label="Description" />
      <el-table-column label="Action">
        <template #default="{ row, $index }">
          <el-button type="success" :icon="Edit" circle @click="onEditItem(row)" />
          <el-button type="danger" :icon="Delete" circle @click="onDeleteItem(row, $index)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper" v-if="response">
      <span class="total-text">Page {{ response.page }} of {{ response.totalPages }}</span>
      <el-pagination :current-page="params.page" :page-size="params.limit" :total="response.total"
        layout="prev, pager, next" class="no-bg-pagination" @current-change="handleCurrentChange" />
    </div>
    <ItemConfigureFormDialog v-model="isOpenForm" :spare="selectedSpare" @refetch-spare="refetch" />
  </div>
</template>

<script setup>
import { useGetSpares } from '@/hooks';
import { reactive, ref, watch } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue'
import ItemConfigureFormDialog from './ItemConfigureFormDialog.vue';

const params = reactive({
  page: 1,
  limit: 10,
  sort: '-createdAt',
});

const isOpenForm = ref(false);
const selectedSpare = ref(null);

const { spares, refetch, response, isLoading } = useGetSpares(params);


const onEditItem = (row) => {
  selectedSpare.value = row;
  isOpenForm.value = true;
};

watch(isOpenForm, (val) => {
  if (!val) {
    selectedSpare.value = null;
  }
});

const onDeleteItem = (row, $index) => {
  console.log('delete', row, $index);
};

const handleCurrentChange = (newPage) => {
  params.page = newPage;
};

</script>


<style>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background-color: #f2f2f2;
  position: relative;
}

.total-text {
  color: #6D6E71;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  position: absolute;
  left: 36px;
}

.no-bg-pagination :deep(.btn-prev),
.no-bg-pagination :deep(.btn-next),
.no-bg-pagination :deep(.el-pager li) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.pagination-container {
  margin-top: 16px;
  text-align: right;
}

.el-form-item {
  margin-bottom: 16px;
}
.item-name {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>