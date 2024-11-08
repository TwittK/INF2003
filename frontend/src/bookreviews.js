import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BookReviews() {
    const { bookId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [bookTitle, setBookTitle] = useState(""); 
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
                reviews.map((review) => (
                    <div key={review._id} className="review-card">
                        <p><strong>Reviewer:</strong> {review.username || "Anonymous"}</p>
                        <p><strong>Rating:</strong> {review.rating} / 5</p>
                        <p><strong>Review:</strong> {review.reviewText}</p>
                        <p><em>Reviewed on {new Date(review.reviewDate).toLocaleDateString()}</em></p>
                    </div>
                ))
            )}
        </div>
    );
}

export default BookReviews;
