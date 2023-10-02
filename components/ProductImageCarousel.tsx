'use client';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';

const ProductImageCarousel = ({ product }: any) => {
  // const productImages = product.imagesUrls
  return (
    <div>
      <Carousel
        showThumbs={false}
        showArrows={false}
        showStatus={false}
        autoPlay
        interval={2000}
        infiniteLoop>
        {/* {productImages?.map((image: string, index: number) => (
          <Image
            src={image}
            alt={'product_image-' + index}
            width={428}
            height={428}
            className='object-contain'
            key={index}
          />
        ))} */}
      </Carousel>
    </div>
  );
};

export default ProductImageCarousel;
