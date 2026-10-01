import React, { useState } from 'react';

const ProductGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no images provided, use placeholders
  const displayImages = images.length > 0 ? images : [
    'placeholder-1', 'placeholder-2', 'placeholder-3', 'placeholder-4'
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square rounded-2xl bg-cream-DEFAULT flex items-center justify-center overflow-hidden border border-gray-100">
        {images.length > 0 ? (
          <img 
            src={displayImages[activeIndex]} 
            alt="Product view" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-9xl">🌿</div>
        )}
      </div>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar py-1">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-cream-light flex items-center justify-center overflow-hidden border-2 transition-all ${
              activeIndex === index ? 'border-ayurveda' : 'border-transparent hover:border-gray-300'
            }`}
          >
            {images.length > 0 ? (
               <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🌱</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
