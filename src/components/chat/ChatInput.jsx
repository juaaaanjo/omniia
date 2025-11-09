import { useState } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import clsx from 'clsx';
import { useLanguage } from '../../hooks/useLanguage';

const ChatInput = ({ onSend, disabled = false, placeholder }) => {
  const { t, translate } = useLanguage();
  const [input, setInput] = useState('');
  const maxCharacters = 1000;
  const effectivePlaceholder = placeholder ?? t.chat.typeMessage;
  const attachTitle = t.chat.actions.attach ?? 'Attach file';
  const sendTitle = t.chat.actions.send ?? t.chat.send;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 bg-white rounded-b-2xl">
      <div className="flex items-end gap-2">
        {/* Input field */}
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={effectivePlaceholder}
            disabled={disabled}
            rows={1}
            className={clsx(
              'w-full px-4 py-3 pr-10 border border-gray-200/80 rounded-xl text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'resize-none transition-all duration-200 placeholder:text-gray-400',
              disabled && 'bg-gray-50 cursor-not-allowed'
            )}
            style={{ maxHeight: '120px', minHeight: '44px' }}
          />
          <button
            type="button"
            className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            title={attachTitle}
          >
            <FiPaperclip className="w-4 h-4" />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={clsx(
            'p-3 rounded-xl transition-all duration-200 shadow-sm',
            input.trim() && !disabled
              ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/10'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
          title={sendTitle}
        >
          <FiSend className="w-4 h-4" />
        </button>
      </div>

      {/* Character count */}
      <div className="mt-2 text-xs text-gray-400 text-right font-medium">
        {translate('chat.characterCount', {
          used: input.length,
          max: maxCharacters,
        })}
      </div>
    </form>
  );
};

export default ChatInput;
