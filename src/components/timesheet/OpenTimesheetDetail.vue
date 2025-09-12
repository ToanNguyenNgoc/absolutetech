<template>
    <div class="timesheet-detail-root">
        <div class="sheet-paper" v-if="timesheet">
            <div class="sheet-header">
                <img src="@/assets/logo.png" class="logo" />
                <div class="company-title">
                    ABSOLUTE ROPE ACCESS PTE LTD
                </div>
                <div class="jobnumber">
                    JOB NUMBER: {{ jobnumber.code }}
                </div>
            </div>

            <div class="info-table">
                <div class="info-row">
                    <span>CLIENT</span><span>{{ jobnumber.client }}</span>
                    <span>PROJECT</span><span>{{ jobnumber.project }}</span>
                </div>
                <div class="info-row">
                    <span>DATE</span>
                    <!-- <span>{{ formatDate(timesheet?.date_time) }}</span> -->
                    <el-date-picker v-model="detailForm.date_time" type="date" placeholder="Date" style="width: 200px;"
                        :disabled="!isEditing" value-format="YYYY-MM-DD" @change="changeDate" />
                    <span>LOCATION</span>
                    <span>{{ jobnumber.location_at }}</span>
                </div>
                <div class="info-row">
                    <span style="line-height: 32px;">SUPERVISOR</span>
                    <!-- <span>{{ supervisorName }}</span> -->
                    <el-select placeholder="Supervisor" style="width: 200px" v-model="detailForm.office_supervisor._id"
                        :disabled="!isEditing">
                        <el-option v-for="item in supervisors" :key="item._id" :label="item.full_name"
                            :value="item._id" />
                    </el-select>
                    <span>TIME</span>
                    <span>{{ formatTime(null, null, timesheet.time_end) }}</span>
                </div>
            </div>

            <el-table :data="timesheet?.details || []" border stripe class="sheet-table">

                <el-table-column prop="attendance.full_name" label="ATTENDANCE" />

                <el-table-column label="TIME IN">
                    <template #default="{ row }">
                        <span v-if="!isEditing">{{ formatTime(null, null, row.time_in) }}</span>
                        <el-time-picker v-else style="width: unset;" v-model="row.time_in" value-format="HH:mm"
                            :format="'HH:mm'" :clearable="false" @change="() => onTimeInput(row)" />
                    </template>
                </el-table-column>

                <el-table-column label="TIME OUT">
                    <template #default="{ row }">
                        <span v-if="!isEditing">{{ formatTime(null, null, row.time_out) }}</span>
                        <el-time-picker v-else style="width: unset;" v-model="row.time_out" value-format="HH:mm"
                            :format="'HH:mm'" :clearable="false" @change="() => onTimeInput(row)" @blur="() => onTimeInput(row)" />
                    </template>
                </el-table-column>

                <el-table-column label="OVER-TIME">
                    <template #default="{ row }">
                        <span v-if="!isEditing">{{ row.over_time }}</span>
                        <el-input v-else v-model="row.over_time" />
                    </template>
                </el-table-column>

                <el-table-column label="ON ROPE">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.on_rope" :disabled="!isEditing" />
                    </template>
                </el-table-column>

                <el-table-column label="IN CHARGE">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.in_charge" :disabled="!isEditing" />
                    </template>
                </el-table-column>

                <el-table-column label="OTHER">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.other" :disabled="!isEditing" />
                    </template>
                </el-table-column>

                <el-table-column label="INDOOR">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.is_indoor" :disabled="!isEditing" />
                    </template>
                </el-table-column>

                <el-table-column label="NIGHT JOB">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.is_night_job" :disabled="!isEditing" />
                    </template>
                </el-table-column>

                <el-table-column label="REMARKS">
                    <template #default="{ row }">
                        <span v-if="!isEditing">{{ row.remarks }}</span>
                        <el-input v-else v-model="row.remarks" type="textarea" autosize />
                    </template>
                </el-table-column>

                <el-table-column label="SIGN (TECH)">
                    <template #default="{ row }">
                        <img v-if="row.signature_tech" :src="row.signature_tech" class="signature-img" />
                    </template>
                </el-table-column>
            </el-table>


            <div class="footer-sign">
                <div class="left">
                    <div>PREPARED & CHECKED BY: <br />SUPERVISOR</div>
                    <div class="sign-box">
                        <img v-if="timesheet.signature" :src="timesheet.signature" class="signature-img" />
                    </div>
                </div>
                <div class="right">
                    <div>VERIFIED BY: CLIENT REPRESENTATIVE</div>
                    <div class="info-row">
                        <span>Date</span>
                        <span>{{ formatDate(timesheet.time_end) }}</span>
                    </div>
                    <div class="sign-box">
                        <img v-if="clientSignature" :src="clientSignature" class="signature-img" />
                    </div>
                </div>
            </div>

            <div class="actions">
                <template v-if="isEditing">
                    <el-button @click="onCancelEdit">Cancel</el-button>
                    <el-button type="primary" @click="onSave">Save</el-button>
                </template>
                <template v-else>
                    <el-button v-if="canEdit" type="primary" @click="onEdit">Edit</el-button>
                    <el-button v-if="canApprove" type="success" @click="onApprove">Approve</el-button>
                    <el-button v-if="canClose" type="danger" @click="onClose">Close</el-button>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTimesheetDetail, approveTimesheet, closeTimesheet, updateTimesheet } from '@/api/timesheet'
