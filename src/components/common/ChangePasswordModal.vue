<template>
    <div class="modal-change-password">
        <el-dialog title="Change Password" v-model="localVisible" :width="dialogWidth" @close="closeDialog"
            height="435px">
            <div>
                <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="Old Password" prop="oldPassword">
                        <el-input v-model="form.oldPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="New Password" prop="newPassword">
                        <el-input v-model="form.newPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="Confirm Password" prop="confirmPassword">
                        <el-input v-model="form.confirmPassword" type="password" show-password />
                    </el-form-item>
                </el-form>
            </div>

            <template #footer>
                <el-button @click="closeDialog">Cancel</el-button>
                <el-button type="primary" @click="handleSubmit">Change Password</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// Import the changePassword function from your axios API module
import { changePassword } from '@/api/auth'

const isMobile = ref(false)
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

const dialogWidth = computed(() => (isMobile.value ? '343px' : '596px'))

const emits = defineEmits(['update:visible'])

const localVisible = computed({
    get() {
        return props.visible
    },
    set(val) {
        emits('update:visible', val)
    }
})

function checkMobile() {
    isMobile.value = window.innerWidth < 768
}

const form = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const rules = {
    oldPassword: [
        { required: true, message: 'Please enter the old password', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: 'Please enter the new password', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: 'Please confirm the new password', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== form.newPassword) {
                    callback(new Error('Confirm password does not match'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

const formRef = ref(null)

function closeDialog() {
    localVisible.value = false
}

function resetForm() {
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    formRef.value?.clearValidate()
}

watch(
    () => props.visible,
    (newVal) => {
        if (!newVal) {
            resetForm()
        }
    }
)

/**
 * Handle form submission:
 * 1. Validate the form.
 * 2. If valid, call the changePassword API with the form data.
 * 3. Display a success message and close the dialog on success.
 */
async function handleSubmit() {
    formRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            const payload = {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword
            }
            await changePassword(payload)
            ElMessage.success('Password changed successfully!')
            closeDialog()
        } catch (error) {
            ElMessage.error(error.response?.data?.message || 'Error occurred!')
        }
    })
}
</script>

<style scoped lang="scss">
.modal-change-password {
    background-color: red;

    :deep(.el-dialog__body) {
        .el-form-item__label {
            justify-content: flex-start;
            font-size: 14px;
            font-family: Gotham;
        }

        .el-select__wrapper {
            height: 48px;
            background-color: #F3F3F3;
            border: none !important;
            box-shadow: none !important;
        }

        .el-form-item__label {
            &::before {
                display: none;
            }
        }

        .el-input__wrapper {
            padding: unset;
            height: 40px;
            border-radius: 2px;
            background: var(--DRK-Lightest-grey, #F3F3F3);
            padding-left: 10px;
        }
    }

    :deep(.el-button) {
        padding: 12px;
        height: fit-content;
    }

    :deep(.el-dialog__title) {
        font-size: 24px;
        line-height: 27px;
    }

    :deep(.el-form-item) {
        display: flex;
        flex-direction: column;
    }

    :deep(.el-dialog__close) {
        width: 24px;
        height: 24px;

        svg {
            width: 24px;
            height: 24px;
        }
    }
}
</style>