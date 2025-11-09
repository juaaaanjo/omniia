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
        'fixed right-6 bottom-6 card flex flex-col z-50 transition-all shadow-xl shadow-gray-900/10',
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
          <h3 className="font-semibold text-sm">
            {t.chat.assistantName ?? t.chat.title}
          </h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
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
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            title={t.chat.actions.clear}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
          <button
            onClick={closeChat}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
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
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t.chat.suggestedQuestions}
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left text-xs px-4 py-3 bg-white border border-gray-200/60 rounded-xl hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 font-medium shadow-sm"
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
