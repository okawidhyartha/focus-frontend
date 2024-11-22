import { RouterProvider } from "react-router-dom";
import TasksProvider from "./providers/TasksProvider";
import TimerProvider from "./providers/TimerProvider";
import { router } from "./router";
import AuthProvider from "./providers/AuthProvider";
import SettingsProvider from "./providers/SettingsProvider";
import IndexedDbProvider from "./providers/IndexedDbProvide";

function App() {
  return (
    <AuthProvider>
      <IndexedDbProvider>
        <TasksProvider>
          <SettingsProvider>
            <TimerProvider>
              <RouterProvider router={router} />
            </TimerProvider>
          </SettingsProvider>
        </TasksProvider>
      </IndexedDbProvider>
    </AuthProvider>
  );
}

export default App;
