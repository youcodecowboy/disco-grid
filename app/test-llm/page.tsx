"use client"

/**
 * Test page for LLM extraction
 */

import { useState } from 'react';

export default function TestLLMPage() {
  const [text, setText] = useState('We are a denim manufacturing facility in Istanbul with 45 employees producing 10,000 garments per month');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testExtraction = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 TEST: Calling API with text:', text);
      
      const response = await fetch('/api/nlp/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      console.log('🧪 TEST: Response status:', response.status);
      
      const data = await response.json();
      console.log('🧪 TEST: Response data:', data);
      
      setResult(data);
    } catch (error) {
      console.error('🧪 TEST: Error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">LLM Extraction Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            Test Input (min 50 characters):
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 px-4 py-2 border rounded-lg"
            placeholder="Enter text to extract entities from..."
          />
          <div className="mt-2 text-xs text-gray-500">
            Length: {text.length} characters
          </div>
        </div>

        <button
          onClick={testExtraction}
          disabled={loading || text.length < 50}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? '🤖 Extracting...' : '🚀 Test LLM Extraction'}
        </button>

        {result && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Results:</h2>
            
            {result.success ? (
              <div>
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-green-800 font-medium">✅ Success!</div>
                  <div className="text-sm text-green-700 mt-1">
                    Model: {result.model} | Tokens: {result.tokensUsed}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {result.entities.map((entity: any, i: number) => (
                    <div key={i} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-700 uppercase">
                            {entity.type}
                          </div>
                          <div className="text-lg font-semibold mt-1">
                            {typeof entity.value === 'object' 
                              ? JSON.stringify(entity.value) 
                              : entity.value}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            From: "{entity.rawText}"
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            Confidence: {entity.confidence}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            🤖 {entity.provenance}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="text-red-800 font-medium">❌ Error</div>
                <div className="text-sm text-red-700 mt-1">
                  {result.error}
                </div>
              </div>
            )}
            
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                View Raw JSON
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm font-medium text-blue-900 mb-2">💡 Check Browser Console</div>
          <div className="text-xs text-blue-800">
            Open DevTools (F12) to see detailed logs of the API call and response.
          </div>
        </div>
      </div>
    </div>
  );
}

