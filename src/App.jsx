import { RouterProvider } from "react-router-dom";
import TasksProvider from "./providers/TasksProvider";
import TimerProvider from "./providers/TimerProvider";
import { router } from "./router";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <TimerProvider>
          <RouterProvider router={router} />
        </TimerProvider>
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
