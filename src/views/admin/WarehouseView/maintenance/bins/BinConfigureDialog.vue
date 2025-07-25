<template>
  <el-dialog :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :width="dialogWidth"
    :before-close="handleClose">
    <div v-if="bin">
      <div class="title">
        Edit Bin: {{ bin.cluster?.name }} - {{ bin.shelf?.name }} - {{ bin.row }} - {{ bin.bin }}
      </div>

      <el-divider>Items</el-divider>

      <div class="table_cnt">
        <el-table :data="binConfigures" border>
          <el-table-column type="index" label="No" width="50" />
          <el-table-column label="Item Name" width="200">
            <template #default="{ row }">
              <el-select placeholder="Item Name" style="width: 100%;" @change="onItemNameChange(row)"
                v-model="row.spare._id">
                <el-option v-for="item in spares" :key="item._id" :label="item.name" :value="item._id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="spare.type" label="Item Type" width="130" />
          <el-table-column prop="spare.part_no" label="Part No" width="130" />
          <el-table-column label="Quantity" width="100">
            <template #default="{ row }">
              <el-input v-model="row.quantity" placeholder="Quantity" type="number" />
            </template>
          </el-table-column>
          <el-table-column label="Critical" width="100">
            <template #default="{ row }">
              <el-input v-model="row.critical" placeholder="Critical" type="number" />
            </template>
          </el-table-column>
          <el-table-column label="Min" width="100">
            <template #default="{ row }">
              <el-input v-model="row.min" placeholder="Min" type="number" />
            </template>
          </el-table-column>
          <el-table-column label="Max" width="120">
            <template #default="{ row }">
              <el-input v-model="row.max" placeholder="Max" type="number" />
            </template>
          </el-table-column>
          <el-table-column label="OH Quantity" width="120">
            <template #default="{ row }">
              <el-input v-model="row.quantity_oh" placeholder="OH Quantity" type="number" />
            </template>
          </el-table-column>
          <el-table-column label="Batch Number" width="220">
            <template #default="{ row }">
              <div class="row-item" v-if="row.spare?.has_batch_no">
                <el-form :model="row">
                  <el-form-item :prop="'batch_no'"
                    :rules="row.spare?.has_batch_no ? [{ required: true, message: 'Batch Number is required', trigger: 'blur' }] : []">
                    <el-input v-model="row.batch_no" placeholder="Batch Number" />
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Serial Number" width="220">
            <template #default="{ row }">
              <div class="row-item">
                <el-form :model="row" v-if="row.spare?.has_serial_no">
                  <el-form-item :prop="'serial_no'"
                    :rules="row.spare?.has_serial_no ? [{ required: true, message: 'Serial Number is required', trigger: 'blur' }] : []">
                    <el-input v-model="row.serial_no" placeholder="Serial Number" />
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="BarCode/QrCode" width="250">
            <template #default="{ row }">
              <div class="row-item" v-if="row.spare?.has_verification">
                <el-form :model="row">
                  <el-form-item :prop="'bar_code_qr_code'"
                    :rules="row.spare?.has_verification ? [{ required: true, message: 'BarCode/QrCode is required', trigger: 'blur' }] : []">
                    <el-input v-model="row.bar_code_qr_code" placeholder="BarCode/QrCode" />
                  </el-form-item>
                </el-form>
                <qrcode-vue v-if="row.bar_code_qr_code" :value="row.bar_code_qr_code" :size="50" level="H"
                  render-as="svg" style="margin-left: 6px; margin-top: 9px;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Change Time" width="250">
            <template #default="{ row }">
              <div class="row-item" v-if="row.spare?.has_charge_time">
                <el-form :model="row">
                  <el-form-item :prop="'charge_time'"
                    :rules="row.spare?.has_charge_time ? [{ required: true, message: 'Change Time is required', trigger: 'blur' }] : []">
                    <el-date-picker v-model="row.charge_time" type="date" placeholder="Change Time" />
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Load Hydrostatic Test Due" width="250">
            <template #default="{ row }">
              <div class="row-item" v-if="row.spare?.has_load_hydrostatic_test_due">
                <el-form :model="row">
                  <el-form-item :prop="'load_hydrostatic_test_due'"
                    :rules="row.spare?.has_load_hydrostatic_test_due ? [{ required: true, message: 'Test Due is required', trigger: 'blur' }] : []">
                    <el-date-picker v-model="row.load_hydrostatic_test_due" type="date" placeholder="Test Due" />
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Expiry Date" width="250">
            <template #default="{ row }">
              <div class="row-item" v-if="row.spare?.has_expiry_date">
                <el-form :model="row">
                  <el-form-item :prop="'expiry_date'"
                    :rules="row.spare?.has_expiry_date ? [{ required: true, message: 'Expiry Date is required', trigger: 'blur' }] : []">
                    <el-date-picker v-model="row.expiry_date" type="date" placeholder="Expiry Date" />
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Action">
            <template #default="{ row, $index }">
              <el-button type="success" :icon="Check" circle @click="onSaveItem(row)" />
              <el-button type="danger" :icon="Delete" circle @click="onDeleteItem(row, $index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button @click="onAddItem" :icon="Plus" type="primary" plain style="margin-top: 12px;">Add Item</el-button>
    </div>

    <template #footer>
      <el-button @click="handleClose">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { useGetSpares } from '@/hooks';
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { Check, Delete, Plus } from '@element-plus/icons-vue'
import { AppLoading } from '@/utils/common';
import { BinApi } from '@/api';
import { ElMessage } from 'element-plus';
import QrcodeVue from 'qrcode.vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  bin: Object,
  modelValue: Boolean,
})
// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'refetch-bins'])

