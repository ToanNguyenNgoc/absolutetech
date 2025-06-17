<template>
    <div :class="{ 'admin-layout-expanded': isExpanded, 'admin-layout-close': !isExpanded }">
        <div class="table-toolbar button-group">
            <el-input v-model="searchTerm" placeholder="Search" prefix-icon="el-icon-search" clearable
                @input="handleSearchInput" class="search-input" />
            <button class="btn btn-primary" @click="handleCreateJobNumber">
                <img src="@/assets/img/ic-add.svg" alt="New JN" class="btn-icon" />
                New JN
            </button>
        </div>

        <el-table v-loading="loading" :data="tableData" class="custom-table" border style="margin-top: 16px;">
            <el-table-column type="index" label="No." width="57" />
            <el-table-column prop="code" label="JN" />
            <el-table-column label="Client">
                <template #default="{ row }">
                    {{ row.assignedTo?.fullName || 'N/A' }}
                </template>
            </el-table-column>
            <el-table-column prop="project" label="Project" />
            <el-table-column prop="estStartDate" label="Est. Start Date">
                <template #default="{ row }">
                    {{ formatDate(row.estStartDate) }}
                </template>
            </el-table-column>
            <el-table-column prop="estEndDate" label="Est. End Date">
                <template #default="{ row }">
                    {{ formatDate(row.estEndDate) }}
                </template>
            </el-table-column>

            <el-table-column label="Action" width="160">
                <template #default="{ row, $index }">
                    <div class="action-buttons">
                        <img src="@/assets/icon-edit.svg" alt="edit" @click="handleEdit(row)" />
                        <img src="@/assets/icon-delete.svg" alt="delete" @click="handleDelete(row)" />
                        <img src="@/assets/icon-copy.svg" alt="duplicate" @click="handleDuplicate(row)" />
                        <template v-if="row._isNew">
                            <button class="btn-save" @click="handleSaveNewRow(row, $index)">Save</button>
                        </template>
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

<script>
import { ref, onMounted, inject } from 'vue';
import { getJobNumbers, deleteJobNumber, createJobNumber } from '@/api/jobnumber';
import { ElMessageBox, ElMessage } from 'element-plus';
import debounce from 'lodash/debounce';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/common';

export default {
    name: 'JobNumberTable',
    setup() {
        const router = useRouter();
        const loading = ref(false);
        const tableData = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(10);
        const totalItems = ref(0);
        const totalPages = ref(0);
        const isExpanded = inject('isExpanded');
        const searchTerm = ref('');
        const rawList = ref([]);

        const fetchData = async () => {
            loading.value = true;
            try {
                const res = await getJobNumbers(currentPage.value, pageSize.value);
                const apiData = res.data.data;
                tableData.value = apiData.list;
                rawList.value = apiData.list;
                totalItems.value = apiData.total;
                totalPages.value = apiData.totalPages;
            } catch (error) {
                console.error('Fetch error:', error);
                ElMessage.error('Failed to load data.');
            } finally {
                loading.value = false;
            }
        };

        const handleCreateJobNumber = () => {
            router.push('/admin/job-number/create');
        };

        const handleEdit = (row) => {
            router.push(`/admin/job-number/${row._id}/edit`);
        };

        const handleDelete = (row) => {
            ElMessageBox.confirm(
                'Do you want to delete this Job Number?',
                'Delete Job Number',
                {
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            ).then(async () => {
                try {
                    await deleteJobNumber(row._id);
                    ElMessage.success('Deleted');
                    fetchData();
                } catch {
                    ElMessage.error('Delete failed');
                }
            });
        };

        const handleDuplicate = (row) => {
            const cloned = { ...row, _isNew: true, _id: undefined };
            tableData.value.push(cloned);
        };

        const handleSaveNewRow = async (row) => {
            try {
                const payload = {
                    code: row.code,
                    project: row.project,
                    estStartDate: row.estStartDate,
                    estEndDate: row.estEndDate,
                    // add client_id or assignedTo if needed
                };
                await createJobNumber(payload);
                ElMessage.success('Saved successfully');
                fetchData();
            } catch (err) {
                ElMessage.error('Save failed');
                console.error(err);
            }
        };

        const handleSearchInput = debounce(() => {
            // Optional: update this to call API if backend supports filtering
            const term = searchTerm.value.toLowerCase();
            if (term === '') {
                tableData.value = rawList.value;
                return;
            }
            tableData.value = rawList.value.filter((item) => {
                return (
                    item.code?.toLowerCase().includes(term) ||
                    item.project?.toLowerCase().includes(term) ||
                    item.assignedTo?.fullName?.toLowerCase().includes(term)
                );
            });
        }, 500);

        const handleCurrentChange = (page) => {
            currentPage.value = page;
            fetchData();
        };

        onMounted(fetchData);

        return {
            loading,
            tableData,
            currentPage,
            pageSize,
            totalItems,
            totalPages,
            isExpanded,
            searchTerm,
            handleCreateJobNumber,
            handleEdit,
            handleDelete,
            handleDuplicate,
            handleSaveNewRow,
            handleSearchInput,
            handleCurrentChange,
            formatDate,
        };
    },
};
</script>

<style scoped>
.admin-layout-expanded {
    width: calc(100vw - 276px);
}

.admin-layout-close {
    width: calc(100vw - 150px);
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.search-input {
    max-width: 260px;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}

.btn-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

.btn-primary {
    color: #fff;
    background-color: #0080f6;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-save {
    padding: 4px 10px;
    background-color: #2ecc71;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    cursor: pointer;
}

.action-buttons {
    display: flex;
    gap: 16px;
    align-items: center;
}

.pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    background-color: #f2f2f2;
    position: relative;
}

.total-text {
    position: absolute;
    left: 36px;
    font-size: 14px;
    color: #6d6e71;
}
</style>
