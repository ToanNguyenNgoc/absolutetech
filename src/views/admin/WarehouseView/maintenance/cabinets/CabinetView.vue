<template>
  <el-table :data="shelfs" class="custom-table" border style="margin-top: 16px;">
    <el-table-column type="index" label="No." width="57" />
    <el-table-column prop="cluster.name" label="Cluster" />
    <el-table-column prop="name" label="Cabinet Name" />
    <el-table-column prop="num_rows" label="Number of Row" />
    <el-table-column prop="num_bin" label="Number of Bin" />
    <el-table-column prop="type" label="Type" />
  </el-table>
</template>

<script setup>
import { ShelfApi } from '@/api';
import { useQuery } from '@tanstack/vue-query';
import { computed, reactive } from 'vue';


const params = reactive({
  page: 1,
  limit: 15,
  sort: '-createdAt'
});

const { data } = useQuery({
  queryKey: ['shelfs', params],
  queryFn: () => ShelfApi.get(params)
})

const response = computed(() => data.value?.data);
const shelfs = computed(() => response?.value?.list || []);
console.log(response);

</script>