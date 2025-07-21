import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const RatingStars = ({ rating, small=false }) => {
  // Calculate full stars, half stars, and empty stars based on the rating
  const fullStars = Math.floor(rating); // Full stars (4 for 4.7)
  const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star (true for 4.7)
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars to make total 5
  
  return (
    <div className="  reviewStarContainer" style={{ display: 'flex', alignItems: 'center' }}>
      {/* Display full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <BsStarFill key={`full-${index}`}   className={`ms-1 ${small==true ? 'fs-6' : 'fs-5'}`} />
      ))}

      {/* Display half star */}
      {hasHalfStar && <BsStarHalf className={`ms-1 ${small==true ? 'fs-6' : 'fs-5'}`} />}

      {/* Display empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <BsStar key={`empty-${index}`} className= {`ms-1 ${small==true ? 'fs-6' : 'fs-5'}`} />
      ))}
    </div>
  );
};

export default RatingStars;
