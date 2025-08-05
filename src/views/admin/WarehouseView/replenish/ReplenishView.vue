<template>
  <PageContainer title="Replenish">
    <div v-if="step == 'LIST'">
      <div style="display: flex;justify-content:flex-end;">
        <div class="right">
          <el-input v-model="search_text" style="width: 240px" placeholder="Search Item Name, Part No..."
            :suffix-icon="Search" @input="onInputSearch" />
        </div>
      </div>
      <el-table :data="replenishBinConfigures" class="custom-table" border style="margin-top: 16px;"
        v-loading="isLoading">
        <el-table-column label="No." width="57">
          <template #default="{ row, $index }">
            <div style="display: flex;align-items: center;">
              <el-checkbox :model-value="isSelected(row)" size="large" @change="() => onSelectItem(row)"
                style="margin-right: 8px;" />
              <span class="item-name">{{ getIndexTable(params.page, params.limit, $index) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="spare.part_no" label="P/N" />
        <el-table-column prop="spare.material_no" label="Mat’l No" />
        <el-table-column prop="spare.name" label="Item Name" />
        <el-table-column label="Type">
          <template #default="{ row }">
            {{ row.spare?.type?.toUpperCase() }}
          </template>
        </el-table-column>
        <el-table-column prop="spare.description" label="Description" />
        <el-table-column label="Bin #">
          <template #default="{ row }">
            {{ renderBinLocation(row.bin) }}
          </template>
        </el-table-column>
        <el-table-column label="Quantity OH">
          <template #default="{ row }">
            <p style="text-align: center;">{{ row.quantity_oh }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="response">
        <AppPagination :limit="params.limit" :page="params.page" :total-items="response?.total"
          :total-pages="response?.totalPages" @current-change="(page) => params.page = page" />
      </div>
      <div class="cart_cnt_button">
        <el-button type="primary" @click="step = 'CHECKOUT'" :icon="Right"
          :disabled="itemsSelected.length == 0">Continue</el-button>
      </div>
    </div>
    <div v-if="step == 'CHECKOUT'">
      <el-button type="primary" :icon="Back" circle @click="step = 'LIST'" />
      <el-table :data="itemsSelected" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
        <el-table-column label="No." width="57">
          <template #default="{ row, $index }">
            <div style="display: flex;align-items: center;">
              <el-checkbox :model-value="isSelected(row)" size="large" @change="() => onSelectIssueItem(row)"
                style="margin-right: 8px;" />
              <span class="item-name">{{ getIndexTable(params.page, params.limit, $index) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="spare.part_no" label="P/N" />
        <el-table-column prop="spare.material_no" label="Mat’l No" />
        <el-table-column prop="spare.name" label="Item Name" />
        <el-table-column label="Type">
          <template #default="{ row }">
            {{ row.spare?.type?.toUpperCase() }}
          </template>
        </el-table-column>
        <el-table-column prop="spare.description" label="Description" />
        <el-table-column label="Bin #">
          <template #default="{ row }">
            {{ renderBinLocation(row.bin) }}
          </template>
        </el-table-column>
        <el-table-column label="Quantity OH">
          <template #default="{ row }">
            <p style="text-align: center;">{{ row.quantity_oh }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Quantity RL">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity_replenish" :min="0" />
          </template>
        </el-table-column>
      </el-table>
      <div class="cart_cnt_button">
        <el-button type="primary" :icon="Right" style="margin-top: 24px;" @click="openTaker = true"
          :disabled="itemsSelected.every(i => i.quantity_replenish == 0)">Checkout</el-button>
      </div>
      <ReplenishTakerDialog v-model="openTaker" @on-submit="onSubmitReplenish" />
    </div>
  </PageContainer>
</template>

<script setup>
import { ReplenishApi } from '@/api';
import PageContainer from '@/components/common/PageContainer.vue';
import { useQuery } from '@tanstack/vue-query';
import { computed, reactive, ref } from 'vue';
import { debounce } from 'lodash';
import { AppConfirm, AppLoading, getIndexTable, renderBinLocation } from '@/utils/common';
import { Search, Right, Back } from '@element-plus/icons-vue'
import AppPagination from '@/components/common/AppPagination.vue';
import ReplenishTakerDialog from './ReplenishTakerDialog.vue';
import { useAuth } from '@/hooks';
import { ElMessage } from 'element-plus';

const { userInfo } = useAuth();
const params = reactive({
  page: 1,
  limit: 10,
  search: null
});
const step = ref('LIST');
const search_text = ref();
const itemsSelected = ref([]);
const onInputSearch = debounce(async (val) => { params.search = val }, 800);
const { data, isLoading, refetch: refetchReplenishBinConfigure } = useQuery({
  queryKey: computed(() => ['replenish/bin-configures', { ...params }]),
  queryFn: () => ReplenishApi.getBinConfigures({ ...params })
});
const response = computed(() => data.value?.data);
const replenishBinConfigures = computed(() => data.value?.data?.list || []);

const isSelected = (item) => itemsSelected.value.some(i => i._id === item._id);
const onSelectItem = (item) => {
  const index = itemsSelected.value.findIndex(i => i._id === item._id);
  if (index >= 0) {
    itemsSelected.value.splice(index, 1);
  } else {
    itemsSelected.value.push({ ...item, quantity_replenish: 1 });
  }
};
//
const openTaker = ref(false);
const onSubmitReplenish = (signature) => {
  if (!userInfo.value?._id) return ElMessage.error('User not login');
  const payload = {
    taker_id: userInfo.value._id,
    signature_taker: signature,
    bin_configures: itemsSelected.value.map(i => ({
      bin_configure_id: i._id,
      quantity_replenish: i.quantity_replenish
    }))
  };
  AppConfirm.open({
    title: 'Do you want to confirm ?',
    callback: () => {
      AppLoading.show();
      ReplenishApi.postBinConfigures(payload)
        .then(() => {
          ElMessage.success('Replenish success');
          refetchReplenishBinConfigure();
          step.value = 'LIST';
          itemsSelected.value = [];
        })
        .catch(() => ElMessage.error('Replenish error'))
        .finally(() => AppLoading.hide())
    }
  })
};

</script>


<style scoped>
.cart_cnt_button {
  display: flex;
  justify-content: flex-end;
}
</style>