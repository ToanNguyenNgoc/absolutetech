<template>
    <div class="avatar-uploader">
        <div class="avatar-wrapper" @click="openFileDialog">
            <img v-if="avatarUrl" :src="avatarUrlComputed" class="avatar-image" alt="Avatar" />
            <div v-else class="avatar-placeholder">
                <img class="icon-camera" src="@/assets/ic-camera.svg" alt="icon-camera" />
            </div>
        </div>

        <div v-if="avatarUrl" class="remove-icon" @click.stop="removeAvatar">
            <img class="icon-close" src="@/assets/close.svg" alt="close" />
        </div>

        <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="onFileChange" hidden />
    </div>
</template>

<script setup>
import { baseURL } from '@/constant/common';
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue', 'file-selected']);

const avatarUrl = ref(props.modelValue);

const avatarUrlComputed = computed(() => {
    return avatarUrl.value && avatarUrl.value.startsWith("data:")
        ? avatarUrl.value
        : avatarUrl.value
            ? baseURL + '/' + avatarUrl.value
            : '';
});
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

function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        avatarUrl.value = evt.target.result;
        emit('update:modelValue', avatarUrl.value);
        emit('file-selected', file);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

function removeAvatar() {
    avatarUrl.value = '';
    emit('update:modelValue', '');
    emit('file-selected', null);
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
    top: 0;
    right: -3px;
    background-color: #8F9BB3;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.file-input {
    display: none;
}
</style>