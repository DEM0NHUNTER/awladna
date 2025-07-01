import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Use Lucide icons or similar SVGs
const LucideStar = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

// All feedback icons use the same wrapper for consistency
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm">
    {children}
  </span>
);
const MessageSquare = () => (
  <IconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#2979FF" strokeWidth="2" fill="#fff"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke="#2979FF" strokeWidth="2" strokeLinecap="round"/></svg>
  </IconWrapper>
);
const ThumbsUp = () => (
  <IconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 10V5a3 3 0 013-3h4a3 3 0 013 3v5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10v10a2 2 0 002 2h2a2 2 0 002-2V10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </IconWrapper>
);
const Clock = () => (
  <IconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FB923C" strokeWidth="2" fill="#fff"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" stroke="#FB923C"/></svg>
  </IconWrapper>
);
const CheckCircle = () => (
  <IconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#A78BFA" strokeWidth="2" fill="#fff"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" stroke="#A78BFA"/></svg>
  </IconWrapper>
);
const Zap = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="13 2 2 22 22 22" strokeWidth="2" /></svg>
);
const Send = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" strokeWidth="2" /><polygon points="22 2 15 22 11 13 2 9 22 2" strokeWidth="2" /></svg>
);

interface FeedbackRating {
  modelResponse: number;
  userExperience: number;
  responseTime: number;
  helpfulness: number;
  responseSpeed: number;
}

export default function Feedback() {
  const { t, i18n } = useTranslation();
  const [ratings, setRatings] = useState<FeedbackRating>({
    modelResponse: 0,
    userExperience: 0,
    responseTime: 0,
    helpfulness: 0,
    responseSpeed: 0
  });
  const [comments, setComments] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackCategories = [
    {
      title: 'aiModelResponse',
      description: 'aiModelResponseDesc',
      icon: MessageSquare,
    },
    {
      title: 'overallExperience',
      description: 'overallExperienceDesc',
      icon: ThumbsUp,
    },
    {
      title: 'responseTime',
      description: 'responseTimeDesc',
      icon: Clock,
    },
    {
      title: 'helpfulness',
      description: 'helpfulnessDesc',
      icon: CheckCircle,
    }
  ];

  const handleRatingChange = (category: keyof FeedbackRating, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setRatings({
        modelResponse: 0,
        userExperience: 0,
        responseTime: 0,
        helpfulness: 0,
        responseSpeed: 0
      });
      setComments('');
      setWouldRecommend(null);
    }, 3000);
  };

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    size = 'w-6 h-6' 
  }: { 
    rating: number; 
    onRatingChange: (rating: number) => void;
    size?: string;
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`${size} transition-colors hover:scale-110 transform`}
          >
            <LucideStar
              className={`w-full h-full ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
              fill={star <= rating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {rating}/5 stars
          </span>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('thankYou')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('feedbackReceived')}
            </p>
            <div className="animate-pulse">
              <div className="w-8 h-1 bg-blue-500 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('feedback')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('helpImprove')}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              {t('optional')}
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('rateExperience')}
            </h2>
            <div className="space-y-8">
              {feedbackCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.title} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <IconComponent />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t(category.title)}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {t(category.description)}
                        </p>
                        <StarRating
                          rating={ratings[category.title as keyof FeedbackRating]}
                          onRatingChange={(rating) => handleRatingChange(category.title as keyof FeedbackRating, rating)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('recommendation')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('recommendQuestion')}
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setWouldRecommend(true)}
                className={`flex-1 py-3 px-6 rounded-lg border-2 font-semibold transition-all ${
                  wouldRecommend === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                {t('yes')}
              </button>
              <button
                type="button"
                onClick={() => setWouldRecommend(false)}
                className={`flex-1 py-3 px-6 rounded-lg border-2 font-semibold transition-all ${
                  wouldRecommend === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 text-gray-700 hover:border-red-300'
                }`}
              >
                {t('no')}
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('additionalComments')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('commentsDescription')}
            </p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t('commentsPlaceholder')}
            />
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('submitFeedback')}
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              {t('submitNote')}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 