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
import WarehouseView from "@/views/admin/WarehouseView/WarehouseView.vue";
import ProjectRequestView from "@/views/admin/WarehouseView/project-request/ProjectRequestView.vue";
import ProjectRequestDetail from "@/views/admin/WarehouseView/project-request/ProjectRequestDetail.vue";
import MaintenanceView from "@/views/admin/WarehouseView/maintenance/MaintenanceView.vue";
import ClusterView from "@/views/admin/WarehouseView/maintenance/clusters/ClusterView.vue";
import CabinetView from "@/views/admin/WarehouseView/maintenance/cabinets/CabinetView.vue";
import BinView from "@/views/admin/WarehouseView/maintenance/bins/BinView.vue";
import ItemConfigureView from "@/views/admin/WarehouseView/maintenance/items-configure/ItemConfigureView.vue";
import IssueView from "@/views/admin/WarehouseView/issues/IssueView.vue";
import DashboardView from "@/views/admin/Dashboard/DashboardView.vue";
import TransactionView from "@/views/admin/WarehouseView/transactions/TransactionView.vue";
import LogView from "@/views/admin/Log/LogView.vue";
import SyncDataLogView from "@/views/admin/Log/sync-data-log/SyncDataLogView.vue";
import RequestLogView from "@/views/admin/Log/request-log/RequestLogView.vue";
import TransactionDetailView from "@/views/admin/WarehouseView/transactions/TransactionDetailView.vue";
import ReturnView from "@/views/admin/WarehouseView/return/ReturnView.vue";
import ReplenishView from "@/views/admin/WarehouseView/replenish/ReplenishView.vue";
import NormalWorkingHourView from "@/views/admin/NormalWorkingHourView.vue";
import HolidayView from "@/views/admin/HolidayView.vue";
import IndividualTimesheetView from "@/views/admin/Salary/IndividualTimesheetView.vue";
import DailyTimesheetView from "@/views/admin/Salary/DailyTimesheetView.vue";

const routes = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path:'dashboard',
        name:'dashboard',
        component: DashboardView
      },
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
      {
        path:'warehouse',
        name:'warehouse',
        component: WarehouseView,
      },
      {
        path:'project-request',
        name:'project-request',
        component: ProjectRequestView
      },
      {
        path:'project-request/:id',
        name:'project-request-detail',
        component: ProjectRequestDetail
      },
      {
        path:'maintenance',
        name:'maintenance',
        component: MaintenanceView,
        children:[
          {path:'clusters', name:'clusters', component: ClusterView},
          {path:'cabinets', name:'cabinets', component: CabinetView},
          {path:'bins', name:'bins', component: BinView},
          {path:'items-configure', name:'items-configure', component: ItemConfigureView},
        ]
      },
      {
        path:'issues',
        name:'issues',
        component: IssueView
      },
      {
        path:'transactions',
        name:'transactions',
        component: TransactionView
      },
      {
        path:'transactions/:id',
        name:'transaction-detail',
        component: TransactionDetailView
      },
      {
        path:'log',
        name:'log',
        component: LogView,
        children:[
          {path:'sync-data-logs', name:'sync-data-logs', component: SyncDataLogView},
          {path:'request-logs', name:'request-logs', component: RequestLogView},
        ]
      },
      {
        path:'returns',
        name:'returns',
        component: ReturnView
      },
      {
        path:'replenishes',
        name:'replenishes',
        component: ReplenishView
      },
      {
        path:'normal-working-hours',
        name:'normal-working-hours',
        component: NormalWorkingHourView
      },
      {
        path:'holidays',
        name:'holidays',
        component: HolidayView
      },
      {
        path:'salary/individual-timesheets',
        name:'salary/individual-timesheets',
        component: IndividualTimesheetView,
      },
      {
        path:'salary/daily-timesheets',
        name:'salary/daily-timesheets',
        component: DailyTimesheetView,
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
    return next("/admin/dashboard");
  }

  if (!token && to.path !== "/login") {
    return next("/login");
  }

  next();
});

export default router;
