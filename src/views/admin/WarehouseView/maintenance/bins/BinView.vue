<template>
  <div>
    <div style="display: flex;justify-content: space-between;">
      <div class="left">
        <BinFilter 
          :status="params.status" @update:status="status => params.status = status"
          :is_drawer="params.is_drawer" @update:is_drawer="is_drawer => params.is_drawer = is_drawer"
          :cluster="params.cluster" @update:cluster="cluster => params.cluster = cluster"
          :shelf="params.shelf" @update:shelf="shelf => params.shelf = shelf"
          :row="params.row" @update:row="row => params.row = row"
          :bin="params.bin" @update:bin="bin => params.bin = bin"
        />
      </div>
      <div class="right">
        <el-input v-model="search_text" style="width: 240px" placeholder="Search Item name..." :suffix-icon="Search"  @input="onInputSearch" />
      </div>
    </div>
    <el-table :data="bins" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
      <el-table-column type="index" label="No." width="57" />
      <el-table-column prop="cluster.name" label="Cluster" />
      <el-table-column prop="shelf.name" label="Cabinet" />
      <el-table-column prop="row" label="Row" />
      <el-table-column prop="bin" label="Bin" />
      <el-table-column prop="bin" label="Item Name" />
      <el-table-column label="Item Name" width="200">
        <template #default="{ row }">
          {{ renderItemName(row.bin_configures) }}
        </template>
      </el-table-column>
      <el-table-column label="Total Item">
        <template #default="{ row }">
          {{ row.bin_configures?.length || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="Total Qty OH">
        <template #default="{ row }">
          {{ renderTotalQtyOh(row.bin_configures) }}
        </template>
      </el-table-column>
      <el-table-column label="Is Drawer">
        <template #default="{ row }">
          <el-button plain @click="updateItem(row, 'is_drawer')" :type="row.is_drawer ? 'success' : 'danger'"
            :icon="row.is_drawer ? Check : Close" circle />
        </template>
      </el-table-column>
      <el-table-column label="Is Faulty">
        <template #default="{ row }">
          <el-button plain @click="updateItem(row, 'is_faulty')" :type="row.is_faulty ? 'success' : 'danger'"
            :icon="row.is_faulty ? Check : Close" circle />
        </template>
      </el-table-column>
      <el-table-column label="Is Failed">
        <template #default="{ row }">
          <el-button plain @click="updateItem(row, 'is_failed')" :type="row.is_failed ? 'success' : 'danger'"
            :icon="row.is_failed ? Check : Close" circle />
        </template>
      </el-table-column>
      <el-table-column label="Action" width="100">
        <template #default="{ row }">
          <div style="display: flex;">
            <el-button :icon="Edit" circle type="primary" @click="onEdit(row)" />
            <!-- <el-button :icon="Delete" circle type="danger" @click="onEdit(row)" /> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="response">
      <AppPagination
        :limit="params.limit"
        :page="params.page"
        :total-items="response?.total"
        :total-pages="response?.totalPages"
        @current-change="(page) => params.page = page"
      />
    </div>
    <BinConfigureDialog v-model="showDialog" :bin="selectedBin" @refetch-bins="refetch" />
  </div>
</template>

<script setup>
import { BinApi } from '@/api';
import { useQuery } from '@tanstack/vue-query';
import { computed, reactive, ref } from 'vue';
import { Check, Edit, Close, Search } from '@element-plus/icons-vue';
import BinConfigureDialog from './BinConfigureDialog.vue';
import { ElMessage } from 'element-plus';
import AppPagination from '@/components/common/AppPagination.vue';
import {debounce} from 'lodash';
import BinFilter from './BinFilter.vue';


const params = reactive({
  page: 1,
  limit: 10,
  sort: '-createdAt',
  search:null,
  status:null,
  is_drawer:null,
  cluster: null,
  shelf:null,
  row: null,
  bin: null
});

const search_text = ref();
const { data, refetch, isLoading } = useQuery({
  queryKey: computed(() => ['spares', { ...params }]),
  queryFn: () => BinApi.getBins({ ...params })
});
const response = computed(() => data.value?.data);
const bins = computed(() => response?.value?.list || []);
const onInputSearch = debounce((val) => { params.search = val }, 800);


const renderItemName = (bin_configures = []) => {
  return bin_configures.map(item => item?.spare?.name).filter(Boolean).join(', ');
};

const renderTotalQtyOh = (bin_configures = []) => {
  if (bin_configures.length === 0) return 0;
  return bin_configures.reduce((total, item) => total += Number(item.quantity_oh || 0), 0);
};

//
const selectedBin = ref(null)
const showDialog = ref(false)

const onEdit = (row) => {
  selectedBin.value = row
  showDialog.value = true
}

const updateItem = (row, key) => {
  row[key] = !row[key];
  BinApi.updateBin(row._id, {
    [key]: row[key]
  })
    .then(() => ElMessage.success('Update success'))
    .catch(() => { ElMessage.error('Update error'); refetch() })
}

</script>