import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Auth/LoginPage.vue"),
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/Auth/SignUpPage.vue"),
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/Dashboard/DashboardLayout.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("../views/Dashboard/HomePage.vue"),
      },
      {
        path: "/class",
        name: "Class",
        component: () => import("../views/Dashboard/ClassPage.vue"),
      },
      {
        path: "/report",
        name: "report",
        component: () => import("../views/Dashboard/Report/ReportPage.vue"),
      },
      {
        path: "/report/details",
        name: "reportDetails",
        component: () => import("../views/Dashboard/Report/ReportDetails.vue"),
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("../views/Dashboard/ProfilePage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