import { ElMessage, ElMessageBox } from 'element-plus';
import { AppLoading, calculateDurationHours, formattedTime, formatTime, getWeekday, parseTimeToISO } from '@/utils/common';
import { useGetNormalWorkingHours, useGetUsers } from '@/hooks';
import { ROLES, WEEKDAYS } from '@/utils/constants';
import moment from 'moment';

const route = useRoute()
const router = useRouter()
const timesheet = ref(null)
const jobnumber = ref({})
const clientSignature = ref('')
const isEditing = ref(false)
const originalTimesheetDetails = ref([]);
const supervisors = useGetUsers({ limit: 1000, roles: `${ROLES.SUPERVISOR}` });
const detailForm = ref({
    date_time: null,
    office_supervisor: {}
});
const {normalWorkingHours} = useGetNormalWorkingHours();

const canEdit = computed(() => {
    return timesheet.value && timesheet.value.status !== 'approve' && timesheet.value.status !== 'closed';
});

const canApprove = computed(() => {
    return timesheet.value && timesheet.value.status !== 'approve' && timesheet.value.status !== 'closed';
});

const canClose = computed(() => {
    return timesheet.value && timesheet.value.status === 'approve';
});

onMounted(async () => {
    await fetchData();
})

const fetchData = async () => {
    AppLoading.show();
    try {
        const res = await getTimesheetDetail(route.params.id)
        detailForm.value.office_supervisor = res.data?.data.office_supervisor || {};
        detailForm.value.date_time = res.data?.data?.date_time;
        timesheet.value = {
            ...res.data?.data,
            details: (res?.data?.data?.details || []).map(i => ({ ...i, time_in: formattedTime(i.time_in), time_out: formattedTime(i.time_out) }))
        };
        jobnumber.value = res.data?.data.jobnumber || {};
        clientSignature.value = res.data?.data.client_signature;
        originalTimesheetDetails.value = JSON.parse(JSON.stringify((timesheet.value?.details || [])))
    } catch (e) {
        console.error(e)
        timesheet.value = null
        ElMessage.error('Failed to load timesheet detail.');
    } finally {
        AppLoading.hide();
    }
}

function changeDate(){
    if (!timesheet.value?.details?.length) return;
  timesheet.value.details.forEach((row) => onTimeInput(row));
}

function formatDate(dt) {
    if (!dt) return ''
    return new Date(dt).toLocaleDateString('en-GB')
}

function onEdit() {
    isEditing.value = true
}

function onCancelEdit() {
    isEditing.value = false;
    timesheet.value.details = JSON.parse(JSON.stringify(originalTimesheetDetails.value));
}

