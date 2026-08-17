import { useEffect, useState } from 'react';

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('apex-volume') ?? 70));
  const [compactTiming, setCompactTiming] = useState(() => localStorage.getItem('apex-compact-timing') === 'true');
  useEffect(() => { localStorage.setItem('apex-volume', String(volume)); }, [volume]);
  useEffect(() => { localStorage.setItem('apex-compact-timing', String(compactTiming)); document.documentElement.classList.toggle('compact-timing', compactTiming); }, [compactTiming]);
  return <section className="settings-panel"><button className="settings-toggle" onClick={() => setOpen(!open)}>SETTINGS {open ? '−' : '+'}</button>{open && <div><label>GAME VOLUME <b>{volume}%</b><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label><label className="settings-check"><input type="checkbox" checked={compactTiming} onChange={(event) => setCompactTiming(event.target.checked)} /> COMPACT LIVE TIMING</label><small>Settings are saved on this device.</small></div>}</section>;
}
