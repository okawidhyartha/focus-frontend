import { RouterProvider } from "react-router-dom";
import TasksProvider from "./providers/TasksProvider";
import TimerProvider from "./providers/TimerProvider";
import { router } from "./router";
import AuthProvider from "./providers/AuthProvider";
import SettingsProvider from "./providers/SettingsProvider";

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <SettingsProvider>
          <TimerProvider>
            <RouterProvider router={router} />
          </TimerProvider>
        </SettingsProvider>
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
