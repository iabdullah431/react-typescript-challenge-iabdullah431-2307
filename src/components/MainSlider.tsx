import { useEffect, useState } from 'react';

const images = [
  '/main-slider/01.png',
  '/main-slider/02.png',
  '/main-slider/03.png'
];

function SimpleCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Use useEffect to automatically change slides with a back-and-forth effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + direction;
        if (nextIndex >= images.length) {
          setDirection(-1);
          return prevIndex - 1;
        } else if (nextIndex < 0) {
          setDirection(1);
          return prevIndex + 1;
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [direction]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setDirection(index > currentIndex ? 1 : -1);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Slider container */}
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${ // Reduced transition duration
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              width="100%"
              height="100%"
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>

      {/* Slide indicators - Placed outside the slider container */}
      <div className="mt-6 flex gap-2"> {/* Increased spacing between indicators */}
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 transition-all duration-300 rounded-full ${
              index === currentIndex ? 'w-16 bg-primary' : 'w-6 bg-gray-300' // Enlarged indicator size
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default SimpleCarousel;
