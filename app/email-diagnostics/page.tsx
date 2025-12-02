"use client";

import { useState } from "react";

export default function EmailDiagnosticsPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('yousafali5381@gmail.com');

  const runDiagnostics = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({
        error: error.message || 'Failed to connect to server',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSpecificEmail = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({
        error: error.message || 'Failed to connect to server',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{
      background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)',
      color: '#FFFFFF'
    }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Email Diagnostics</h1>
        
        <div className="mb-6 space-y-4">
          <div>
            <button
              onClick={runDiagnostics}
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-bold mr-4"
              style={{
                background: isLoading 
                  ? 'rgba(58, 139, 255, 0.5)' 
                  : 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                color: '#FFFFFF',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Testing...' : 'Test Email to Business Email'}
            </button>
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Test Email to Specific Address:
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF'
                }}
                placeholder="Enter email address"
              />
            </div>
            <button
              onClick={testSpecificEmail}
              disabled={isLoading || !testEmail}
              className="px-6 py-3 rounded-lg font-bold"
              style={{
                background: isLoading || !testEmail
                  ? 'rgba(58, 139, 255, 0.5)' 
                  : 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                color: '#FFFFFF',
                cursor: isLoading || !testEmail ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className="p-6 rounded-xl" style={{
            background: testResult.status === 'success' 
              ? 'rgba(34, 197, 94, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${testResult.status === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            <h2 className="text-2xl font-bold mb-4">
              {testResult.status === 'success' ? '✅ Test Results' : '❌ Test Failed'}
            </h2>
            <pre className="whitespace-pre-wrap text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-6 rounded-xl" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 className="text-2xl font-bold mb-4">What to Check:</h2>
          <ul className="list-disc list-inside space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <li>Make sure your <code className="bg-black px-2 py-1 rounded">.env.local</code> file exists in the project root</li>
            <li>Verify <code className="bg-black px-2 py-1 rounded">RESEND_API_KEY</code> is set (starts with <code className="bg-black px-2 py-1 rounded">re_</code>)</li>
            <li>Verify <code className="bg-black px-2 py-1 rounded">RESEND_FROM_EMAIL</code> is set (use <code className="bg-black px-2 py-1 rounded">onboarding@resend.dev</code> for testing)</li>
            <li>Verify <code className="bg-black px-2 py-1 rounded">CONSULTATION_EMAIL</code> is set (your email address)</li>
            <li>Restart your dev server after changing <code className="bg-black px-2 py-1 rounded">.env.local</code></li>
            <li>Check your spam/junk folder for test emails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

