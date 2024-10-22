import TimerPage from "./pages/timer";
import VibeProvider from "./providers/VibeProvider";

function App() {
  return (
    <VibeProvider>
      <TimerPage />
    </VibeProvider>
  );
}

export default App;
