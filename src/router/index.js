import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import UserView from "@/views/admin/UserView.vue";
import EntryLogView from "@/views/admin/EntryLogView.vue";
import { getCookie } from "@/utils/cookie";
import AdminLayout from "@/layouts/AdminLayout.vue";

const routes = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
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
