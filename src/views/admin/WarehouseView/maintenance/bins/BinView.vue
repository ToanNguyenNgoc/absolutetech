<template>
  <div>
    <el-table :data="bins" class="custom-table" border style="margin-top: 16px;">
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
          <el-button :type="row.is_drawer ? 'success' : 'danger'" :icon="row.is_drawer ? Check : Delete" circle />
        </template>
      </el-table-column>
      <el-table-column label="Is Faulty">
        <template #default="{ row }">
          <el-button :type="row.is_faulty ? 'success' : 'danger'" :icon="row.is_faulty ? Check : Delete" circle />
        </template>
      </el-table-column>
      <el-table-column label="Is Failed">
        <template #default="{ row }">
          <el-button :type="row.is_failed ? 'success' : 'danger'" :icon="row.is_failed ? Check : Delete" circle />
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default="{ row }">
          <el-button :icon="Edit" circle type="primary" @click="onEdit(row)" />
        </template>
      </el-table-column>
    </el-table>
    <BinConfigureDialog v-model="showDialog" :bin="selectedBin" />
  </div>
</template>

<script setup>
import { BinApi } from '@/api';
import { useQuery } from '@tanstack/vue-query';
import { computed, reactive, ref } from 'vue';
import { Check, Delete, Edit } from '@element-plus/icons-vue';
import BinConfigureDialog from './BinConfigureDialog.vue';


const params = reactive({
  page: 1,
  limit: 15,
  sort: '-created_at'
});

const { data } = useQuery({
  queryKey: ['bins', params],
  queryFn: () => BinApi.getBins(params)
});

const response = computed(() => data.value?.data);
const bins = computed(() => response?.value?.list || []);

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

</script>