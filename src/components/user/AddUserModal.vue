<template>
    <el-dialog class="add-user-dialog" v-model="dialogVisible" :width="dialogWidth"
        custom-class="add-user-dialog-custom" :close-on-click-modal="false" :append-to-body="true">
        <div class="dialog-header">
            <h2 class="dialog-title" v-if="!isEditLocal">Add User</h2>
            <h2 class="dialog-title" v-if="isEditLocal">Edit User</h2>
        </div>

        <el-form :model="userForm" class="user-form">
            <div class="avatar-section">
                <AvatarUploader v-model="userForm.avatar" @file-selected="onFileSelected" />
            </div>
            <div class="form-modal-add-user">
                <!-- employee_id -->
                <el-form-item label="employee_id">
                    <el-input :disabled="isEditLocal" v-model="userForm.employee_id" placeholder="Employee ID" />
                </el-form-item>

                <!-- Full Name -->
                <el-form-item label="Full Name">
                    <el-input v-model="userForm.full_name" placeholder="Enter full name" />
                </el-form-item>

                <!-- Username -->
                <el-form-item label="Username">
                    <el-input v-model="userForm.username" placeholder="Enter username" autocomplete="off" />
                </el-form-item>


                <!-- Role (Select) -->
                <el-form-item label="Role">
                    <el-select v-model="userForm.role" placeholder="Select Role">
                        <el-option v-for="r in Roles" :key="r.value" :label="r.label" :value="r.value" />
                    </el-select>
                </el-form-item>

                <!-- Position -->
                <el-form-item label="Position">
                    <el-input v-model="userForm.position" placeholder="Position" />
                </el-form-item>

                <!-- Gender (Select) -->
                <el-form-item label="Gender">
                    <el-select v-model="userForm.gender" placeholder="Select Gender">
                        <el-option v-for="g in genders" :key="g" :label="g" :value="g" />
                    </el-select>
                </el-form-item>

                <!-- Birthday (Date Picker) -->
                <el-form-item label="Birthday">
                    <el-date-picker v-model="userForm.birthday" type="date" placeholder="Select birthday"
                        style="width: 100%;" />
                </el-form-item>

                <!-- Phone -->
                <el-form-item label="Phone">
                    <el-input v-model="userForm.phone" placeholder="Phone number" />
                </el-form-item>

                <!-- Address -->
                <el-form-item label="Address">
                    <el-input v-model="userForm.address" placeholder="Address" />
                </el-form-item>

                <!-- Email -->
                <el-form-item label="Email">
                    <el-input v-model="userForm.email" placeholder="Email communication" />
                </el-form-item>

                <!-- Password -->
                <el-form-item label="Password" v-if="!isEditLocal">
                    <el-input type="password" v-model="userForm.password" placeholder="Password"
                        autocomplete="new-password" />
                </el-form-item>

                <!-- NRIC/FIN -->
                <el-form-item label="NRIC/FIN">
                    <el-input v-model="userForm.nric_fin" placeholder="Enter NRIC or FIN" />
                </el-form-item>

                <!-- Work Permit Expiry -->
                <el-form-item label="Work Permit Expiry">
                    <el-date-picker v-model="userForm.work_permit_expiry" type="date" placeholder="Select expiry date"
                        style="width: 100%;" />
                </el-form-item>
            </div>
            <h2 class="dialog-title" style="margin: 24px 0px;">Setting Salary</h2>
            <div class="form-modal-add-user">
                <el-form-item label="Basic salary">
                    <el-input v-model="userForm.user_setting_salary.basic_salary" :min="0" class="custom-input-number"
                        @input="(val) => handleInput('basic_salary', val)"
                        :formatter="formatCurrency"
                        :parser="parseCurrency"
                    >
                        <template #prefix>
                            <span>$</span>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Base allowance">
                    <el-input v-model="userForm.user_setting_salary.base_allowance" :min="0" class="custom-input-number"
                        @input="(val) => handleInput('base_allowance', val)"
                        :formatter="formatCurrency"
                        :parser="parseCurrency"   
                    >
                        <template #prefix>
                            <span>$</span>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Job allowance">
                    <el-input v-model="userForm.user_setting_salary.job_allowance" :min="0" class="custom-input-number"
                        @input="(val) => handleInput('job_allowance', val)"
                        :formatter="formatCurrency"
                        :parser="parseCurrency"  
                    >
                        <template #prefix>
                            <span>$</span>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Overtime">
                    <el-input v-model="userForm.user_setting_salary.overtime" :min="0" class="custom-input-number"
                        @input="(val) => handleInput('overtime', val)"
                        :formatter="formatCurrency"
                        :parser="parseCurrency"
                    >
                        <template #prefix>
                            <span>$</span>
                        </template>
                    </el-input>
                </el-form-item>

            </div>
        </el-form>

        <!-- Footer -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveUser">Save</el-button>
            </div>
        </template>
    </el-dialog>
    <MyMessage :message="messageText" :type="messageType" />
