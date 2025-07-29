<template>
    <div class="timesheet-detail-root">
        <!-- Nút ẩn auto print, sẽ được trigger JS sau khi fetch xong -->
        <button
            ref="autoPrintBtn"
            style="display: none"
            v-print="printObj"
        >Print</button>

        <!-- Vùng sẽ được in -->
        <div id="printMe" ref="printMe">
            <div class="sheet-paper" v-if="timesheet">
                <!-- Header -->
                <div class="sheet-header">
                    <img src="@/assets/logo.png" class="logo"  />
                    <div class="company-title">
                        ABSOLUTE ROPE ACCESS PTE LTD
                    </div>
                    <div class="jobnumber">
                        JOB NUMBER: {{ jobnumber.code }}
                    </div>
                </div>

                <!-- Info table -->
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
                        <span>{{ formatTime(null, null, timesheet.time_end) }}</span>
                    </div>
                </div>

                <!-- Table -->
                <el-table :data="timesheet?.details || []" border stripe class="sheet-table">
                    <el-table-column prop="attendance.full_name" label="ATTENDANCE" />
                    <el-table-column label="TIME IN">
                        <template #default="{ row }">
                            <span>{{ formatTime(null, null, row.time_in) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="TIME OUT">
                        <template #default="{ row }">
                            <span>{{ formatTime(null, null, row.time_out) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="OVER-TIME">
                        <template #default="{ row }">
                            <span>{{ row.over_time }}</span>
                        </template>
                    </el-table-column>
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
                    <el-table-column label="REMARKS">
                        <template #default="{ row }">
                            <span>{{ row.remarks }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="SIGN (TECH)">
                        <template #default="{ row }">
                            <img v-if="row.signature_tech" :src="row.signature_tech" class="signature-img" />
                        </template>
                    </el-table-column>
                </el-table>

                <!-- Footer -->
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
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getTimesheetDetail } from '@/api/timesheet'
import { ElMessage } from 'element-plus'

const route = useRoute()
const timesheet = ref(null)
const jobnumber = ref({})
const supervisorName = ref('')
const clientSignature = ref('')

const autoPrintBtn = ref(null)

// Cấu hình đối tượng printObj truyền vào v-print
const printObj = {
    id: "printMe",
    popTitle: 'Timesheet',
    standard: 'html5',
    preview: false,
    // Có thể thêm extraCss, extraHead,... nếu muốn
}

onMounted(async () => {
    await fetchData()
    // Đảm bảo DOM render xong, mới gọi click tự động
    nextTick(() => {
        setTimeout(() => {
            if (autoPrintBtn.value) autoPrintBtn.value.click()
        }, 1000)
    })
})

const fetchData = async () => {
    try {
        const res = await getTimesheetDetail(route.params.id)
        timesheet.value = res.data?.data
        jobnumber.value = res.data?.data.jobnumber || {},
        supervisorName.value = res.data?.data.office_supervisor?.full_name
        clientSignature.value = res.data?.data.client_signature
    } catch (e) {
        timesheet.value = null
        ElMessage.error('Failed to load timesheet detail.')
    }
}

function formatDate(dt) {
    if (!dt) return ''
    return new Date(dt).toLocaleDateString('en-GB')
}
function formatTime(_, __, cellValue) {
    if (!cellValue) return ''
    const date = new Date(`2000-01-01T${cellValue}:00`)
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}
</script>

<style scoped>
.timesheet-detail-root {
    background: #fff;
    margin: 0;
    padding: 0;
}

#printMe,
.sheet-paper {
    width: 297mm;
    min-height: 210mm;
    max-width: 297mm;
    margin: 0 auto;
    box-sizing: border-box;
    background: #fff;
    padding: 18mm 10mm 12mm 10mm;
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

@media print {

    html,
    body,
    #app {
        background: #fff !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
    }

    #app> :not(#printMe) {
        display: none !important;
    }

    #printMe {
        display: block !important;
        width: 297mm !important;
        min-height: 210mm !important;
        max-width: 297mm !important;
        background: #fff !important;
        box-shadow: none !important;
        padding: 0 !important;
        position: static !important;
    }

    .sheet-paper {
        width: 100% !important;
        max-width: 297mm !important;
        min-height: 180mm !important;
        margin: 0 !important;
        padding: 18mm 10mm 12mm 10mm !important;
        background: #fff !important;
        border-radius: 0 !important;
        box-sizing: border-box !important;
        box-shadow: none !important;
    }

    header,
    nav,
    aside,
    .sidebar,
    .el-menu,
    .main-header,
    .main-sidebar,
    footer {
        display: none !important;
    }

    @page {
        size: A4;
        margin: 0;
    }
}
</style>
