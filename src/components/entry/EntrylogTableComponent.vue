<template>
    <div class="entry-logs-page">
        <div class="top-bar">
            <div class="search-wrapper">
                <div class="search-box">
                    <el-input v-model="searchText" placeholder="Search..." clearable prefix-icon="el-icon-search"
                        class="search-input" @keyup.enter="forceSearch" />

                    <img src="@/assets/img/icon-search.svg" alt="">
                </div>
            </div>
            <button class="btn btn-outlined" @click="handleExport">
                <img src="@/assets/img/ic-export.svg" alt="Export" class="btn-icon" />
                Export
            </button>
        </div>

        <div :class="{
            'admin-layout-expanded': isExpanded,
            'admin-layout-close': !isExpanded
        }">
            <el-table v-loading="loading" :data="tableData" class="custom-table" border style="margin-top: 16px;">
                <el-table-column type="index" label="No." width="60" />
                <el-table-column prop="user.employee_id" label="employee_id" />
                <el-table-column prop="user.full_name" label="Full Name" />
                <el-table-column prop="user.username" label="Username" />
                <el-table-column prop="user.position" label="Dept" />
                <el-table-column prop="date" label="Date" :formatter="formatDate" />
                <el-table-column prop="time_in" label="Time In" :formatter="formatTime" />
                <el-table-column prop="time_out" label="Time Out" :formatter="formatTime" />
                <el-table-column prop="duration" label="Duration" />
            </el-table>
        </div>

        <div class="pagination-wrapper">
            <span class="total-text">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalItems"
                layout="prev, pager, next" class="no-bg-pagination" @current-change="handleCurrentChange"
                @size-change="handleSizeChange" />
        </div>
    </div>
</template>

<script>
import { getEntryLogs, getEntryLogsExport } from '@/api/entryLogs';
import { dayjs } from 'element-plus';
import { ref, onMounted, inject, watch } from 'vue';

export default {
    name: 'EntrylogTableComponent',
    setup() {
        const loading = ref(false);
        const tableData = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(10);
        const totalItems = ref(0);
        const totalPages = ref(0);
        const searchText = ref('');
        const isExpanded = inject('isExpanded');

        let searchtime_out = null;


        const fetchData = async () => {
            loading.value = true;
            try {
                const res = await getEntryLogs(currentPage.value, pageSize.value, searchText.value);
                const { list, total, totalPages: tp } = res.data.data;
                tableData.value = list;
                totalItems.value = total;
                totalPages.value = tp;
            } catch (error) {
                console.error('fetchData error:', error);
            } finally {
                loading.value = false;
            }
        };

        const handleSearch = () => {
            currentPage.value = 1;
            fetchData();
        };

        const handleCurrentChange = (newPage) => {
            currentPage.value = newPage;
            fetchData();
        };

        const handleSizeChange = (newSize) => {
            pageSize.value = newSize;
            fetchData();
        };

        const handleExport = async () => {
            try {
                const response = await getEntryLogsExport(searchText.value);
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const date = new Date().toISOString().slice(0, 10);
                const filename = `entry-logs-${date}.csv`;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Export error:', error);
            }
        };

        const forceSearch = () => {
            cleartime_out(searchtime_out);
            currentPage.value = 1;
            fetchData();
        };

        const formatDate = (row, column, cellValue) => {
            return dayjs(cellValue).format('DD/MM/YYYY');
        };

        const formatTime = (row, column, cellValue) => {
            return dayjs(cellValue).format('HH:mm');
        };

        onMounted(() => {
            fetchData();
        });

        watch(
            () => searchText.value,
            () => {
                cleartime_out(searchtime_out);
                searchtime_out = settime_out(() => {
                    currentPage.value = 1;
                    fetchData();
                }, 500);
            },
        );

        return {
            loading,
            tableData,
            currentPage,
            pageSize,
            totalItems,
            totalPages,
            searchText,
            isExpanded,
            fetchData,
            handleSearch,
            handleCurrentChange,
            handleSizeChange,
            handleExport,
            forceSearch,
            formatDate,
            formatTime,
        };
    },
};
</script>

<style scoped>
.search-box {
    display: flex;
    align-items: center;
}

.search-box img {
    position: relative;
    left: -30px;
}

/* .entry-logs-page {
    padding: 16px;
} */

.search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
}

.search-input {
    width: 240px;
}

.custom-table {
    width: 100%;
}

.pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    background-color: #f2f2f2;
    position: relative;
    margin-top: 16px;
}

.total-text {
    color: #6d6e71;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    position: absolute;
    left: 36px;
}

.no-bg-pagination :deep(.btn-prev),
.no-bg-pagination :deep(.btn-next),
.no-bg-pagination :deep(.el-pager li) {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

.admin-layout-expanded {
    width: calc(100vw - 276px);
}

.admin-layout-close {
    width: calc(100vw - 150px);
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

@media (max-width: 1024px) {
    .admin-layout-expanded {
        width: 100%;
    }

    .admin-layout-close {
        width: 100%;
    }

    .pagination-wrapper {
        justify-content: end !important;
    }
}

@media (max-width: 767px) {
    .admin-layout-expanded {
        width: 100%;
    }

    .admin-layout-close {
        width: 100vw;
    }

    :deep(.el-table .cell) {
        font-size: 10px;
        padding-left: 5px;
    }

    .pagination-wrapper {
        justify-content: end !important;
    }

    .entry-logs-page {
        padding: unset;
    }

    .total-text {
        left: 0px;
    }
}

:deep(.el-table__header thead th) {
    background-color: #f2f2f2;
    color: #171A26;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
}

:deep(.el-table__header td) {
    padding: 16px;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid transparent;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background-color: #fff;
}

.btn-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

.btn-outlined {
    background-color: #fff;
    border: 1px solid #0080F6;
}

.btn-outlined:hover {
    background-color: #f0f8ff;
}
</style>