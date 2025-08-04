<template>
  <PageContainer title="Return">
    <CardContainer>
      <div>
        <div class="input_search_cnt" v-if="!isCheckout">
          <span class="input_search_title">
            Please scan user employee's card
          </span>
          <div class="input_search_form">
            <el-input v-model="searchIssueCardText" size="large" placeholder="Employee's card" @input="onInputSearch"
              :suffix-icon="Search" />
          </div>
        </div>
        <div v-else>
          <el-button type="primary" :icon="Back" circle @click="onBack" />
          <el-table :data="issueCards" class="custom-table" border style="margin-top: 16px;">
            <el-table-column label="No." width="57">
              <template #default="{ row, $index }">
                <div style="display: flex;align-items: center;">
                  <el-checkbox :model-value="isSelected(row)" size="large" @change="() => onSelectIssueItem(row)"
                    style="margin-right: 8px;" />
                  {{ $index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="issue.bin_configure.spare.name" label="Item Name" />
            <el-table-column prop="issue.bin_configure.spare.description" label="Description" />
            <el-table-column prop="project_request.job_number.code" label="Job Number" />
            <el-table-column label="Bin#">
              <template #default="{ row }">
                {{ renderLocation(row.issue?.bin_configure?.bin) }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="Qty On Loan" />
            <el-table-column label="Qty Issue">
              <template #default="{ row }">
                <el-input-number v-model="row.quantity_return" :min="0" :max="row.quantity"
                  @change="(e) => handleChangeQuantityIssue(e, row)" />
              </template>
            </el-table-column>
          </el-table>
          <div class="cart_cnt_button">
            <el-button type="primary" @click="onCheckOut" :icon="Right"
              :disabled="!(issueCardsSelected.filter(i => i.quantity_return).length > 0)">Checkout</el-button>
          </div>
          <ReturnTakerDialog v-model="openTaker" @on-submit-return="onSubmitReturn" />
        </div>
      </div>
    </CardContainer>
  </PageContainer>
</template>

<script setup>
import { ReturnApi } from '@/api';
import CardContainer from '@/components/common/CardContainer.vue';
import PageContainer from '@/components/common/PageContainer.vue';
import { Search, Right, Back } from '@element-plus/icons-vue';
import { useQuery } from '@tanstack/vue-query';
import { debounce, uniq } from 'lodash';
import { computed, reactive, ref } from 'vue';
import ReturnTakerDialog from './ReturnTakerDialog.vue';
import { useAuth } from '@/hooks';
import { ElMessage } from 'element-plus';
import { AppConfirm, AppLoading } from '@/utils/common';

const { userInfo } = useAuth();
const params = reactive({
  page: 1,
  limit: 15,
  search: null
});
const isCheckout = ref(false);
const issueCardsSelected = ref([]);
const searchIssueCardText = ref();
const openTaker = ref(false);
const onInputSearch = debounce(async (val) => { params.search = val }, 800);
const { data } = useQuery({
  queryKey: computed(() => ['return/issue-cards', { ...params }]),
  queryFn: () => ReturnApi.getIssueCards(params),
  enabled: computed(() => !!params.search),
  onSuccess: (data) => {
    if (data?.data?.list?.length > 0) {
      isCheckout.value = true;
    }
  }
});
const issueCards = computed(() => (data.value?.data?.list || []).map(i => ({ ...i, quantity_return: 0 })));

const onBack = () => {
  isCheckout.value = false;
  issueCardsSelected.value = [];
  openTaker.value = false;
  params.search = null;
  searchIssueCardText.value = null;
}

const renderLocation = (bin) => {
  if (!bin) return;
  return `${bin?.cluster?.name} - ${bin?.shelf?.name} - ${bin?.row} - ${bin?.bin}`
}
const isSelected = (item) => issueCardsSelected.value.some(i => i._id === item._id);
const onSelectIssueItem = (issueItem) => {
  const index = issueCardsSelected.value.findIndex(i => i._id === issueItem._id);
  if (index >= 0) {
    issueItem.quantity_return = 0;
    issueCardsSelected.value.splice(index, 1);
  } else {
    issueItem.quantity_return = 1;
    issueCardsSelected.value.push(issueItem);
  }
};
const handleChangeQuantityIssue = (val, issueItem) => {
  const index = issueCardsSelected.value.findIndex(i => i._id === issueItem._id);
  if (val > 0 && index < 0) {
    return issueCardsSelected.value.push(issueItem);
  }
  if (val === 0 && index >= 0) {
    issueCardsSelected.value.splice(index, 1);
    return
  }
  return issueItem.quantity_issue = val;
};
//
const onCheckOut = async () => {
  openTaker.value = true
}

const onSubmitReturn = async (signature) => {
  if (!userInfo.value?._id) return ElMessage.error('User not login');
  const project_request_id = uniq(issueCardsSelected.value.map(i => i.project_request._id));
  const items = project_request_id.map(item => ({
    project_request: item,
    issue_cards: issueCardsSelected.value
      .filter(item_issue_card => item_issue_card.project_request._id == item)
      .map(item_issue_card => ({
        _id: item_issue_card._id,
        issue_id: item_issue_card.issue._id,
        quantity_return: item_issue_card.quantity_return
      })),
  }));
  AppConfirm.open({
    title: 'Do you want to confirm ?',
    callback: () => {
      AppLoading.show();
      ReturnApi.postReturnIssueCards({
        signature_taker: signature,
        taker_id: userInfo.value._id,
        items
      })
        .then(() => { ElMessage.success('Returned success'); onBack() })
        .catch(() => ElMessage.error('Returned error'))
        .finally(() => AppLoading.hide())
    }
  })
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