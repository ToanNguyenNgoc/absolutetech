<template>
    <div class="open-timesheet-table">
        <div class="table-toolbar">
            <el-input v-model="searchTerm" placeholder="Search" prefix-icon="el-icon-search" clearable
                @input="handleSearchInput" class="search-input" />
        </div>
        <el-table v-loading="loading" :data="tableData" class="custom-table" border style="margin-top: 16px;">
            <el-table-column type="index" label="No." width="57" />
            <el-table-column prop="jobnumber.code" label="JN" />
            <el-table-column prop="jobnumber.client" label="Client" />
            <el-table-column prop="jobnumber.project" label="Project" />
            <el-table-column label="Action" width="150">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <img src="@/assets/icon-edit.svg" alt="edit" @click="handleView(row)" />
                        <img src="@/assets/icon-print.svg" alt="print" @click="handlePrint(row)" />
                        <img src="@/assets/icon-download.svg" alt="download" @click="handleApprove(row)" />
                    </div>
                </template>
            </el-table-column>
        </el-table>


        <div class="pagination-wrapper">
            <span class="total-text">Page {{ currentPage }} of {{ totalPages }}</span>
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalItems"
                layout="prev, pager, next" class="no-bg-pagination" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
// API: getTimesheets(page, limit, searchTerm)
import { getTimesheets } from '@/api/timesheet'; // tự viết hoặc mock
import debounce from 'lodash/debounce';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const tableData = ref([]);
const rawList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);
const searchTerm = ref('');

const fetchData = async () => {
    loading.value = true;
    try {
        // Gọi API get timesheet
        const res = await getTimesheets(currentPage.value, pageSize.value, searchTerm.value);
        const apiData = res.data.data || res.data;
        tableData.value = apiData.items;
        rawList.value = apiData.items;
        totalItems.value = apiData.total;
        totalPages.value = apiData.totalPages;
    } catch (error) {
        ElMessage.error('Failed to load timesheet data.');
    } finally {
        loading.value = false;
    }
};

const handleView = (row) => {
    router.push(`/admin/open-timesheets/${row.id}`);
};
const handlePrint = (row) => {
    // TODO: trigger print (in PDF, hoặc chuyển sang trang print)
    ElMessage.info(`Print timesheet ${row.jobnumber.code}`);
};
const handleApprove = (row) => {
    // TODO: trigger approve API, nếu row.status == 'open'
    ElMessage.success(`Approved timesheet ${row.jobnumber.code}`);
    // Xong gọi lại fetchData();
};
const handleCurrentChange = (page) => {
    currentPage.value = page;
    fetchData();
};
const handleSearchInput = debounce(() => {
    currentPage.value = 1;
    fetchData();
}, 400);

onMounted(fetchData);
</script>

<style scoped>
.open-timesheet-table {
    padding: 24px;
}

.table-toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 16px;
}

.action-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
}

.pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    background-color: #f2f2f2;
    position: relative;
    min-height: 40px;
}

.total-text {
    position: absolute;
    left: 24px;
    font-size: 14px;
    color: #6d6e71;
}
</style>
