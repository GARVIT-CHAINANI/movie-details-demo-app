import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Authentication from "./pages/Authentication";
import "./App.css";
import ProtectedRoutes from "./components/LoginPage/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./components/LoginPage/AuthProvider";
import AuthRedirect from "./components/AuthRedirect";
import { db } from "./config/firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },
  {
    path: "/auth",
    element: <Authentication />,
  },
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
  console.log(db);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
