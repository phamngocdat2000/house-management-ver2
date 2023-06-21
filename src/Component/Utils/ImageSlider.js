import React, { useState } from 'react';
import iconPrevious from "../../Image/previous.svg"
import iconNext from "../../Image/next.svg"
const ImageSlider = ({images}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const previousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    console.log(currentImageIndex)

    const currentImage = images[currentImageIndex];

    return (
        <div className="image-slider">
            <button className="image-slider-btn"
                    onClick={previousImage}
                    disabled={images.length === 1}>
                <img src={iconPrevious} alt="previous"/>
            </button>
            <div className="image-slider-img">
                <img style={{height:450,width:750}} src={currentImage} alt="Slider" />
            </div>
            <button className="image-slider-btn"
                    onClick={nextImage}
                    disabled={images.length === 1}>
                <img src={iconNext} alt="next"/>
            </button>
        </div>
    );
};

export default ImageSlider;