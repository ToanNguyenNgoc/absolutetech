<template>
    <div class="users-page" v-loading="loading">
        <div class="current-menu">User</div>
        <div class="toolbar">
            <div class="button-group">

                <button class="btn btn-primary" @click="handleSyncUsers">
                    <img src="@/assets/img/ic-add.svg" alt="Import" class="btn-icon" />
                    Sync HIK
                </button>
                <button class="btn btn-primary" @click="handleAddUser">
                    <img src="@/assets/img/ic-add.svg" alt="Import" class="btn-icon" />
                    Add User
                </button>

                <button class="btn btn-outlined" @click="handleImport">
                    <img src="@/assets/img/ic-import.svg" alt="Import" class="btn-icon" />
                    Import
                </button>

                <button class="btn btn-outlined" @click="handleExport">
                    <img src="@/assets/img/ic-export.svg" alt="Export" class="btn-icon" />
                    Export
                </button>
            </div>
        </div>

        <UserTable ref="userTableRef" />
        <AddUserModal ref="addUserRef" :refreshUser="refreshUserTable" />
        <ImportModal v-model="showImport" @importSuccess="onImportSuccess" />

    </div>
</template>

<script>
import { exportUsers, syncHik } from '@/api/user';
import ImportModal from '@/components/common/ImportModal.vue';
import AddUserModal from '@/components/user/AddUserModal.vue';
import UserTable from '@/components/user/UserTable.vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
export default {
    name: 'UsersView',
    components: { UserTable, AddUserModal, ImportModal },
    setup() {
        const loading = ref(false); // ✅ Thêm biến loading
        const userTableRef = ref(null);
        const addUserRef = ref(null);
        const handleImport = () => {
            showImport.value = true;
            console.log('Import clicked');
        };
        const showImport = ref(false);

        const handleAddUser = () => {
            if (addUserRef.value && addUserRef.value.setShowDialog) {
                addUserRef.value.setShowDialog(true);
            }

        };

        const handleSyncUsers = async () => {
            try {
                loading.value = true; // 🔄 Bật loading
                await syncHik();
                refreshUserTable();
                ElMessage.success('Sync HIK successfully!'); // ✅ Hiển thị message success
            } catch (error) {
                console.error('Sync HIK error:', error);
                ElMessage.error('Sync HIK failed!'); // ❌ Hiển thị message error
            } finally {
                loading.value = false; // ❌ Tắt loading dù có lỗi hay không
            }
        };

        const refreshUserTable = () => {
            if (userTableRef.value && userTableRef.value.fetchData) {
                userTableRef.value.fetchData(true);
            }
        };

        const handleExport = async () => {
            try {
                const response = await exportUsers();
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const date = new Date().toISOString().slice(0, 10);
                const filename = `users-${date}.csv`;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Export error:', error);
            }
        };

        function onImportSuccess() {
            refreshUserTable()
        }

        return {
            loading, // ✅ Trả loading ra template
            userTableRef,
            addUserRef,
            showImport,
            handleAddUser,
            handleImport,
            handleExport,
            refreshUserTable,
            onImportSuccess,
            handleSyncUsers
        };
    },
};
</script>

<style scoped>
.users-page {
    padding: 16px;
    border-radius: 4px;
}

.toolbar {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.button-group {
    display: flex;
    gap: 16px;
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

.btn-primary {
    color: #fff;
    background-color: #0080F6;
}

.btn-outlined {
    background-color: #fff;
    border: 1px solid #0080F6;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-outlined:hover {
    background-color: #f0f8ff;
}

.current-menu {
    display: none;
}

@media (max-width: 1024px) {
    .current-menu {
        display: block;
        text-align: center;
        padding: 24px 0;
    }
}

@media (max-width: 767px) {
    .current-menu {
        display: block;
        text-align: center;
        padding: 24px 0;
    }
}
</style>