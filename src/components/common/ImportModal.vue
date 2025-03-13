<template>
    <el-dialog title="Import" v-model="visible" :width="dialogWidth" :close-on-click-modal="false">
        <div class="import-container">
            <div class="download-template">
                <a href="#" @click.prevent="downloadTemplate">Download CSV Template</a>
            </div>

            <template v-if="uploadState === 'initial'">
                <el-upload class="upload-demo" drag action="" :auto-upload="false" :file-list="fileList" :limit="1"
                    :on-exceed="onExceed" :on-change="onFileChange" :on-remove="onRemove" accept=".csv">
                    <img src="@/assets/img/ic-csv.svg" alt="icon" />
                    <div class="el-upload__text">
                        <span style="color: #0080F6; font-weight: 600;">Click to upload </span>or drag and drop
                    </div>
                </el-upload>
            </template>

            <template v-else-if="uploadState === 'uploading'">
                <div class="upload-progress">
                    <div class="file-row__icon">
                        <img src="@/assets/img/ic-import-user.svg" alt="icon" />
                    </div>
                    <div class="file-row__progress">
                        <span class="file-name">Uploading...</span>
                        <el-progress :text-inside="true" :stroke-width="16" :percentage="uploadProgress"></el-progress>
                    </div>
                    <div class="file-row__delete">
                        <img src="@/assets/img/icon-delete.svg" alt="delete" @click="resetFile"
                            style="cursor: pointer;" />
                    </div>
                </div>
            </template>

            <template v-else-if="uploadState === 'ready'">
                <div class="file-finished">
                    <div class="file-row__icon">
                        <img src="@/assets/img/ic-import-user.svg" alt="icon" />
                    </div>
                    <div class="file-row__progress">
                        <p class="file-name">{{ currentFileName }}</p>
                        <p class="file-size">{{ currentFileSize }}</p>
                    </div>
                    <div class="file-row__delete">
                        <img src="@/assets/img/icon-delete.svg" alt="delete" @click="resetFile"
                            style="cursor: pointer;" />
                    </div>
                </div>
            </template>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        </div>

        <span class="dialog-footer" style="display: flex; justify-content: flex-end;">
            <el-button @click="handleCancel">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit" :disabled="uploadState !== 'ready'">Submit</el-button>
        </span>
    </el-dialog>
    <MyMessage :message="messageText" :type="messageType" :duration="messageDuration" />
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { importUsers } from '@/api/user'
import MyMessage from './MyMessage.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'importSuccess'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (newVal) => {
    visible.value = newVal
})
watch(visible, (newVal) => {
    emit('update:modelValue', newVal)
})

const fileList = ref([])
const errorMessage = ref('')
const uploadState = ref('initial')
const messageText = ref('')
const messageType = ref('')
const messageDuration = ref(5000)
const uploadProgress = ref(0)
const isMobile = ref(false)
const dialogWidth = computed(() => isMobile.value ? '343px' : '400px')

const currentFileName = computed(() => {
    if (!fileList.value.length) return ''
    return fileList.value[0].name
})
const currentFileSize = computed(() => {
    if (!fileList.value.length) return ''
    const sizeKB = fileList.value[0].size / 1024
    return `${sizeKB.toFixed(2)} KB`
})

function onFileChange(file, fileListArg) {
    uploadProgress.value = 0;
    uploadState.value = 'uploading';
    fileList.value = fileListArg;
    errorMessage.value = '';

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        uploadProgress.value = progress;
        if (progress >= 100) {
            clearInterval(interval);
            uploadState.value = 'ready';
        }
    }, 200);
}

function onRemove(file, fileListArg) {
    fileList.value = fileListArg
    uploadState.value = fileList.value.length ? 'uploading' : 'initial'
    uploadProgress.value = 0
    errorMessage.value = ''
}

function onExceed() {
    alert('Only 1 file can be uploaded at a time!')
}

function resetFile() {
    fileList.value = []
    uploadState.value = 'initial'
    uploadProgress.value = 0
    errorMessage.value = ''
}

async function handleSubmit() {
    const formData = new FormData();
    formData.append("file", fileList.value[0].raw);
    const response = await importUsers(formData);
    console.log('response:', response.data.data);
    if (response && response.data && response.data.data && response.data.data.skippedCount > 0) {
        messageText.value = `Imported successfully with ${response.data.data.skippedCount}  rows skipped due to duplicate usernames, emails or employee IDs.`;
        messageType.value = "success";
    }
    if (response && response.data && response.data.data && response.data.data.skippedCount === 0) {
        messageText.value = "Imported successfully.";
        messageType.value = "success";
    }
    handleCancel();
}

function handleCancel() {
    visible.value = false
    resetFile()
}

function downloadTemplate() {
    if (!fileList.value.length) {
        alert("No file available to download.");
        return;
    }

    const fileObj = fileList.value[0].raw;
    const url = URL.createObjectURL(fileObj);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileObj.name || "downloaded_file.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function checkMobile() {
    isMobile.value = window.innerWidth < 768
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.import-container {
    margin: 16px 0;
}

.download-template {
    margin-bottom: 16px;
}

.file-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.upload-progress {
    border: 1px solid #ebeef5;
    padding: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-row__icon img {
    width: 40px;
    height: 40px;
}

.file-row__progress {
    flex: 1;
}

.file-row__delete {
    cursor: pointer;
}

.file-finished {
    border: 1px solid #ebeef5;
    padding: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
}

.file-name {
    font-weight: 500;
}

.file-size {
    font-size: 12px;
    color: #999;
}

.remove-btn {
    margin-left: auto;
}

.error-text {
    color: red;
    margin-top: 8px;
}
</style>