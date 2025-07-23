<template>
  <PageContainer title="Issue">
    <CardContainer>
      <template v-if="!projectSelected">
        <div class="input_search_cnt">
          <span class="input_search_title">
            Scan or Manual Input
          </span>
          <div class="input_search_form">
            <el-input v-model="search_text" size="large" placeholder="Enter job number, project name..." @input="onInputSearch"
              :suffix-icon="Search" />
          </div>
        </div>
        <el-table v-if="search_text?.trim().length > 0" v-loading="isLoading" :data="project_requests" class="custom-table" border style="margin-top: 16px;">
          <el-table-column type="index" label="No." width="57" />
          <el-table-column prop="job_number.code" label="Job Number" />
          <el-table-column prop="job_number.client" label="Client" />
          <el-table-column prop="job_number.client" label="Assign" />
          <el-table-column prop="project_name" label="Project Name" />
          <el-table-column label="Status">
            <template #default="{ row }">
              <ProjectRequestStatus :status="row.status" />
            </template>
          </el-table-column>
          <el-table-column label="Confirmed">
            <template #default="{ row }">
              <el-tag v-if="row.confirmed_by" type="success">Confirmed</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Action">
            <template #default="{ row }">
              <el-button type="primary" plain @click="onGoToCart(row)" :icon="ShoppingCart">Go to cart</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div v-else class="cart_cnt">
        <el-button type="primary" :icon="Back" circle @click="projectSelected = null; onClearAllData()" />
        <el-table v-loading="isLoadingIssues" :data="issues" class="custom-table" border style="margin-top: 16px;">
          <el-table-column label="No." width="57">
            <template #default="{ row, $index }">
              <div style="display: flex;align-items: center;">
                <el-checkbox :model-value="isSelected(row)" size="large" @change="() => onSelectIssueItem(row)"
                  :disabled="row.quantity_request === 0" style="margin-right: 8px;" />
                {{ $index + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="bin_configure.spare.name" label="Description" />
          <el-table-column prop="bin_configure.spare.part_no" label="Part No" />
          <el-table-column label="Location">
            <template #default="{ row }">
              {{ renderLocation(row.bin_configure?.bin) }}
            </template>
          </el-table-column>
          <el-table-column prop="bin_configure.quantity_oh" label="OH Quantity" />
          <el-table-column prop="quantity_request" label="Quantity Request" />
          <el-table-column label="Qty Issue">
            <template #default="{ row }">
              <el-input-number v-model="row.quantity_issue" :min="0" :max="row.quantity_request"
                :disabled="row.quantity_request === 0" @change="(e) => handleChangeQuantityIssue(e, row)" />
            </template>
          </el-table-column>
        </el-table>
        <div class="cart_cnt_button">
          <el-button type="primary" @click="onCheckOut" :icon="Right"
            :disabled="!(issuesSelected.filter(i => i.quantity_issue).length > 0)">Checkout</el-button>
        </div>
      </div>
    </CardContainer>
    <IssueTakerDialog v-model="openTaker" @on-submit-issue="obSubmitIssue" />
  </PageContainer>
</template>

<script setup>
import CardContainer from '@/components/common/CardContainer.vue';
import PageContainer from '@/components/common/PageContainer.vue';
import { useAuth, useGetProjectRequests } from '@/hooks';
import { debounce } from 'lodash';
import { computed, reactive, ref } from 'vue';
import { Search, ShoppingCart, Back, Right } from '@element-plus/icons-vue'
import { ProjectRequest } from '@/api';
import { useQuery } from '@tanstack/vue-query';
import IssueTakerDialog from './IssueTakerDialog.vue';
import { ElMessage } from 'element-plus';
import { TRANSACTION_TYPE } from '@/utils/constants';
import { AppConfirm, AppLoading } from '@/utils/common';
import { IssuingApi } from '@/api/issuing';
import ProjectRequestStatus from '@/components/common/ProjectRequestStatus.vue';

const params = reactive({
  page: 1,
  limit: 15,
  search: null
});
const { userInfo } = useAuth();
const projectSelected = ref(null);
const issuesSelected = ref([]);
const search_text = ref();
const { project_requests, isLoading } = useGetProjectRequests(params, {
});
const onInputSearch = debounce((val) => { params.search = val }, 800);
const onGoToCart = (row) => {
  if (!row?.confirmed_by) return ElMessage.error('Job Number must be confirmed');
  projectSelected.value = row;
}
//Handle cart
const jobNumberId = computed(() => projectSelected.value?._id);
const { data: dataIssues, isLoading: isLoadingIssues } = useQuery({
  queryKey: ['issues', jobNumberId.value],
  queryFn: () => ProjectRequest.getIssuesByProjectId(projectSelected.value?._id),
  enabled: computed(() => !!jobNumberId.value)
});

const issues = computed(() => (dataIssues.value?.data || []).map(i => ({ ...i, quantity_issue: 0 })))

const renderLocation = (bin) => {
  return `${bin.cluster?.name} - ${bin.shelf?.name} - ${bin.row} - ${bin.bin}`
}
const onSelectIssueItem = (issueItem) => {
  const index = issuesSelected.value.findIndex(i => i._id === issueItem._id);
  if (index >= 0) {
    issueItem.quantity_issue = 0;
    issuesSelected.value.splice(index, 1);
  } else {
    issueItem.quantity_issue = 1;
    issuesSelected.value.push(issueItem);
  }
};
const isSelected = (item) => issuesSelected.value.some(i => i._id === item._id);
const handleChangeQuantityIssue = (val, issueItem) => {
  const index = issuesSelected.value.findIndex(i => i._id === issueItem._id);
  if (val > 0 && index < 0) {
    return issuesSelected.value.push(issueItem);
  }
  if (val === 0 && index >= 0) {
    issuesSelected.value.splice(index, 1);
    return
  }
  return issueItem.quantity_issue = val;
};
//
const openTaker = ref(false);
const onCheckOut = () => {
  openTaker.value = true;
};
const obSubmitIssue = async (signature) => {
  if (!userInfo.value?._id) return ElMessage.error('User not login');
  const data = {
    type: TRANSACTION_TYPE.ISSUE.value,
    job_number_id: projectSelected.value?.job_number?._id,
    issues: issuesSelected.value.map(i => ({ id: i._id, quantity_issue: i.quantity_issue })),
    taker_id: userInfo.value._id,
    signature_taker: signature
  };
  AppConfirm.open({
    title: 'Do you want to confirm ?',
    callback: () => {
      AppLoading.show();
      IssuingApi.post(data)
        .then(() => { ElMessage.success('Issue success'); onClearAllData() })
        .catch(() => ElMessage.error('Issue error'))
        .finally(() => AppLoading.hide())
    }
  })
}

const onClearAllData = () => {
  issuesSelected.value = [];
  projectSelected.value = null;
  openTaker.value = false;
}

</script>

<style scoped>
.input_search_title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.input_search_cnt {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input_search_form {
  width: 45%;
}

.cart_cnt_button {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>