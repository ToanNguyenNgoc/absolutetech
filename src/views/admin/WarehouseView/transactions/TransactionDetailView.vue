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
      <div>
        <el-table :data="detail?.transaction_details || []" class="custom-table" border style="margin-top: 16px;">
          <el-table-column label="No." width="57">
            <template #default="{ $index }">
              <span class="item-name">{{ $index + `` }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Item">
            <template #default="{ row }">
              {{ row?.issue?.bin_configure?.spare?.name || row?.bin_configure?.spare?.name }}
            </template>
          </el-table-column>
          <el-table-column prop="current_qty" label="Current Quantity" />
          <el-table-column prop="quantity" label="Quantity" />
          <el-table-column prop="changed_qty" label="Changed Quality" />
        </el-table>
      </div>
      <template v-if="detail?.files?.length > 0">
        <p class="image_title">Issue Images</p>
        <div class="image_cnt">
          <div class="image_item_cnt" v-for="item in detail?.files" :key="item._id">
            <img class="item_image" :src="item.original_url" alt="" @error="onErrorImage">
          </div>
        </div>
      </template>
    </CardContainer>
  </PageContainer>
</template>

<script setup>
import { TransactionApi } from '@/api';
import CardContainer from '@/components/common/CardContainer.vue';
import LoadingPage from '@/components/common/LoadingPage.vue';
import PageContainer from '@/components/common/PageContainer.vue';
import { formatDate, onErrorImage } from '@/utils/common';
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

.image_title {
  margin: 22px 0px 16px 0px;
  font-size: 20px;
  font-weight: 600;
}

.image_cnt {
  grid-gap: 12px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
}

.image_item_cnt {
  width: 100%;
  aspect-ratio: 1/1;
  background-color: #fafafa;
  border-radius: 8px;
}

.item_image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 8px;
  object-fit: cover;
}
</style>