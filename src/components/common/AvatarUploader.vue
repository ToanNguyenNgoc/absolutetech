<template>
    <div class="avatar-uploader">
        <div class="avatar-wrapper" @click="openFileDialog">
            <img v-if="avatarUrl" :src="baseURL + '/' + avatarUrl" class="avatar-image" alt="Avatar" />
            <div v-else class="avatar-placeholder">
                <img class="icon-camera" src="@/assets/ic-camera.svg" alt="icon-camera" />
            </div>
        </div>

        <div v-if="avatarUrl" class="remove-icon" @click.stop="removeAvatar">
            <img class="icon-camera" src="@/assets/close.svg" alt="icon-camera" />
        </div>

        <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="onFileChange" hidden />
    </div>
</template>

<script setup>
import { uploadFile } from '@/api/upload';
import { baseURL } from '@/constant/common';
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['change', 'update:modelValue']);

const avatarUrl = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newVal) => {
        avatarUrl.value = newVal;
    }
);

const fileInput = ref(null);

function openFileDialog() {
    fileInput.value?.click();
}

async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await uploadFile(formData);
        if (response.data.success) {
            avatarUrl.value = response.data.data.url;
            emit('update:modelValue', avatarUrl.value);
        }
    } catch (error) {
        console.error('Upload failed:', error);
    } finally {
        e.target.value = '';
    }
}

function removeAvatar() {
    avatarUrl.value = '';
    emit('update:modelValue', '');
}
</script>

<style scoped>
.avatar-uploader {
    position: relative;
    display: inline-block;
}

.avatar-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    /* để ảnh thừa bị cắt tròn */
    position: relative;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #999;
}

.remove-icon {
    position: absolute;
    top: 0px;
    right: -3px;
    background-color: #8F9BB3;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.file-input {
    display: none;
}
</style>