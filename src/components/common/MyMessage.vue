<template>
    <slot></slot>
</template>

<script setup>
import { watch, defineProps } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'success'
    },
    duration: {
        type: Number,
        default: 3000
    }
})

watch(
    () => props.message,
    (newMessage) => {
        if (!newMessage) return

        if (props.type === 'success') {
            ElMessage.success({
                message: newMessage,
                duration: props.duration,
                customClass: 'my-custom-success'
            })
        }
        if (props.type === 'error') {
            ElMessage.error({
                message: newMessage,
                duration: props.duration,
                customClass: 'my-custom-error'
            })
        }
    },
    { immediate: true }
)
</script>

<style>
.my-custom-success.el-message--success {
    background-color: #28a745 !important;
    color: #fff !important;
    border: unset;
}

.my-custom-success.el-message--success p {
    color: #fff !important;
}

.el-message.my-custom-success .el-message-icon--success {
    display: none !important;
}

.my-custom-error.el-message--error {
    background-color: #dc3545 !important;
    color: #fff !important;
    border: unset;
}

.my-custom-error.el-message--error p {
    color: #fff !important;
}

.my-custom-error.el-message--error i {
    display: none !important;
}
</style>