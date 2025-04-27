import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
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
        component: () => import("../views/Dashboard/Class/ClassPage.vue"),
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
      {
        path: "/class/details/:id",
        name: "ClassDetails",
        component: () => import("../views/Dashboard/Class/ClassDetails.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const authStore = useAuthStore();
      await authStore.getUser();
    }

    const isAuthRoute = to.path === "/login" || to.path === "/signup";

    if (data.session && isAuthRoute) {
      next("/home");
    } else if (!data.session && !isAuthRoute) {
      next("/login");
    } else {
      next();
    }
  } catch (error) {
    if (to.path !== "/login") {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
