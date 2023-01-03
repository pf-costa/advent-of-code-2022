import Day22 from "./days/Day22";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Day22 />,
  },
  {
    path: "/day-22",
    element: <Day22 />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
