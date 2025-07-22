<template>
  <el-dialog :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :width="dialogWidth"
    :before-close="handleClose">
    <div v-if="bin">
      <div class="title">
        Edit Bin: {{ bin.cluster?.name }} - {{ bin.shelf?.name }} - {{ bin.row }} - {{ bin.bin }}
      </div>

      <el-divider>Items</el-divider>

      <el-table :data="binConfigures" border>
        <el-table-column type="index" label="No" width="50" />
        <el-table-column label="Item Name">
          <template #default="{ row }">
            <el-select placeholder="Item Name" size="large" style="width: 100%;" @change="onItemNameChange(row)"
              v-model="row.spare._id">
              <el-option v-for="item in spares" :key="item._id" :label="item.name" :value="item._id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="spare.type" label="Item Type" />
        <el-table-column prop="spare.part_no" label="Part No" />
        <el-table-column label="Quantity">
          <template #default="{ row }">
            <AppInput v-model="row.quantity" placeholder="Quantity" type="number" />
          </template>
        </el-table-column>
        <el-table-column label="Critical">
          <template #default="{ row }">
            <AppInput v-model="row.critical" placeholder="Critical" type="number" />
          </template>
        </el-table-column>
        <el-table-column label="Min">
          <template #default="{ row }">
            <AppInput v-model="row.min" placeholder="Min" type="number" />
          </template>
        </el-table-column>
        <el-table-column label="Max">
          <template #default="{ row }">
            <AppInput v-model="row.max" placeholder="Max" type="number" />
          </template>
        </el-table-column>
        <el-table-column label="OH Quantity">
          <template #default="{ row }">
            <AppInput v-model="row.quantity_oh" placeholder="OH Quantity" type="number" />
          </template>
        </el-table-column>
        <el-table-column label="Action">
          <template #default="{ row, $index }">
            <el-button type="success" :icon="Check" circle @click="onSaveItem(row)" />
            <el-button type="danger" :icon="Delete" circle @click="onDeleteItem(row, $index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="onAddItem" :icon="Plus" type="primary" plain style="margin-top: 12px;">Add Item</el-button>
    </div>

    <template #footer>
      <el-button @click="handleClose">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import AppInput from '@/components/common/AppInput.vue';
import { useGetSpares } from '@/hooks';
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { Check, Delete, Plus } from '@element-plus/icons-vue'
import { AppConfirm, AppLoading } from '@/utils/common';
import { BinApi } from '@/api';
import { ElMessage } from 'element-plus';

// eslint-disable-next-line no-undef
const props = defineProps({
  bin: Object,
  modelValue: Boolean,
})
// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue'])

const handleClose = () => {
  emit('update:modelValue', false)
}

// Mobile responsive width
const isMobile = ref(false)
const dialogWidth = computed(() => (isMobile.value ? '343px' : '85vw'))

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
//
const bin = computed(() => props.bin);
const { spares } = useGetSpares({ limit: 1000 });
const rawBinConfigures = ref([]);
const binConfigures = computed(() => {
  const fromProps = props.bin?.bin_configures || []
  const combined = [...fromProps, ...rawBinConfigures.value]
  return combined.map(item => ({
    ...item,
    spare: item.spare || {},
  }))
});

const onItemNameChange = (row) => {
  const selected = spares.value.find(
    (item) => item._id === row.spare._id
  );
  if (selected) {
    row.spare = structuredClone(selected);
  }
};
const onAddItem = () => {
  rawBinConfigures.value.push({
    spare: structuredClone(spares.value.length > 0 ? spares.value[0] : {}),
    quantity: 1,
    critical: 0,
    min: 1,
    max: 1000,
    quantity_oh: 1000
  })
};

const onSaveItem = async (row) => {
  AppLoading.show();
  try {
    if (row._id) {
      await BinApi.updateBinConfigure(row._id, { ...row })
    } else {
      await BinApi.createBinConfigure({ ...row, spare: row.spare?.id, bin: bin.value?._id })
    }
    ElMessage.success('Successes to save item');
  } catch (error) {
    console.log(error);
    ElMessage.error('Failed to save item');
  } finally {
    AppLoading.hide();
  }
};

const onDeleteItem = (row, $index) => {
  AppConfirm.open({
    title: 'Do you want to delete this item?',
    callback: () => {
      console.log(row, $index);
    }
  });
};

</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  text-align: center;
}
</style>
