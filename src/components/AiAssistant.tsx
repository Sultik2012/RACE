import { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function getAnswer(data: unknown) {
  return typeof data === 'object' && data !== null && 'text' in data && typeof data.text === 'string' ? data.text : null;
}

export function AiAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const ask = async () => {
    const prompt = question.trim();
    if (!prompt || loading) return;
    if (!isSupabaseConfigured) { setAnswer('AI is not connected yet. Add Supabase settings first.'); return; }
    setLoading(true); setAnswer('');
    const { data, error } = await supabase.functions.invoke('ai', {
      body: { prompt, system: 'You are a friendly general AI assistant inside a game. Answer questions on any topic clearly and honestly, in the same language as the user. Keep answers useful and concise. If you are unsure or information may be current, say so.' },
    });
    setAnswer(error ? 'AI is not connected yet. Add GEMINI_API_KEY, then upload the secret and deploy the AI function.' : getAnswer(data) ?? 'I could not answer this time. Please try again.');
    setLoading(false);
  };
  return <section className="ai-assistant"><p className="panel-label">AI ASSISTANT</p><h2>ASK ANYTHING</h2><p>Ask any question — not only about racing.</p><div><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void ask(); }} placeholder="Write your question…" /><button disabled={!question.trim() || loading} onClick={() => void ask()}>{loading ? 'THINKING…' : 'ASK AI'}</button></div>{answer && <article>{answer}</article>}</section>;
}
