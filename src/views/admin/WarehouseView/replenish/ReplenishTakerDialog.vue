<template>
  <el-dialog :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)"
    :before-close="handleClose" style="width: 45vw;">
    <div class="taker_cnt">
      <p class="taker_title">Replenish</p>
      <div class="taker_info">
        <AppInput label="Name" v-model="userInfo.username" :disabled="true" />
        <AppInput label="Employee ID" v-model="userInfo.employee_id" :disabled="true" style="margin: 8px 0px;" />
        <p class="label">Signature</p>
      </div>
      <div class="taker_pad">
        <VueSignaturePad ref="signature" :min-width="2" :max-width="2" :options="{
          penColor: '#000',
          backgroundColor: '#fff',
        }" width="574px" height="329px" />
      </div>
    </div>
    <div style="display: flex;justify-content: flex-end;">
    </div>

    <template #footer>
      <el-button type="danger" plain @click="onClear">Clear</el-button>
      <el-button type="success" @click="handleSubmit">Submit</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { useAuth } from "@/hooks";
import { VueSignaturePad } from "@selemondev/vue3-signature-pad"
import { ElMessage } from "element-plus";
import { ref } from 'vue';
import AppInput from "@/components/common/AppInput.vue";

// eslint-disable-next-line no-unused-vars, no-undef
const props = defineProps({
  modelValue: Boolean,
})
const { userInfo } = useAuth();
// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'on-submit']);
const signature = ref(null);
const onClear = () => signature.value?.clearCanvas();

const handleClose = () => {
  onClear();
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  if (signature.value?.isCanvasEmpty()) return ElMessage.error('Please sign!');
  const dataUrl = signature.value?.saveSignature();
  emit('on-submit', dataUrl);
  setTimeout(() => onClear(), 1000)
}
</script>

<style scoped>
.taker_cnt {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.taker_title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
}

.taker_info {
  width: 50%;
}

.taker_pad {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  border: solid 1px #303133;
}

.label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  width: 100%;
}
</style>
