<template>
  <PageContainer title="Project Request Detail">
    <CardContainer title="General Info">
      <form @submit.prevent="onSubmit">
        <div class="row-container">
          <div class="row-item">
            <AppInput v-model="client" placeholder="Client" label="Client" :error="errors.client" />
          </div>
          <div class="row-item">
            <label class="label">Site Supervisor</label>
            <el-select v-model="site_supervisor" placeholder="Select" size="large" style="width: 100%;"
              class="custom-select">
              <el-option v-for="item in users" :key="item._id" :label="item.full_name" :value="item._id" />
            </el-select>
            <div class="error-text" v-if="errors.site_supervisor">{{ errors.site_supervisor }}</div>
          </div>
          <div class="row-item">
            <label class="label">Job Number</label>
            <el-select v-model="job_number" placeholder="Select" size="large" style="width: 100%;"
              class="custom-select">
              <el-option v-for="item in job_numbers" :key="item._id" :label="item.code" :value="item._id" />
            </el-select>
             <div class="error-text" v-if="errors.job_number">{{ errors.job_number }}</div>
          </div>
          <div class="row-item">
            <label class="label">Date request</label>
            <el-form-item>
              <el-date-picker v-model="date_request" type="date" placeholder="Date request" style="width: 100%;" />
            </el-form-item>
            <div class="error-text" v-if="errors.date_request">{{ errors.date_request }}</div>
          </div>
          <div class="row-item">
            <AppInput v-model="project_name" placeholder="Project name" label="Project name" :error="errors.project_name" />
          </div>
        </div>
        <AppFooterForm>
          <el-button type="primary" @click="router.back()" plain>Back</el-button>
          <el-button type="primary" native-type="submit" :loading="isLoadingSaveProject">Save & Exit</el-button>
        </AppFooterForm>
      </form>
    </CardContainer>
    <CardContainer style="margin-top: 24px;">
      <el-table :data="raw_issues" class="custom-table" border style="margin-top: 16px;" v-loading="isLoading">
        <el-table-column type="index" label="No." width="57" />
        <el-table-column label="Description">
          <template #default="{ row }">
            <el-select placeholder="Description" size="large" style="width: 100%;" v-model="row.bin_configure._id"
              @change="onDescriptionChange(row)">
              <el-option v-for="item in bin_configures" :key="item._id" :label="item.spare.name" :value="item._id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="bin_configure.spare.part_no" label="Part No" />
        <el-table-column label="Quantity Request">
          <template #default="{ row }">
            <AppInput v-model="row.quantity_request" placeholder="Quantity Request" type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="bin_configure.quantity_oh" label="OH Qty" />
        <el-table-column label="Location">
          <template #default="{ row }">
           {{ renderLocation(row.bin_configure?.bin) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="date_request" label="Location">
          <template #default="{ row }">
            <el-select placeholder="Location" size="large" style="width: 100%;" v-model="row.bin._id">
              <el-option v-for="item in bins" :key="item._id" :label="renderLocation(item)" :value="item._id" />
            </el-select>
          </template>
        </el-table-column> -->
        <el-table-column prop="issue_to.full_name" label="Issue To" />
        <el-table-column prop="returned" label="Issue/Return/WriteOff" />
        <el-table-column label="Action">
          <template #default="{ row, $index }">
            <el-button type="success" :icon="Check" circle @click="onSaveItem(row)" />
            <el-button type="danger" :icon="Delete" circle @click="onDeleteItem(row, $index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="onAddItem" :icon="Plus" type="primary" plain style="margin-top: 12px;">Add Item</el-button>
    </CardContainer>
  </PageContainer>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageContainer from '@/components/common/PageContainer.vue'
import { ProjectRequest } from '@/api'
import CardContainer from '@/components/common/CardContainer.vue'
import AppInput from '@/components/common/AppInput.vue'
import { useGetBinConfigures, useGetJobNumbers, useGetUsers } from '@/hooks'
import { ref } from 'vue'
import { Check, Delete, Plus } from '@element-plus/icons-vue'
import AppFooterForm from '@/components/common/AppFooterForm.vue'
import * as yup from 'yup'
import { AppLoading } from '@/utils/common'

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const users = useGetUsers({
  // roles: [ROLES.SITE_SUPERVISOR]
});
const job_numbers = useGetJobNumbers();
// const bins = useGetBins({ limit: 1000 });
const bin_configures = useGetBinConfigures({ limit: 1000 });

const { handleSubmit, setFieldValue, useFieldModel, errors } = useForm({
  initialValues: {
    client: '',
    project_name: '',
    site_supervisor: '',
    job_number: '',
    date_request: null,
  },
  validationSchema: yup.object({
    client: yup.string().required('Client is not empty'),
    project_name: yup.string().required('Project name is not empty'),
    site_supervisor: yup.string().required('Site supervisor is not empty'),
    job_number: yup.string().required('Job number is not empty'),
    date_request: yup.string().required('Date request is not empty'),
  })
})
const [client, project_name, site_supervisor, job_number, date_request] = useFieldModel(['client', 'project_name', 'site_supervisor', 'job_number', 'date_request'])

const { refetch: refetchDetail } = useQuery({
  queryKey: ['project-request-id', id],
  queryFn: () => ProjectRequest.getDetail(id),
  onSuccess: (data) => {
    if (data?.data) {
      setFieldValue('client', data.data.client)
      setFieldValue('project_name', data.data.project_name)
      setFieldValue('site_supervisor', data?.data?.job_number?.assigned_to)
      setFieldValue('job_number', data?.data?.job_number?._id)
      setFieldValue('date_request', data?.data?.date_request)
    }
  },
  onError: () => {
    ElMessage.error('Failed to load project request.')
  }
})

const { mutate, isLoading: isLoadingSaveProject } = useMutation({
  mutationFn: (body) => ProjectRequest.updateDetail(id, body),
  onSuccess: () => {
    ElMessage.success('Success to save project request.');
    setTimeout(() => router.back(), 3000)
  },
  onError: () => {
    ElMessage.error('Failed to save project request.');
    refetchDetail()
  }
})


const onSubmit = handleSubmit(async (values) => {
  mutate(values);
});

//
const renderLocation = (bin) => {
  return `${bin.cluster?.name} - ${bin.shelf?.name} - ${bin.row} - ${bin.bin}`
}
const raw_issues = ref([]);
const { refetch, isLoading } = useQuery({
  queryKey: ['issues', id],
  queryFn: () => ProjectRequest.getIssuesByProjectId(id),
  onSuccess: (data) => {
    raw_issues.value = (data?.data || []).map(item => ({
      ...item,
      bin_configure: item.bin_configure || {},
      bin: item.bin || {}
    }))
  }
});

const onDescriptionChange = (row) => {
  const selected = bin_configures.value.find(
    (item) => item._id === row.bin_configure._id
  );
  if (selected) {
    row.bin_configure = structuredClone(selected);
  }
}
const onSaveItem = async (row) => {
  const quantity_request = Number(row.quantity_request || 0);
  if(quantity_request < 0 || quantity_request > row.bin_configure?.quantity_oh){
    return ElMessage.warning('Quantity request must be smaller OH Qty')
  }
  AppLoading.show();
  try {
    const data = {
      // bin: row.bin._id,
      project_request: id,
      bin_configure: row.bin_configure._id,
      quantity_request: Number(row.quantity_request || 0),
    }
    if (row._id) {
      await ProjectRequest.updateIssue(row._id, data);
    } else {
      await ProjectRequest.createIssue(data);
    }
    ElMessage.success('Successes to save item');
  } catch (error) {
    ElMessage.error('Failed to save item');
    console.log(error);
    refetch();
  } finally{
    AppLoading.hide()
  }
}
const onDeleteItem = (row, $index) => {
  ElMessageBox.confirm(
    '<p>Do you want to delete this item?</p>',
    'Delete Item',
    {
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      customClass: 'delete-confirm-box',
      dangerouslyUseHTMLString: true,
    }
  )
    .then(async () => {
      raw_issues.value = raw_issues.value.filter((_item, index) => index !== $index);
      if (!row._id) return ElMessage.success('Delete success');
      AppLoading.show()
      ProjectRequest.deleteIssue(row._id)
        .then(() => ElMessage.success('Delete success'))
        .catch(() => { ElMessage.error('Delete failed'); refetch() })
        .finally(() => AppLoading.hide())
    })
    .catch(() => {
    })
}
const onAddItem = () => {
  console.log(bin_configures.value[0]);
  raw_issues.value.push({
    bin_configure: structuredClone(bin_configures.value.length > 0 ? bin_configures.value[0] : {}),
    quantity_request: 1,
    // bin: structuredClone(bins.value.length > 0 ? bins.value[0] : {})
  });
}
//

</script>

<style scoped>
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

.error-text {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
</style>
