import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import UserView from "@/views/admin/UserView.vue";
import EntryLogView from "@/views/admin/EntryLogView.vue";
import { getCookie } from "@/utils/cookie";
import AdminLayout from "@/layouts/AdminLayout.vue";
import JobNumberView from "@/views/admin/JobNumberView.vue";
import JobNumberCreate from "@/components/job-number/JobNumberCreate.vue";
import OpenTimesheetView from "@/views/admin/OpenTimesheetView.vue";
import CloseTimesheetView from "@/views/admin/CloseTimesheetView.vue";
import SocketView from "@/views/socket/SocketView.vue";
import OpenTimesheetDetail from "@/components/timesheet/OpenTimesheetDetail.vue";
import OpenTimesheetEdit from "@/components/timesheet/OpenTimesheetEdit.vue";
import CloseTimesheetDetail from "@/components/timesheet/CloseTimesheetDetail.vue";
import PrintTimeSheetDetail from "@/components/timesheet/PrintTimeSheetDetail.vue";

const routes = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "job-number",
        name: "admin-job-number",
        component: JobNumberView,
      },
      {
        path: "job-number/create",
        name: "admin-job-number-create",
        component: JobNumberCreate,
      },
      {
        path: "job-number/:id/edit",
        name: "admin-job-number-edit",
        component: JobNumberCreate,
        props: true,
      },
      {
        path: "/admin/job-number/:id/duplicate",
        name: "DuplicateJobNumber",
        component: JobNumberCreate,
        props: true,
      },
      {
        path: "users",
        name: "admin-users",
        component: UserView,
      },
      {
        path: "entry-logs",
        name: "admin-entry-logs",
        component: EntryLogView,
      },
      {
        path: "open-timesheets",
        name: "admin-open-timesheets",
        component: OpenTimesheetView,
      },
      // Thêm vào mảng routes
      {
        path: "open-timesheets/:id",
        name: "admin-open-timesheet-detail",
        component: OpenTimesheetDetail,
        props: true,
      },
      {
        path: "open-timesheets/:id/edit",
        name: "admin-open-timesheet-edit",
        component: OpenTimesheetEdit,
        props: true,
      },

      {
        path: "close-timesheets",
        name: "admin-close-timesheets",
        component: CloseTimesheetView,
      },
      {
        path: "close-timesheets/:id",
        name: "admin-close-timesheet-detail",
        component: CloseTimesheetDetail,
        props: true,
      },
      {
        path: "open-timesheets/:id/print",
        name: "admin-open-timesheet-print",
        component: PrintTimeSheetDetail,
        props: true,
      },

    ],
  },
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/socket",
    name: "socket",
    component: SocketView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = getCookie("access_token");

  if (token && to.path === "/login") {
    return next("/admin/users");
  }

  if (!token && to.path !== "/login") {
    return next("/login");
  }

  next();
});

export default router;
