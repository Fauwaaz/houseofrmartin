"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const Review = ({ productId, productSlug, comments = [] }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const normalizeComments = (nodes) => {
    if (!Array.isArray(nodes)) return [];

    return nodes.map((c) => {
      let rating = 0;
      if (Array.isArray(c.commentMeta)) {
        const ratingMeta = c.commentMeta.find((m) => m.key === "rating");
        if (ratingMeta) rating = parseInt(ratingMeta.value || 0, 10);
      }

      return {
        id: c.id || c.commentId || `${c.author?.name}-${c.date}`,
        author: c.author?.name || "Anonymous",
        email: c.author?.email || "",
        rating: rating,
        content:
          typeof c.content === "object" && c.content.rendered
            ? c.content.rendered
            : c.content || "",
        date: c.date || null,
      };
    });
  };


  useEffect(() => {
    if (comments && comments.length > 0) {
      setReviews(normalizeComments(comments));
    }
    setLoading(false);
  }, [comments]);

  // Handle new review submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment || !name || !email) {
      toast.error("Please fill all fields and select a rating.");
      return;
    }

    try {
      const res = await axios.post("/api/woo/create-review", {
        productId,
        rating,
        review: comment,
        reviewer: name,
        reviewer_email: email,
      });

      if (res.data.success) {
        toast.success("Review submitted successfully!");
        // Optimistically add review to the list
        const newReview = {
          id: Date.now(),
          author: name,
          email,
          rating,
          content: comment,
          date: new Date().toISOString(),
        };
        setReviews((prev) => [newReview, ...prev]);

        // Reset form
        setRating(0);
        setComment("");
        setName("");
        setEmail("");
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Unable to submit review.");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-geograph text-lg mb-2">Customer Reviews</h3>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3 mb-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-3">
              <div className="flex items-center gap-1 text-yellow-500 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i <= (review.rating || 0) ? "#facc15" : "none"}
                    stroke="#facc15"
                  />
                ))}
              </div>
              <p
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: review.content }}
              />
              <p className="text-xs text-gray-500 mt-1">
                - {review.author || "Anonymous"}
                {review.date
                  ? ` on ${new Date(review.date).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-0">
        <h4 className="font-geograph text-md">Add Your Review</h4>

        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={22}
              fill={star <= rating ? "#facc15" : "none"}
              stroke="#facc15"
              className="cursor-pointer"
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <input
          type="text"
          placeholder="Your Name"
          className="border rounded w-full px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Your Email"
          className="border rounded w-full px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Your Review"
          className="border rounded w-full px-3 py-2 text-sm"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Review;