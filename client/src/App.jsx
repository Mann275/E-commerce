import React, { Suspense, lazy, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import SellerDashboard from "./pages/seller/SellerDashboard";

// Lazy load all page components
const Overview = lazy(() => import("./pages/Overview"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Products = lazy(() => import("./pages/customer/Products"));
const ProductDetails = lazy(() => import("./pages/customer/ProductDetails"));
const Cart = lazy(() => import("./pages/customer/Cart"));
const Wishlist = lazy(() => import("./pages/customer/Wishlist"));
const SellerProfile = lazy(() => import("./pages/seller/SellerProfile"));

// Auth pages
const Signup = lazy(() => import("./pages/auth/Signup"));
const Login = lazy(() => import("./pages/auth/Login"));
const Verify = lazy(() => import("./pages/auth/Verify"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

// Info pages
const About = lazy(() => import("./pages/info/About"));
const Contact = lazy(() => import("./pages/info/Contact"));
const Offers = lazy(() => import("./pages/info/Offers"));
const Privacy = lazy(() => import("./pages/info/Privacy"));
const Terms = lazy(() => import("./pages/info/Terms"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center transition-colors duration-300 relative">
    <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-200/40 via-white to-white dark:from-sky-900/20 dark:via-black dark:to-black"></div>
    <div className="text-center relative z-10">
      <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
    </div>
  </div>
);

// Conditional component - shows Home if logged in, Overview if not
const HomeOrOverview = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return isAuthenticated ? <Home /> : <Overview />;
};

// Layout wrapper with Navbar and Footer
const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <HomeOrOverview />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/products",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute allowedRoles={["customer"]}>
          <Layout>
            <Products />
          </Layout>
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute allowedRoles={["customer"]}>
          <Layout>
            <ProductDetails />
          </Layout>
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/sellerinfo/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <SellerProfile />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute allowedRoles={["seller"]}>
          <Layout>
            <SellerDashboard />
          </Layout>
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/wishlist",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute allowedRoles={["customer"]}>
          <Layout>
            <Wishlist />
          </Layout>
        </ProtectedRoute>
      </Suspense>
    ),
  },

  {
    path: "/cart",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute allowedRoles={["customer"]}>
          <Layout>
            <Cart />
          </Layout>
        </ProtectedRoute>
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
    path: "/offers",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <Offers />
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
]);

function App() {
  // Authentication state is now initialized synchronously in Redux userSlice

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
