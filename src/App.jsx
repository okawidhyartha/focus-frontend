import TimerPage from "./pages/timer";
import TasksProvider from "./providers/TasksProvider";
import TimerProvider from "./providers/TimerProvider";

function App() {
  return (
    <TasksProvider>
      <TimerProvider>
        <TimerPage />
      </TimerProvider>
    </TasksProvider>
  );
}

export default App;
