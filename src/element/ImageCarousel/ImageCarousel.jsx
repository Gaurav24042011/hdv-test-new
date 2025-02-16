import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ImageCarousel.scss'

const ImageCarousel = ({images, dots=true, infinite=true, autoplay=true, arrows=true}) => {
  const settings = {
    dots: dots,              // Show navigation dots
    infinite: infinite,          // Infinite looping
    speed: 500,              // Transition speed
    slidesToShow: 1,         // Number of slides to show
    slidesToScroll: 1,       // Number of slides to scroll
    autoplay: autoplay,          // Enable auto-slide
    autoplaySpeed: 2000,     // Auto-slide interval in milliseconds
    arrows: arrows,            // Show next/prev arrows
  };

  return (
    <div className="carousel">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;
