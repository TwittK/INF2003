// bookreviews.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './bookreviews.css';

function BookReviews({ user }) { // Accept user as a prop
    const { bookId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [bookTitle, setBookTitle] = useState(""); 
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviewsAndBookDetails = async () => {
            try {
                // Fetch book details to get the title
                const bookResponse = await fetch(`http://localhost:5000/books/${bookId}`);
                if (!bookResponse.ok) {
                    throw new Error("Failed to fetch book details");
                }
                const bookData = await bookResponse.json();
                setBookTitle(bookData.title);

                // Fetch reviews for the book
                const reviewsResponse = await fetch(`http://localhost:5000/reviews/${bookId}`);
                if (!reviewsResponse.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const reviewsData = await reviewsResponse.json();
                setReviews(reviewsData);
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReviewsAndBookDetails();
    }, [bookId]);

    const submitReview = async () => {
        if (!user) {
            alert("You need to be logged in to submit a review.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/add_review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: Number(user.userID), // Use user ID from the user prop
                    book_id: Number(bookId),
                    review_text: reviewText,
                    rating: rating
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Review submitted successfully!');
                setReviewText('');
                setRating(0);
                setReviews([...reviews, { reviewText, rating, username: user.name, reviewDate: new Date() }]);
            } else {
                alert('Error submitting review: ' + data.error);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (loading) {
        return <div>Loading reviews...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="reviews-container">
            <h1>Reviews for {bookTitle}</h1>
            {reviews.length === 0 ? (
                <p>No reviews yet for this book.</p>
            ) : (
                reviews.map((review, index) => (
                    <div key={review._id || index} className="review-card">
                        <p><strong>Reviewer:</strong> {review.username || "Anonymous"}</p>
                        <p><strong>Rating:</strong> {review.rating} / 5</p>
                        <p><strong>Review:</strong> {review.reviewText}</p>
                        <p><em>Reviewed on {new Date(review.reviewDate).toLocaleDateString()}</em></p>
                    </div>
                ))
            )}

            {/* Review Form */}
            <div className="review-form">
                <h2>Submit Your Review</h2>
                <textarea
                    placeholder="Write your review here"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />
                <div className='rating'>
                {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num}>
                        <input
                            type="radio"
                            name="rating"
                            value={num}
                            checked={rating === num}
                            onChange={(e) => setRating(Number(e.target.value))}
                            aria-label={`Rate ${num} out of 5`}
                        />
                        <span
                            className={`heart ${num <= rating ? "active" : ""}`}
                        >
                            &#x2764; {/* Unicode for filled heart */}
                        </span>
                    </label>
                ))}
                </div>
                <button onClick={submitReview}>Submit Review</button>
            </div>
        </div>
    );
}

export default BookReviews;
