import React, { useState, useEffect } from 'react';
import './AIPostModal.css';

const STYLES = [
  { value: 'professional', label: 'Professional', icon: '💼', description: 'Authoritative and industry-focused' },
  { value: 'casual', label: 'Casual', icon: '😊', description: 'Friendly and conversational' },
  { value: 'funny', label: 'Funny', icon: '😄', description: 'Humorous and entertaining' },
  { value: 'inspirational', label: 'Inspirational', icon: '✨', description: 'Motivational and uplifting' },
  { value: 'storytelling', label: 'Storytelling', icon: '📖', description: 'Narrative and engaging' }
];

const LENGTHS = [
  { value: 'short', label: 'Short', description: '1-2 sentences, quick and punchy' },
  { value: 'medium', label: 'Medium', description: '3-5 sentences, balanced content' },
  { value: 'long', label: 'Long', description: '6+ sentences, detailed and comprehensive' }
];

function AIPostModal({ isOpen, onClose, onGenerate }) {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('casual');
  const [selectedLength, setSelectedLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTopic('');
      setSelectedStyle('casual');
      setSelectedLength('medium');
      setError(null);
      setIsGenerating(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    if (topic.trim().length < 3) {
      setError('Topic must be at least 3 characters');
      return;
    }

    if (topic.trim().length > 500) {
      setError('Topic must be less than 500 characters');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      await onGenerate({
        topic: topic.trim(),
        style: selectedStyle,
        length: selectedLength
      });

      // Don't close modal here - parent will handle it after showing preview
    } catch (err) {
      setError(err.message || 'Failed to generate post');
      setIsGenerating(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isGenerating) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-modal-overlay" onClick={handleBackdropClick}>
      <div className="ai-modal-content">
        <div className="ai-modal-header">
          <h2>Generate Post with AI</h2>
          <button
            className="ai-modal-close"
            onClick={onClose}
            disabled={isGenerating}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ai-modal-form">
          {/* Topic Input */}
          <div className="ai-form-group">
            <label htmlFor="topic-input" className="ai-label">
              What's your topic?
              <span className="ai-label-required">*</span>
            </label>
            <textarea
              id="topic-input"
              className="ai-topic-input"
              placeholder="e.g., The importance of work-life balance in tech industry..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={500}
              rows={2}
              disabled={isGenerating}
              autoFocus
            />
            <div className="ai-char-count">
              {topic.length} / 500 characters
            </div>
          </div>

          {/* Style Selector */}
          <div className="ai-form-group">
            <label className="ai-label">Choose a style</label>
            <div className="ai-style-grid">
              {STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  className={`ai-style-option ${selectedStyle === style.value ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(style.value)}
                  disabled={isGenerating}
                >
                  <span className="ai-style-icon">{style.icon}</span>
                  <span className="ai-style-label">{style.label}</span>
                  <span className="ai-style-desc">{style.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Length Selector */}
          <div className="ai-form-group">
            <label className="ai-label">Post length</label>
            <div className="ai-length-options">
              {LENGTHS.map((length) => (
                <button
                  key={length.value}
                  type="button"
                  className={`ai-length-option ${selectedLength === length.value ? 'selected' : ''}`}
                  onClick={() => setSelectedLength(length.value)}
                  disabled={isGenerating}
                >
                  <span className="ai-length-label">{length.label}</span>
                  <span className="ai-length-desc">{length.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="ai-error-message">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="ai-modal-actions">
            <button
              type="button"
              className="ai-cancel-button"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ai-generate-button"
              disabled={!topic.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="ai-spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  Generate Post
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="ai-info-section">
          <p className="ai-info-text">
            Our AI will analyze your topic and create an engaging social media post in your selected style.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIPostModal;
