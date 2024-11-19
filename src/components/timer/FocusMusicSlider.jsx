import { Swiper, SwiperSlide } from "swiper/react";
import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
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
import { FOCUS_MUSICS } from "../../helpers/constants";
import { useSettings } from "../../hooks/useSettings";

export default function FocusMusicSlider() {
  const toast = useToast();
  const {
    setFocusBackgroundPreview,
    setIsVisibleFocusMusicSetting,
    focusMusic,
    setFocusMusic,
    editSettings,
  } = useSettings();

  const [previewMusic, setPreviewMusic] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(focusMusic);
  const [swiper, setSwiper] = useState(null);

  const handlePrev = () => {
    if (swiper) swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiper) swiper.slideNext();
  };

  const handleApply = () => {
    setFocusMusic(selected);
    toast({
      title: "Focus music applied!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
    setIsVisibleFocusMusicSetting(false);
    editSettings();
  };

  const handleClose = () => {
    setIsVisibleFocusMusicSetting(false);
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
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => setSwiper(swiper)}
        >
          {FOCUS_MUSICS.map((option) => (
            <SwiperSlide style={{ width: "calc(100% / 4)" }} key={option.value}>
              <Box
                width="100%"
                height="100px"
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
                  height="100px"
                  backdropFilter={option.background ? "brightness(0.6)" : ""}
                  borderRadius="10px"
                  border={
                    selected === option.value
                      ? "3px solid white"
                      : "1px solid black"
                  }
                  _hover={{
                    backdropFilter: option.background ? "brightness(0.3)" : "",
                  }}
                  transition="backdrop-filter 0.3s"
                  color="white"
                  onMouseEnter={() => {
                    setPreviewMusic(option.audio);
                    setFocusBackgroundPreview(option.background);
                    setPlaying(true);
                  }}
                  onMouseLeave={() => {
                    setPreviewMusic(null);
                    setFocusBackgroundPreview(null);
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
        >
          Close
        </Button>
        <Button
          width="fit-content"
          leftIcon={<IconCircleCheck />}
          onClick={handleApply}
        >
          Apply
        </Button>
      </HStack>
    </Box>
  );
}
