import { useContext } from "react";
import { TasksContext } from "../providers/VibeProvider";

export const useVibe = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useVibe must be used within a VibeProvider");
  }
  return context;
};
