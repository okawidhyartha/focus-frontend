import {
  Button,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useSettings } from "../../hooks/useSettings";
import { useCallback, useEffect, useState } from "react";
import { ALARMS, FOCUS_MUSICS } from "../../helpers/constants";

export default function ModalSettings({ isOpen, onClose }) {
  const { timerDuration, focusMusic, alarm, updateSettings } = useSettings();
  const [focusDuration, setFocusDuration] = useState(0);
  const [shortBreakDuration, setShortBreakDuration] = useState(0);
  const [longBreakDuration, setLongBreakDuration] = useState(0);
  const [focusMusicSelected, setFocusMusicSelected] = useState("none");
  const [alarmSelected, setAlarmSelected] = useState("none");

  useEffect(() => {
    if (isOpen) {
      setFocusDuration(timerDuration["focus-time"]);
      setShortBreakDuration(timerDuration["short-break"]);
      setLongBreakDuration(timerDuration["long-break"]);
      setFocusMusicSelected(focusMusic);
      setAlarmSelected(alarm);
    }
  }, [isOpen, timerDuration, focusMusic, alarm]);

  const handleSave = useCallback(() => {
    updateSettings(
      {
        "focus-time": focusDuration,
        "short-break": shortBreakDuration,
        "long-break": longBreakDuration,
      },
      focusMusicSelected,
      alarmSelected
    );

    onClose();
  }, [
    alarmSelected,
    updateSettings,
    focusDuration,
    focusMusicSelected,
    longBreakDuration,
    onClose,
    shortBreakDuration,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "5xl" }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Setting</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            rowGap={4}
          >
            <GridItem>
              <VStack align={"flex-start"}>
                <Text fontWeight={"bold"}>Time (minutes)</Text>
                <HStack>
                  <Text>Focus times</Text>
                  <NumberInput
                    min={1}
                    value={focusDuration}
                    onChange={(value) => setFocusDuration(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
                <HStack>
                  <Text>Short break</Text>
                  <NumberInput
                    min={1}
                    value={shortBreakDuration}
                    onChange={(value) => setShortBreakDuration(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
                <HStack>
                  <Text>Long break</Text>
                  <NumberInput
                    min={1}
                    value={longBreakDuration}
                    onChange={(value) => setLongBreakDuration(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align={"flex-start"}>
                <Text fontWeight={"bold"}>Sound</Text>
                <VStack width={"100%"} align={"flex-start"}>
                  <Text>Focus music</Text>
                  <Select
                    value={focusMusicSelected}
                    onChange={(event) =>
                      setFocusMusicSelected(event.target.value)
                    }
                  >
                    {FOCUS_MUSICS.map((music) => (
                      <option value={music.value} key={music.value}>
                        {music.name}
                      </option>
                    ))}
                  </Select>
                </VStack>
                <VStack width={"100%"} align={"flex-start"}>
                  <Text>Alarm</Text>
                  <Select
                    value={alarmSelected}
                    onChange={(event) => setAlarmSelected(event.target.value)}
                  >
                    {ALARMS.map((music) => (
                      <option value={music.value} key={music.value}>
                        {music.name}
                      </option>
                    ))}
                  </Select>
                </VStack>
              </VStack>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ModalSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
