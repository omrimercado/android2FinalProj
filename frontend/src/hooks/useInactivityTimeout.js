import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for handling user inactivity timeout
 * Automatically logs out user after specified period of inactivity
 * 
 * @param {Function} onTimeout - Callback function to execute when timeout occurs
 * @param {number} timeoutMinutes - Number of minutes before timeout (default: 10)
 */
export const useInactivityTimeout = (onTimeout, timeoutMinutes = 10) => {
  const timeoutId = useRef(null);
  const lastActivityTime = useRef(Date.now());
  const TIMEOUT_DURATION = timeoutMinutes * 60 * 1000; // Convert to milliseconds
  const STORAGE_KEY = 'lastActivityTime';

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    // Clear existing timer
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Update last activity time
    const now = Date.now();
    lastActivityTime.current = now;
    localStorage.setItem(STORAGE_KEY, now.toString());

    console.log('⏰ Activity detected - timer reset');

    // Set new timer
    timeoutId.current = setTimeout(() => {
      console.log('⏱️ Inactivity timeout reached - logging out');
      onTimeout();
    }, TIMEOUT_DURATION);
  }, [onTimeout, TIMEOUT_DURATION]);

  // Check if session has expired (useful when opening new tab or refreshing)
  const checkSessionExpiry = useCallback(() => {
    const lastActivity = localStorage.getItem(STORAGE_KEY);
    
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
      
      if (timeSinceLastActivity >= TIMEOUT_DURATION) {
        console.log('⏱️ Session expired - last activity was', Math.round(timeSinceLastActivity / 60000), 'minutes ago');
        onTimeout();
        return true;
      }
    }
    
    return false;
  }, [onTimeout, TIMEOUT_DURATION]);

  useEffect(() => {
    // Check if session has already expired
    const isExpired = checkSessionExpiry();
    if (isExpired) {
      return; // Don't set up listeners if already expired
    }

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners for user activity
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initialize timer
    resetTimer();

    // Check session expiry when tab becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👀 Tab became visible - checking session expiry');
        const isExpired = checkSessionExpiry();
        if (!isExpired) {
          resetTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      // Remove all event listeners
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Clear timer
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [resetTimer, checkSessionExpiry]);

  // Return a function to manually reset the timer if needed
  return { resetTimer };
};

export default useInactivityTimeout;


