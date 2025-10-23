import { useEffect, useState } from 'react';
import { FiX, FiTrash2, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import clsx from 'clsx';

const ChatInterface = ({ area = 'analytics' }) => {
  const { user } = useAuth();
  const { t, translate } = useLanguage();
  const {
    messages,
    isTyping,
    isChatOpen,
    closeChat,
    sendMessage,
    clearHistory,
    getSuggestedQuestions,
    updateContext,
  } = useChat();

  const [isMinimized, setIsMinimized] = useState(false);
  const translatedSuggestions = translate(`chat.suggestions.${area}`);
  const suggestedQuestions =
    (Array.isArray(translatedSuggestions) && translatedSuggestions.length > 0
      ? translatedSuggestions
      : getSuggestedQuestions(area)) ?? [];

  // Update context when area changes
  useEffect(() => {
    updateContext({ area });
  }, [area, updateContext]);

  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm(translate('chat.confirmClearHistory'))) {
      await clearHistory(user?.id);
    }
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  if (!isChatOpen) return null;

  return (
    <div
      className={clsx(
        'fixed right-6 bottom-6 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 transition-all',
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-primary-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h3 className="font-semibold">
            {t.chat.assistantName ?? t.chat.title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-primary-700 rounded transition-colors"
            title={isMinimized ? t.chat.actions.maximize : t.chat.actions.minimize}
          >
            {isMinimized ? (
              <FiMaximize2 className="w-4 h-4" />
            ) : (
              <FiMinimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleClearHistory}
            className="p-1 hover:bg-primary-700 rounded transition-colors"
            title={t.chat.actions.clear}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
          <button
            onClick={closeChat}
            className="p-1 hover:bg-primary-700 rounded transition-colors"
            title={t.chat.actions.close}
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content - hidden when minimized */}
      {!isMinimized && (
        <>
          {/* Suggested questions */}
          {messages.length === 0 && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {t.chat.suggestedQuestions}
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat history */}
          <ChatHistory messages={messages} isTyping={isTyping} />

          {/* Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping}
          />
          <div className="sr-only" aria-live="polite">
            {isTyping ? t.chat.thinking : ''}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
