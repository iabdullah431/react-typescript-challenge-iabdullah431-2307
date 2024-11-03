import { useEffect, useState } from 'react';

const images = [
  '/main-slider/01.png',
  '/main-slider/02.png',
  '/main-slider/03.png'
];

function MainSlider() {
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current slide index
  const [direction, setDirection] = useState(1); // Controls slide direction (1 for forward, -1 for backward)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + direction;

        // Reverse direction when reaching the last or first slide
        if (nextIndex >= images.length) {
          setDirection(-1); // Go backward
          return prevIndex - 1;
        } else if (nextIndex < 0) {
          setDirection(1); // Go forward
          return prevIndex + 1;
        }
        return nextIndex; // Move to next slide based on direction
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [direction]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setDirection(index > currentIndex ? 1 : -1); // Adjust direction based on the selected slide
  };

  return (
    <div className="flex flex-col items-center">
      {/* Slider container with responsive height */}
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Slide indicators with adaptive sizes */}
      <div className="mt-3 sm:mt-4 flex gap-1 sm:gap-2 items-center justify-center">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 sm:w-10 bg-primary' : 'w-4 sm:w-5 bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default MainSlider;
