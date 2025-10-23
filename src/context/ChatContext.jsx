import { createContext, useState, useCallback, useEffect } from 'react';
import chatService from '../services/chatService';

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [context, setContext] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Send message
  const sendMessage = useCallback(async (message, additionalContext = {}) => {
    try {
      setError(null);

      // Add user message
      const userMessage = chatService.formatMessage(message, 'user');
      setMessages(prev => [...prev, userMessage]);

      // Set typing indicator
      setIsTyping(true);

      // Send to backend
      const response = await chatService.sendMessage(message, {
        ...context,
        ...additionalContext,
      });

      console.log('[ChatContext] Chat API response:', response);

      // Extract answer from response (API returns data.answer)
      const answer = response.data?.answer || response.answer || response.message || response.text;
      const responseData = response.data || response;

      // Add AI response
      const aiMessage = {
        id: Date.now() + Math.random(),
        message: answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        chart: chatService.extractChartData(responseData),
        table: chatService.extractTableData(responseData),
        suggestions: responseData.suggestions || [],
        metadata: {
          agentUsed: responseData.agentUsed,
          confidence: responseData.confidence,
          dataSources: responseData.dataSources,
          responseTime: responseData.responseTime,
        },
      };

      console.log('[ChatContext] AI message created:', aiMessage);

      setMessages(prev => [...prev, aiMessage]);

      return aiMessage;
    } catch (error) {
      setError(error.message || 'Failed to send message');

      // Add error message
      const errorMessage = chatService.formatMessage(
        'Sorry, I encountered an error processing your request. Please try again.',
        'ai'
      );
      setMessages(prev => [...prev, errorMessage]);

      throw error;
    } finally {
      setIsTyping(false);
    }
  }, [context]);

  // Load chat history
  const loadHistory = useCallback(async (userId, limit = 50) => {
    try {
      const history = await chatService.getChatHistory(userId, limit);
      setMessages(history);
      return history;
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setError(error.message || 'Failed to load chat history');
    }
  }, []);

  // Clear chat history
  const clearHistory = useCallback(async (userId) => {
    try {
      if (userId) {
        await chatService.clearHistory(userId);
      }
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      setError(error.message || 'Failed to clear chat history');
    }
  }, []);

  // Update context
  const updateContext = useCallback((newContext) => {
    setContext(prev => ({ ...prev, ...newContext }));
  }, []);

  // Get suggested questions
  const getSuggestedQuestions = useCallback((area) => {
    return chatService.getSuggestedQuestions(area);
  }, []);

  // Toggle chat
  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  // Open chat
  const openChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  // Close chat
  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  // Delete message
  const deleteMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  // Retry last message
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (lastUserMessage) {
      // Remove last AI response if exists
      setMessages(prev => {
        const lastAiIndex = prev.map(msg => msg.sender).lastIndexOf('ai');
        if (lastAiIndex > -1) {
          return prev.slice(0, lastAiIndex);
        }
        return prev;
      });

      return sendMessage(lastUserMessage.message);
    }
  }, [messages, sendMessage]);

  const value = {
    messages,
    isTyping,
    error,
    context,
    isChatOpen,
    sendMessage,
    loadHistory,
    clearHistory,
    updateContext,
    getSuggestedQuestions,
    toggleChat,
    openChat,
    closeChat,
    deleteMessage,
    retryLastMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
