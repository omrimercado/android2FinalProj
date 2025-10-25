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
  
  // Admin management states
  const [editingGroup, setEditingGroup] = useState(null);
  const [managingGroup, setManagingGroup] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleSearch = async (searchParams) => {
    // אם זה חיפוש מתקדם (אובייקט עם פרמטרים)
    if (typeof searchParams === 'object' && searchParams.name !== undefined) {
      setLoading(true);
      try {
        const result = await ApiService.searchGroups(searchParams);
        if (result.success) {
          const groups = result.data || [];
          
          // Map to frontend format
          const formattedGroups = groups.map(group => ({
            id: group.group_id || group._id || group.id,
            name: group.group_name || group.name,
            description: group.description || '',
            tags: group.tags || [],
            membersCount: group.members_count || group.membersCount || 0,
            avatar: `https://i.pravatar.cc/150?img=${Math.abs((group.group_id || group._id || group.id).toString().charCodeAt(0) % 50)}`,
            isPrivate: group.is_private || group.isPrivate,
            isMember: group.isMember || false
          }));

          // Show results in suggested groups section
          setSuggestedGroups(formattedGroups);
          setSearchTerm(''); // Clear simple search term
        } else {
          console.error('Failed to search groups:', result.message);
        }
      } catch (error) {
        console.error('Error searching groups:', error);
      } finally {
        setLoading(false);
      }
    } 
    // אם זה חיפוש רגיל (סתם טקסט)
    else {
      setSearchTerm(searchParams);
    }
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
        setSuccessMessage('Successfully left the group');

        // Optionally refresh groups to show it in suggested again
        // fetchGroups();
      } else {
        console.error('Failed to leave group:', result.message);
        setErrorMessage(result.message || 'Failed to leave group');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      setErrorMessage('Error leaving group. Please try again.');
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    try {
      if (!window.confirm(`Are you sure you want to delete "${groupName}"? This action cannot be undone.`)) {
        return;
      }

      const result = await ApiService.deleteGroup(groupId);

      if (result.success) {
        setMyGroups(myGroups.filter(g => g.id !== groupId));
        setSuccessMessage(`"${groupName}" deleted successfully`);
      } else {
        setErrorMessage(result.message || 'Failed to delete group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      setErrorMessage('Error deleting group. Please try again.');
    }
  };

  const handleManageMembers = (group) => {
    setManagingGroup(group);
  };

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

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
          {/* Success/Error Messages */}
          {(successMessage || errorMessage) && (
            <div className={`message-banner ${successMessage ? 'success' : 'error'}`}>
              <span>{successMessage || errorMessage}</span>
              <button 
                className="close-message"
                onClick={() => {
                  setSuccessMessage(null);
                  setErrorMessage(null);
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Search and Create Button */}
          <div className="groups-header">
            <SearchBar 
              placeholder="Search groups..."
              onSearch={handleSearch}
              showAdvancedSearch={true}
              searchType="groups"
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
                        onEdit={group.isAdmin ? () => handleEditGroup(group) : null}
                        onDelete={group.isAdmin ? () => handleDeleteGroup(group.id, group.name) : null}
                        onManageMembers={group.isAdmin ? () => handleManageMembers(group) : null}
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

      {/* Edit Group Modal */}
      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onUpdate={(updatedGroup) => {
            setMyGroups(myGroups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
            setEditingGroup(null);
            setSuccessMessage('Group updated successfully!');
          }}
        />
      )}

      {/* Manage Members Modal */}
      {managingGroup && (
        <ManageGroupMembersModal
          group={managingGroup}
          onClose={() => setManagingGroup(null)}
          onMemberRemoved={(userId) => {
            // Update members count
            setMyGroups(myGroups.map(g => 
              g.id === managingGroup.id 
                ? { ...g, membersCount: Math.max(0, g.membersCount - 1) } 
                : g
            ));
            setSuccessMessage('Member removed successfully');
          }}
        />
      )}
    </div>
  );
}

// Group Card Component
function GroupCard({ group, isMember, onAction, actionLabel, userInterests = [], onEdit, onDelete, onManageMembers }) {
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
  const isAdmin = group.isAdmin;

  return (
    <div className={`group-card ${hasMatches ? 'recommended' : ''} ${isAdmin ? 'admin-card' : ''}`}>
      <div className="group-card-header">
        <div className="group-avatar-icon">
          👥
        </div>
        <div className="group-info">
          <h3 className="group-name">{group.name}</h3>
          <span className="group-members">👤 {group.membersCount} members</span>
        </div>
        {isAdmin && (
          <span className="admin-badge">⭐ Admin</span>
        )}
        {hasMatches && !isAdmin && (
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

      {/* Admin Actions */}
      {isAdmin && (onEdit || onDelete || onManageMembers) && (
        <div className="admin-actions">
          {onManageMembers && (
            <button 
              className="admin-btn manage-btn"
              onClick={onManageMembers}
              title="Manage Members"
            >
              👥 Manage Members
            </button>
          )}
          {onEdit && (
            <button 
              className="admin-btn edit-btn"
              onClick={onEdit}
              title="Edit Group"
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button 
              className="admin-btn delete-btn"
              onClick={onDelete}
              title="Delete Group"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}

      {/* Regular Action Button */}
      <button 
        className={`group-action-btn ${isMember ? 'leave' : 'join'}`}
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// Edit Group Modal Component
function EditGroupModal({ group, onClose, onUpdate }) {
  const [groupName, setGroupName] = useState(group.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await ApiService.updateGroup(group.id, { name: groupName });

      if (result.success) {
        onUpdate({ ...group, name: groupName });
      } else {
        setError(result.message || 'Failed to update group');
      }
    } catch (err) {
      setError('An error occurred while updating the group');
      console.error('Error updating group:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit Group</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="modal-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="groupName">Group Name:</label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              disabled={isUpdating}
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn cancel-btn"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn submit-btn"
              disabled={isUpdating || !groupName.trim()}
            >
              {isUpdating ? '⌛ Updating...' : '✓ Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Manage Group Members Modal Component
function ManageGroupMembersModal({ group, onClose, onMemberRemoved }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingUserId, setRemovingUserId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ApiService.getGroupMembers(group.id);

      if (result.success) {
        setMembers(result.data);
      } else {
        setError(result.message || 'Failed to load members');
      }
    } catch (err) {
      setError('An error occurred while loading members');
      console.error('Error fetching members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId, userName) => {
    if (!window.confirm(`Remove ${userName} from ${group.name}?`)) {
      return;
    }

    setRemovingUserId(userId);
    setError(null);

    try {
      const result = await ApiService.removeUserFromGroup(group.id, userId);

      if (result.success) {
        setMembers(members.filter(m => m._id !== userId));
        onMemberRemoved(userId);
      } else {
        setError(result.message || 'Failed to remove member');
      }
    } catch (err) {
      setError('An error occurred while removing member');
      console.error('Error removing member:', err);
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👥 Manage Members - {group.name}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="modal-error">{error}</div>
        )}

        {isLoading ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="modal-empty">
            <p>No members in this group yet.</p>
          </div>
        ) : (
          <div className="members-list">
            {members.map(member => (
              <div key={member._id} className="member-item">
                <img 
                  src={member.avatar || `https://i.pravatar.cc/150?u=${member._id}`} 
                  alt={member.name} 
                  className="member-avatar" 
                />
                <div className="member-info">
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-email">{member.email}</p>
                </div>
                <button
                  className="remove-member-btn"
                  onClick={() => handleRemoveMember(member._id, member.name)}
                  disabled={removingUserId === member._id}
                  title="Remove member"
                >
                  {removingUserId === member._id ? '⌛' : '🗑️'} Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

