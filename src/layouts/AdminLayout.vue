<template>
    <div class="admin-layout">
        <!-- HEADER -->
        <header class="admin-header">
            <!-- Logo Left -->
            <router-link class="menu-link" to="/">
                <div class="header-left">
                    <img class="logo-img" src="@/assets/logo.png" alt="Logo" />
                </div>
            </router-link>

            <div class="hamburger" @click="toggleDrawer">
                <img class="logo-img" src="@/assets/img/icon-menu.svg" alt="Logo" />
            </div>

            <!-- Avatar & Dropdown Right -->
            <div class="header-right" @click="toggleDropdown" ref="avatarArea">
                <img class="avatar-img"
                    :src="userInfo?.avatar ? baseURL + '/' + userInfo.avatar : require('@/assets/img/avt-default.png')"
                    alt="Logo" />

                <!-- Dropdown user info -->
                <transition name="fade">
                    <div v-if="showDropdown" class="dropdown-menu">
                        <ul>
                            <li>
                                <img src="@/assets/icon-user.svg" alt="">
                                <span class="avatar-name">{{ userInfo?.full_name }}</span>
                            </li>
                            <li>
                                <img src="@/assets/icon-information.svg" alt="">
                                <span class="avatar-name" @click="openChangePasswordModal">Change Password</span>
                            </li>
                        </ul>
                        <hr>
                        <ul>
                            <li @click="handleLogout">
                                <img src="@/assets/icon-logout.png" alt="">
                                <span class="avatar-name">Logout</span>
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>
        </header>

        <!-- MAIN -->
        <div class="admin-main">
            <!-- SIDEBAR (MENU) - Hiển thị khi desktop -->
            <aside :class="['admin-menu', { collapsed: !isExpanded }]" v-show="!isMobileOrTablet">
                <div class="menu-toggle" @click="toggleMenu">
                    <img class="negative" src="@/assets/negative.png" alt="negative" />
                </div>

                <nav class="menu-nav">
                    <ul class="menu-list">
                        <li>
                            <router-link class="menu-link" to="/admin/job-number">
                                <img src="@/assets/img/icon-job-number.svg" alt="Job Number"
                                    v-if="!isRouteActive('admin-job-number')" />
                                <img src="@/assets/img/icon-job-number-active.svg" alt="Job Number"
                                    v-if="isRouteActive('admin-job-number')" />
                                <span class="icon-menu-expand" v-show="isExpanded">Job Number</span>
                            </router-link>
                        </li>
                        <!-- Open Timesheets -->
                        <li>
                            <router-link class="menu-link" to="/admin/open-timesheets">
                                <img src="@/assets/img/icon-open-timesheets.svg" alt="Open"
                                    v-if="!isRouteActive('admin-open-timesheets')" />
                                <img src="@/assets/img/icon-open-timesheets-active.svg" alt="Open"
                                    v-if="isRouteActive('admin-open-timesheets')" />
                                <span class="icon-menu-expand" v-show="isExpanded">Open Timesheets</span>
                            </router-link>
                        </li>
                        <!-- Close Timesheets -->
                        <li>
                            <router-link class="menu-link" to="/admin/close-timesheets">
                                <img src="@/assets/img/close-time-sheets.svg" alt="Close"
                                    v-if="!isRouteActive('admin-close-timesheets')" />
                                <img src="@/assets/img/close-time-sheets-active.svg" alt="Close"
                                    v-if="isRouteActive('admin-close-timesheets')" />
                                <span class="icon-menu-expand" v-show="isExpanded">Close Timesheets</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link class="menu-link" to="/admin/users">
                                <img src="@/assets/admin.png" alt="User" v-if="!isRouteActive('admin-users')" />
                                <img src="@/assets/admin-active.svg" alt="User" v-if="isRouteActive('admin-users')" />
                                <span class="icon-menu-expand" v-show="isExpanded">Users</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link class="menu-link" to="/admin/entry-logs">
                                <img src="@/assets/entry-log.svg" alt="Entry Log"
                                    v-if="!isRouteActive('admin-entry-logs')" />
                                <img src="@/assets/entry-log-active.svg" alt="Entry Log"
                                    v-if="isRouteActive('admin-entry-logs')" />
                                <span class="icon-menu-expand" v-show="isExpanded">Entry Logs</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link class="menu-link" to="/admin/warehouse">
                                <img src="@/assets/img/warehouse.svg" alt="warehouse"
                                    v-if="!isRouteActive('warehouse')" />
                                <img src="@/assets/img/warehouse-active.svg" alt="warehouse"
                                    v-if="isRouteActive('warehouse')" />
                                <span class="icon-menu-expand" v-show="isExpanded">Warehouse</span>
                            </router-link>
                        </li>
                        <!-- <li>
                            <a class="menu-link" @click="redirectToSourceB">
                                <img src="@/assets/img/warehouse.svg" alt="warehouse"
                                    v-if="!isRouteActive('admin-warehouse')" />
                                <img src="@/assets/img/warehouse-active.svg" alt="warehouse"
                                    v-if="isRouteActive('admin-warehouse')" />
                                <span class="icon-menu-expand" v-show="isExpanded">Warehouse</span>
                            </a>
                        </li> -->
                    </ul>
                    <ul>
                        <li class="bottom-link">
                            <router-link class="menu-link" to="/">
                                <img src="@/assets/icon-home.svg" alt="Home" />
                                <span class="icon-menu-expand" v-show="isExpanded">Back to home</span>
                            </router-link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- MAIN CONTENT -->
            <div class="main-container">
                <section class="admin-content">
                    <router-view />
                </section>
                <footer class="admin-footer">
                    Powered by Absolutech-Auth
                </footer>
            </div>
        </div>

        <el-drawer v-model="isDrawerOpen" direction="rtl" :with-header="false" modal-class="drawer-mobile"
            custom-class="mobile-drawer" :modal-append-to-body="false">
            <div class="drawer-header">
                <img class="chevron-right" src="@/assets/img/chevron-right.svg" alt="Logo" @click="closeDrawer" />
            </div>

            <nav class="drawer-menu-nav">
                <ul class="drawer-menu-list-mobile">
                    <li>
                        <router-link class="menu-link" to="/admin/job-number">
                            <img src="@/assets/img/icon-job-number.svg" alt="Job Number"
                                v-if="!isRouteActive('admin-job-number')" />
                            <img src="@/assets/img/icon-job-number-active.svg" alt="Job Number"
                                v-if="isRouteActive('admin-job-number')" />
                            <span class="icon-menu-expand" v-show="isExpanded">Job Number</span>
                        </router-link>
                    </li>
                    <!-- Open Timesheets -->
                    <li>
                        <router-link class="menu-link" to="/admin/open-timesheets">
                            <img src="@/assets/img/icon-open-timesheets.svg" alt="Open"
                                v-if="!isRouteActive('admin-open-timesheets')" />
                            <img src="@/assets/img/icon-open-timesheets-active.svg" alt="Open"
                                v-if="isRouteActive('admin-open-timesheets')" />
                            <span class="icon-menu-expand" v-show="isExpanded">Open Timesheets</span>
                        </router-link>
                    </li>
                    <!-- Close Timesheets -->
                    <li>
                        <router-link class="menu-link" to="/admin/close-timesheets">
                            <img src="@/assets/img/close-time-sheets.svg" alt="Close"
                                v-if="!isRouteActive('admin-close-timesheets')" />
                            <img src="@/assets/img/close-time-sheets-active.svg" alt="Close"
                                v-if="isRouteActive('admin-close-timesheets')" />
                            <span class="icon-menu-expand" v-show="isExpanded">Close Timesheets</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link class="drawer-menu-link" to="/admin/users" @click="closeDrawer">
                            <img src="@/assets/admin.png" alt="User" v-if="!isRouteActive('admin-users')" />
                            <img src="@/assets/admin-active.svg" alt="User" v-else />
                            <span>Users</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link class="drawer-menu-link" to="/admin/entry-logs" @click="closeDrawer">
                            <img src="@/assets/entry-log.svg" alt="Entry Log"
                                v-if="!isRouteActive('admin-entry-logs')" />
                            <img src="@/assets/entry-log-active.svg" alt="Entry Log" v-else />
                            <span>Entry Logs</span>
                        </router-link>
                    </li>
                    <li>
                        <a class="menu-link" @click="redirectToSourceB">
                            <img src="@/assets/img/warehouse.svg" alt="Warehouse" />
                            <span class="icon-menu-expand" v-show="isExpanded">Warehouse</span>
                        </a>
                    </li>
                </ul>

                <div class="drawer-user-info-mobile">
                    <div class="drawer-user-info-mobile__block-top">
                        <div class="drawer-user-info-mobile__top">
                            <div class="drawer-user-info-mobile__left">
                                <img class="avt-mobile"
                                    :src="userInfo?.avatar ? baseURL + '/' + userInfo.avatar : require('@/assets/img/avt-default.png')"
                                    alt="Logo" />
                                <p>{{ userInfo?.full_name }}</p>
                            </div>
                            <div class="drawer-user-info-mobile__right" @click="openChangePasswordModal">
                                Change Password
                            </div>
                        </div>
                        <div @click="handleLogout" class="drawer-user-info-mobile__logout">
                            <span class="avatar-name">
                                <img src="@/assets/img/icon-logout-mobile.svg" style="width: 16px; height: 16px;"
                                    alt="">
                                Logout
                            </span>
                        </div>
                    </div>
                    <ul>
                        <li class="bottom-link">
                            <router-link class="drawer-menu-link" to="/" @click="closeDrawer">
                                <img src="@/assets/icon-home.svg" alt="Home" />
                                <span>Back to home</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </el-drawer>
    </div>
    <change-password-modal :visible="isChangePasswordModalVisible"
        @update:visible="isChangePasswordModalVisible = $event" />
