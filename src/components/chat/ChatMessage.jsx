import { FiUser, FiCpu } from 'react-icons/fi';
import { formatRelativeTime } from '../../utils/formatters';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import '../../styles/markdown.css';
import clsx from 'clsx';
import { useLanguage } from '../../hooks/useLanguage';

const ChatMessage = ({ message }) => {
  const { t } = useLanguage();
  const isAI = message.sender === 'ai';
  const assistantLabel = t.chat.assistantName ?? t.chat.title;
  const userLabel = t.chat.user ?? 'You';

  // Preprocess message to convert LaTeX delimiters
  const preprocessMessage = (text) => {
    if (!text) return '';

    // Convert \[ \] to $$ $$ for block math
    let processed = text.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$');

    // Convert \( \) to $ $ for inline math (if any)
    processed = processed.replace(/\\\(/g, '$').replace(/\\\)/g, '$');

    return processed;
  };

  const renderChart = () => {
    if (!message.chart) return null;

    const { type, data, options } = message.chart;

    switch (type) {
      case 'line':
        return <LineChart data={data} {...options} />;
      case 'bar':
        return <BarChart data={data} {...options} />;
      case 'pie':
        return <PieChart data={data} {...options} />;
      default:
        return null;
    }
  };

  const renderTable = () => {
    if (!message.table) return null;

    const { columns, rows } = message.table;

    return (
      <div className="overflow-x-auto mt-3">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        'flex gap-3 p-4',
        isAI ? 'bg-gray-50' : 'bg-white'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAI ? 'bg-primary-100' : 'bg-gray-200'
        )}
      >
        {isAI ? (
          <FiCpu className="w-5 h-5 text-primary-600" />
        ) : (
          <FiUser className="w-5 h-5 text-gray-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {isAI ? assistantLabel : userLabel}
          </span>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>

        {/* Message text */}
        <div className="text-sm text-gray-700 prose prose-sm max-w-none markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              // Math formulas
              div: ({ className, children }) => {
                if (className?.includes('math-display')) {
                  return <div className="my-4 overflow-x-auto">{children}</div>;
                }
                return <div className={className}>{children}</div>;
              },
              // Custom styles for markdown elements
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="ml-2">{children}</li>,
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 bg-gray-100 text-primary-600 rounded text-xs font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block p-3 bg-gray-100 rounded-lg text-xs font-mono overflow-x-auto mb-3">
                    {children}
                  </code>
                ),
              pre: ({ children }) => <pre className="mb-3">{children}</pre>,
              h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-2">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary-300 pl-3 py-1 my-3 text-gray-600 italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {preprocessMessage(message.message)}
          </ReactMarkdown>
        </div>

        {/* Chart */}
        {message.chart && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
            {renderChart()}
          </div>
        )}

        {/* Table */}
        {message.table && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
            {renderTable()}
          </div>
        )}

        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="text-xs px-3 py-1 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
