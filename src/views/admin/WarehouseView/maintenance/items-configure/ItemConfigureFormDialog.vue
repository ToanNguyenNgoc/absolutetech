<template>
  <el-dialog :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :width="dialogWidth"
    :before-close="handleDialogClose">
    <div class="title">
      {{ spare ? 'Edit Item' : 'Add Item' }}
    </div>

    <form @submit.prevent="onSubmit">
      <div class="row-container">
        <div class="row-item">
          <AppInput label="Item Name" v-model="name" :error="errors.name" />
        </div>
        <div class="row-item">
          <AppInput label="Part No" v-model="part_no" :error="errors.part_no" />
        </div>
        <div class="row-item">
          <AppInput label="Material No" v-model="material_no" :error="errors.material_no" />
        </div>
        <div class="row-item">
          <AppInput label="Location" v-model="location" />
        </div>
        <div class="row-item">
          <AppInput label="Supplier’s Email" v-model="supplier_email" />
        </div>
        <div class="row-item">
          <AppInput label="Item Acct" v-model="item_acct" />
        </div>
        <div class="row-item">
          <AppInput label="Mat’l Grp" v-model="mat_grp" />
        </div>
        <div class="row-item">
          <AppInput label="UOM" v-model="jom" />
        </div>
        <div class="row-item">
          <AppInput label="CriCode" v-model="cricode" />
        </div>
        <div class="row-item">
          <label class="label">Has Batch Number</label>
          <el-checkbox size="large" v-model="has_batch_no" />
        </div>
        <div class="row-item">
          <label class="label">Has Serial Number</label>
          <el-checkbox size="large" v-model="has_serial_no" />
        </div>
        <div class="row-item">
          <label class="label">Item Type</label>
          <el-select size="large" style="width: 100%;" v-model="type">
            <el-option v-for="item in types" :key="item" :label="item" :value="item" />
          </el-select>
          <div class="error-text" v-if="errors.type">{{ errors.type }}</div>
        </div>
        <div class="row-item">
          <label class="label">Has Charge time</label>
          <el-checkbox size="large" v-model="has_charge_time" />
        </div>
        <div class="row-item">
          <label class="label">Has Calibration Due</label>
          <el-checkbox size="large" v-model="has_calibration_due" />
        </div>
        <div class="row-item">
          <label class="label">Has Expiry Date</label>
          <el-checkbox size="large" v-model="has_expiry_date" />
        </div>
        <div class="row-item">
          <label class="label">Has Load Hydrostatic Test Due</label>
          <el-checkbox size="large" v-model="has_load_hydrostatic_test_due" />
        </div>
        <div class="row-item">
          <label class="label">Has Verification</label>
          <el-checkbox size="large" v-model="has_verification" />
        </div>
        <div class="row-item">
          <AppInput label="Spare Field #1" v-model="field1" />
        </div>
        <div class="row-item">
          <AppInput label="Spare Field #2" v-model="field2" />
        </div>
        <div class="row-item">
          <AppInput label="Description" v-model="description" />
        </div>
        <div class="row-item">
          <label class="label">Item Image</label>
          <el-upload v-model:file-list="fileList" class="upload-demo" :action="mediaUploadUrl" :on-change="onFileChange"
            :on-remove="handleRemove" list-type="picture" :limit="1">
            <el-button style="height: 44px;" type="primary">Click to upload</el-button>
            <template #tip>
              <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
            </template>
          </el-upload>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <el-button @click="emit('update:modelValue', false)">Close</el-button>
        <el-button type="primary" native-type="submit">Save</el-button>
      </div>
    </form>
  </el-dialog>
</template>

<script setup>
import { useDialogFromSize } from '@/hooks';
import AppInput from '@/components/common/AppInput.vue';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { SpareApi } from '@/api';
import { baseURL } from '@/api/axios';
import { AppLoading } from '@/utils/common';
import { ElMessage } from 'element-plus';
import * as yup from 'yup';

// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
  spare: Object,
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'refetch-spare']);

const { dialogWidth } = useDialogFromSize();

const mediaUploadUrl = `${baseURL}/media`;
const fileList = ref([]);

const types = ['TTI', 'TTC', 'Perishable', 'CE', 'Torque wrench', 'Others'];

const {
  useFieldModel,
  resetForm,
  handleSubmit,
  setFieldValue,
  errors
} = useForm({
  initialValues: {
    name: '',
    part_no: '',
    material_no: '',
    location: '',
    supplier_email: '',
    item_acct: '',
    mat_grp: '',
    cricode: '',
    jom: '',
    has_batch_no: false,
    has_serial_no: false,
    type: '',
    has_charge_time: false,
    has_calibration_due: false,
    has_expiry_date: false,
    has_load_hydrostatic_test_due: false,
    has_verification: false,
    url: null,
    field1: '',
    field2: '',
    description: ''
  },
  validationSchema: yup.object({
    name: yup.string().required('Name is not empty'),
    part_no: yup.string().required('Part No is not empty'),
    material_no: yup.string().required('Material No is not empty'),
    type: yup.string().required('Item type is not empty'),
  })
});

watch(
  () => props.spare,
  (spare) => {
    if (spare) {
      resetForm({
        values: {
          ...spare
        },
      });
      if (spare.url) {
        fileList.value = [{ name: spare.url, url: spare.url }];
      }
    } else {
      fileList.value = [];
    }
  },
  { immediate: true }
);

const [
  name, part_no, material_no, location, supplier_email, item_acct,
  mat_grp, cricode, jom, has_batch_no, has_serial_no, type,
  has_charge_time, has_calibration_due, has_expiry_date,
  has_load_hydrostatic_test_due, has_verification, field1, field2, description
] = useFieldModel([
  'name', 'part_no', 'material_no', 'location', 'supplier_email', 'item_acct',
  'mat_grp', 'cricode', 'jom', 'has_batch_no', 'has_serial_no', 'type',
  'has_charge_time', 'has_calibration_due', 'has_expiry_date',
  'has_load_hydrostatic_test_due', 'has_verification', 'field1', 'field2', 'description'
]);

const onFileChange = (e) => {
  if (e?.response?.data?.original_url) {
    setFieldValue('url', e.response.data.original_url);
  }
};

const handleRemove = () => setFieldValue('url', null);

const onSubmit = handleSubmit(async (values) => {
  AppLoading.show();
  try {
    const response = props.spare?._id
      ? await SpareApi.update(props.spare._id, values)
      : await SpareApi.post(values);
    if (response) {
      emit('refetch-spare');
      emit('update:modelValue', false);
      ElMessage.success('Save item success');
    }
  } catch (error) {
    console.error('Error saving spare:', error);
    ElMessage.error('Save item error');
  } finally {
    AppLoading.hide();
  }
});

const handleDialogClose = (done) => {
  emit('update:modelValue', false);
  done();
};
</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  text-align: center;
}

.label {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 4px;
}

.row-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.row-item {
  width: 31%;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

:deep(.row-item .el-input__wrapper) {
  height: 42px;
  background-color: #F3F3F3;
  border: none !important;
  box-shadow: none !important;
  border-radius: 8px;
}

:deep(.row-item .el-select__wrapper) {
  background-color: #f5f5f5;
  min-height: 46px !important;
  box-shadow: none !important;
  border-radius: 8px !important;
}

.error-text {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
</style>