</template>

<script>
import { getSSOToken, info } from '@/api';
import { baseURL } from '@/constant/common';
import { setCookie } from '@/utils/cookie';
import { computed } from 'vue';
import { globalState } from "@/store/globalState";
import ChangePasswordModal from '@/components/common/ChangePasswordModal.vue';

export default {
    name: 'AdminLayout',
    components: {
        ChangePasswordModal,
    },
    data() {
        return {
            isExpanded: false,       // sidebar desktop
            showDropdown: false,
            isDrawerOpen: false,     // drawer mobile
            isMobileOrTablet: false,
            baseURL: baseURL,
            isChangePasswordModalVisible: false
        };
    },
    computed: {
        isExpandedProvide() {
            return this.isExpanded;
        },
        userInfo() {
            return globalState.userInfo;
        }
    },
    provide() {
        return {
            isExpanded: computed(() => this.isExpanded),
        };
    },
    methods: {
        toggleMenu() {
            this.isExpanded = !this.isExpanded;
        },
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        handleLogout() {
            setCookie('access_token', '', 0);
            this.$router.push('/login');
        },
        isRouteActive(routeName) {
            return this.$route.name === routeName;
        },
        handleClickOutside(e) {
            if (this.$refs.avatarArea && !this.$refs.avatarArea.contains(e.target)) {
                this.showDropdown = false;
            }
        },
        toggleDrawer() {
            this.isDrawerOpen = !this.isDrawerOpen;
        },
        closeDrawer() {
            this.isDrawerOpen = false;
        },
        checkDeviceSize() {
            this.isMobileOrTablet = window.innerWidth <= 1024;
        },

        openChangePasswordModal() {
            console.log('open change password modal');
            this.isChangePasswordModalVisible = true
        },

        async fetchUserInfo() {
            try {
                const response = await info();
                globalState.setUser(response.data.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        },

        async redirectToSourceB() {
            try {
                const response = await getSSOToken();
                const token = response?.data?.data?.token;
                const targetUrl = `${process.env.VUE_APP_SOURCE_WAREHOUSE_URL}/login?token=${token}`;
                window.open(targetUrl, "_blank");
            } catch (error) {
                console.error("Failed to redirect to Source B:", error);
                this.$message.error("Cannot redirect to Warehouse login.");
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        window.addEventListener('resize', this.checkDeviceSize);
        this.checkDeviceSize();
        this.fetchUserInfo();
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
        window.removeEventListener('resize', this.checkDeviceSize);
    },
};
</script>

<style scoped>
.avatar-name {
    white-space: nowrap;
}

.drawer-user-info-mobile__block-top {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: #fff;
    width: 194px;
    margin: 0 auto;
}

.drawer-user-info-mobile__block-top .avt-mobile {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #D7D7D7;
}

.drawer-user-info-mobile__top {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background: #454545;
    height: 100px;
    padding: 16px 13px 0 10px;

}

.drawer-user-info-mobile__left {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 9px;
    border-bottom: 1px soild #ECECEC;
    border-bottom: 1px gray solid;
}

.drawer-user-info-mobile__left .p {
    color: #F2F2F2;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.drawer-user-info-mobile__right {
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: -0.176px;
    padding-top: 8px;
}

.drawer-user-info-mobile__logout span {
    display: flex;
    border-radius: 8px;
    background: #454545;
    height: 36px;
    color: #FFF;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.154px;
    text-align: center;
    margin-bottom: 50px;
    align-items: center;
    justify-content: center;
    gap: 9px;
}

.drawer-menu-nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
}

:deep(.el-drawer) {
    background-color: #1C1D27;
    overflow: unset;
}

:deep(.el-drawer__body) {
    padding: 0;
}

.drawer-header {
    position: absolute;
    left: -36px;
}

.drawer-header .chevron-right {
    width: 40px;
    height: 40px;
    background: #0080F6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* =========== HEADER =========== */
.admin-header {
    height: 60px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    background-image: url('@/assets/icon-bg-overlay.png');
    background-repeat: no-repeat;
    background-position: right center;
}

.header-left .logo-img {
    height: 40px;
}


.hamburger {
    display: none;
    font-size: 20px;
    color: #333;
    cursor: pointer;
}

.header-right {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
}

.avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
}

.avatar-name {
    margin-right: 4px;
}

.dropdown-menu {
    position: absolute;
    top: 60px;
    right: 0;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 140px;
    z-index: 10;
    width: 188px;
}

.dropdown-menu ul {
    list-style: none;
    margin: 0;
    padding: 8px 0;
}

.dropdown-menu li {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
}

.dropdown-menu img {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.dropdown-menu li:hover {
    background-color: #CFECF9;
}

/* =========== MAIN =========== */
.admin-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.admin-main {
    display: flex;
    flex: 1;
}

.main-container {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.admin-content {
    flex: 1;
    padding: 20px;
    background-color: #f8f8f8;
    background-image: url('@/assets/icon-bg-overlay.png');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: contain;
}

.admin-footer {
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    background: var(--DRK-Lightest-grey, #F3F3F3);
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 26px;
}

/* =========== SIDEBAR =========== */
.admin-menu {
    width: 220px;
    background-color: #1A1A1A;
    color: #fff;
    position: relative;
    display: flex;
    flex-direction: column;
}

.admin-menu.collapsed {
    width: 80px;
}

.menu-toggle {
    cursor: pointer;
    text-align: right;
    color: #fff;
    position: absolute;
    right: -13px;
    top: 10px;
}

.menu-nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 220px;
}

.menu-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu-link {
    display: flex;
    align-items: center;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    gap: 8px;
    padding: 8px 26px 8px 22px;
    border-left: 4px solid transparent;
}

.menu-link.router-link-active {
    border-left: 4px solid #0080F6;
    background: linear-gradient(90deg, rgba(0, 128, 246, 0.20) -5.62%, rgba(255, 255, 255, 0.00) 100%);
}

.menu-link.router-link-active span {
    color: #0080F6;
}

.menu-nav li a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.menu-nav li a i {
    margin-right: 8px;
}

.menu-nav img {
    width: 32px;
    height: 32px;
}

.menu-list {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 220px;
}

.bottom-link {
    margin-top: auto;
}

/* =========== DRAWER (Element Plus) =========== */
.mobile-drawer {
    width: 240px !important;
    background-color: #1A1A1A;
    color: #fff;
}

.drawer-menu-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.drawer-menu-list {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;
}

.drawer-menu-link {
    display: flex;
    align-items: center;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    gap: 8px;
    padding: 12px 20px;
    border-left: 4px solid transparent;
}

.drawer-menu-link.router-link-active {
    border-left: 4px solid #0080F6;
    background: linear-gradient(90deg, rgba(0, 128, 246, 0.20) -5.62%, rgba(255, 255, 255, 0.00) 100%);
}

/* =========== RESPONSIVE =========== */
@media (max-width: 1024px) {

    .admin-menu {
        display: none;
    }

    .header-right {
        display: none;
    }

    .hamburger {
        display: block;
    }

    .drawer-menu-list-mobile {
        padding-top: 88px !important;
    }

    .drawer-user-info-mobile {
        padding-bottom: 12px !important;
    }

    .admin-layout {
        height: unset;
        min-height: 100vh;
    }
}

@media (max-width: 767px) {
    :deep(.el-drawer) {
        width: 226px !important;
    }

    :deep(.bottom-link) {
        padding: 0;
    }

    .admin-content {
        padding: unset;
    }

    .users-page {
        padding: unset;
    }

    .admin-layout {
        height: unset;
        min-height: 100vh;
    }
}

.mobile-drawer {
    width: 240px !important;
    background-color: #1A1A1A;
    color: #fff;
    display: flex;
    flex-direction: column;
}

.drawer-header {
    display: flex;
    justify-content: flex-start;
    padding: 16px;
}

.drawer-header i {
    font-size: 24px;
    color: #fff;
    cursor: pointer;
}

.drawer-menu-nav {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.drawer-menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.drawer-menu-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    text-decoration: none;
    padding: 12px 20px;
    border-left: 4px solid transparent;
}

.drawer-menu-link.router-link-active {
    border-left: 4px solid #0080F6;
    background: linear-gradient(90deg, rgba(0, 128, 246, 0.20) -5.62%, rgba(255, 255, 255, 0.00) 100%);
}

.drawer-user-info {
    margin-top: 16px;
    padding: 0 20px;
}

.drawer-user-info .avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-bottom: 12px;
}

.drawer-user-info ul {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-bottom: 16px;
}

.drawer-user-info li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    cursor: pointer;
}

.icon-menu-expand {
    white-space: nowrap;
}
</style>