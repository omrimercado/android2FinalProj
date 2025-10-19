import React, { useState } from 'react';
import './NewPost.css';
import { getAvatar } from '../utils/helpers';

function NewPost({ user, onPostCreated }) {
  const [postContent, setPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [mediaType, setMediaType] = useState(''); // 'image' or 'video'

  const handleCreatePost = () => {
    if (!postContent.trim() && !imageUrl && !videoUrl) return;
    
    const newPost = {
      id: Date.now(),
      userId: user.id,
      content: postContent,
      image: imageUrl || null,
      video: videoUrl || null, // HTML5 Video Support
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
    };
    
    if (onPostCreated) {
      onPostCreated(newPost);
    }
    
    // Reset file inputs
    const imageInput = document.getElementById('image-file-input');
    const videoInput = document.getElementById('video-file-input');
    if (imageInput) imageInput.value = '';
    if (videoInput) videoInput.value = '';
    
    // Reset form (don't revoke URLs here as they're now part of the post)
    setPostContent('');
    setImageUrl('');
    setVideoUrl('');
    setShowMediaInput(false);
    setMediaType('');
  };

  const handleAddImage = () => {
    // Trigger file input click
    document.getElementById('image-file-input').click();
  };

  const handleImageFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file only (JPG, PNG, GIF, etc.)');
        return;
      }

      // Check file size (max 10MB for image)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file is too large. Please select an image up to 10MB');
        return;
      }

      // Create local URL for preview
      const imageURL = URL.createObjectURL(file);
      setImageUrl(imageURL);
      setVideoUrl(''); // Clear video if image is selected
      setMediaType('image');
      setShowMediaInput(false);
    }
  };

  const handleAddVideo = () => {
    // Trigger file input click
    document.getElementById('video-file-input').click();
  };

  const handleVideoFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file only (MP4, WebM, etc.)');
        return;
      }

      // Check file size (max 50MB for video)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file is too large. Please select a video up to 50MB');
        return;
      }

      // Create local URL for preview
      const videoURL = URL.createObjectURL(file);
      setVideoUrl(videoURL);
      setImageUrl(''); // Clear image if video is selected
      setMediaType('video');
      setShowMediaInput(false);
    }
  };

  const handleRemoveMedia = () => {
    // Revoke object URLs to prevent memory leaks
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    
    // Reset file inputs
    const imageInput = document.getElementById('image-file-input');
    const videoInput = document.getElementById('video-file-input');
    if (imageInput) imageInput.value = '';
    if (videoInput) videoInput.value = '';
    
    setImageUrl('');
    setVideoUrl('');
    setShowMediaInput(false);
    setMediaType('');
  };

  return (
    <div className="new-post-section">
      <div className="new-post-box">
        <img src={getAvatar(user.avatar, user.name)} alt={user.name} className="user-avatar" />
        <input 
          type="text" 
          placeholder="What's on your mind?" 
          className="new-post-input"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !showMediaInput && handleCreatePost()}
        />
      </div>

      {/* Hidden file inputs for media upload */}
      <input
        id="image-file-input"
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        style={{ display: 'none' }}
      />
      <input
        id="video-file-input"
        type="file"
        accept="video/*"
        onChange={handleVideoFileSelect}
        style={{ display: 'none' }}
      />

      {/* Media Preview - Image */}
      {imageUrl && (
        <div className="media-preview">
          <div className="media-preview-header">
            <span className="media-label">🖼️ Image attached</span>
            <button className="remove-preview-btn" onClick={handleRemoveMedia}>
              ✕ Remove
            </button>
          </div>
          <img src={imageUrl} alt="Preview" className="preview-image" />
        </div>
      )}

      {/* HTML5 Video Preview */}
      {videoUrl && (
        <div className="media-preview">
          <div className="media-preview-header">
            <span className="media-label">📹 Video attached</span>
            <button className="remove-preview-btn" onClick={handleRemoveMedia}>
              ✕ Remove
            </button>
          </div>
          <video controls className="preview-video" key={videoUrl}>
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser doesn't support the video tag.
          </video>
        </div>
      )}

      <div className="new-post-actions">
        <div className="media-buttons">
          <button 
            className="media-action-btn"
            onClick={handleAddImage}
            title="Add Image"
          >
            🖼️ Photo
          </button>
          <button 
            className="media-action-btn video-btn"
            onClick={handleAddVideo}
            title="Add Video"
          >
            🎥 Video
          </button>
        </div>
        <button 
          className="post-button"
          onClick={handleCreatePost}
          disabled={!postContent.trim() && !imageUrl && !videoUrl}
        >
          POST
        </button>
      </div>
    </div>
  );
}

export default NewPost;
