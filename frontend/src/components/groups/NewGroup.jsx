import React, { useState } from 'react';
import ApiService from '../../services/api';
import './NewGroup.css';

export default function NewGroup({ user, onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['']);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    if (tags.length < 5) {
      setTags([...tags, '']);
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags.length === 0 ? [''] : newTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (!description.trim()) {
      setError('Group description is required');
      return;
    }

    // Filter empty tags
    const filteredTags = tags.filter(tag => tag.trim() !== '');

    if (filteredTags.length === 0) {
      setError('Please add at least one tag');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await ApiService.createGroup({
        name: groupName.trim(),
        description: description.trim(),
        tags: filteredTags,
        isPrivate: isPrivate,
        adminId: user.id
      });

      if (result.success) {
        console.log('Group created successfully:', result.data);
        if (onGroupCreated) {
          onGroupCreated(result.data);
        }
        onClose();
      } else {
        setError(result.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Error creating group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newgroup-overlay" onClick={onClose}>
      <div className="newgroup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="newgroup-header">
          <h2>Create New Group</h2>
          <button className="newgroup-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="newgroup-form">
          {error && (
            <div className="newgroup-error">
              ⚠️ {error}
            </div>
          )}

          {/* Group Name */}
          <div className="form-group">
            <label htmlFor="groupName">Group Name *</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., React Developers Israel"
              maxLength={100}
              disabled={isSubmitting}
            />
            <span className="char-count">{groupName.length}/100</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Group Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your group and its purpose..."
              maxLength={500}
              rows={4}
              disabled={isSubmitting}
            />
            <span className="char-count">{description.length}/500</span>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags * (Maximum 5)</label>
            <div className="tags-container">
              {tags.map((tag, index) => (
                <div key={index} className="tag-input-group">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder={`Tag ${index + 1}`}
                    maxLength={20}
                    disabled={isSubmitting}
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      className="remove-tag-btn"
                      onClick={() => removeTag(index)}
                      disabled={isSubmitting}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {tags.length < 5 && (
              <button
                type="button"
                className="add-tag-btn"
                onClick={addTag}
                disabled={isSubmitting}
              >
                + Add Tag
              </button>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="checkbox-label">🔒 Private Group (requires admin approval to join)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⌛ Creating...' : '✨ Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

