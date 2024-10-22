import { createContext, useState } from "react";
import { TIMER_OPTIONS } from "../helpers/constants";

export const TasksContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function VibeProvider({ children }) {
  const [fisrtOption] = TIMER_OPTIONS;
  const [color, setColor] = useState(fisrtOption.color);
  const [selectedOption, setSelectedOption] = useState(fisrtOption.value);

  return (
    <TasksContext.Provider
      value={{ color, setColor, selectedOption, setSelectedOption }}
    >
      {children}
    </TasksContext.Provider>
  );
}
