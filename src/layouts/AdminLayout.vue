<template>
  <div class="admin-layout">
    <!-- HEADER -->
    <header class="admin-header">
      <router-link class="menu-link" to="/">
        <div class="header-left">
          <img class="logo-img" src="@/assets/logo.png" alt="Logo" />
        </div>
      </router-link>

      <div class="hamburger" @click="toggleDrawer">
        <img class="logo-img" src="@/assets/img/icon-menu.svg" alt="Menu" />
      </div>

      <!-- Avatar & Dropdown Right -->
      <div class="header-right" @click="toggleDropdown" ref="avatarArea">
        <img
          class="avatar-img"
          :src="userInfo?.avatar ? baseURL + '/' + userInfo.avatar : require('@/assets/img/avt-default.png')"
          alt="Avatar"
        />

        <transition name="fade">
          <div v-if="showDropdown" class="dropdown-menu">
            <ul>
              <li>
                <img src="@/assets/icon-user.svg" alt="">
                <span class="avatar-name">{{ userInfo?.full_name }}</span>
              </li>
              <li @click.stop="openChangePasswordModal">
                <img src="@/assets/icon-information.svg" alt="">
                <span class="avatar-name">Change Password</span>
              </li>
            </ul>
            <hr>
            <ul>
              <li @click.stop="handleLogout">
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
      <!-- SIDEBAR (MENU) - Desktop -->
      <aside :class="['admin-menu', { collapsed: !isExpanded }]" v-show="!isMobileOrTablet">
        <div class="menu-toggle" @click="toggleMenu">
          <img class="negative" src="@/assets/negative.png" alt="negative" />
        </div>

        <nav class="menu-nav">
          <ul class="menu-list">
            <!-- Render từ cấu hình -->
            <template v-for="(item, idx) in menuItems" :key="idx">
              <!-- Item có submenu -->
              <li v-if="item.children" class="has-submenu">
                <el-tooltip
                  :content="item.label"
                  placement="right"
                  :disabled="isExpanded"
                  :show-after="200"
                >
                  <div
                    class="menu-link"
                    :class="{ 'router-link-active': isParentActive(item) }"
                    @click="toggleSubmenu(idx)"
                  >
                    <img :src="getItemIcon(item, isParentActive(item))" :alt="item.label" />
                    <span class="icon-menu-expand" v-show="isExpanded">{{ item.label }}</span>
                    <span class="submenu-arrow" v-show="isExpanded">{{ openSubmenus[idx] ? '▾' : '▸' }}</span>
                  </div>
                </el-tooltip>

                <transition name="slide-vert">
                  <ul
                    v-show="isExpanded && openSubmenus[idx]"
                    class="submenu"
                  >
                    <li v-for="(child, cIdx) in item.children" :key="cIdx">
                      <router-link
                        class="menu-link submenu-link"
                        :to="child.route"
                        :class="{ 'router-link-active': isRouteActive(child.routeName) }"
                      >
                        <span>{{ child.label }}</span>
                      </router-link>
                    </li>
                  </ul>
                </transition>
              </li>

              <!-- Item thường -->
              <li v-else>
                <el-tooltip
                  :content="item.label"
                  placement="right"
                  :disabled="isExpanded"
                  :show-after="200"
                >
                  <router-link
                    class="menu-link"
                    :to="item.route"
                    :class="{ 'router-link-active': isRouteActive(item.routeName) }"
                  >
                    <img :src="getItemIcon(item, isRouteActive(item.routeName))" :alt="item.label" />
                    <span class="icon-menu-expand" v-show="isExpanded">{{ item.label }}</span>
                  </router-link>
                </el-tooltip>
              </li>
            </template>
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

    <!-- DRAWER MOBILE -->
    <el-drawer
      v-model="isDrawerOpen"
      direction="rtl"
      :with-header="false"
      modal-class="drawer-mobile"
      custom-class="mobile-drawer"
      :modal-append-to-body="false"
    >
      <div class="drawer-header">
        <img class="chevron-right" src="@/assets/img/chevron-right.svg" alt="Close" @click="closeDrawer" />
      </div>

      <nav class="drawer-menu-nav">
        <ul class="drawer-menu-list-mobile">
          <template v-for="(item, idx) in menuItems" :key="'m-' + idx">
            <!-- Submenu trong drawer -->
            <li v-if="item.children" class="drawer-has-submenu">
              <div class="menu-link" @click="toggleSubmenuMobile(idx)">
                <img :src="getItemIcon(item, isParentActive(item))" :alt="item.label" />
                <span class="icon-menu-expand">{{ item.label }}</span>
                <span class="submenu-arrow">{{ openSubmenusMobile[idx] ? '▾' : '▸' }}</span>
              </div>
              <transition name="slide-vert">
                <ul class="submenu" v-show="openSubmenusMobile[idx]">
                  <li v-for="(child, cIdx) in item.children" :key="'m-c-' + cIdx">
                    <router-link
                      class="drawer-menu-link"
                      :to="child.route"
                      @click="closeDrawer"
                      :class="{ 'router-link-active': isRouteActive(child.routeName) }"
                    >
                      <span>{{ child.label }}</span>
                    </router-link>
                  </li>
                </ul>
              </transition>
            </li>

            <!-- Item thường trong drawer -->
            <li v-else>
              <router-link
                class="drawer-menu-link"
                :to="item.route"
                @click="closeDrawer"
                :class="{ 'router-link-active': isRouteActive(item.routeName) }"
              >
                <img :src="getItemIcon(item, isRouteActive(item.routeName))" :alt="item.label" />
                <span>{{ item.label }}</span>
              </router-link>
            </li>
          </template>
        </ul>

        <!-- User info + action trong drawer -->
        <div class="drawer-user-info-mobile">
          <div class="drawer-user-info-mobile__block-top">
            <div class="drawer-user-info-mobile__top">
              <div class="drawer-user-info-mobile__left">
                <img
                  class="avt-mobile"
                  :src="userInfo?.avatar ? baseURL + '/' + userInfo.avatar : require('@/assets/img/avt-default.png')"
                  alt="Logo"
                />
                <p>{{ userInfo?.full_name }}</p>
              </div>
              <div class="drawer-user-info-mobile__right" @click="openChangePasswordModal">
                Change Password
              </div>
            </div>
            <div @click="handleLogout" class="drawer-user-info-mobile__logout">
              <span class="avatar-name">
                <img src="@/assets/img/icon-logout-mobile.svg" style="width: 16px; height: 16px;" alt="">
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

  <change-password-modal
    :visible="isChangePasswordModalVisible"
    @update:visible="isChangePasswordModalVisible = $event"
  />
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
  components: { ChangePasswordModal },
  data() {
    return {
      isExpanded: false,
      showDropdown: false,
      isDrawerOpen: false,
      isMobileOrTablet: false,
      baseURL: baseURL,
      isChangePasswordModalVisible: false,

      openSubmenus: {},          // desktop
      openSubmenusMobile: {},    // mobile

      menuItems: [
        {
          label: 'Job Number',
          route: '/admin/job-number',
          routeName: 'admin-job-number',
          icon: require('@/assets/img/icon-job-number.svg'),
          activeIcon: require('@/assets/img/icon-job-number-active.svg'),
        },
        {
          label: 'Timesheets',
          icon: require('@/assets/img/icon-open-timesheets.svg'),
          activeIcon: require('@/assets/img/icon-open-timesheets-active.svg'),
          children: [
            { label: 'Open Timesheets', route: '/admin/open-timesheets', routeName: 'admin-open-timesheets' },
            { label: 'Close Timesheets', route: '/admin/close-timesheets', routeName: 'admin-close-timesheets' },
          ]
        },
        {
          label: 'Users',
          icon: require('@/assets/admin.png'),
          activeIcon: require('@/assets/admin-active.svg'),
          children: [
            { label: 'User List', route: '/admin/users', routeName: 'admin-users' },
          ]
        },
        {
          label: 'Logs',
          icon: require('@/assets/entry-log.svg'),
          activeIcon: require('@/assets/entry-log-active.svg'),
          children: [
            { label: 'Entry Logs', route: '/admin/entry-logs', routeName: 'admin-entry-logs' },
            { label: 'Sync Data Logs', route: '/admin/log/sync-data-logs', routeName: 'log' },
          ]
        },
        {
          label: 'Warehouse',
          route: '/admin/warehouse',
          routeName: 'warehouse',
          icon: require('@/assets/img/warehouse.svg'),
          activeIcon: require('@/assets/img/warehouse-active.svg'),
        },
        {
          label: 'Settings',
          icon: require('@/assets/setting.svg'),
          activeIcon: require('@/assets/setting-active.svg'),
          children: [
            { label: 'Normal Working Hours', route: '/admin/normal-working-hours', routeName: 'normal-working-hours' },
            { label: 'Holidays', route: '/admin/holidays', routeName: 'holidays' },
          ]
        },
        {
          label: 'Salary',
          icon: require('@/assets/money.svg'),
          activeIcon: require('@/assets/money-active.svg'),
          children: [
            { label: 'Daily Timesheet', route: '/admin/salary/daily-timesheets', routeName: 'salary/daily-timesheets' },
            { label: 'Individual Timesheet', route: '/admin/salary/individual-timesheets', routeName: 'salary/individual-timesheets' },
          ]
        },
      ],
    };
  },
  computed: {
    isExpandedProvide() { return this.isExpanded; },
    userInfo() { return globalState.userInfo; }
  },
  provide() {
    return { isExpanded: computed(() => this.isExpanded) };
  },
  methods: {
    // Header
    toggleDropdown() { this.showDropdown = !this.showDropdown; },
    handleLogout() {
      setCookie('access_token', '', 0);
      this.$router.push('/login');
    },
    openChangePasswordModal() { this.isChangePasswordModalVisible = true; },

    // Layout
    toggleMenu() {
      this.isExpanded = !this.isExpanded;
      if (!this.isExpanded) this.openSubmenus = {};
    },
    toggleDrawer() { this.isDrawerOpen = !this.isDrawerOpen; },
    closeDrawer() { this.isDrawerOpen = false; this.openSubmenusMobile = {}; },
    checkDeviceSize() { this.isMobileOrTablet = window.innerWidth <= 1024; },

    // Outside click cho dropdown avatar
    handleClickOutside(e) {
      if (this.$refs.avatarArea && !this.$refs.avatarArea.contains(e.target)) {
        this.showDropdown = false;
      }
    },

    // Route helpers
    isRouteActive(routeName) { return this.$route.name === routeName; },
    isChildActive(item) {
      if (!item.children) return false;
      return item.children.some(ch => this.isRouteActive(ch.routeName));
    },
    isParentActive(item) {
      return this.isChildActive(item) || (item.routeName && this.isRouteActive(item.routeName));
    },
    getItemIcon(item, isActive) {
      if (item.activeIcon && item.icon) return isActive ? item.activeIcon : item.icon;
      return item.icon || '';
    },

    // Submenu toggle (Vue 3: gán trực tiếp)
    toggleSubmenu(idx) { 
      const item = this.menuItems[idx];
      if(item.children?.length > 0){
        this.$router.push(item.children[0].route);
      }
      this.isExpanded = true;
      this.openSubmenus[idx] = !this.openSubmenus[idx];
     },
    toggleSubmenuMobile(idx) { this.openSubmenusMobile[idx] = !this.openSubmenusMobile[idx]; },

    // API
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
    },

    // auto mở submenu chứa route hiện tại
    expandParentForCurrentRoute() {
      this.menuItems.forEach((item, idx) => {
        if (this.isParentActive(item)) {
          this.openSubmenus[idx] = true;
          this.openSubmenusMobile[idx] = true;
        }
      });
    }
  },
  watch: {
    '$route.name'() { this.expandParentForCurrentRoute(); }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', this.checkDeviceSize);
    this.checkDeviceSize();
    this.fetchUserInfo();
    this.expandParentForCurrentRoute();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.checkDeviceSize);
  },
};
</script>