</template>

<script>
import { createUser, updateUser } from '@/api/user';
import { uploadFile } from '@/api/upload';
import { computed, onBeforeUnmount, onMounted, ref, toRaw } from 'vue';
import AvatarUploader from '../common/AvatarUploader.vue';
import MyMessage from '../common/MyMessage.vue';
import { Roles } from '@/constant/role';
import { formatCurrency, parseCurrency } from '@/utils/common';


export default {
    name: 'AddUserModal',
    components: { AvatarUploader, MyMessage },
    props: {
        refreshUser: {
            type: Function,
            required: true,
        },
    },
    setup(props) {
        const dialogVisible = ref(false);
        const isEditLocal = ref(false);
        const messageText = ref('');
        const messageType = ref('success');
        const isMobile = ref(false);
        const selectedFile = ref(null);

        const userForm = ref({
            avatar: '',
            full_name: '',
            username: '',
            employee_id: '',
            position: '',
            role: '',
            gender: '',
            birthday: null,  // date
            phone: '',
            address: '',
            email: '',
            password: '',
            nric_fin: '',
            work_permit_expiry: null,
            user_setting_salary: {
                basic_salary: 0,
                base_allowance: 0,
                job_allowance: 0,
                overtime: 0
            }
        });

        const getDefaultUserForm = () => ({
            avatar: '',
            full_name: '',
            username: '',
            employee_id: '',
            position: '',
            role: '',
            gender: '',
            birthday: null,
            phone: '',
            address: '',
            email: '',
            password: '',
            nric_fin: '',
            work_permit_expiry: null,
            user_setting_salary: {
                basic_salary: 0,
                base_allowance: 0,
                job_allowance: 0,
                overtime: 0
            }
        })

        const genders = ['Male', 'Female'];

        const dialogWidth = computed(() => {
            return isMobile.value ? '343px' : '712px';
        });

        onMounted(() => {
            checkMobile();
            window.addEventListener('resize', checkMobile);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', checkMobile);
        });

        const checkMobile = () => {
            isMobile.value = window.innerWidth < 768;
        };

        const handleAddUser = () => {
            userForm.value = getDefaultUserForm()
            selectedFile.value = null;
            isEditLocal.value = false;
            dialogVisible.value = true;
        };

        const onFileSelected = (file) => {
            selectedFile.value = file;
        };

        const setShowDialog = (value) => {
            dialogVisible.value = value;
        };

        const handleInput = (key, val) => {
            if (val === null || val === undefined || val === '') {
                userForm.value.user_setting_salary[key] = 0
                return
            }
            const cleaned = String(val).replace(/[^\d]/g, '')
            userForm.value.user_setting_salary[key] = cleaned ? parseInt(cleaned) : 0
        }

        const setUser = (row) => {
            if (row) {
                const defaultForm = getDefaultUserForm()
                userForm.value = Object.assign(defaultForm, row)
                if (typeof row.role === 'string') {
                    const found = Roles.find(r => r.label === row.role);
                    userForm.value.role = found ? found.value : '';
                }
            }
            selectedFile.value = null;
            isEditLocal.value = true;
            dialogVisible.value = true;
        };

        const saveUser = async () => {
            try {
                messageText.value = '';
                messageType.value = '';

                if (selectedFile.value) {
                    const formData = new FormData();
                    formData.append('file', selectedFile.value);
                    const uploadResponse = await uploadFile(formData);
                    if (uploadResponse.data.success) {
                        userForm.value.avatar = uploadResponse.data.data.url;
                    } else {
                        messageText.value = 'File upload failed.';
                        messageType.value = 'error';
                        return;
                    }
                }

                let res;
                if (isEditLocal.value) {
                    res = await updateUser(userForm.value._id, toRaw(userForm.value));
                } else {
                    res = await createUser(toRaw(userForm.value));
                }

                if (res && res.data && (res.data.status === 200 || res.data.status === 201)) {
                    messageText.value = 'Save Successfully';
                    messageType.value = 'success';
                    props.refreshUser();
                    dialogVisible.value = false;
                }
            } catch (error) {
                messageText.value = 'Save failed. Please try again.';
                messageType.value = 'error';
            }
        };

        return {
            dialogVisible,
            genders,
            userForm,
            Roles,
            isEditLocal,
            messageText,
            messageType,
            dialogWidth,
            handleAddUser,
            setShowDialog,
            setUser,
            saveUser,
            onFileSelected,
            handleInput,
            formatCurrency,
            parseCurrency,
        };
    },
};
</script>
<style scoped>
:deep(:-webkit-autofill),
:deep(:-webkit-autofill:hover),
:deep(:-webkit-autofill:focus),
:deep(:-webkit-autofill:active) {
    box-shadow: 0 0 0px 1000px #F3F3F3 inset !important;
    -webkit-box-shadow: 0 0 0px 1000px #F3F3F3 inset !important;
}

.dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    /* Hoặc set border-bottom, etc. */
}

.dialog-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.avatar-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
}

.avatar-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-left: 16px;
}

/* Form style */
.user-form {
    margin-top: 8px;
}

.user-form .el-form-item {
    margin-bottom: 0;
}

.el-form-item {
    margin-bottom: 16px;
}

/* Footer */
.dialog-footer {
    text-align: right;
}

.form-modal-add-user {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-wrap: wrap;
    gap: 16px;
}

.form-modal-add-user .el-form-item {
    display: flex;
    flex-direction: column;
}

:deep(.form-modal-add-user .el-form-item__label) {
    display: flex;
    justify-content: flex-start;
    color: var(--DRK-grey, #767A7D);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 17px;
    height: 17px;
}

:deep(.form-modal-add-user .el-select__wrapper) {
    height: 48px;
    background-color: #F3F3F3;
    border: none !important;
    box-shadow: none !important;
}

:deep(.form-modal-add-user .el-input) {
    max-width: 320px;
}

:deep(.form-modal-add-user .el-form-item) {
    max-width: 320px;
}

:deep(.form-modal-add-user .el-input__inner) {
    height: 48px;
    background-color: #F3F3F3;
    padding: 12px 8px;
    font-size: 16px;
}

:deep(.form-modal-add-user .el-input__wrapper) {
    height: 48px;
    background-color: #F3F3F3;
    border: none !important;
    box-shadow: none !important;
}

:deep(.form-modal-add-user .el-input__wrapper) {
    padding: unset;
}

:deep(.el-input__prefix-inner) {
    position: absolute;
    top: 25%;
    right: 10px;
    width: 24px;
    height: 24px;
}

:deep(.el-input__prefix-inner .el-input__icon) {
    width: 24px !important;
    height: 24px !important;
}

:deep(.el-input__prefix-inner .el-input__icon svg) {
    width: 24px !important;
    height: 24px !important;
}

.custom-input-number{
    width: 100%;
}
.custom-input-number >>> .el-input-number__decrease,
.custom-input-number >>> .el-input-number__increase {
  display: none;
}

@media (max-width: 1024px) {}

@media (max-width: 767px) {
    .form-modal-add-user {
        display: grid;
        grid-template-columns: 1fr;
    }
}
</style>