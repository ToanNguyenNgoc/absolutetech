<template>
  <PageContainer title="Project Request Detail">
    <CardContainer title="General Info">
      <form @submit.prevent="onSubmit">
        <div class="row-container">
          <div class="row-item">
            <AppInput v-model="client" placeholder="Client" label="Client" />
          </div>
          <div class="row-item">
            <label class="label">Site Supervisor</label>
            <el-select v-model="site_supervisor" placeholder="Select" size="large" style="width: 100%;"
              class="custom-select">
              <el-option v-for="item in users" :key="item._id" :label="item.full_name" :value="item._id" />
            </el-select>
          </div>
          <div class="row-item">
            <label class="label">Job Number</label>
            <el-select v-model="job_number" placeholder="Select" size="large" style="width: 100%;"
              class="custom-select">
              <el-option v-for="item in job_numbers" :key="item._id" :label="item.code" :value="item._id" />
            </el-select>
          </div>
          <div class="row-item">
            <label class="label">Date request</label>
            <el-form-item>
              <el-date-picker v-model="date_request" type="date" placeholder="Date request" style="width: 100%;" />
            </el-form-item>
          </div>
          <div class="row-item">
            <AppInput v-model="project_name" placeholder="Project name" label="Project name" />
          </div>
        </div>
      </form>
    </CardContainer>
    <CardContainer style="margin-top: 24px;">
      <el-table :data="issues" class="custom-table" border style="margin-top: 16px;">
        <el-table-column type="index" label="No." width="57" />
        <el-table-column prop="bin_configure.description" label="Description" />
        <el-table-column prop="spare.part_no" label="Part No" />
        <el-table-column prop="quantity_request" label="Quantity Request" />
        <el-table-column prop="bin_configure.bin.quantity_oh" label="OH Qty" />
        <el-table-column prop="bin_configure.bin.quantity_oh" label="OH Qty" />
        <el-table-column prop="date_request" label="Location">
          <template #default="{ row }">
            {{ row.bin_configure?.bin?.cluster?.name}} - {{ row.bin_configure?.bin?.shelf?.name }} - {{ row.bin_configure?.bin?.row }} - {{ row.bin_configure?.bin?.bin }}
          </template>
        </el-table-column>
        <el-table-column prop="issue_to.full_name" label="Issue To" />
        <el-table-column prop="returned" label="Issue/Return/WriteOff" />
        <!-- <el-table-column label="Action" width="150">
          <template #default="{ row }">
            <IconButton :src="editIcon" @click="handleView(row)" />
          </template>
        </el-table-column> -->
      </el-table>
    </CardContainer>
  </PageContainer>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/common/PageContainer.vue'
import { ProjectRequest } from '@/api'
import CardContainer from '@/components/common/CardContainer.vue'
import AppInput from '@/components/common/AppInput.vue'
// import { ref } from 'vue'
import { useGetJobNumbers, useGetUsers } from '@/hooks'
import { computed } from 'vue'
// import { ROLES } from '@/utils/constants'

const route = useRoute();
const id = route.params.id;
const users = useGetUsers({
  // roles: [ROLES.SITE_SUPERVISOR]
});
const job_numbers = useGetJobNumbers();

const { handleSubmit, setFieldValue, useFieldModel } = useForm({
  initialValues: {
    client: '',
    project_name: '',
    site_supervisor: '',
    job_number: '',
    date_request: null,
  }
})
const [client, project_name, site_supervisor, job_number, date_request] = useFieldModel(['client', 'project_name', 'site_supervisor', 'job_number', 'date_request'])

useQuery({
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
//
const { data: data_issues } = useQuery({
  queryKey: ['issues', id],
  queryFn: () => ProjectRequest.getIssuesByProjectId(id)
});
const issues = computed(() => data_issues?.value?.data || []);
//

const onSubmit = handleSubmit(async (values) => {
  console.log('Form submitted:', values)
});

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
  height: 46px;
  background-color: #F3F3F3;
  border: none !important;
  box-shadow: none !important;
  border-radius: 8px;
}
</style>
