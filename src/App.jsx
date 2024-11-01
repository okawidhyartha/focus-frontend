import TimerPage from "./pages/timer";
import TimerProvider from "./providers/TimerProvider";

function App() {
  return (
    <TimerProvider>
      <TimerPage />
    </TimerProvider>
  );
}

export default App;
