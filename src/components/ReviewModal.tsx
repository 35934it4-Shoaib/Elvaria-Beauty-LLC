import React, { useState } from 'react';
import { X, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId = 'prod-elvaria-body-lotion',
  productName = 'ELVARIA Medicated Body Lotion',
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setError('Please provide your name and review details.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await api.submitReview({
        productId,
        productName,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        rating,
        title: title.trim(),
        content: content.trim(),
        isVerifiedPurchase: isVerified,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Failed to submit review.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setError('');
    setAuthorName('');
    setAuthorEmail('');
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div id="review-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#202420]/50 backdrop-blur-xs transition-opacity"
        onClick={handleResetAndClose}
      />

      <div className="relative bg-[#F7F5F0] border border-[#DCDDD8] max-w-lg w-full p-6 sm:p-8 z-10 shadow-2xl overflow-hidden my-8">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-[#68706B] hover:text-[#202420] rounded-full hover:bg-[#EFEAE2] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#DDE5DF] text-[#62756A] flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#202420]">Thank You for Your Feedback</h3>
            <p className="text-sm text-[#68706B] max-w-sm mx-auto leading-relaxed">
              Your review for <strong>{productName}</strong> has been submitted. To uphold authenticity and avoid spam, reviews are verified by our team before appearing publicly.
            </p>
            <button
              onClick={handleResetAndClose}
              className="bg-[#62756A] text-[#F7F5F0] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors mt-2"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#62756A]">
              Community Experience
            </span>
            <h2 className="font-heading text-xl font-bold text-[#202420] mt-1 mb-1">
              Share Your ELVARIA BEAUTY Experience
            </h2>
            <p className="text-xs text-[#68706B] mb-6">
              Reviewing: <strong>{productName}</strong>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-xs rounded mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Rating selection */}
              <div>
                <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1.5">
                  Rating
                </label>
                <div className="flex gap-2 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-[#DCDDD8]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Sarah K."
                    className="w-full bg-white border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                  />
                </div>
                <div>
                  <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                    Your Email (Private)
                  </label>
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full bg-white border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Excellent comforting moisture for winter dryness"
                  className="w-full bg-white border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                  Detailed Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="How did the lotion feel on your skin? Describe texture, absorption, and hydration..."
                  className="w-full bg-white border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified-check"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="rounded text-[#62756A] focus:ring-[#62756A]"
                />
                <label htmlFor="verified-check" className="text-[11px] text-[#68706B]">
                  I confirm that this review is based on my genuine personal use of ELVARIA BEAUTY.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#62756A] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors mt-2"
              >
                {loading ? 'Submitting...' : 'Submit Review for Moderation'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
