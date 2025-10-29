import React, { useState, useEffect } from 'react';
import { useDialog } from '../contexts/DialogContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ChatWindow from '../components/chat/ChatWindow';
import ApiService from '../services/api';
import { getAvatar } from '../utils/helpers';
import './MessagesPage.css';

export default function MessagesPage({ user, currentPage, onNavigate, onLogout }) {
  const { showError } = useDialog();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.getConversations();
      if (response.success) {
        // Transform server data to match component expectations
        const formattedConversations = (response.data || []).map(conv => ({
          id: conv.conversationId,
          user: conv.otherUser,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount
        }));
        setConversations(formattedConversations);
      } else {
        showError('Failed to load conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      showError('Error loading conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = (conversationUser) => {
    setSelectedUser(conversationUser);
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
    // Refresh conversations to update unread counts
    fetchConversations();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="messages-page">
      <Header
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
        user={user}
      />

      <div className="messages-container">
        <div className="messages-header">
          <h1>Messages</h1>
        </div>

        {isLoading ? (
          <div className="messages-loading">
            <p>Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="messages-empty">
            <h2>No messages yet</h2>
            <p>Start a conversation by clicking on a user's avatar in the feed</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                onClick={() => handleOpenChat(conversation.user)}
              >
                <img
                  src={getAvatar(conversation.user.avatar, conversation.user.name)}
                  alt={conversation.user.name}
                  className="conversation-avatar"
                />
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h3>{conversation.user.name}</h3>
                    {conversation.lastMessage && (
                      <span className="conversation-time">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="conversation-preview">
                      {conversation.lastMessage.senderId === user.id && 'You: '}
                      {conversation.lastMessage.text}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="unread-badge">{conversation.unreadCount}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {selectedUser && (
        <ChatWindow
          user={user}
          targetUser={selectedUser}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}

