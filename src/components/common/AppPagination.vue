<template>
  <div class="pagination-wrapper">
    <span class="total-text">Page {{ page }} of {{ totalPages }}</span>
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="totalItems"
      layout="prev, pager, next"
      class="no-bg-pagination"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 15 },
  totalPages: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['current-change']);

const handleCurrentChange = (val) => {
  emit('current-change', val);
};
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background-color: #f2f2f2;
  position: relative;
}

.total-text {
  color: #6D6E71;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  position: absolute;
  left: 36px;
}

.no-bg-pagination :deep(.btn-prev),
.no-bg-pagination :deep(.btn-next),
.no-bg-pagination :deep(.el-pager li) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
