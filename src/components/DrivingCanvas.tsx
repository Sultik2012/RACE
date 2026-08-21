import { useEffect, useRef, useState } from 'react';
import type { Tyre } from '../lib/racingData';

type Props = { active: boolean; colour: string; tyre: Tyre; totalLaps: number; pitRequested: boolean; weather: string; onPitDone: () => void; onFinish: (place: number) => void };
type Dashboard = { speed: number; lap: number; position: number; wear: number; energy: number; fuel: number; limits: number; safetyCar: boolean; pitting: boolean };

const pressed = new Set<string>();
const tyreGrip: Record<Tyre, number> = { soft: 1.15, medium: 1, hard: .9 };

function fillPolygon(context: CanvasRenderingContext2D, points: [number, number][], colour: string) {
  context.beginPath();
  points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.closePath(); context.fillStyle = colour; context.fill();
}

export function DrivingCanvas({ active, colour, tyre, totalLaps, pitRequested, weather, onPitDone, onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tyreRef = useRef(tyre); const pitRef = useRef(pitRequested); const activeRef = useRef(active);
  tyreRef.current = tyre; pitRef.current = pitRequested; activeRef.current = active;
  const [dashboard, setDashboard] = useState<Dashboard>({ speed: 0, lap: 1, position: 8, wear: 0, energy: 100, fuel: 100, limits: 0, safetyCar: false, pitting: false });

  useEffect(() => {
    const canvas = canvasRef.current; const context = canvas?.getContext('2d'); if (!canvas || !context) return undefined;
    const race = { speed: 0, steering: 0, lateral: 0, curve: 0, distance: 0, wear: 0, energy: 100, fuel: 100, limits: 0, safety: 0, pit: 0, finished: false };
    const isWet = weather.includes('Дождь');
    const resize = () => { canvas.width = canvas.clientWidth * devicePixelRatio; canvas.height = canvas.clientHeight * devicePixelRatio; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
    const keyDown = (event: KeyboardEvent) => { if (['w', 'a', 's', 'd', 'b', 'x', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.key)) { event.preventDefault(); pressed.add(event.key.toLowerCase()); } };
    const keyUp = (event: KeyboardEvent) => pressed.delete(event.key.toLowerCase());
    resize(); window.addEventListener('resize', resize); window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp);
    let animation = 0; let previous = 0;
    const frame = (time: number) => {
      const delta = Math.min(2, (time - previous || 16) / 16); previous = time; const width = canvas.clientWidth; const height = canvas.clientHeight; const horizon = height * .31;
      const gas = pressed.has('w') || pressed.has('arrowup'); const brake = pressed.has('s') || pressed.has('arrowdown'); const turn = (pressed.has('a') || pressed.has('arrowleft') ? -1 : 0) + (pressed.has('d') || pressed.has('arrowright') ? 1 : 0); const overtake = pressed.has('b') && race.energy > 1 && race.safety <= 0; const aero = pressed.has('x') && Math.abs(race.curve) < .12;
      if (activeRef.current && race.pit > 0) { race.speed = 0; race.pit -= delta; if (race.pit <= 0) onPitDone(); }
      else if (activeRef.current) { const grip = tyreGrip[tyreRef.current] * (isWet ? .84 : 1); race.curve = Math.sin(race.distance / 27) * .28 + Math.sin(race.distance / 9) * .08; race.lateral += (turn * .032 * grip - race.curve * race.speed / 9000) * delta; const offTrack = Math.abs(race.lateral) > .92; const limit = race.safety > 0 ? 110 : aero ? 338 : 320; const acceleration = gas ? 4.2 * grip + (overtake ? 3.4 : 0) : -1.8; race.speed = Math.max(0, Math.min(limit, race.speed + acceleration - (brake ? 8 : 0) - (offTrack ? 7 : 0))); race.steering += (turn * .08 - race.steering * .1) * delta; race.distance += race.speed / 120000 * delta; race.wear += race.speed / 33000 * delta + Math.abs(turn) * .0006; race.fuel = Math.max(0, race.fuel - race.speed / 31000); race.energy = Math.max(0, Math.min(100, race.energy + (brake ? .38 : .03) - (overtake ? .75 : 0))); if (Math.abs(race.lateral) > 1.18 && race.speed > 180) race.limits = Math.min(3, race.limits + .008); race.lateral = Math.max(-1.35, Math.min(1.35, race.lateral)); if (race.distance > 35.55 && race.distance < 35.56 && race.safety <= 0) race.safety = 95; if (race.safety > 0) race.safety -= delta; }
      if (pitRef.current && race.pit === 0 && race.distance > 1.1 && race.distance % 1 < .08) { race.pit = 42; race.wear = 0; }
      if (race.distance > totalLaps && !race.finished) { race.finished = true; onFinish(Math.min(8, (race.speed > 210 ? 3 : 6) + Math.floor(race.limits))); }
      context.fillStyle = '#82b9dc'; context.fillRect(0, 0, width, horizon); context.fillStyle = '#4e8f43'; context.fillRect(0, horizon, width, height - horizon);
      const offset = (race.steering + race.curve + race.lateral * .52) * width * .24;
      for (let stripe = 0; stripe < 22; stripe += 1) { const near = horizon + (stripe / 22) ** 2 * height * .58; const far = horizon + ((stripe + 1) / 22) ** 2 * height * .58; const nearHalf = width * (.08 + (stripe / 22) * .62); const farHalf = width * (.08 + ((stripe + 1) / 22) * .62); const center = width / 2 + offset * (stripe / 22) ** 1.5; fillPolygon(context, [[center - nearHalf, near], [center + nearHalf, near], [center + farHalf, far], [center - farHalf, far]], stripe % 2 ? '#2a2b2b' : '#303131'); }
      for (let index = 0; index < 9; index += 1) { const depth = (race.distance * 1.6 + index * .11) % 1; const scale = .1 + depth * .7; const x = width / 2 + Math.sin(race.distance * 1.6 + index * 8) * width * .28 * depth + offset * depth; const y = horizon + depth ** 2 * height * .48; context.fillStyle = ['#ff8b18', '#1584e7', '#e93631', '#00a19b', '#f1f0e8'][index % 5]; context.fillRect(x - 22 * scale, y - 9 * scale, 44 * scale, 18 * scale); context.fillStyle = '#101010'; context.fillRect(x - 25 * scale, y - 11 * scale, 8 * scale, 22 * scale); context.fillRect(x + 17 * scale, y - 11 * scale, 8 * scale, 22 * scale); }
      if (isWet) { context.strokeStyle = '#d7efff88'; context.lineWidth = 1; for (let drop = 0; drop < 60; drop += 1) { const x = (drop * 59 + time / 2) % width; const y = (drop * 83 + time / 3) % height; context.beginPath(); context.moveTo(x, y); context.lineTo(x - 7, y + 15); context.stroke(); } }
      if (race.safety > 0) { context.fillStyle = '#f4c425'; context.fillRect(width * .35, 20, width * .3, 26); context.fillStyle = '#171717'; context.font = 'bold 13px Arial'; context.fillText('SAFETY CAR', width * .42, 38); }
      const wheelX = width / 2 + race.lateral * width * .24; context.fillStyle = '#121212'; context.fillRect(0, height * .77, width, height * .23); context.fillStyle = colour; context.fillRect(width * .18, height * .88, width * .64, height * .12); context.fillStyle = '#191919'; context.beginPath(); context.arc(wheelX, height * .9, width * .145, 0, Math.PI * 2); context.fill(); context.strokeStyle = '#c5c2b8'; context.lineWidth = 8; context.stroke(); context.fillStyle = '#111'; context.fillRect(width / 2 - 44, height * .84, 88, 52); context.fillStyle = '#d9e5d4'; context.font = 'bold 20px monospace'; context.fillText(String(Math.round(race.speed)).padStart(3, '0'), width / 2 - 35, height * .875);
      setDashboard({ speed: Math.round(race.speed), lap: Math.min(totalLaps, Math.floor(race.distance) + 1), position: Math.max(1, 10 - Math.floor(race.distance / 12)), wear: Math.min(100, Math.round(race.wear * 100)), energy: Math.round(race.energy), fuel: Math.round(race.fuel), limits: Math.floor(race.limits), safetyCar: race.safety > 0, pitting: race.pit > 0 }); animation = requestAnimationFrame(frame);
    }; animation = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(animation); window.removeEventListener('resize', resize); window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); pressed.clear(); };
  }, [colour, onFinish, onPitDone]);
  return <section className="cockpit-card"><canvas className="cockpit-canvas" ref={canvasRef} /><div className="cockpit-hud"><span>P{dashboard.position}<small>ПОЗИЦИЯ</small></span><span>{dashboard.lap}/{totalLaps}<small>КРУГ</small></span><span>{dashboard.speed}<small>КМ/Ч</small></span><span>{dashboard.wear}%<small>ШИНЫ</small></span></div><div className="race-systems"><span>ERS {dashboard.energy}%</span><span>FUEL {dashboard.fuel}%</span><span>LIMITS {dashboard.limits}/3</span></div>{dashboard.safetyCar && <p className="safety-status">SAFETY CAR · ДЕРЖИ ТЕМП</p>}{dashboard.pitting && <p className="pit-status">ПИТ-СТОП: НОВЫЙ КОМПЛЕКТ УСТАНОВЛЕН</p>}<p className="controls-help"><b>W / ↑</b> газ · <b>S / ↓</b> тормоз · <b>A D / ← →</b> поворот · держись на асфальте · <b>B</b> OVERTAKE · <b>X</b> AERO</p></section>;
}
