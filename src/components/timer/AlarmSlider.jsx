import { Swiper, SwiperSlide } from "swiper/react";
import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ReactPlayer from "react-player";
import { useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { ALARMS } from "../../helpers/constants";
import { useSettings } from "../../hooks/useSettings";

export default function AlarmSlider() {
  const toast = useToast();
  const { alarm, setAlarm, setIsVisibleAlarmSetting, editSettings } =
    useSettings();
  const [previewMusic, setPreviewMusic] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(alarm);
  const [swiper, setSwiper] = useState(null);

  const swiperSlideWidth = useBreakpointValue({
    base: "calc(100% / 2.5)",
    md: "calc(100% / 4.5)",
  });

  const handlePrev = () => {
    if (swiper) swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiper) swiper.slideNext();
  };

  const handleApply = () => {
    setAlarm(selected);
    toast({
      title: "Alarm applied!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
    setIsVisibleAlarmSetting(false);
    editSettings();
  };

  const handleClose = () => {
    setIsVisibleAlarmSetting(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      position={"relative"}
      mt={4}
    >
      <Box position={"relative"} mb={4}>
        <Swiper
          style={{ borderRadius: "10px" }}
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={"auto"}
          onSwiper={(swiper) => setSwiper(swiper)}
        >
          {ALARMS.map((option) => (
            <SwiperSlide style={{ width: swiperSlideWidth }} key={option.value}>
              <Box
                width="100%"
                height={{base: "80px", md: "100px"}}
                borderRadius="10px"
                bg={
                  option.background
                    ? `url(${option.background})`
                    : "rgba(0,0,0,0.8)"
                }
                bgSize="cover"
                cursor="pointer"
                onClick={() => {
                  setSelected(option.value);
                }}
              >
                <Center
                  width="100%"
                  height={{base: "80px", md: "100px"}}
                  backdropFilter={option.background ? "brightness(0.6)" : ""}
                  borderRadius="10px"
                  border={
                    selected === option.value
                      ? "3px solid white"
                      : "1px solid black"
                  }
                  fontSize={{base: "14px", md: "16px"}}
                  _hover={{
                    backdropFilter: option.background ? "brightness(0.3)" : "",
                  }}
                  transition="backdrop-filter 0.3s"
                  color="white"
                  onMouseEnter={() => {
                    setPreviewMusic(option.audio);
                    setPlaying(true);
                  }}
                  onMouseLeave={() => {
                    setPreviewMusic(null);
                    setPlaying(false);
                  }}
                >
                  {option.name}
                </Center>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Box display="none">
          <ReactPlayer
            url={previewMusic}
            playing={playing}
            playsinline
            progressInterval={500}
          />
        </Box>
        <IconButton
          borderRadius="full"
          position="absolute"
          display={{ base: "none", md: "flex" }}
          top="50%"
          left="-20px"
          transform="translate(0, -50%)"
          zIndex={2}
          onClick={handlePrev}
        >
          <IconChevronLeft />
        </IconButton>
        <IconButton
          borderRadius="full"
          position="absolute"
          display={{ base: "none", md: "flex" }}
          top="50%"
          right="-20px"
          transform="translate(0, -50%)"
          zIndex={2}
          onClick={handleNext}
        >
          <IconChevronRight />
        </IconButton>
      </Box>
      <HStack alignSelf="end">
        <Button
          width="fit-content"
          leftIcon={<IconCircleX />}
          onClick={handleClose}
          fontSize={{base: "14px", md: "16px"}}
        >
          Close
        </Button>
        <Button
          width="fit-content"
          leftIcon={<IconCircleCheck />}
          onClick={handleApply}
          fontSize={{base: "14px", md: "16px"}}
        >
          Apply
        </Button>
      </HStack>
    </Box>
  );
}