async function onSave() {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to save these changes?',
            'Confirm Save',
            {
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        );

        const payload = {
            office_supervisor: detailForm.value.office_supervisor?._id,
            date_time: detailForm.value.date_time,
            details: timesheet.value.details.map(detail => ({
                id: detail.id,
                attendance_id: detail.attendance_id,
                time_in: parseTimeToISO(detail.time_in, moment(detailForm.value.date_time).format('YYYY-MM-DD')),
                time_out: parseTimeToISO(detail.time_out, moment(detailForm.value.date_time).format('YYYY-MM-DD')),
                over_time: detail.over_time,
                on_rope: detail.on_rope,
                in_charge: detail.in_charge,
                other: detail.other,
                remarks: detail.remarks,
            }))
        };
        await updateTimesheet(route.params.id, payload);
        ElMessage.success('Timesheet updated successfully!');
        isEditing.value = false;
        await fetchData();
    } catch (error) {
        if (error !== 'cancel') {
            console.error('Failed to save timesheet:', error);
            ElMessage.error(error.response?.data?.message || 'Failed to save timesheet.');
        }
    }
}

// Calc biding overtime
function onTimeInput(row) {
    const int = parseTimeToISO(row.time_in, moment(detailForm.value.date_time).format('YYYY-MM-DD'));
    const out = parseTimeToISO(row.time_out, moment(detailForm.value.date_time).format('YYYY-MM-DD'));
    const hours = calculateDurationHours(int, out);
    const weekday = getWeekday(moment(detailForm.value.date_time).format('YYYY-MM-DD'));
    if(weekday == WEEKDAYS.SUNDAY) return row.over_time = hours;
    const standard = toRaw(normalWorkingHours.value).find(i => i.weekday === weekday)?.hours;
    if (hours - standard >= 0) {
        row.over_time = hours - standard
    }
}


async function onApprove() {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to approve this timesheet? Once approve, it cannot be edited.',
            'Confirm Approval',
            {
                confirmButtonText: 'Approve',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        );

        await approveTimesheet(route.params.id);

        ElMessage.success('Timesheet approve successfully!');
        isEditing.value = false;
        await fetchData();
    } catch (error) {
        if (error !== 'cancel') {
            console.error('Failed to approve timesheet:', error);
            ElMessage.error(error.response?.data?.message || 'Failed to approve timesheet.');
        }
    }
}

async function onClose() {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to close this timesheet? Once closed, it cannot be reopened except by Super Admin.',
            'Confirm Close',
            {
                confirmButtonText: 'Close',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        );

        await closeTimesheet(route.params.id);

        ElMessage.success('Timesheet closed successfully!');
        isEditing.value = false;
        router.push('/admin/close-timesheets');
    } catch (error) {
        if (error !== 'cancel') {
            console.error('Failed to close timesheet:', error);
            ElMessage.error(error.response?.data?.message || 'Failed to close timesheet.');
        }
    }
}
</script>

<style scoped>
/* Styles không thay đổi */
.timesheet-detail-root {
    min-height: 100vh;
    padding: 32px 0;
}

.sheet-paper {
    background: #fff;
    margin: 0 auto;
    max-width: 1200px;
    box-shadow: 0 2px 16px #ccc;
    border-radius: 12px;
    padding: 32px 48px;
}

.sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #eee;
    margin-bottom: 16px;
}

.logo {
    height: 45px;
}

.company-title {
    font-weight: bold;
    font-size: 20px;
    flex: 1;
    text-align: center;
}

.jobnumber {
    font-size: 18px;
    font-weight: 600;
}

.info-table {
    margin: 16px 0;
}

.info-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    font-size: 15px;
    padding: 4px 0;
}

.sheet-table {
    margin: 24px 0 24px 0;
}

.signature-img {
    height: 60px;
    max-width: 140px;
    object-fit: contain;
    border-bottom: 1px solid #eee;
}

.footer-sign {
    display: flex;
    justify-content: space-between;
    margin-top: 36px;
}

.left,
.right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.sign-box {
    min-height: 70px;
    margin: 8px 0;
    border: 1px solid #eee;
    background: #f9f9f9;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 32px;
}
</style>