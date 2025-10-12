import React, { useState } from 'react';
import ApiService from '../services/api';
import './ChangeImage.css';

export default function ChangeImage({ onClose, currentImage, onSave }) {
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    console.log('💾 שומר תמונה חדשה...');
    console.log('🖼️ Preview URL:', previewUrl);
    
    try {
      // שליחת ה-URL של התמונה לשרת
      const response = await ApiService.updateAvatar(previewUrl);
      
      if (response.success) {
        console.log('✅ התמונה עודכנה בהצלחה');
        
        // עדכון ה-user ב-localStorage
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        savedUser.avatar = previewUrl;
        localStorage.setItem('user', JSON.stringify(savedUser));
        
        // קריאה ל-callback של הקומפוננטה האב
        onSave(previewUrl);
        
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
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="preview-image"
            />
          </div>
          <p className="preview-hint">This is how your profile picture will look</p>
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

