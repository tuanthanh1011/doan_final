import { createRouter, createWebHistory } from "vue-router";

import SignInView from "../views/SignInView.vue";
import SignUpView from "../views/SignUpView.vue";
import HomeUserView from "../views/HomeUserView.vue";
import NotFound from "../views/NotFoundView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import Category_DoNuong from "../views/Category_DoNuongView.vue";
import Category_DoLau from "../views/Category_DoLauView.vue";
import Category_MonAn from "../views/Category_MonAnView.vue";
import ShopingCart from "../views/ShopingCartView.vue";
import MyProfileView from "../views/MyProfileView.vue";
import MyOrderView from "../views/MyOrderView.vue";
import NewsView from "../views/NewView.vue";
import MyMessageView from "../views/MyMessageView.vue";
import MyManagerMessageView from "../views/MyManagerMessageView.vue";
import MyMessageDetailView from "../views/MyMessageDetailView.vue";
import MyUserAddressView from "@/views/MyUserAddressView.vue";
import ForbiddenView from "../views/ForbiddenView.vue";
import MyOrderDetailView from "@/views/MyOrderDetailView.vue";
import WishListView from "@/views/WishListView.vue";
import store from "@/store/store.main";
import { verifyToken } from "@/utils/jsonwebtoken";

// ADMIN

import ManagerUserComponent from "@/components/admin/ManagerUserComponent/ManagerUserComponent.vue";
import ManagerProductComponent from "@/components/admin/ManagerProductComponent/ManagerProductComponent.vue";
import ManagerDashboardComponent from "@/components/admin/ManagerDashboardComponent/ManagerDashboardComponent.vue";
import ManagerContactComponent from "@/components/admin/ManagerContactComponent.vue";
import ManagerOrderComponent from "@/components/admin/ManagerOrderComponent/ManagerOrderComponent.vue";
import ManagerCategoryComponent from "@/components/admin/ManagerCategoryComponent/ManagerCategoryComponent.vue";

import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";

const routes = [
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignInView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUpView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/my-address",
    name: "my-address",
    component: MyUserAddressView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/",
    name: "home",
    component: HomeUserView,
    alias: "/home",
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/news",
    name: "news",
    component: NewsView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/order-history/:id",
    name: "order-history-detail",
    component: MyOrderDetailView,
    meta: { requiresAuth: true, roleAdmin: false },
    props: true,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/admin/manager-user",
    name: "manager-user",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerUserComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-product",
    name: "manager-product",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerProductComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-category",
    name: "manager-category",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerCategoryComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-contact",
    name: "manager-contact",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerContactComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-order",
    name: "manager-order",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerOrderComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/dashboard",
    name: "dashboard",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerDashboardComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/do-nuong",
    name: "do-nuong",
    component: Category_DoNuong,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/wish-list",
    name: "wish-list",
    component: WishListView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/do-lau",
    name: "do-lau",
    component: Category_DoLau,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/mon-an",
    name: "mon-an",
    component: Category_MonAn,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/shoping-cart",
    name: "shoping-cart",
    component: ShopingCart,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-profile",
    name: "my-profile",
    component: MyProfileView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/order-history",
    name: "order-history",
    component: MyOrderView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-message",
    name: "my-message",
    component: MyMessageView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-manager-message",
    name: "my-manager-message",
    component: MyManagerMessageView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-message-detail/:id",
    name: "my-message-detail",
    component: MyMessageDetailView,
    props: true,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/forbidden",
    name: "forbidden",
    component: ForbiddenView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active-page",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAuthAdmin = to.matched.some((record) => record.meta.roleAdmin);
  const isAuthenticated = localStorage.getItem("accessToken");
  const userDecoded = verifyToken();

  if (requiresAuth && !isAuthenticated) {
    next({ name: "sign-in" });
  } else if (
    requiresAuthAdmin &&
    (!userDecoded ||
      (userDecoded.role !== "ADMIN" && userDecoded.role !== "EMPLOYEE"))
  ) {
    next({ name: "forbidden" });
  }
  if (
    userDecoded.role === "EMPLOYEE" &&
    ["manager-category", "manager-user", "manager-product"].includes(to.name)
  ) {
    next({ name: "forbidden" });
  } else {
    store.dispatch("auth/loadUserLoginByToken", true);
    store.commit("setIsAdminRoute", requiresAuthAdmin);
    next();
  }
});

export default router;
