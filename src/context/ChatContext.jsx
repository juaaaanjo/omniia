import { createContext, useState, useCallback } from 'react';
import chatService from '../services/chatService';
import smartRegisterService from '../services/smartRegisterService';

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [context, setContext] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState('assistant'); // assistant | setupiq
  const [smartRegisterSession, setSmartRegisterSession] = useState(null);
  const [smartRegisterMessages, setSmartRegisterMessages] = useState([]);
  const [isSmartRegisterTyping, setIsSmartRegisterTyping] = useState(false);
  const [smartRegisterError, setSmartRegisterError] = useState(null);
  const [smartRegisterProgress, setSmartRegisterProgress] = useState(null);

  const formatQuestionPrompt = useCallback((question) => {
    if (!question) return null;
    return (
      question.prompt ||
      question.text ||
      question.message ||
      question.label ||
      (typeof question === 'string' ? question : null)
    );
  }, []);

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

  const resetSmartRegister = useCallback(() => {
    setSmartRegisterSession(null);
    setSmartRegisterMessages([]);
    setSmartRegisterProgress(null);
    setSmartRegisterError(null);
  }, []);

  const startSmartRegister = useCallback(async () => {
    try {
      setSmartRegisterError(null);
      setIsSmartRegisterTyping(true);
      const session = await smartRegisterService.startSession();
      const sessionId = session.sessionId || session.id;

      setSmartRegisterSession({ ...session, sessionId });
      setSmartRegisterProgress(session.progress);

      const introMessage = chatService.formatMessage(
        'Starting SetupIQ. I will guide you through a few questions to capture your company profile.',
        'ai'
      );

      const firstPrompt =
        formatQuestionPrompt(session.nextQuestion) ||
        'Let’s start: share the legal company name, NIT/EIN, country, city, timezone, and base currency.';
      const firstQuestion = chatService.formatMessage(firstPrompt, 'ai');

      setSmartRegisterMessages([introMessage, firstQuestion]);
      setChatMode('setupiq');
      setIsChatOpen(true);

      return session;
    } catch (error) {
      setSmartRegisterError(error.message || 'Failed to start SetupIQ');
      throw error;
    } finally {
      setIsSmartRegisterTyping(false);
    }
  }, [formatQuestionPrompt]);

  const resumeSmartRegister = useCallback(
    async (sessionId) => {
      if (!sessionId) return null;

      try {
        setSmartRegisterError(null);
        setIsSmartRegisterTyping(true);
        const session = await smartRegisterService.getSession(sessionId);
        const normalizedSession = { ...session, sessionId: session.sessionId || session.id || sessionId };

        setSmartRegisterSession(normalizedSession);
        setSmartRegisterProgress(session.progress);

        const nextPrompt = formatQuestionPrompt(session.nextQuestion);
        if (nextPrompt) {
          setSmartRegisterMessages((prev) => {
            if (prev.length > 0) return prev;
            return [chatService.formatMessage(nextPrompt, 'ai')];
          });
        }

        setChatMode('setupiq');
        setIsChatOpen(true);
        return session;
      } catch (error) {
        setSmartRegisterError(error.message || 'Failed to resume SetupIQ');
        throw error;
      } finally {
        setIsSmartRegisterTyping(false);
      }
    },
    [formatQuestionPrompt]
  );

  const sendSmartRegisterMessage = useCallback(
    async (message) => {
      if (!message) return null;

      setChatMode('setupiq');
      setIsChatOpen(true);
      setSmartRegisterError(null);

      let activeSessionId = smartRegisterSession?.sessionId || smartRegisterSession?.id;

      if (!activeSessionId) {
        const session = await startSmartRegister();
        activeSessionId = session.sessionId || session.id;
      }

      const userMessage = chatService.formatMessage(message, 'user');
      setSmartRegisterMessages((prev) => [...prev, userMessage]);
      setIsSmartRegisterTyping(true);

      try {
        const response = await smartRegisterService.answerSession(activeSessionId, message);

        setSmartRegisterSession((prev) => ({
          ...prev,
          ...response,
          sessionId: activeSessionId,
        }));

        if (response.progress) {
          setSmartRegisterProgress(response.progress);
        }

        const nextPrompt = formatQuestionPrompt(response.nextQuestion);
        let aiText = response.message || response.answer || '';
        const isCompleted =
          response.completed ||
          (response.progress?.total &&
            response.progress?.answered >= response.progress.total);

        if (isCompleted) {
          aiText =
            aiText ||
            'Done! SetupIQ is completed. You can review or restart anytime.';
        } else if (nextPrompt) {
          aiText = aiText ? `${aiText}\n\n${nextPrompt}` : nextPrompt;
        }

        if (!aiText) {
          aiText = 'Got it. Please continue with the next detail.';
        }

        const aiMessage = chatService.formatMessage(aiText, 'ai');
        setSmartRegisterMessages((prev) => [...prev, aiMessage]);

        return response;
      } catch (error) {
        setSmartRegisterError(error.message || 'Failed to send answer');

        const errorMessage = chatService.formatMessage(
          'There was a problem saving this answer. Please try again.',
          'ai'
        );
        setSmartRegisterMessages((prev) => [...prev, errorMessage]);

        throw error;
      } finally {
        setIsSmartRegisterTyping(false);
      }
    },
    [formatQuestionPrompt, smartRegisterSession, startSmartRegister]
  );

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
    chatMode,
    setChatMode,
    smartRegisterSession,
    smartRegisterMessages,
    isSmartRegisterTyping,
    smartRegisterError,
    smartRegisterProgress,
    sendMessage,
    sendSmartRegisterMessage,
    loadHistory,
    clearHistory,
    updateContext,
    getSuggestedQuestions,
    startSmartRegister,
    resumeSmartRegister,
    resetSmartRegister,
    toggleChat,
    openChat,
    closeChat,
    deleteMessage,
    retryLastMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
