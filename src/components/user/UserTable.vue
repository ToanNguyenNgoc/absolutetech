<template>
    <div :class="{
        'admin-layout-expanded': isExpanded,
        'admin-layout-close': !isExpanded
    }">
        <el-table v-loading="loading" :data="tableData" class="custom-table" border style="margin-top: 16px;"
            :fit="true" ref="tableRef">
            <el-table-column type="index" label="No." width="57" />
            <el-table-column prop="fullName" label="Full Name" />
            <el-table-column prop="username" label="Username" />
            <el-table-column prop="employeeID" label="EmployeeID" />
            <el-table-column prop="role" label="Role" />
            <el-table-column label="Action">
                <template #default="{ row }">
                    <div class="action-buttons" v-if="toRaw(row)?._id !== userInfo?._id">
                        <img src="@/assets/img/finger-ic.svg" alt="finger" @click="handleShowFingerModal(row)" />
                        <img src="@/assets/icon-edit.svg" alt="edit" @click="handleEdit(row)" />
                        <img src="@/assets/icon-delete.svg" alt="edit" @click="handleDelete(row)" />
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="pagination-wrapper">
        <span class="total-text">Page {{ currentPage }} of {{ totalPages }}</span>
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalItems" layout="prev, pager, next"
            class="no-bg-pagination" @current-change="page => handleCurrentChange(page)"
            @size-change="size => handleSizeChange(size)" />
    </div>
    <AddUserModal ref="addUserRef" :refreshUser="fetchData" />
    <MyMessage :message="messageText" :type="messageType" />
    <FingerScanModal v-model:visible="showFingerModal" :scannedFingers="currentSelectedFingers" />
</template>

<script>
import { deleteUser, getUsers } from '@/api/user';
import { inject, onMounted, ref, toRaw, computed } from 'vue';
import AddUserModal from './AddUserModal.vue';
import { ElMessageBox } from 'element-plus';
import MyMessage from '../common/MyMessage.vue';
import { globalState } from "@/store/globalState";
import FingerScanModal from '../common/FingerScanModal.vue';

export default {
    name: 'UserTable',
    components: { AddUserModal, MyMessage, FingerScanModal },
    setup() {
        const loading = ref(false);
        const tableData = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(10);
        const totalItems = ref(0);
        const totalPages = ref(0);
        const addUserRef = ref(null);
        const tableRef = ref(null);
        const isExpanded = inject('isExpanded');
        const messageText = ref('')
        const messageType = ref('success')
        const showFingerModal = ref(false)
        const currentSelectedFingers = ref([])
        const FINGER_FIELDS_MAP = {
            left_thumb: 'Left thumb',
            left_index: 'Left index finger',
            left_middle: 'Left middle finger',
            left_ring: 'Left ring finger',
            left_pinkie: 'Left pinkie',
            right_thumb: 'Right thumb',
            right_index: 'Right index finger',
            right_middle: 'Right middle finger',
            right_ring: 'Right ring finger',
            right_pinkie: 'Right pinkie',
        }

        onMounted(() => {
            fetchData();
        });
        const userInfo = computed(() => globalState.userInfo);


        const fetchData = async (isAdd = false) => {
            loading.value = true;
            try {
                if (isAdd) {
                    currentPage.value = totalPages.value > 0 ? totalPages.value : 1;
                }
                const res = await getUsers(currentPage.value, pageSize.value);
                tableData.value = res.data.data.list;
                totalItems.value = res.data.data.total;
                totalPages.value = res.data.data.totalPages;

            } catch (error) {
                console.error('fetchData error:', error);
            } finally {
                loading.value = false;
            }
        };

        const handleSizeChange = (newSize) => {
            pageSize.value = newSize;
            fetchData();
        };

        const handleCurrentChange = (newPage) => {
            currentPage.value = newPage;
            fetchData();
        };

        const handleEdit = (row) => {
            console.log('Edit:', toRaw(row)); // row là một reactive proxy
            const plainRow = toRaw(row);
            if (addUserRef.value && addUserRef.value.setUser) {
                addUserRef.value.setUser(plainRow);
            }
        };

        const handleDelete = async (row) => {
            messageText.value = ''
            messageType.value = ''
            ElMessageBox.confirm(
                '<p>Do you want to delete this user?</p> All related data will also be deleted.',
                'Delete User',
                {
                    confirmButtonText: 'Remove',
                    cancelButtonText: 'Cancel',
                    customClass: 'delete-confirm-box',
                    dangerouslyUseHTMLString: true,
                }
            )
                .then(async () => {
                    await deleteUser(row._id);
                    messageText.value = 'Delete Successfully'
                    messageType.value = 'success'
                    fetchData();
                })
                .catch(() => {
                })

        };

        const handleShowFingerModal = (row) => {
            currentSelectedFingers.value = Object.entries(FINGER_FIELDS_MAP)
                .filter(([field]) => row[field])
                .map(([, label]) => label)
            // const plainRow = toRaw(row);
            console.log('Scanned Fingers:', currentSelectedFingers.value) // ✅ Log tại đây kiểm tra đúng data
            showFingerModal.value = true
        }

        return {
            loading,
            tableData,
            currentPage,
            pageSize,
            totalItems,
            totalPages,
            messageText,
            messageType,
            handleSizeChange,
            handleCurrentChange,
            fetchData,
            handleEdit,
            addUserRef,
            handleDelete,
            tableRef,
            isExpanded,
            userInfo,
            toRaw,
            handleShowFingerModal,
            showFingerModal,
            currentSelectedFingers,
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

.action-buttons {
    display: flex;
    gap: 24px;
    cursor: pointer;
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
    color: #6D6E71;
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

.pagination-container {
    margin-top: 16px;
    text-align: right;
}

.el-form-item {
    margin-bottom: 16px;
}
</style>