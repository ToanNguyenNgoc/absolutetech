<template>
    <el-card>
        <div>
            <el-form :model="form">
                <el-form-item label="Client">
                    <el-input v-model="form.jobnumber.client" disabled />
                </el-form-item>
                <el-form-item label="Project">
                    <el-input v-model="form.jobnumber.project" disabled />
                </el-form-item>
                <!-- Thêm các trường cần edit -->
            </el-form>
            <el-table :data="form.details" style="margin-top: 16px;">
                <el-table-column prop="attendance.full_name" label="Attendance" />
                <el-table-column label="Time In">
                    <template #default="{ row }">
                        <el-time-picker v-model="row.time_in" :format="'HH:mm'" placeholder="Select time" />
                    </template>
                </el-table-column>
                <el-table-column label="Time Out">
                    <template #default="{ row }">
                        <el-time-picker v-model="row.time_out" :format="'HH:mm'" placeholder="Select time" />
                    </template>
                </el-table-column>
                <el-table-column label="Over Time">
                    <template #default="{ row }">
                        <el-input-number v-model="row.over_time" :min="0" />
                    </template>
                </el-table-column>
                <el-table-column label="On Rope">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.on_rope" />
                    </template>
                </el-table-column>
                <el-table-column label="In Charge">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.in_charge" />
                    </template>
                </el-table-column>
                <el-table-column label="Other">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.other" />
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="Remarks">
                    <template #default="{ row }">
                        <el-input v-model="row.remarks" />
                    </template>
                </el-table-column>
                <el-table-column label="Signature">
                    <template #default="{ row }">
                        <img :src="row.signature_tech" alt="Signature" height="50" />
                        <!-- Có thể thêm chức năng upload lại chữ ký nếu cần -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-space style="margin-top: 24px; float: right;">
            <el-button @click="onCancel">Cancel</el-button>
            <el-button type="primary" @click="onSave">Save</el-button>
        </el-space>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Clone từ View, thay thành form editable
const route = useRoute();
const router = useRouter();
const form = ref(null);

onMounted(async () => {
    // fetch chi tiết timesheet về form.value
});

function onCancel() {
    router.push(`/admin/open-timesheets/${route.params.id}`);
}
function onSave() {
    // Call API update timesheet
    // await api.updateTimesheet(route.params.id, form.value)
    router.push(`/admin/open-timesheets/${route.params.id}`);
}
</script>
