import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy load all page components
const Overview = lazy(() => import("./pages/Overview"));
const Home = lazy(() => import("./pages/Home"));

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
    <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200/40 via-white to-white dark:from-sky-900/20 dark:via-black dark:to-black"></div>
    <div className="text-center relative z-10">
      <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
    </div>
  </div>
);

// Conditional component - shows Home if logged in, Overview if not
const HomeOrOverview = () => {
  const isAuthenticated = () => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accesstoken");
    return user && accessToken;
  };

  return isAuthenticated() ? <Home /> : <Overview />;
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
    path: "/signup",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/verify",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Verify />
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <Suspense fallback={<PageLoader />}>
        <VerifyEmail />
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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
