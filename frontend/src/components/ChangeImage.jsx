import React, { useState, useRef, useEffect } from 'react';
import ApiService from '../services/api';
import './ChangeImage.css';

export default function ChangeImage({ onClose, currentImage, onSave }) {
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // HTML5 Canvas Filters
  const filters = [
    { id: 'normal', name: 'Normal', icon: '🖼️' },
    { id: 'grayscale', name: 'Grayscale', icon: '⚫' },
    { id: 'sepia', name: 'Sepia', icon: '🟤' },
    { id: 'brightness', name: 'Bright', icon: '☀️' },
    { id: 'contrast', name: 'Contrast', icon: '🌗' },
    { id: 'blur', name: 'Blur', icon: '💨' },
  ];

  // Apply Canvas Filter Effect
  const applyFilter = (filter) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!img || !canvas || !ctx) return;

    // Set canvas size to image size
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filter based on selection
    switch (filter) {
      case 'grayscale':
        ctx.filter = 'grayscale(100%)';
        break;
      case 'sepia':
        ctx.filter = 'sepia(100%)';
        break;
      case 'brightness':
        ctx.filter = 'brightness(1.5)';
        break;
      case 'contrast':
        ctx.filter = 'contrast(150%)';
        break;
      case 'blur':
        ctx.filter = 'blur(2px)';
        break;
      default:
        ctx.filter = 'none';
    }

    // Draw image with filter
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  // Update preview when filter changes
  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      applyFilter(selectedFilter);
    }
  }, [selectedFilter, previewUrl]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // בדיקה שזה קובץ תמונה
      if (!file.type.startsWith('image/')) {
        alert('אנא בחר קובץ תמונה בלבד');
        return;
      }

      // בדיקת גודל הקובץ (מקסימום 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('התמונה גדולה מדי. אנא בחר תמונה עד 5MB');
        return;
      }

      // יצירת URL לתצוגה מקדימה
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setSelectedImage(file);
        setSelectedFilter('normal'); // Reset filter
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    console.log('💾 שומר תמונה חדשה...');
    
    try {
      // Get filtered image from canvas
      const canvas = canvasRef.current;
      let finalImageUrl = previewUrl;
      
      if (canvas && selectedFilter !== 'normal') {
        // Convert canvas to data URL with filter applied
        finalImageUrl = canvas.toDataURL('image/png');
        console.log('🎨 Canvas filter applied:', selectedFilter);
      }
      
      console.log('🖼️ Final URL:', finalImageUrl.substring(0, 50) + '...');
      
      // שליחת ה-URL של התמונה לשרת
      const response = await ApiService.updateAvatar(finalImageUrl);
      
      if (response.success) {
        console.log('✅ התמונה עודכנה בהצלחה');
        
        // עדכון ה-user ב-localStorage
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        savedUser.avatar = finalImageUrl;
        localStorage.setItem('user', JSON.stringify(savedUser));
        
        // קריאה ל-callback של הקומפוננטה האב
        onSave(finalImageUrl);
        
        // סגירת המודאל
        onClose();
      } else {
        console.error('❌ שגיאה בעדכון התמונה:', response.error);
        setError(response.error || 'Failed to update avatar');
      }
    } catch (err) {
      console.error('💥 שגיאה:', err);
      setError('An error occurred while updating your avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    // חזרה לתמונת ברירת מחדל
    const defaultImage = 'https://i.pravatar.cc/150?img=1';
    setPreviewUrl(defaultImage);
    setSelectedImage(null);
  };

  return (
    <div className="change-image-overlay" onClick={onClose}>
      <div className="change-image-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2 className="modal-title">🖼️ Change Profile Picture</h2>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        
        <div className="image-preview-section">
          <div className="preview-container">
            {/* Hidden image for loading */}
            <img 
              ref={imageRef}
              src={previewUrl} 
              alt="Original" 
              className="hidden-image"
              crossOrigin="anonymous"
              onLoad={() => applyFilter(selectedFilter)}
            />
            
            
            <canvas 
              ref={canvasRef}
              className="preview-canvas"
            />
          </div>
          <p className="preview-hint">
            {selectedFilter === 'normal' 
              ? 'Select a filter below to edit your image' 
              : `Filter: ${selectedFilter.toUpperCase()}`}
          </p>
        </div>

        {/* Canvas Filters Section */}
        <div className="filters-section">
          <h3 className="filters-title">🎨 Canvas Filters</h3>
          <div className="filters-grid">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-name">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="upload-section">
          <label htmlFor="file-input" className="upload-button">
            📁 Choose Image from Library
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <p className="upload-hint">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
        </div>

        <div className="modal-actions">
          <button className="btn-remove" onClick={handleRemove}>
            🗑️ Remove Picture
          </button>
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={loading}>
            {loading ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

