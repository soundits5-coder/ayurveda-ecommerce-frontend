import React from 'react';
import { LuStar } from 'react-icons/lu';

const StarRating = ({ rating = 0, numReviews }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <LuStar
        key={i}
        className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {numReviews !== undefined && (
        <span className="text-sm text-dark-muted ml-2">({numReviews} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;
