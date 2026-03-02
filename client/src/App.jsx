import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./redux/cartSlice";
import { fetchWishlist } from "./redux/wishlistSlice";
import { routes } from "./AppRoute";
import PageLoader from "./components/PageLoader";

const router = createBrowserRouter(routes);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Forced delay to show animation (1 second)
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 3000);

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
