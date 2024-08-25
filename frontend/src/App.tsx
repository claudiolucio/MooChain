import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./dashboard";
import React from "react";
import ManageVakinha from "./manageVakinha";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard contractAddress="0x72bb9c7ffbE2Ed234e53bc64862DdA6d9fFF333b" />,
  },
  {
    path: "/manage-vakinha/:vaquinhaId",
    element: <ManageVakinha contractAddress="0x72bb9c7ffbE2Ed234e53bc64862DdA6d9fFF333b" />,
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
