import { useEffect, useState } from 'react';

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('apex-volume') ?? 70));
  const [compactTiming, setCompactTiming] = useState(() => localStorage.getItem('apex-compact-timing') === 'true');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => localStorage.getItem('apex-theme') === 'light' ? 'light' : 'dark');

  useEffect(() => { localStorage.setItem('apex-volume', String(volume)); }, [volume]);
  useEffect(() => { localStorage.setItem('apex-compact-timing', String(compactTiming)); document.documentElement.classList.toggle('compact-timing', compactTiming); }, [compactTiming]);
  useEffect(() => { localStorage.setItem('apex-theme', theme); document.documentElement.dataset.theme = theme; }, [theme]);

  return <section className="settings-panel">
    <button className="settings-toggle" onClick={() => setOpen(!open)}>SETTINGS {open ? '−' : '+'}</button>
    {open && <div>
      <label>GAME THEME <span className="theme-buttons"><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>DARK</button><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>LIGHT</button></span></label>
      <label>GAME VOLUME <b>{volume}%</b><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
      <label className="settings-check"><input type="checkbox" checked={compactTiming} onChange={(event) => setCompactTiming(event.target.checked)} /> COMPACT LIVE TIMING</label>
      <button className="change-device" onClick={() => { localStorage.removeItem('apex-device'); window.location.reload(); }}>CHANGE DEVICE</button>
      <small>Settings are saved on this device.</small>
    </div>}
  </section>;
}
