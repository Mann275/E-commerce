import React, { Suspense, lazy, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { fetchCart } from "./redux/cartSlice";
import { fetchWishlist } from "./redux/wishlistSlice";

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

import PageLoader from "./components/PageLoader";

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
        <Layout>
          <Products />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <ProductDetails />
        </Layout>
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
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Forced delay to show animation (3.5 seconds)
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  if (isInitializing) {
    return <PageLoader />;
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
