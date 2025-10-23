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
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
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
              'w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'resize-none',
              disabled && 'bg-gray-100 cursor-not-allowed'
            )}
            style={{ maxHeight: '120px', minHeight: '40px' }}
          />
          <button
            type="button"
            className="absolute right-2 bottom-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title={attachTitle}
          >
            <FiPaperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            input.trim() && !disabled
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
          title={sendTitle}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>

      {/* Character count */}
      <div className="mt-1 text-xs text-gray-500 text-right">
        {translate('chat.characterCount', {
          used: input.length,
          max: maxCharacters,
        })}
      </div>
    </form>
  );
};

export default ChatInput;
