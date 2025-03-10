import { useAuthStore } from "@/state/pinia";
export default [
  {
    path: "/",
    name: "default",
    meta: { title: "Dashboard", authRequired: false },
    component: () => import("../views/dashboards/default"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/account/login"),
    meta: {
      title: "Login",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        if (auth.loggedIn) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/account/register"),
    meta: {
      title: "Register",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        if (auth.loggedIn) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("../views/account/forgot-password"),
    meta: {
      title: "Forgot password",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        if (auth.loggedIn) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("../views/account/logout"),
    meta: {
      title: "Logout",
      authRequired: false,
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();

        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          auth.logOut();
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
          route.push("/login")
        );
        // Navigate back to previous page, or home as a fallback
        next(
          authRequiredOnPreviousRoute ? { name: "default" } : { ...routeFrom }
        );
      },
    },
  },

  {
    path: "/user",
    name: "user",
    meta: { title: "Master User", authRequired: false },
    component: () => import("../views/user"),
  },
  {
    path: "/customer",
    name: "customer",
    meta: { title: "Customer", authRequired: false },
    component: () => import("../views/customer"),
  },

  {
    path: "/product-category",
    name: "product-category",
    meta: { title: "Master Product Category", authRequired: false },
    component: () => import("../views/productCategory"),
  },

  {
    path: "/product",
    name: "product",
    meta: { title: "Master Product", authRequired: false },
    component: () => import("../views/product"),
  },
  {
    path: "/product/form",
    name: "product-form",
    meta: { title: "Master Product", authRequired: false },
    component: () => import("../views/product/form.vue"),
  },

  {
    path: "/transaksi",
    name: "transaksi",
    meta: { title: "Master Transaksi", authRequired: false },
    component: () => import("../views/transaksi"),
  },

  {
    path: "/laporan",
    name: "laporan",
    meta: { title: "Master Transaksi", authRequired: false },
    component: () => import("../views/transaksi/laporan.vue"),
  },

  {
    path: "/sales",
    name: "sales",
    meta: { title: "Master Sales", authRequired: false },
    component: () => import("../views/transaksi/sales.vue"),
  },

  {
    path: "/chart",
    name: "chart",
    meta: { title: "Chart", authRequired: false },
    component: () => import("../views/charts"),
  },

  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  // {
  //   path: "*",
  //   redirect: "404",
  // },
];
