import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_EVENTS } from '../utils/constants';

/**
 * Custom hook to manage Socket.io connection
 */
export const useSocket = (options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No authentication token found');
      return;
    }

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token,
      },
      ...options,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Socket connected');
      setIsConnected(true);
      setError(null);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error.message || 'Socket connection error');
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [options]);

  // Subscribe to event
  const subscribe = useCallback((event, callback) => {
    if (!socketRef.current) return;

    socketRef.current.on(event, (data) => {
      setLastMessage({ event, data, timestamp: Date.now() });
      callback(data);
    });

    // Return unsubscribe function
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  }, []);

  // Unsubscribe from event
  const unsubscribe = useCallback((event, callback) => {
    if (!socketRef.current) return;
    socketRef.current.off(event, callback);
  }, []);

  // Emit event
  const emit = useCallback((event, data) => {
    if (!socketRef.current || !isConnected) {
      console.warn('Socket not connected. Cannot emit event:', event);
      return;
    }

    socketRef.current.emit(event, data);
  }, [isConnected]);

  // Subscribe to data updates
  const subscribeToDataUpdates = useCallback((callback) => {
    return subscribe(SOCKET_EVENTS.DATA_UPDATED, callback);
  }, [subscribe]);

  // Subscribe to sync status updates
  const subscribeToSyncStatus = useCallback((callback) => {
    return subscribe(SOCKET_EVENTS.SYNC_STATUS, callback);
  }, [subscribe]);

  // Subscribe to chat responses
  const subscribeToChatResponse = useCallback((callback) => {
    return subscribe(SOCKET_EVENTS.CHAT_RESPONSE, callback);
  }, [subscribe]);

  // Subscribe to notifications
  const subscribeToNotifications = useCallback((callback) => {
    return subscribe(SOCKET_EVENTS.NOTIFICATION, callback);
  }, [subscribe]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    lastMessage,
    subscribe,
    unsubscribe,
    emit,
    subscribeToDataUpdates,
    subscribeToSyncStatus,
    subscribeToChatResponse,
    subscribeToNotifications,
  };
};
