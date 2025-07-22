<template>
  <PageContainer title="Issue">
    <CardContainer>
      <div class="input_search_cnt">
        <span class="input_search_title">
          Scan or Manual Input
        </span>
        <div class="input_search_form">
          <el-input v-model="search_text" size="large" placeholder="Enter job number..." @input="onInputSearch"
            :suffix-icon="Search" />
        </div>
      </div>
      <el-table v-if="search_text?.trim().length > 0" v-loading="isLoading" :data="job_numbers"
        class="custom-table" border style="margin-top: 16px;">
        <el-table-column type="index" label="No." width="57" />
        <el-table-column prop="code" label="JN" />
        <el-table-column prop="client" label="Client" />
      </el-table>
    </CardContainer>
  </PageContainer>
</template>

<script setup>
import CardContainer from '@/components/common/CardContainer.vue';
import PageContainer from '@/components/common/PageContainer.vue';
import { useGetJobNumbers } from '@/hooks';
import { debounce } from 'lodash';
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue'

const params = reactive({
  page: 1,
  limit: 15,
  search: null
});
const search_text = ref()
const { job_numbers, isLoading } = useGetJobNumbers(params);
const onInputSearch = debounce((val) => { params.search = val }, 800);

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
</style>