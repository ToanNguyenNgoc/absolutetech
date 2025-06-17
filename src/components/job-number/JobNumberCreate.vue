<template>
    <div class="job-number-create">
        <el-page-header @back="$router.back()" content="Create New JN" />

        <el-form ref="formRef" :model="form" :rules="rules" label-width="160px" class="form-card">
            <!-- General Info -->
            <div class="card">
                <div class="card-title">General Info</div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="JN" prop="code">
                            <el-input v-model="form.code" placeholder="Job Number" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Client" prop="client">
                            <el-input v-model="form.client" placeholder="Client Name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Project" prop="project">
                            <el-input v-model="form.project" placeholder="Project Name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Est. Start Date" prop="estStartDate">
                            <el-date-picker v-model="form.estStartDate" type="date" placeholder="Start Date" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Est. End Date" prop="estEndDate">
                            <el-date-picker v-model="form.estEndDate" type="date" placeholder="End Date" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Technician/Supervisor" prop="assignedTo">
                            <el-select v-model="form.assignedTo" placeholder="Select">
                                <el-option v-for="user in users" :key="user._id" :label="user.fullName"
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
                            <el-input v-model="row.name" placeholder="File name" />
                        </template>
                    </el-table-column>
                    <el-table-column label="Document">
                        <template #default="{ row }">
                            <el-upload :limit="1" :auto-upload="false"
                                :on-change="(file) => handleFileChange(file, row)" :file-list="row.fileList"
                                list-type="text">
                                <el-button type="text">Upload PDF file</el-button>
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
                    <el-radio-group v-model="uploadMode">
                        <el-radio label="multiple">Upload multiple files</el-radio>
                    </el-radio-group>
                    <el-button type="primary" @click="addDocument">+ Add</el-button>
                </div>
            </div>

            <!-- Footer -->
            <div class="form-footer">
                <el-button @click="$router.back()">Cancel</el-button>
                <el-button type="primary" @click="submitForm">Save</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { createJobNumber, uploadJobFile } from '@/api/jobnumber';
import { getTechnicianUsers } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const formRef = ref();
        const router = useRouter();
        const form = ref({
            code: '',
            client: '',
            project: '',
            estStartDate: '',
            estEndDate: '',
            assignedTo: '',
            documents: [],
        });

        const users = ref([]);

        const uploadMode = ref('multiple');

        const rules = {
            code: [{ required: true, message: 'Required', trigger: 'blur' }],
            project: [{ required: true, message: 'Required', trigger: 'blur' }],
        };

        const addDocument = () => {
            form.value.documents.push({ name: '', fileIds: [], fileList: [] });
        };

        const removeDocument = (index) => {
            form.value.documents.splice(index, 1);
        };

        const handleFileChange = async (file, row) => {
            try {
                const formData = new FormData();
                formData.append('file', file.raw);
                const res = await uploadJobFile(formData);

                const fileId = res.data?.data?._id || res.data?._id;
                if (fileId) {
                    row.fileIds = [fileId];
                    row.fileList = [file]; // still show file in UI
                } else {
                    throw new Error('Missing fileId');
                }
            } catch (err) {
                console.error('File upload failed:', err);
                ElMessage.error('Upload failed');
            }
        };

        const submitForm = () => {
            formRef.value.validate(async (valid) => {
                if (!valid) return;
                const payload = {
                    ...form.value,
                    status: 'open',
                    documents: form.value.documents.map((doc) => ({
                        name: doc.name,
                        fileIds: doc.fileIds,
                    })),
                };
                try {
                    await createJobNumber(payload);
                    ElMessage.success('Job Number created successfully');
                    router.push('/admin/job-number');
                } catch (err) {
                    ElMessage.error('Failed to create Job Number');
                    console.error(err);
                }
            });
        };

        onMounted(async () => {
            const res = await getTechnicianUsers();
            users.value = res.data.data || [];
        });

        return {
            form,
            formRef,
            rules,
            users,
            uploadMode,
            addDocument,
            removeDocument,
            handleFileChange,
            submitForm,
        };
    },
};
</script>

<style scoped>
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
    margin-top: 20px;
}

.file-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
}
</style>
