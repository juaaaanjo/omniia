import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = () => {
      // Check for error parameter
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setMessage(errorDescription || error || 'Authentication failed');

        // Notify parent window of error
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'META_ADS_OAUTH_ERROR',
              error: errorDescription || error,
            },
            window.location.origin
          );
        }

        // Close popup after a short delay
        setTimeout(() => {
          window.close();
        }, 2000);
        return;
      }

      // Check for success indicators (code parameter means successful auth)
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code) {
        setStatus('success');
        setMessage('Authentication successful! Closing window...');

        // Notify parent window of success
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'META_ADS_OAUTH_SUCCESS',
              code,
              state,
            },
            window.location.origin
          );
        }

        // Close popup after a short delay
        setTimeout(() => {
          window.close();
        }, 1500);
        return;
      }

      // If we get here, something unexpected happened
      setStatus('error');
      setMessage('Unexpected response from authentication server');

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'META_ADS_OAUTH_ERROR',
            error: 'Unexpected response',
          },
          window.location.origin
        );
      }

      setTimeout(() => {
        window.close();
      }, 2000);
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        {status === 'processing' && (
          <>
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4 text-6xl">✓</div>
            <p className="text-xl font-semibold text-green-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4 text-6xl text-red-500">✗</div>
            <p className="text-xl font-semibold text-red-600">Authentication Failed</p>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}

        <p className="mt-4 text-sm text-gray-500">
          This window will close automatically...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
