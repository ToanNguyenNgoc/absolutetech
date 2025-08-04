<template>
    <div class="page-container">
        <div class="job-number-create">
            <el-page-header @back="$router.back()" :content="renderPageTitle()" />
            <el-form ref="formRef" :model="form" :rules="rules" label-width="160px" class="form-card">
                <!-- General Info -->
                <div class="card">
                    <div class="card-title">General Info</div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="JN" prop="code">
                                <el-input v-model="form.code" placeholder="Job Number" :disabled="isEdit" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Project" prop="project">
                                <el-input v-model="form.project" placeholder="Project Name" :disabled="isEdit" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Client" prop="client">
                                <el-input v-model="form.client" placeholder="Client Name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Location" prop="location_at">
                                <el-input v-model="form.location_at" placeholder="Location Name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Est. Start Date" prop="est_start_date">
                                <el-date-picker v-model="form.est_start_date" type="date" placeholder="Start Date" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Est. End Date" prop="est_end_date">
                                <el-date-picker v-model="form.est_end_date" type="date" placeholder="End Date" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Technician/Supervisor" prop="assigned_to">
                                <el-select v-model="form.assigned_to" placeholder="Select">
                                    <el-option v-for="user in users" :key="user._id" :label="user.full_name"
                                        :value="user._id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!-- Attachment Details -->
                <div class="card">
                    <div class="card-title">Attachment Details</div>
                    <el-table :data="form.documents" border style="margin-bottom: 16px">
                        <el-table-column label="No." type="index" width="50" />
                        <el-table-column label="File Name">
                            <template #default="{ row }">
                                <el-form :model="row">
                                    <el-form-item :prop="'name'"
                                        :rules="[{ required: true, message: 'File Name is required', trigger: 'blur' }]">
                                        <el-input v-model="row.name" placeholder="File Name" />
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column label="Document">
                            <template #default="{ row }">
                                <el-upload :auto-upload="false" multiple
                                    :on-change="(file) => handleFileChange(file, row)" :file-list="row.fileList"
                                    accept=".pdf" list-type="text" :before-remove="(file) => beforeRemoveFile(file)"
                                    :on-remove="(file, fileList) => onRemoveFile(file, fileList, row)">
                                    <el-button type="text">Upload PDF file</el-button>
                                    <template #tip>
                                        <div class="el-upload__tip">
                                            pdf files with a size less than 10MB.
                                        </div>
                                    </template>
                                </el-upload>
                            </template>
                        </el-table-column>
                        <el-table-column label="Action" width="80">
                            <template #default="scope">
                                <div class="file-row__delete">
                                    <img src="@/assets/img/icon-delete.svg" alt="delete"
                                        @click="removeDocument(scope.$index)" style="cursor: pointer;" />
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="file-actions">
                        <el-button type="primary" @click="addDocument">+ Add More</el-button>
                    </div>
                </div>

                <!-- Footer -->
                <AppFooterForm>
                    <div class="form-footer">
                        <el-button @click="$router.back()">Cancel</el-button>
                        <el-button :loading="isMutating" type="primary" @click="submitForm">Save</el-button>
                    </div>
                </AppFooterForm>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createJobNumber, getJobNumberById, updateJobNumber, uploadJobFile } from '@/api/jobnumber';
import { getTechnicianUsers } from '@/api/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { AppConfirm, AppLoading } from '@/utils/common';
import AppFooterForm from '../common/AppFooterForm.vue';

