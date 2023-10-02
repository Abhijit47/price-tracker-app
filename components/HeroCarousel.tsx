'use client';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';

const heroImages = [
  { imgURL: '/assets/images/hero-1.svg', alt: 'smartwatch' },
  { imgURL: '/assets/images/hero-2.svg', alt: 'bag' },
  { imgURL: '/assets/images/hero-3.svg', alt: 'lamp' },
  { imgURL: '/assets/images/hero-4.svg', alt: 'air frywer' },
  { imgURL: '/assets/images/hero-5.svg', alt: 'chair' },
];

const HeroCarousel = () => {
  return (
    <div className='hero-carousel'>
      <Carousel
        showThumbs={false}
        showArrows={false}
        showStatus={false}
        autoPlay
        interval={2000}
        infiniteLoop>
        {heroImages.map((image) => (
          <Image
            src={image.imgURL}
            alt={image.alt}
            width={428}
            height={428}
            className='object-contain'
            key={image.alt}
          />
        ))}
      </Carousel>
      <Image
        src={'/assets/icons/hand-drawn-arrow.svg'}
        alt='arrow'
        width={175}
        height={175}
        // style={{ width: '175px', height: '175px' }}
        className='max-xl:hidden absolute -left-[15%] bottom-0 z-0'
      />
    </div>
  );
};

export default HeroCarousel;
