import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = '#ff9900' }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<Star key={i} size={16} fill={color} stroke={color} />);
    } else if (value >= i - 0.5) {
      stars.push(<StarHalf key={i} size={16} fill={color} stroke={color} />);
    } else {
      stars.push(<Star key={i} size={16} fill="transparent" stroke="#cbd5e1" />);
    }
  }

  return (
    <div className="rating-container">
      <div className="stars">{stars}</div>
      {text && <span className="review-count">{text}</span>}
    </div>
  );
};

export default Rating;
