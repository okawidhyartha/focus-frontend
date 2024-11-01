import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Center } from "@chakra-ui/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const MUSIC_OPTIONS = [
  {
    name: "None",
    value: "none",
  },
  {
    name: "Calm",
    value: "calm",
  },
  {
    name: "Focus",
    value: "focus",
  },
  {
    name: "Relax",
    value: "relax",
  },
  {
    name: "Nature",
    value: "nature",
  },
  {
    name: "Rain",
    value: "rain",
  },
  {
    name: "Ocean",
    value: "ocean",
  },
  {
    name: "Forest",
    value: "forest",
  },
];

export default function FocusMusicSlider() {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={10}
      slidesPerView={"auto"}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      navigation
    //   pagination={{ clickable: true }}
    >
      {MUSIC_OPTIONS.map((option) => (
        <SwiperSlide style={{ width: "calc(100% / 4)" }} key={option.value}>
          <Center
            width="100%"
            height="100px"
            border="1px solid black"
            borderRadius="md"
          >
            {option.name}
          </Center>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
