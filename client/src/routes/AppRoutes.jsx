import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ProtectedRoute,
  PublicOnlyRoute,
  CustomerOnlyRoute,
  BannedOnlyRoute,
} from "../components/RouteGuards";
import SellerSidebar from "../components/seller/SellerSidebar";
import AdminSidebar from "../components/admin/AdminSidebar";
import { AuthInterceptor } from "../components/AuthInterceptor";
import PageLoader from "../components/PageLoader";

// Lazy load all page components
const Overview = lazy(() => import("../pages/Overview"));
const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const Products = lazy(() => import("../pages/customer/Products"));
const ProductDetails = lazy(() => import("../pages/customer/ProductDetails"));
const Cart = lazy(() => import("../pages/customer/Cart"));
const Wishlist = lazy(() => import("../pages/customer/Wishlist"));
const Checkout = lazy(() => import("../pages/customer/Checkout"));
const MyOrders = lazy(() => import("../pages/customer/MyOrders"));
const SellerProfile = lazy(() => import("../pages/seller/SellerProfile"));
const SellerAnalytics = lazy(() => import("../pages/seller/SellerAnalytics"));
const SellerInventory = lazy(() => import("../pages/seller/SellerInventory"));
const SellerOrders = lazy(() => import("../pages/seller/SellerOrders"));
const AddProduct = lazy(() => import("../pages/seller/AddProduct"));
const EditProduct = lazy(() => import("../pages/seller/EditProduct"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));

// Auth pages
const Signup = lazy(() => import("../pages/auth/Signup"));
const Login = lazy(() => import("../pages/auth/Login"));
const Verify = lazy(() => import("../pages/auth/Verify"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const BannedPage = lazy(() => import("../pages/auth/BannedPage"));

// Info pages
const About = lazy(() => import("../pages/info/About"));
const Contact = lazy(() => import("../pages/info/Contact"));
const Privacy = lazy(() => import("../pages/info/Privacy"));
const Terms = lazy(() => import("../pages/info/Terms"));

// Conditional component - shows Home if logged in, Overview if not
const HomeOrOverview = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return isAuthenticated ? <Home /> : <Overview />;
};

// Layout wrapper with Navbar and Footer
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAdminDashboard = location.pathname.startsWith("/admin-dashboard");
  const isAnyDashboard = isDashboard || isAdminDashboard;

  return (
    <>
      <Navbar />
      {user?.role === "seller" && isDashboard && <SellerSidebar />}
      {user?.role === "admin" && isAdminDashboard && <AdminSidebar />}
      <div
        className={
          isAnyDashboard
            ? "pb-24 md:pb-0 md:pl-20 lg:pl-24 pt-20 md:pt-24 min-h-screen bg-white dark:bg-zinc-950 transition-colors"
            : "min-h-screen"
        }
      >
        <div
          className={
            isAnyDashboard ? "max-w-7xl mx-auto px-4 md:px-8 pb-10" : ""
          }
        >
          {children}
        </div>
      </div>
      {!isAnyDashboard && <Footer />}
    </>
  );
};

export const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <Layout>
            <HomeOrOverview />
          </Layout>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/products",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <CustomerOnlyRoute>
            <Layout>
              <Products />
            </Layout>
          </CustomerOnlyRoute>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <CustomerOnlyRoute>
            <Layout>
              <ProductDetails />
            </Layout>
          </CustomerOnlyRoute>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/sellerinfo/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <Layout>
            <SellerProfile />
          </Layout>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <ProtectedRoute allowedRoles={["seller"]}>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        </AuthInterceptor>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <SellerAnalytics />,
      },
      {
        path: "inventory",
        element: <SellerInventory />,
      },
      {
        path: "orders",
        element: <SellerOrders />,
      },
      {
        path: "settings",
        element: <SellerProfile />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "edit-product/:productId",
        element: <EditProduct />,
      },
    ],
  },
  {
    path: "/admin-dashboard",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        </AuthInterceptor>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: "/wishlist",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <ProtectedRoute allowedRoles={["customer"]}>
            <Layout>
              <Wishlist />
            </Layout>
          </ProtectedRoute>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/cart",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <ProtectedRoute allowedRoles={["customer"]}>
            <Layout>
              <Cart />
            </Layout>
          </ProtectedRoute>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <ProtectedRoute allowedRoles={["customer"]}>
            <Layout>
              <Checkout />
            </Layout>
          </ProtectedRoute>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthInterceptor>
          <ProtectedRoute allowedRoles={["customer"]}>
            <Layout>
              <MyOrders />
            </Layout>
          </ProtectedRoute>
        </AuthInterceptor>
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicOnlyRoute>
          <Signup />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/verify",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicOnlyRoute>
          <Verify />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicOnlyRoute>
          <ForgotPassword />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicOnlyRoute>
          <VerifyEmail />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/banned",
    element: (
      <Suspense fallback={<PageLoader />}>
        <BannedOnlyRoute>
          <BannedPage />
        </BannedOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <About />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <Contact />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/privacy",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <Privacy />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/terms",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <Terms />
        </Layout>
      </Suspense>
    ),
  },
];
