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
      // TODO: Replace with actual API calls when backend is ready
      // const myGroupsResult = await ApiService.getMyGroups();
      // const suggestedResult = await ApiService.getSuggestedGroups();
      
      // Mock data for now
      setTimeout(() => {
        setMyGroups([
          {
            id: 1,
            name: 'React Developers Israel',
            description: 'A community for React developers in Israel',
            tags: ['React', 'JavaScript', 'Web'],
            membersCount: 1250,
            avatar: 'https://i.pravatar.cc/150?img=1',
            isAdmin: true
          },
          {
            id: 2,
            name: 'UI/UX Designers',
            description: 'Share your designs and get feedback',
            tags: ['Design', 'UI', 'UX'],
            membersCount: 820,
            avatar: 'https://i.pravatar.cc/150?img=2',
            isAdmin: false
          }
        ]);

        setSuggestedGroups([
          {
            id: 3,
            name: 'Tech Entrepreneurs',
            description: 'Network with tech entrepreneurs and startup founders',
            tags: ['Startup', 'Business', 'Tech'],
            membersCount: 2100,
            avatar: 'https://i.pravatar.cc/150?img=3'
          },
          {
            id: 4,
            name: 'Frontend Masters',
            description: 'Advanced frontend development techniques',
            tags: ['Frontend', 'JavaScript', 'CSS'],
            membersCount: 950,
            avatar: 'https://i.pravatar.cc/150?img=4'
          },
          {
            id: 5,
            name: 'DevOps Community',
            description: 'Share DevOps best practices and tools',
            tags: ['DevOps', 'Cloud', 'Docker'],
            membersCount: 1600,
            avatar: 'https://i.pravatar.cc/150?img=5'
          }
        ]);
        
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleGroupCreated = (newGroup) => {
    console.log('New group created:', newGroup);
    setMyGroups([newGroup, ...myGroups]);
    fetchGroups();
  };

  const handleJoinGroup = async (groupId) => {
    try {
      // TODO: Call actual API
      // const result = await ApiService.joinGroup(groupId);
      console.log('Joining group:', groupId);
      
      // Mock: Move from suggested to my groups
      const groupToJoin = suggestedGroups.find(g => g.id === groupId);
      if (groupToJoin) {
        setSuggestedGroups(suggestedGroups.filter(g => g.id !== groupId));
        setMyGroups([...myGroups, { ...groupToJoin, isAdmin: false }]);
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      // TODO: Call actual API
      // const result = await ApiService.leaveGroup(groupId);
      console.log('Leaving group:', groupId);
      
      setMyGroups(myGroups.filter(g => g.id !== groupId));
    } catch (error) {
      console.error('Error leaving group:', error);
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
function GroupCard({ group, isMember, onAction, actionLabel }) {
  return (
    <div className="group-card">
      <div className="group-card-header">
        <img src={group.avatar} alt={group.name} className="group-avatar" />
        <div className="group-info">
          <h3 className="group-name">{group.name}</h3>
          <span className="group-members">👤 {group.membersCount} members</span>
        </div>
        {group.isAdmin && (
          <span className="admin-badge">Admin</span>
        )}
      </div>

      <p className="group-description">{group.description}</p>

      <div className="group-tags">
        {group.tags.map((tag, index) => (
          <span key={index} className="group-tag">#{tag}</span>
        ))}
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

