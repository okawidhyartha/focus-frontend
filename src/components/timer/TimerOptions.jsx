import { HStack } from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";
import { TIMER_OPTIONS } from "../../helpers/constants";
import OptionButton from "./OptionButton";

export default function TimerOptions() {
  const { selectedOption, setSelectedOption } = useTimer();

  return (
    <HStack>
      {TIMER_OPTIONS.map((option) => (
        <OptionButton
          key={option.value}
          onClick={() => setSelectedOption(option.value)}
          active={selectedOption === option.value}
        >
          {option.name}
        </OptionButton>
      ))}
    </HStack>
  );
}