const handleClose = () => {
  emit('update:modelValue', false);
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
const binConfigures = ref(computed(() => props.bin?.bin_configures.map(i => ({ ...i, spare: i.spare || {} })) || []));

const onItemNameChange = (row) => {
  const selected = spares.value.find(
    (item) => item._id === row.spare._id
  );
  if (selected) {
    row.spare = structuredClone(selected);
  }
};
const onAddItem = () => {
  binConfigures.value.push({
    spare: structuredClone(spares.value.length > 0 ? spares.value[0] : {}),
    quantity: 1,
    critical: 0,
    min: 1,
    max: 1000,
    quantity_oh: 1000
  })
};

const onSaveItem = async (row) => {
  if(!row.spare?._id) return ElMessage.warning('Item Name is required');
  if (row.spare?.has_batch_no && !row.batch_no) return;
  if (row.spare?.has_serial_no && !row.serial_no) return;
  if (row.spare?.has_verification && !row.bar_code_qr_code) return;
  if (row.spare?.has_charge_time && !row.charge_time) return;
  if (row.spare?.has_load_hydrostatic_test_due && !row.load_hydrostatic_test_due) return;
  if (row.spare?.has_expiry_date && !row.expiry_date) return;
  AppLoading.show();
  try {
    if (row._id) {
      await BinApi.updateBinConfigure(row._id, { ...row })
    } else {
      await BinApi.createBinConfigure({ ...row, spare: row.spare?.id, bin: bin.value?._id })
    }
    ElMessage.success('Successes to save item');
    emit('refetch-bins');
  } catch (error) {
    console.log(error);
    ElMessage.error('Failed to save item');
  } finally {
    AppLoading.hide();
  }
};

const onDeleteItem = (row, $index) => {
  if (!row._id) {
    binConfigures.value.splice($index, 1);
  }
  BinApi.deleteBinConfigure(row._id)
    .then(() => {
      binConfigures.value.splice($index, 1);
      ElMessage.success('Delete item success');
      emit('refetch-bins');
    })
    .catch(() => ElMessage.error('Delete item failed'))
};

</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  text-align: center;
}

.table_cnt {
  width: 100%;
  overflow-x: scroll;
}

.table_cnt .el-table {
  min-width: 2650px;
}

:deep(.el-dialog__body) {
  overflow-x: visible !important;
}

.row-item {
  display: flex;
  /* align-items: center; */
}

.row-item .el-form {
  margin-top: 18px;
}

.row-item .el-checkbox {
  margin-right: 6px;
}
</style>
