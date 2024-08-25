import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./dashboard";
import React from "react";
import ManageVakinha from "./manageVakinha";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard contractAddress="0x9eBb49B2004C753f6Fb8b3181C224a8972f70528" />,
  },
  {
    path: "/manage-vakinha/:vaquinhaId",
    element: <ManageVakinha contractAddress="0x9eBb49B2004C753f6Fb8b3181C224a8972f70528" />,
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
