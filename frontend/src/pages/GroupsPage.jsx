import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import NewGroup from '../components/NewGroup';
import ApiService from '../services/api';
import './GroupsPage.css';

export default function GroupsPage({ user, currentPage, onNavigate, onLogout }) {
  const [myGroups, setMyGroups] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Fetch user's groups and suggested groups from API
      const [myGroupsResult, suggestedGroupsResult] = await Promise.all([
        ApiService.getMyGroups(),
        ApiService.getSuggestedGroups()
      ]);

      // Get user interests from user object
      const userInterests = user?.interests || [];
      console.log('👤 User interests:', userInterests);

      // Calculate match score for each group based on user interests
      const calculateMatchScore = (groupTags) => {
        if (!userInterests || userInterests.length === 0) return 0;

        let matches = 0;
        groupTags.forEach(tag => {
          userInterests.forEach(interest => {
            // Exact match or partial match
            if (
              tag.toLowerCase() === interest.toLowerCase() ||
              tag.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(tag.toLowerCase())
            ) {
              matches++;
            }
          });
        });

        return matches;
      };

      // Map backend response to frontend format for user's groups
      let userGroups = [];
      if (myGroupsResult.success && myGroupsResult.data.groups) {
        userGroups = myGroupsResult.data.groups.map(group => ({
          id: group._id,
          name: group.name,
          description: group.description,
          tags: group.tags,
          membersCount: group.membersCount || group.members?.length || 0,
          avatar: `https://i.pravatar.cc/150?img=${Math.abs(group._id.charCodeAt(0) % 50)}`,
          isAdmin: group.isAdmin
        }));
      }

      // Map backend response to frontend format for suggested groups
      let availableGroups = [];
      if (suggestedGroupsResult.success && suggestedGroupsResult.data.groups) {
        availableGroups = suggestedGroupsResult.data.groups.map(group => ({
          id: group._id,
          name: group.name,
          description: group.description,
          tags: group.tags,
          membersCount: group.membersCount || group.members?.length || 0,
          avatar: `https://i.pravatar.cc/150?img=${Math.abs(group._id.charCodeAt(0) % 50)}`,
          matchScore: calculateMatchScore(group.tags),
          isPrivate: group.isPrivate
        }));

        // Sort by match score (highest first), then by member count
        availableGroups.sort((a, b) => {
          if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
          }
          return b.membersCount - a.membersCount;
        });

        console.log('✨ Suggested groups with scores:',
          availableGroups.map(g => ({ name: g.name, score: g.matchScore }))
        );
      }

      setMyGroups(userGroups);
      setSuggestedGroups(availableGroups);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleGroupCreated = (createdGroup) => {
    console.log('New group created:', createdGroup);

    // Map backend response to frontend format
    const group = createdGroup.group || createdGroup;
    const newGroup = {
      id: group._id,
      name: group.name,
      description: group.description,
      tags: group.tags,
      membersCount: group.membersCount || 1,
      avatar: `https://i.pravatar.cc/150?img=${Math.abs(group._id.charCodeAt(0) % 50)}`,
      isAdmin: true
    };

    // Add to my groups at the top
    setMyGroups([newGroup, ...myGroups]);

    // Optionally refresh all groups to ensure consistency
    // fetchGroups();
  };

  const handleJoinGroup = async (groupId) => {
    try {
      console.log('Joining group:', groupId);

      const result = await ApiService.joinGroup(groupId);

      if (result.success) {
        const status = result.data.status; // 'member' or 'pending'

        if (status === 'member') {
          // Public group - user joined immediately
          console.log('✅ Joined group successfully');

          // Move from suggested to my groups
          const groupToJoin = suggestedGroups.find(g => g.id === groupId);
          if (groupToJoin) {
            setSuggestedGroups(suggestedGroups.filter(g => g.id !== groupId));
            setMyGroups([...myGroups, { ...groupToJoin, isAdmin: false }]);
          }

          // Show success message (you can add a toast notification here)
          alert('Successfully joined the group!');
        } else if (status === 'pending') {
          // Private group - request sent
          console.log('📤 Join request sent');

          // Remove from suggested groups (request pending)
          setSuggestedGroups(suggestedGroups.filter(g => g.id !== groupId));

          // Show pending message
          alert('Join request sent! Waiting for admin approval.');
        }
      } else {
        console.error('Failed to join group:', result.message);
        alert(result.message || 'Failed to join group');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Error joining group. Please try again.');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      console.log('Leaving group:', groupId);

      // Confirm before leaving
      if (!window.confirm('Are you sure you want to leave this group?')) {
        return;
      }

      const result = await ApiService.leaveGroup(groupId);

      if (result.success) {
        console.log('✅ Left group successfully');

        // Remove from my groups
        setMyGroups(myGroups.filter(g => g.id !== groupId));

        // Show success message
        alert('Successfully left the group');

        // Optionally refresh groups to show it in suggested again
        // fetchGroups();
      } else {
        console.error('Failed to leave group:', result.message);
        alert(result.message || 'Failed to leave group');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Error leaving group. Please try again.');
    }
  };

  const filteredMyGroups = myGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSuggestedGroups = suggestedGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="groups-page">
      <Header 
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
      />

      <div className="groups-container">
        <div className="groups-content">
          {/* Search and Create Button */}
          <div className="groups-header">
            <SearchBar 
              placeholder="Search groups..."
              onSearch={handleSearch}
            />
            <button 
              className="create-group-btn"
              onClick={() => setShowNewGroup(true)}
            >
              ✨ Create Group
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading groups...</p>
            </div>
          ) : (
            <>
              {/* My Groups Section */}
              <section className="groups-section">
                <h2 className="section-title">
                  👥 My Groups ({filteredMyGroups.length})
                </h2>
                {filteredMyGroups.length === 0 ? (
                  <div className="empty-state">
                    <p>You haven't joined any groups yet.</p>
                    <button 
                      className="btn-create"
                      onClick={() => setShowNewGroup(true)}
                    >
                      Create your first group
                    </button>
                  </div>
                ) : (
                  <div className="groups-grid">
                    {filteredMyGroups.map(group => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        isMember={true}
                        onAction={() => handleLeaveGroup(group.id)}
                        actionLabel="Leave"
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Suggested Groups Section */}
              <section className="groups-section">
                <h2 className="section-title">
                  ✨ Suggested for You ({filteredSuggestedGroups.length})
                </h2>
                {user?.interests && user.interests.length > 0 && (
                  <div className="interests-info">
                    <span className="interests-label">📌 Based on your interests:</span>
                    <div className="user-interests">
                      {user.interests.slice(0, 5).map((interest, idx) => (
                        <span key={idx} className="interest-badge">{interest}</span>
                      ))}
                      {user.interests.length > 5 && (
                        <span className="interest-badge more">+{user.interests.length - 5} more</span>
                      )}
                    </div>
                  </div>
                )}
                {filteredSuggestedGroups.length === 0 ? (
                  <div className="empty-state">
                    <p>No suggested groups at the moment.</p>
                  </div>
                ) : (
                  <div className="groups-grid">
                    {filteredSuggestedGroups.map(group => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        isMember={false}
                        onAction={() => handleJoinGroup(group.id)}
                        actionLabel="Join"
                        userInterests={user?.interests || []}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* New Group Modal */}
      {showNewGroup && (
        <NewGroup
          user={user}
          onClose={() => setShowNewGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}

// Group Card Component
function GroupCard({ group, isMember, onAction, actionLabel, userInterests = [] }) {
  // Check which tags match user interests
  const isTagMatched = (tag) => {
    if (!userInterests || userInterests.length === 0) return false;
    
    return userInterests.some(interest => 
      tag.toLowerCase() === interest.toLowerCase() ||
      tag.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(tag.toLowerCase())
    );
  };

  const hasMatches = group.matchScore && group.matchScore > 0;

  return (
    <div className={`group-card ${hasMatches ? 'recommended' : ''}`}>
      <div className="group-card-header">
        <img src={group.avatar} alt={group.name} className="group-avatar" />
        <div className="group-info">
          <h3 className="group-name">{group.name}</h3>
          <span className="group-members">👤 {group.membersCount} members</span>
        </div>
        {group.isAdmin && (
          <span className="admin-badge">Admin</span>
        )}
        {hasMatches && !group.isAdmin && (
          <span className="match-badge">🎯 {group.matchScore} match{group.matchScore > 1 ? 'es' : ''}</span>
        )}
      </div>

      <p className="group-description">{group.description}</p>

      <div className="group-tags">
        {group.tags.map((tag, index) => {
          const isMatched = isTagMatched(tag);
          return (
            <span 
              key={index} 
              className={`group-tag ${isMatched ? 'matched' : ''}`}
              title={isMatched ? 'Matches your interests!' : ''}
            >
              {isMatched && '⭐ '}#{tag}
            </span>
          );
        })}
      </div>

      <button 
        className={`group-action-btn ${isMember ? 'leave' : 'join'}`}
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  );
}

