import React, { useState, useEffect, useRef } from 'react';
import { useDialog } from '../../contexts/DialogContext';
import { ChatApiService } from '../../services';
import { getAvatar } from '../../utils/helpers';
import './ChatWindow.css';

export default function ChatWindow({ user, targetUser, onClose }) {
  const { showError } = useDialog();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    // Connect to main server via ChatApiService
    const wsUrl = ChatApiService.getWebSocketUrl();
    console.log('🔌 Attempting to connect to:', wsUrl);
    const ws = ChatApiService.createWebSocketConnection();

    ws.onopen = () => {
      console.log('✅ WebSocket Connected successfully!');
      setIsConnected(true);

      // Send join message with user details
      ws.send(JSON.stringify({
        type: 'join',
        userId: user.id,
        targetUserId: targetUser.id,
        userName: user.name
      }));
      console.log('📤 Sent join message for user:', user.name);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
          case 'message':
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: data.text,
              senderId: data.senderId,
              senderName: data.senderName,
              timestamp: new Date(data.timestamp),
              delivered: data.delivered
            }]);
            break;
            
          case 'typing':
            if (data.userId !== user.id) {
              setIsTyping(true);
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
              }, 3000);
            }
            break;
            
          case 'history':
            // Load previous message history
            if (data.messages) {
              setMessages(data.messages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              })));
            }
            break;

          case 'user_status':
            // Update target user status
            if (data.userId === targetUser.id) {
              console.log(`👤 Target user ${targetUser.name} is now: ${data.isOnline ? 'ONLINE 🟢' : 'OFFLINE ⚪'}`);
              setIsTargetOnline(data.isOnline);
            }
            break;
            
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      console.error('⚠️ Make sure the WebSocket server is running on ws://localhost:8080/chat');
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      console.log('🔴 WebSocket Disconnected', event.code, event.reason);
      if (!event.wasClean) {
        console.error('⚠️ Connection closed unexpectedly. Is the server running?');
      }
      setIsConnected(false);
    };

    wsRef.current = ws;

    // Cleanup when component unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      clearTimeout(typingTimeoutRef.current);
    };
  }, [user.id, targetUser.id, user.name]);

  // Send typing indicator
  const handleTyping = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        userId: user.id,
        targetUserId: targetUser.id
      }));
    }
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    // Check that connection is active
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showError('No connection to server. Please try again later.');
      return;
    }

    const message = {
      type: 'message',
      text: newMessage.trim(),
      senderId: user.id,
      senderName: user.name,
      targetUserId: targetUser.id,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending message to', targetUser.name, '(online:', isTargetOnline, ')');
    wsRef.current.send(JSON.stringify(message));
    setNewMessage('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-window-overlay" onClick={onClose}>
      <div className="chat-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-user">
            <img src={getAvatar(targetUser.avatar, targetUser.name)} alt={targetUser.name} className="chat-avatar" />
            <div className="chat-header-info">
              <h3>{targetUser.name}</h3>
              <span className="chat-status">
                {isConnected ? (
                  isTargetOnline ? '🟢 Online' : '⚪ Offline (message will be saved)'
                ) : '🔴 Disconnected'}
              </span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Messages area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>👋 Start a conversation with {targetUser.name}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-message ${msg.senderId === user.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {msg.senderId !== user.id && (
                    <span className="message-sender">{msg.senderName}</span>
                  )}
                  <p>{msg.text}</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="chat-message received">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message input area */}
        <form className="chat-input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            disabled={!isConnected}
            dir="auto"
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!newMessage.trim() || !isConnected}
            title={isTargetOnline ? 'Send message' : 'Send message (will be saved until user connects)'}
          >
            {isTargetOnline ? '📤' : '📬'}
          </button>
        </form>
      </div>
    </div>
  );
}

