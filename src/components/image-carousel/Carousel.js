import React from "react";
import { Image } from "semantic-ui-react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import Thumbnails from '../image-carousel/Thumbnails';
import 'pure-react-carousel/dist/react-carousel.es.css';

const Carousel = ({images}) => (
  <CarouselProvider
    naturalSlideWidth={300}
    naturalSlideHeight={300}
    totalSlides={images.length}
    infinite={true}
  >
    <div className="carousel-body">
      <Slider>
        {images.map( (image, i) => (
          <Slide index={i} key={image.id}>
            <Image
              src={image.url}
              alt={image.name}/>
          </Slide>

        ))}
      </Slider>
      <ButtonBack
        className="carousel-ctrl back">
        <i className="angle left icon"></i>
      </ButtonBack>
      <ButtonNext
        className="carousel-ctrl next">
        <i className="angle right icon"></i>
      </ButtonNext>
    </div>
    <Thumbnails images={images} />
  </CarouselProvider>
);

export default Carousel;
