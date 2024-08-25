import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./dashboard";
import React from "react";
import ManageVakinha from "./manageVakinha";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard contractAddress="0x5fbdb2315678afecb367f032d93f642f64180aa3" />,
  },
  {
    path: "/manage-vakinha/:vaquinhaId",
    element: <ManageVakinha contractAddress="0x5fbdb2315678afecb367f032d93f642f64180aa3"/>,
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
