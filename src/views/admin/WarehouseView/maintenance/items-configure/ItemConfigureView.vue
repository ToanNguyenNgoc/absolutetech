<template>
  <div>
    <el-table :data="spares" class="custom-table" border style="margin-top: 16px;">
      <el-table-column type="index" label="No." width="57" />
      <el-table-column prop="name" label="Item Name" />
      <el-table-column prop="type" label="Type" />
      <el-table-column prop="part_no" label="P/N" />
      <el-table-column prop="material_no" label="Mat’l No" />
      <el-table-column prop="description" label="Description" />
    </el-table>
  </div>
</template>

<script setup>
import { useGetSpares } from '@/hooks';
import { reactive } from 'vue';


const params = reactive({
  page: 1,
  limit: 15,
  sort: '-created_at'
});

const { spares } = useGetSpares(params);

</script>