import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProtectedRoutes from "./components/LoginPage_temp/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./components/LoginPage_temp/AuthProvider";
import AuthRedirect from "./components/AuthRedirect";
import ForgotPassword from "./pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },

  {
    path: "/auth",
    element: <Authentication />,
  },

  { path: "/auth/forgot-password", element: <ForgotPassword /> },

  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
