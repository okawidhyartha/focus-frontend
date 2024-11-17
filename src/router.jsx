import { createBrowserRouter } from "react-router-dom";
import TimerPage from "./pages/timer";
import SignInPage from "./pages/auth/signIn";
import SignUpPage from "./pages/auth/signUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <TimerPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
]);
