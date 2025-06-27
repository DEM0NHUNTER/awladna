// front_end/src/components/FeedbackForm.tsx
import React, { useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { motion } from "framer-motion";

interface FeedbackFormProps {
  chatLogId: string;
  onSubmit?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ chatLogId, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/auth/feedback/", {
        chat_log_id: chatLogId,
        rating,
        comment
      });
      onSubmit?.();
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="mt-4 p-3 bg-white/10 rounded-lg"
    >
      <h4 className="text-sm font-medium text-white mb-2">Rate this response</h4>

      {/* Star Rating */}
      <div
        className="flex space-x-2 mb-2"
        onMouseLeave={() => setHoveredStar(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            whileHover={{ scale: 1.2 }}
            className={`text-2xl ${
              (hoveredStar && star <= hoveredStar) || star <= rating
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            ★
          </motion.button>
        ))}
      </div>

      {/* Comment Box */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-blue-500"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </motion.form>
  );
};

export default FeedbackForm;