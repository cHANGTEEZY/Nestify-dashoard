import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useGetReviewsQuery } from '../state/api';

// Utility function to format relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

const StarRating = ({ rating }) => {
  const stars = [];
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} className="text-yellow-400 bg-white" />);
  }
  
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="star-half" className="text-yellow-400 bg-white" />);
  }
  
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`star-empty-${i}`} className="text-yellow-400 bg-white" />);
  }
  
  return <div className="flex items-center gap-0.5 bg-white">{stars}</div>;
};

const Reviews = () => {
  const { data: reviews, isLoading: isLoadingReviews, error: errorReviews } = useGetReviewsQuery();

  if (isLoadingReviews) return <div>Fetching Data...</div>;
  if (errorReviews) return <div>Error Fetching Data...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {reviews.slice(0, 3).map((review) => (
        <div key={review.review_id} className="flex mb-4 border-b last:border-b-0 justify-between bg-white">

          <div className='flex flex-col bg-white'>
          <div className="flex items-center gap-2 mb-1 bg-white">
            <h2 className="font-semibold text-lg bg-white">{review.user_name}</h2>
          </div>
          <p className="text-gray-700 text-sm tracking-tight bg-white">{review.review_message}</p>
            <p className="text-sm text-gray-500 bg-white">
              {getRelativeTime(review.review_date_time)}
            </p>
            <h3 className="font-medium text-black bg-white">
              {review.property_title}
            </h3>
          </div>
            <div className='bg-white'>
             <StarRating rating={review.rating} />
            </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;