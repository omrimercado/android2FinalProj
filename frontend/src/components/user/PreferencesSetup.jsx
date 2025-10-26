import React, { useState } from 'react';
import './PreferencesSetup.css';

const AVAILABLE_INTERESTS = [
  { id: 1, name: 'React', icon: '⚛️', category: 'Development' },
  { id: 2, name: 'JavaScript', icon: '💻', category: 'Development' },
  { id: 3, name: 'UI/UX Design', icon: '🎨', category: 'Design' },
  { id: 4, name: 'Mobile Development', icon: '📱', category: 'Development' },
  { id: 5, name: 'Backend', icon: '🔧', category: 'Development' },
  { id: 6, name: 'DevOps', icon: '🚀', category: 'Development' },
  { id: 7, name: 'Data Science', icon: '📊', category: 'Data' },
  { id: 8, name: 'Machine Learning', icon: '🤖', category: 'Data' },
  { id: 9, name: 'Cloud Computing', icon: '☁️', category: 'Infrastructure' },
  { id: 10, name: 'Cybersecurity', icon: '🔒', category: 'Security' },
  { id: 11, name: 'Blockchain', icon: '⛓️', category: 'Technology' },
  { id: 12, name: 'Startup', icon: '💡', category: 'Business' },
  { id: 13, name: 'Marketing', icon: '📢', category: 'Business' },
  { id: 14, name: 'Product Management', icon: '📦', category: 'Business' },
  { id: 15, name: 'Photography', icon: '📸', category: 'Creative' },
  { id: 16, name: 'Gaming', icon: '🎮', category: 'Entertainment' },
  { id: 17, name: 'Music', icon: '🎵', category: 'Creative' },
  { id: 18, name: 'Fitness', icon: '💪', category: 'Lifestyle' },
];

export default function PreferencesSetup({ user, onComplete, onSkip }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleToggleInterest = (interest) => {
    if (selectedInterests.find(i => i.id === interest.id)) {
      setSelectedInterests(selectedInterests.filter(i => i.id !== interest.id));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest to continue');
      return;
    }
    
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Save preferences and complete
      const updatedUser = {
        ...user,
        interests: selectedInterests.map(i => i.name),
        interestTags: selectedInterests.map(i => ({ name: i.name, icon: i.icon })),
      };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      onComplete(updatedUser);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  // Group interests by category
  const categorizedInterests = AVAILABLE_INTERESTS.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {});

  return (
    <div className="preferences-setup-overlay">
      <div className="preferences-setup-modal">
        <div className="preferences-header">
          <h2>🎯 Tell us what you're interested in</h2>
          <p>We'll suggest groups and content based on your interests</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && (
          <div className="preferences-content">
            <div className="selected-count">
              <span className="count-badge">{selectedInterests.length}</span>
              <span>interests selected</span>
            </div>

            <div className="interests-categories">
              {Object.entries(categorizedInterests).map(([category, interests]) => (
                <div key={category} className="interest-category">
                  <h3 className="category-title">{category}</h3>
                  <div className="interests-grid">
                    {interests.map(interest => (
                      <button
                        key={interest.id}
                        className={`interest-btn ${
                          selectedInterests.find(i => i.id === interest.id) ? 'selected' : ''
                        }`}
                        onClick={() => handleToggleInterest(interest)}
                      >
                        <span className="interest-icon">{interest.icon}</span>
                        <span className="interest-name">{interest.name}</span>
                        {selectedInterests.find(i => i.id === interest.id) && (
                          <span className="check-icon">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="preferences-summary">
            <div className="summary-icon">🎉</div>
            <h3>Great choices!</h3>
            <p>You've selected {selectedInterests.length} interests:</p>
            
            <div className="selected-interests-list">
              {selectedInterests.map(interest => (
                <div key={interest.id} className="selected-interest-item">
                  <span>{interest.icon}</span>
                  <span>{interest.name}</span>
                </div>
              ))}
            </div>

            <p className="summary-text">
              We'll use these to recommend relevant groups and content for you!
            </p>
          </div>
        )}

        <div className="preferences-actions">
          <button className="btn-skip" onClick={handleSkip}>
            Skip for now
          </button>
          <button 
            className="btn-continue" 
            onClick={handleContinue}
            disabled={selectedInterests.length === 0}
          >
            {currentStep === 1 ? 'Continue' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}

