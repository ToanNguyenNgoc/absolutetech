<template>
  <PageContainer title="Project Request">
    <div>
      <el-table v-loading="isLoading" v-if="!response"></el-table>
      <el-table v-if="response" :data="response.list" class="custom-table" border style="margin-top: 16px;">
        <el-table-column type="index" label="No." width="57" />
        <el-table-column prop="job_number.client" label="Client" />
        <el-table-column prop="job_number.code" label="JN" />
        <el-table-column prop="project_name" label="Project Name" />
        <el-table-column prop="job_number.assigned_to.full_name" label="Site Supervisor" />
        <el-table-column prop="date_request" label="Date Requested">
          <template #default="{ row }">
            {{ formatDateEn(row.date_request) }}
          </template>
        </el-table-column>
        <el-table-column label="Status">
          <template #default="{ row }">
            <el-select v-model="row.status" placeholder="Status" size="large" style="width: 100%;"
              @change="handleStatusChange(row)">
              <el-option v-for="item in statuses" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="150">
          <template #default="{ row }">
            <IconButton :src="editIcon" @click="handleView(row)" />
          </template>
        </el-table-column>
      </el-table>

      <div v-if="response" class="pagination-wrapper">
        <span class="total-text">Page {{ response.page }} of {{ response.total }}</span>
        <el-pagination :current-page="response.page" :page-size="15" :total="response.total" layout="prev, pager, next"
          class="no-bg-pagination" @current-change="handleCurrentChange" />
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ProjectRequest } from '@/api';
import PageContainer from '@/components/common/PageContainer.vue';
import { useQuery } from '@tanstack/vue-query';
import { computed, reactive } from 'vue';
import { formatDateEn } from '@/utils/common';
import IconButton from '@/components/common/IconButton.vue';
import editIcon from '@/assets/icon-edit.svg'
import { useRouter } from 'vue-router';
import { PROJECT_REQUEST_STATUS } from '@/utils/constants';

const router = useRouter();
const params = reactive({
  page: 1,
  limit: 15,
  sort: '-created_at'
})
const { data, isLoading } = useQuery({
  queryKey: ['project-request', params],
  queryFn: () => ProjectRequest.get(params)
})

const statuses = Object.values(PROJECT_REQUEST_STATUS);

const response = computed(() => data.value?.data);
const handleCurrentChange = () => {
  params.page = params.page + 1
}
const handleView = (item) => {
  router.push(`/admin/project-request/${item._id}`)
}

const handleStatusChange = (row) => {
  ProjectRequest.updateDetail(row._id, {
    status: row.status
  })
}

</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  background-color: #f2f2f2;
  position: relative;
  min-height: 40px;
}

.total-text {
  position: absolute;
  left: 24px;
  font-size: 14px;
  color: #6d6e71;
}

.no-bg-pagination :deep(.btn-prev),
.no-bg-pagination :deep(.btn-next),
.no-bg-pagination :deep(.el-pager li) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.search-input {
  width: 240px;
}
</style>