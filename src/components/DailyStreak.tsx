import { useEffect, useState } from 'react';

type Streak = { days: number; lastVisit: string };

function today() { return new Date().toISOString().slice(0, 10); }
function daysBetween(from: string, to: string) { return Math.round((Date.parse(`${to}T00:00:00`) - Date.parse(`${from}T00:00:00`)) / 86_400_000); }

export function DailyStreak() {
  const [streak, setStreak] = useState<Streak>({ days: 1, lastVisit: today() });
  useEffect(() => { const saved = localStorage.getItem('apex-daily-streak'); const current = today(); const previous = saved ? JSON.parse(saved) as Streak : null; const gap = previous ? daysBetween(previous.lastVisit, current) : 0; const next = !previous ? { days: 1, lastVisit: current } : gap === 0 ? previous : gap === 1 ? { days: previous.days + 1, lastVisit: current } : { days: 1, lastVisit: current }; localStorage.setItem('apex-daily-streak', JSON.stringify(next)); setStreak(next); }, []);
  const week = Array.from({ length: 7 }, (_, index) => Math.max(0, streak.days - 6 + index));
  return <section className="daily-streak"><div><p className="panel-label">DAILY STREAK</p><b>🔥 {streak.days} DAYS</b><small>Come back tomorrow to protect your streak.</small></div><div className="streak-days">{week.map((day, index) => <span className={day > 0 ? 'active' : ''} key={index}>{day > 0 ? '🔥' : '○'}</span>)}</div></section>;
}
