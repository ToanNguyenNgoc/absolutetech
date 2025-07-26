<template>
  <div style="display: flex;align-items: center;">
    <el-select v-model="modelValueIsCluster" placeholder="Cluster" style="width: 120px; margin-right: 6px;">
      <el-option v-for="item in [{ _id: '', name: 'All' }, ...clusters]" :key="item._id" :label="item.name"
        :value="item._id" />
    </el-select>
    <el-select v-model="modelValueIsShelf" placeholder="Shelf" style="width: 120px; margin-right: 6px;">
      <el-option v-for="item in [{ _id: '', name: 'All' }, ...shelfs]" :key="item._id" :label="item.name"
        :value="item._id" />
    </el-select>
    <el-select v-model="modelValueRow" placeholder="Row" style="width: 120px; margin-right: 6px;">
      <el-option v-for="item in ['All', ...rows]" :key="item" :label="item" :value="item" />
    </el-select>
    <el-select v-model="modelValueBin" placeholder="Bin" style="width: 120px; margin-right: 6px;">
      <el-option v-for="item in ['All', ...bins]" :key="item" :label="item" :value="item" />
    </el-select>
    <el-select v-model="modelValueStatus" placeholder="Status" style="width: 120px; margin-right: 6px;">
      <el-option v-for="item in bin_statutes" :key="item.value" :label="item.name" :value="item.value" />
    </el-select>
    <el-select v-model="modelValueIsDrawer" placeholder="Is Drawer" style="width: 120px; margin-right: 6px;">
      <el-option v-for="item in boolean_list" :key="item" :label="item.name" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup>
import { useGetClusters, useGetShelfs } from '@/hooks';
import { BIN_STATUSES } from '@/utils/constants';
import { computed, reactive, ref, watch } from 'vue';

const bin_statutes = [{ value: '', name: 'All' }, ...Object.values(BIN_STATUSES)];
const boolean_list = [{ value: '', name: 'All' }, { value: true, name: 'True' }, { value: false, name: 'False' }];

// eslint-disable-next-line no-undef
const props = defineProps({
  status: String,
  is_drawer: {
    type: [String, Boolean],
    default: ''
  },
  cluster: { type: String, default: '' },
  shelf: { type: String, default: '' },
  row: { type: [Number, String], default: '' },
  bin: { type: [Number, String], default: '' },
});
const { clusters } = useGetClusters({ limit: 1000 });
const paramsShelf = reactive({ limit: 1000, cluster: props.cluster });
// const rows = ref([]);
const { shelfs } = useGetShelfs(paramsShelf, { enabled: computed(() => !!props.cluster) })

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:status', 'update:is_drawer', 'update:cluster', 'update:shelf', 'update:row', 'update:bin']);

const modelValueStatus = computed({
  get: () => props.status,
  set: (value) => emit('update:status', value)
});
const modelValueIsDrawer = computed({
  get: () => props.is_drawer,
  set: (value) => emit('update:is_drawer', value)
});
const modelValueIsCluster = computed({
  get: () => props.cluster,
  set: (value) => {
    emit('update:cluster', value);
    paramsShelf.cluster = value;
    if (modelValueIsCluster.value !== value) {
      emit('update:shelf', '');
      emit('update:row', '');
      emit('update:bin', '');
    }
  },
});
const modelValueIsShelf = computed({
  get: () => props.shelf,
  set: (value) => {
    emit('update:shelf', value);
    if (modelValueIsShelf.value !== value) {
      emit('update:row', '');
      emit('update:bin', '');
    }
  },
});
const rows = ref([]);
const bins = ref([]);
watch(
  () => props.shelf,
  () => {
    const shelf = shelfs.value.find(i => i._id == props.shelf);
    if (shelf?.num_rows) {
      if (shelf?.num_rows > 0) rows.value = Array(shelf.num_rows).fill(null).map((_i, index) => index + 1);
      if (shelf?.num_bin > 0) bins.value = Array(shelf.num_bin).fill(null).map((_i, index) => index + 1);
    }
  }
)
const modelValueRow = computed({
  get: () => props.row,
  set: (value) => {
    emit('update:row', value === 'All' ? '' : value);
  },
});
const modelValueBin = computed({
  get: () => props.bin,
  set: (value) => {
    emit('update:bin', value === 'All' ? '' : value);
  },
});
</script>