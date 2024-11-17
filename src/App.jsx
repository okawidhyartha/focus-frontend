import { RouterProvider } from "react-router-dom";
import TasksProvider from "./providers/TasksProvider";
import TimerProvider from "./providers/TimerProvider";
import { router } from "./router";

function App() {
  return (
    <TasksProvider>
      <TimerProvider>
        <RouterProvider router={router} />
      </TimerProvider>
    </TasksProvider>
  );
}

export default App;
