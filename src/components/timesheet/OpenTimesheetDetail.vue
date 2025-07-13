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
                    <span>{{ formatDate(timesheet?.date_time) }}</span>
                    <span>LOCATION</span>
                    <span>{{ jobnumber.location_at }}</span>
                </div>
                <div class="info-row">
                    <span>SUPERVISOR</span>
                    <span>{{ supervisorName }}</span>
                    <span>TIME</span>
                    <span>{{ formatDate(timesheet.time_end) }}</span>
                </div>
            </div>

            <el-table :data="timesheet?.details || []" border stripe class="sheet-table">

                <el-table-column prop="attendance.full_name" label="ATTENDANCE" />
                <el-table-column prop="time_in" label="TIME IN" :formatter="formatTime" />
                <el-table-column prop="time_out" label="TIME OUT" :formatter="formatTime" />
                <el-table-column prop="over_time" label="OVER-TIME" />
                <el-table-column label="ON ROPE">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.on_rope" disabled />
                    </template>
                </el-table-column>
                <el-table-column label="IN CHARGE">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.in_charge" disabled />
                    </template>
                </el-table-column>
                <el-table-column label="OTHER">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.other" disabled />
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="REMARKS" />
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
                <el-button type="primary" @click="onEdit">Edit</el-button>
                <el-button type="success">Approve</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTimesheetDetail } from '@/api/timesheet'

const route = useRoute()
const router = useRouter()
const timesheet = ref(null)
const jobnumber = ref({})
const supervisorName = ref('')
const clientSignature = ref('')

onMounted(async () => {
    try {
        console.log('Call API với id:', route.params.id);
        const res = await getTimesheetDetail(route.params.id)
        console.log('RES:', res)
        timesheet.value = res.data?.data
        jobnumber.value = res.data?.data.jobnumber
        supervisorName.value = res.data?.data.office_supervisor?.full_name
    } catch (e) {
        console.error(e)
        timesheet.value = null
    }
})


function formatDate(dt) {
    if (!dt) return ''
    return new Date(dt).toLocaleDateString('en-GB')
}
function formatTime(_, __, cellValue) {
    if (!cellValue) return ''
    return new Date(cellValue).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
function onEdit() {
    router.push(`/admin/open-timesheets/${route.params.id}/edit`)
}
</script>

<style scoped>
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
    height: 60px;
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
