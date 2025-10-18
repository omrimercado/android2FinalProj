import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook לניהול חיבור WebSocket
 * @param {string} url - כתובת URL של שרת ה-WebSocket
 * @param {Object} options - אפשרויות נוספות
 * @param {Function} options.onMessage - פונקציית callback לטיפול בהודעות נכנסות
 * @param {Function} options.onOpen - פונקציית callback כשהחיבור נפתח
 * @param {Function} options.onClose - פונקציית callback כשהחיבור נסגר
 * @param {Function} options.onError - פונקציית callback כשיש שגיאה
 * @param {boolean} options.autoConnect - האם להתחבר אוטומטית (ברירת מחדל: true)
 * @param {boolean} options.reconnect - האם לנסות להתחבר מחדש אוטומטית (ברירת מחדל: true)
 * @param {number} options.reconnectInterval - זמן המתנה בין ניסיונות חיבור מחדש במילישניות (ברירת מחדל: 3000)
 * @param {number} options.maxReconnectAttempts - מספר מקסימלי של ניסיונות חיבור מחדש (ברירת מחדל: 5)
 */
export function useWebSocket(url, options = {}) {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    autoConnect = true,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnectRef = useRef(reconnect);

  // פונקציה לשליחת הודעה
  const sendMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(message);
      return true;
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
      return false;
    }
  }, []);

  // פונקציה להתחברות מחדש
  const attemptReconnect = useCallback(() => {
    if (
      shouldReconnectRef.current &&
      reconnectAttemptsRef.current < maxReconnectAttempts
    ) {
      reconnectAttemptsRef.current += 1;
      console.log(
        `Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
      );
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, reconnectInterval);
    } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      setConnectionError('Failed to reconnect after maximum attempts');
    }
  }, [reconnectInterval, maxReconnectAttempts]);

  // פונקציה להתחברות
  const connect = useCallback(() => {
    try {
      // סגירת חיבור קיים אם יש
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        
        if (onOpen) {
          onOpen();
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          
          if (onMessage) {
            onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          setLastMessage(event.data);
          
          if (onMessage) {
            onMessage(event.data);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError(error);
        
        if (onError) {
          onError(error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        
        if (onClose) {
          onClose(event);
        }

        // ניסיון להתחבר מחדש אם מופעל
        if (!event.wasClean && shouldReconnectRef.current) {
          attemptReconnect();
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionError(error);
      
      if (onError) {
        onError(error);
      }
    }
  }, [url, onMessage, onOpen, onClose, onError, attemptReconnect]);

  // פונקציה לניתוק
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  // פונקציה להתחברות מחדש ידנית
  const reconnectManually = useCallback(() => {
    shouldReconnectRef.current = true;
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  // התחברות אוטומטית בעליית הקומפוננטה
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // ניקוי בירידת הקומפוננטה
    return () => {
      shouldReconnectRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [autoConnect, connect]);

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    connect,
    disconnect,
    reconnect: reconnectManually,
    websocket: wsRef.current
  };
}

export default useWebSocket;

