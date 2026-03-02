import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./redux/cartSlice";
import { fetchWishlist } from "./redux/wishlistSlice";
import { routes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import PageLoader from "./components/PageLoader";

// Root component that wraps everything with AuthProvider
function RootLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

// Create router with AuthProvider wrapper
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: routes,
  },
]);

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Forced delay to show animation (3 seconds)
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return <PageLoader />;
  }

  return <RouterProvider router={router} />;
}

export default App;