<style scoped>
/* Tooltip + Fade for dropdown */
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Slide transition for submenu (desktop & mobile) */
.slide-vert-enter-active, .slide-vert-leave-active {
  transition: max-height .22s ease, opacity .22s ease;
  overflow: hidden;
}
.slide-vert-enter-from, .slide-vert-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-vert-enter-to, .slide-vert-leave-from {
  max-height: 600px; /* đủ lớn cho submenu của bạn */
  opacity: 1;
}

.avatar-name { white-space: nowrap; }

/* Drawer user info (mobile) */
.drawer-user-info-mobile__block-top {
  display: flex; flex-direction: column; gap: 16px; color: #fff; width: 194px; margin: 0 auto;
}
.drawer-user-info-mobile__block-top .avt-mobile {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid #D7D7D7;
}
.drawer-user-info-mobile__top {
  display: flex; flex-direction: column; border-radius: 8px; background: #454545;
  padding: 16px 13px 0 10px;
}
.drawer-user-info-mobile__left {
  display: flex; align-items: center; gap: 8px; padding-bottom: 9px; border-bottom: 1px gray solid;
}
.drawer-user-info-mobile__right {
  color: #FFF; text-align: center; font-size: 16px; font-weight: 700; line-height: 20px; padding-top: 8px;
}
.drawer-user-info-mobile__logout span {
  display: flex; border-radius: 8px; background: #454545; height: 36px; color: #FFF; font-size: 14px;
  align-items: center; justify-content: center; gap: 9px; margin-bottom: 50px;
}

