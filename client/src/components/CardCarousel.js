import { CarouselProvider, Slider } from "pure-react-carousel";
import React from "react";

import CustomCardSlide from "../components/CustomCardSlide";
import CustomDotGroup from "../components/CustomDotGroup";

const CardCarousel = () => (
  <CarouselProvider
    naturalSlideWidth={1}
    naturalSlideHeight={1.25}
    totalSlides={3}
    style={{ width: "300px" }}
    
  >
    <Slider>
      <CustomCardSlide
        image="https://www.lg.com/gr/images/TV/features/TV-UHD-UM71-02-4K-Resolution-Desktop01.jpg"
        index={0}
        header="Matthew House"
        meta="Friend"
      />
      <CustomCardSlide
        header="Elliot Baker"
        image="https://www.sony.gr/image/bc6d25fa6371c2899ce704a2bed7614c?fmt=png-alpha&wid=960"
        index={1}
        meta="Friend"
      />
      <CustomCardSlide
        header="Steve Sanders"
        image="https://place-hold.it/800x800&text=Steve&fontsize=32"
        index={2}
        meta="Friend"
      />
    </Slider>

    <CustomDotGroup slides={3} />
  </CarouselProvider>
);

export default CardCarousel;