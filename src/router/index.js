import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import UserView from "@/views/admin/UserView.vue";
import EntryLogView from "@/views/admin/EntryLogView.vue";
import { getCookie } from "@/utils/cookie";
import AdminLayout from "@/layouts/AdminLayout.vue";
import JobNumberView from "@/views/admin/JobNumberView.vue";
import JobNumberCreate from "@/components/job-number/JobNumberCreate.vue";

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
        path: 'job-number/:id/edit',
        name: 'admin-job-number-edit',
        component: JobNumberCreate,
        props: true,
      },
      {
        path: '/admin/job-number/:id/duplicate',
        name: 'DuplicateJobNumber',
        component: JobNumberCreate,
        props: true
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
    ],
  },
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: LoginView,
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