/* Drawer */
.drawer-menu-nav { display: flex; flex-direction: column; justify-content: space-between; height: 100vh; }
:deep(.el-drawer) { background-color: #1C1D27; overflow: unset; }
:deep(.el-drawer__body) { padding: 0; }
.drawer-header { position: absolute; left: -36px; }
.drawer-header .chevron-right {
  width: 40px; height: 40px; background: #0080F6; border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.mobile-drawer { width: 240px !important; background-color: #1A1A1A; color: #fff; }

/* Header */
.admin-header {
  height: 60px; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; background-image: url('@/assets/icon-bg-overlay.png'); background-repeat: no-repeat; background-position: right center;
}
.header-left .logo-img { height: 40px; }
.hamburger { display: none; cursor: pointer; }
.header-right { display: flex; align-items: center; cursor: pointer; position: relative; }
.avatar-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 8px; }
.dropdown-menu {
  position: absolute; top: 60px; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 4px; min-width: 140px; z-index: 10; width: 188px;
}
.dropdown-menu ul { list-style: none; margin: 0; padding: 8px 0; }
.dropdown-menu li { padding: 8px 16px; display: flex; align-items: center; cursor: pointer; gap: 8px; }
.dropdown-menu img { width: 20px; height: 20px; object-fit: contain; }
.dropdown-menu li:hover { background-color: #CFECF9; }

/* Main */
.admin-layout { display: flex; flex-direction: column; height: 100vh; }
.admin-main { display: flex; flex: 1; }
.main-container { display: flex; flex-direction: column; flex: 1; }
.admin-content {
  flex: 1; padding: 20px; background-color: #f8f8f8; background-image: url('@/assets/icon-bg-overlay.png');
  background-repeat: no-repeat; background-position: right center; background-size: contain;
}
.admin-footer {
  font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;
  background: #F3F3F3; box-shadow: 0 4px 8px rgba(0,0,0,0.25); height: 50px; display: flex; align-items: center; padding-left: 26px;
}

/* Sidebar */
.admin-menu {
  width: 220px; background-color: #1A1A1A; color: #fff; position: relative; display: flex; flex-direction: column;
}
.admin-menu.collapsed { width: 80px; }
.menu-toggle { cursor: pointer; position: absolute; right: -13px; top: 10px; }
.menu-nav { display: flex; flex-direction: column; height: 100%; max-width: 220px; padding-top: 5%; }
.menu-nav ul { list-style: none; padding: 0; margin: 0; }
.menu-link {
  display: flex; align-items: center; color: #fff; text-decoration: none; cursor: pointer; gap: 8px;
  padding: 8px 26px 8px 22px; border-left: 4px solid transparent;
}
.menu-link.router-link-active {
  border-left: 4px solid #0080F6;
  background: linear-gradient(90deg, rgba(0,128,246,0.20) -5.62%, rgba(255,255,255,0.00) 100%);
}
.menu-link.router-link-active span { color: #0080F6; }
.menu-nav img { width: 32px; height: 32px; }
.icon-menu-expand { white-space: nowrap; }
.has-submenu .submenu-arrow { margin-left: auto; opacity: 0.9; }

/* Submenu */
.submenu { list-style: none; padding-left: 16px; }
.submenu-link { font-size: 14px; padding-left: 30px; color: #cfd3dc; }
.submenu-link.router-link-active { color: #fff; border-left: 4px solid transparent; }

/* Drawer menu links */
.drawer-menu-link {
  display: flex; align-items: center; color: #fff; text-decoration: none; cursor: pointer; gap: 8px;
  padding: 12px 20px; border-left: 4px solid transparent;
}
.drawer-menu-link.router-link-active {
  border-left: 4px solid #0080F6;
  background: linear-gradient(90deg, rgba(0,128,246,0.20) -5.62%, rgba(255,255,255,0.00) 100%);
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-menu { display: none; }
  .header-right { display: none; }
  .hamburger { display: block; }
  .drawer-menu-list-mobile { padding-top: 88px !important; }
  .drawer-user-info-mobile { padding-bottom: 12px !important; }
  .admin-layout { height: unset; min-height: 100vh; }
}
@media (max-width: 767px) {
  :deep(.el-drawer) { width: 226px !important; }
  :deep(.bottom-link) { padding: 0; }
  .admin-content { padding: unset; }
  .users-page { padding: unset; }
  .admin-layout { height: unset; min-height: 100vh; }
}
</style>
