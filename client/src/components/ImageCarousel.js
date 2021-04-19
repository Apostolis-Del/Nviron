import { CarouselProvider, Image, Slide, Slider } from "pure-react-carousel";
import React from "react";
import { Divider } from "semantic-ui-react";
import logo1 from '../img/kalampaka.jpg'; // with import
import logo2 from '../img/portkatsiki.jpg'; // with import
import logo3 from '../img/ecology2.jpg'; // with import



import CustomDotGroup from "../components/CustomDotGroup";

// const mystyle={
//   width:"100%",
//   height:"50%"
// };

const ImageCarousel = () => (
  <CarouselProvider
    naturalSlideWidth={800}
    naturalSlideHeight={500}
    totalSlides={2}
    style={{color:"green"}}
  >
    <Slider>
      <Slide tag="a" index={0}>
        <h1 style={{ position: "absolute",
                    top: "40%",
                    left: "20%",
                    right:"15%",
                    color:"white",
                    textAlign:"center",
                    textShadow: "2px 2px 4px #606060	"}}>NVIRON is an environmental event planning and social media app that helps people discover
                          environmental events ,<br/>ranging from neighborhood to domestic enviromental events. </h1>
                          
        <Image src={logo1} />
      </Slide>
      <Slide tag="a" index={1}>
      <h1 style={{ position: "absolute",
                    top: "40%",
                    left: "20%",
                    right:"15%",
                    color:"white",
                    textAlign:"center",
                    textShadow: "2px 2px 4px #606060	"
                  }}>You can Sign Up and view all enviromental actions and organizations in your area and throughout Greece. </h1>
        <Image src={logo2} />
      </Slide>
       {/* <Slide tag="a" index={2}>
        <Image src={logo3}  />

      </Slide>  */}
    </Slider>

    <Divider />
    <CustomDotGroup slides={2} />
  </CarouselProvider>
);

export default ImageCarousel;