export default {
    components: { AppFooterForm },
    props: {
        id: {
            type: String,
            default: null,
        },
    },
    setup(props) {
        const formRef = ref();
        const router = useRouter();
        const route = useRoute();
        const isMutating = ref(false);
        const form = ref({
            code: '',
            project: '',
            client: '',
            location_at: '',
            est_start_date: '',
            est_end_date: '',
            assigned_to: '',
            documents: [],
        });

        const users = ref([]);
        const uploadMode = ref('multiple');
        const isEdit = ref(false);

        const renderPageTitle = () => {
            let title = 'Create New Job Number';
            if (props.id) title = 'Edit Job Number';
            if(props.id && route.path.includes('/duplicate')) title = 'Duplicate Job Number'
            return title;
        }

        const rules = {
            code: [{ required: true, message: 'Required', trigger: 'blur' }],
            project: [{ required: true, message: 'Required', trigger: 'blur' }],
        };

        const addDocument = () => {
            form.value.documents.push({
                name: '',
                // fileIds: [],
                fileList: []
            });
        };

        const removeDocument = (index) => {
            AppConfirm.delete({
                callback: () => form.value.documents.splice(index, 1)
            });
        };

        const handleFileChange = async (file, row) => {
            const rawFile = file.raw;
            const isLt10M = rawFile.size / 1024 / 1024 < 10;

            if (!isLt10M) {
                ElMessage.warning('File size must be less than 10MB.');
                row.fileList = [];
                return;
            }
            try {
                const formData = new FormData();
                formData.append('file', file.raw);
                const res = await uploadJobFile(formData);
                const fileId = res.data?.data?._id || res.data?._id;
                if (fileId) {
                    row.fileList.push({ id: fileId, ...file });
                } else {
                    throw new Error('Missing fileId');
                }
            } catch (err) {
                console.error('Upload failed', err);
                ElMessage.error('Upload failed');
            }
        };

        const beforeRemoveFile = (uploadFile) => {
            return ElMessageBox
                .confirm(
                    `Do you want to remove ${uploadFile.name} ?`
                ).then(
                    () => true,
                    () => false
                )
        };

        const onRemoveFile = (file, _fileList, row) => {
            row.fileList = row.fileList.filter(i => i.id !== file.id);
        };

        const submitForm = () => {
            formRef.value.validate(async (valid) => {
                if (!valid) return;
                const hasEmptyFileName = form.value.documents.some((documentItem, index) => {
                    if (documentItem.name.trim() == '') {
                        ElMessage.warning(`File Name in item ${index + 1} is not empty !`);
                        return true
                    }
                    return false;
                })
                if (hasEmptyFileName) return;
                let documents = [];
                if (form.value.documents.length === 0) return ElMessage.warning('Attachment Details is not empty');
                for (let i = 0; i < form.value.documents.length; i++) {
                    documents.push({
                        documentId: form.value.documents[i].documentId,
                        name: form.value.documents[i].name,
                        fileIds: form.value.documents[i].fileList.map(file => file.id),
                    })
                }
                const payload = {
                    id: props.id,
                    ...form.value,
                    documents
                };
                isMutating.value = true
                try {
                    if (isEdit.value) {
                        await updateJobNumber(props.id, payload);
                        ElMessage.success('Updated successfully');
                    } else {
                        await createJobNumber(payload);
                        ElMessage.success('Created successfully');
                    }
                    setTimeout(() => router.back(), 1500);
                } catch (err) {
                    if (err.response?.data?.errors?.length > 0 && err.response?.data?.errors[0]?.messages?.length > 0) {
                        console.log(err.response?.data?.errors);
                        ElMessage.error(err.response?.data?.errors[0]?.messages[0])
                    } else {
                        ElMessage.error('Failed to save Job Number');
                    }
                } finally {
                    isMutating.value = false;
                }
            });
        };

        const loadDataIfEdit = async () => {
            if (props.id) {
                AppLoading.show();
                try {
                    const res = await getJobNumberById(props.id,{
                        gen_duplicate: route.path.includes('/duplicate') ? true: null 
                    });
                    const data = res.data?.data;

                    if (route.path.includes('/edit')) {
                        isEdit.value = true;
                        form.value = {
                            code: data.code,
                            project: data.project,
                            client: data.client,
                            location_at: data.location_at,
                            est_start_date: data.est_start_date ? new Date(data.est_start_date) : '',
                            est_end_date: data.est_end_date ? new Date(data.est_end_date) : '',
                            assigned_to: data.assigned_to?._id || '',
                            documents: (data.documents || []).map((doc) => ({
                                documentId: doc._id,
                                name: doc.name,
                                fileList: doc.files.map((f) => ({
                                    id: f._id,
                                    name: f.name,
                                    url: '/' + f.url,
                                })),
                            })),
                        };
                    }
                    else if (route.path.includes('/duplicate')) {
                        isEdit.value = false;
                        const duplicate_data = data.duplicate;
                        const documents = (duplicate_data?.duplicate_documents || []).map(doc => ({
                            name: doc.name,
                            fileList: doc.files?.map((f) => ({
                                id:f._id,
                                name: f.name,
                                url: '/' + f.url,
                            }))
                        }))
                        form.value = {
                            code: duplicate_data?.duplicate_code || '',
                            project: data.project,
                            client: data.client,
                            location_at: data.location_at,
                            est_start_date: data.est_start_date ? new Date(data.est_start_date) : '',
                            est_end_date: data.est_end_date ? new Date(data.est_end_date) : '',
                            assigned_to: data.assigned_to?._id || '',
                            // documents: (data.documents || []).map((doc) => ({
                            //     name: doc.name,
                            //     fileList: doc.files.map((f) => ({
                            //         id: f._id,
                            //         name: f.name,
                            //         url: '/' + f.url,
                            //     })),
                            // })),
                            documents
                        };
                    }

                } catch (err) {
                    console.error('Failed to fetch job number', err);
                } finally {
                    AppLoading.hide();
                }
            }
        };


        onMounted(async () => {
            const res = await getTechnicianUsers();
            users.value = res.data.data || [];
            await loadDataIfEdit();
        });

        return {
            renderPageTitle,
            isEdit,
            form,
            formRef,
            users,
            rules,
            uploadMode,
            addDocument,
            removeDocument,
            handleFileChange,
            beforeRemoveFile,
            onRemoveFile,
            submitForm,
            isMutating
        };
    },
};
</script>

<style scoped>
.page-container {
    height: calc(100vh - 162px);
    overflow-y: scroll;
}

.job-number-create {
    padding: 20px;
    max-width: 1200px;
    margin: auto;
}

.card {
    background: white;
    border: 1px solid #eaeaea;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 24px;
}

.card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
}

.form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.file-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
}
</style>
