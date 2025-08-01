<template>
  <PageContainer title="Transaction Detail">
    <LoadingPage :loading="isLoading" />
    <CardContainer title="Detail">
      <div class="container_detail">
        <div class="item_container">
          <span class="item_label">Issue:</span>
          <span class="item_value">{{ detail?.taker?.full_name }}</span>
        </div>
        <div class="item_container">
          <span class="item_label">Job Number:</span>
          <span class="item_value">{{ detail?.job_number?.code }}</span>
        </div>
        <div class="item_container">
          <span class="item_label">Type:</span>
          <span class="item_value">{{ detail?.type }}</span>
        </div>
        <div class="item_container">
          <span class="item_label">Trans Date:</span>
          <span class="item_value">{{ formatDate(detail?.createdAt) }}</span>
        </div>
        <div class="item_container">
          <span class="item_label">Signature:</span>
          <img v-if="detail?.signature_taker" class="item_signature" :src="detail?.signature_taker" alt="">
        </div>
      </div>
    </CardContainer>
    <CardContainer title="Items" style="margin-top: 12px;">
      <el-table :data="detail?.transaction_details || []" class="custom-table" border style="margin-top: 16px;">
        <el-table-column label="No." width="57">
          <template #default="{ $index }">
            <span class="item-name">{{ $index + `` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="issue.bin_configure.spare.name" label="Item" />
        <el-table-column prop="current_qty" label="Current Quantity" />
        <el-table-column prop="quantity" label="Quantity" />
        <el-table-column prop="changed_qty" label="Changed Quality" />
      </el-table>
    </CardContainer>
  </PageContainer>
</template>

<script setup>
import { TransactionApi } from '@/api';
import CardContainer from '@/components/common/CardContainer.vue';
import LoadingPage from '@/components/common/LoadingPage.vue';
import PageContainer from '@/components/common/PageContainer.vue';
import { formatDate } from '@/utils/common';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;
const { data, isLoading } = useQuery({
  queryKey: ['transactions-detail', id],
  queryFn: () => TransactionApi.getDetail(id),
  enabled: !!id
});

const detail = computed(() => data.value?.data);

</script>

<style scoped>
.container_detail {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.item_container {
  width: 25%;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.item_label {
  font-weight: 400;
}

.item_signature {
  width: calc(100% - 85px);
  aspect-ratio: 2/1;
  background-color: #fafafafa;
  border-radius: 4px;
  object-fit: contain;
}
</style>