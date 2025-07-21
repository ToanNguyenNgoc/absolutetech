<template>
  <el-dialog :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :width="dialogWidth"
    :before-close="handleClose">
    <div v-if="bin">
      <div class="title">
        Edit Bin: {{ bin.cluster?.name }} - {{ bin.shelf?.name }} - {{ bin.row }} - {{ bin.bin }}
      </div>

      <el-divider>Items</el-divider>

      <el-table :data="binConfigures" border>
        <el-table-column type="index" label="No" width="50" />
        <el-table-column label="Item Name">
          <template #default="{ row }">
            <el-select placeholder="Item Name" size="large" style="width: 100%;" @change="onItemNameChange(row)">
              <el-option v-for="item in spares" :key="item._id" :label="item.name" :value="item._id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="spare.name" label="Item Name" />
        <el-table-column prop="spare.type" label="Item Type" />
        <el-table-column prop="spare.part_no" label="Part No" />
        <el-table-column prop="quantity" label="Quantity" />
        <el-table-column prop="critical" label="Critical" />
        <el-table-column prop="min" label="Min" />
        <el-table-column prop="max" label="Max" />
        <el-table-column prop="quantity_oh" label="OH Quantity" />
      </el-table>
      <!-- <el-button @click="onAddItem" :icon="Plus" type="primary" plain style="margin-top: 12px;">Add Item</el-button> -->
    </div>

    <template #footer>
      <el-button @click="handleClose">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { useGetSpares } from '@/hooks';
import { computed, onMounted, ref, onUnmounted } from 'vue';
// import {Plus} from '@element-plus/icons-vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  bin: Object,
  modelValue: Boolean,
})
// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue'])

const handleClose = () => {
  emit('update:modelValue', false)
}

// Mobile responsive width
const isMobile = ref(false)
const dialogWidth = computed(() => (isMobile.value ? '343px' : '85vw'))

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
//
const {spares} = useGetSpares({limit: 1000})
const binConfigures = computed(() => (props.bin?.bin_configures || []).map(i => ({ ...i, spare: i.spare || {} })));
const onItemNameChange = (row)=>{
  console.log(row)
};
// const onAddItem = () => {};

</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  text-align: center;
}
</style>
