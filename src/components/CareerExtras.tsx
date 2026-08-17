import { useEffect, useState, type CSSProperties } from 'react';
import type { RaceHistoryItem } from '../lib/career';

type Props = { driver: string; driverRating: number; history: RaceHistoryItem[]; round: number };
type Difficulty = 'ROOKIE' | 'PRO' | 'LEGEND';

const academy = [{ name: 'A. Vega', rating: 72 }, { name: 'K. Nakamura', rating: 75 }, { name: 'L. Moretti', rating: 78 }];

export function CareerExtras({ driver, driverRating, history, round }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>(() => (localStorage.getItem('apex-difficulty') as Difficulty | null) ?? 'PRO');
  const [colour, setColour] = useState(() => localStorage.getItem('apex-livery') ?? '#e63234');
  const [number, setNumber] = useState(() => localStorage.getItem('apex-number') ?? '26');
  const [prospect, setProspect] = useState(() => localStorage.getItem('apex-prospect') ?? '');
  useEffect(() => { localStorage.setItem('apex-difficulty', difficulty); localStorage.setItem('apex-livery', colour); localStorage.setItem('apex-number', number); localStorage.setItem('apex-prospect', prospect); }, [difficulty, colour, number, prospect]);
  const wins = history.filter((race) => race.position === 1).length;
  const podiums = history.filter((race) => race.position <= 3).length;
  const news = [`Round ${round}: ${driver} is preparing with a ${driverRating.toFixed(1)} rating.`, wins ? `Paddock talks about your ${wins} race win${wins === 1 ? '' : 's'}.` : 'The paddock is waiting for your first victory.', prospect ? `${prospect} is being watched by the academy.` : 'Your academy has three young prospects ready for testing.'];
  return <section className="career-extras"><div className="extras-card"><p className="panel-label">CAREER MODE</p><h2>DIFFICULTY</h2><div className="difficulty-buttons">{(['ROOKIE', 'PRO', 'LEGEND'] as Difficulty[]).map((item) => <button className={difficulty === item ? 'active' : ''} onClick={() => setDifficulty(item)} key={item}>{item}</button>)}</div><small>Rookie is relaxed; Legend makes race results tougher.</small></div><div className="extras-card"><p className="panel-label">TEAM IDENTITY</p><h2>LIVERY</h2><div className="livery-preview" style={{ '--livery': colour } as CSSProperties}><b>#{number}</b><i /></div><label>COLOUR <input type="color" value={colour} onChange={(event) => setColour(event.target.value)} /></label><label>CAR NUMBER <input type="number" min="1" max="99" value={number} onChange={(event) => setNumber(event.target.value)} /></label></div><div className="extras-card academy"><p className="panel-label">DRIVER ACADEMY</p><h2>YOUNG TALENTS</h2>{academy.map((talent) => <button className={prospect === talent.name ? 'active' : ''} onClick={() => setProspect(talent.name)} key={talent.name}><b>{talent.name}</b><span>RATING {talent.rating}</span></button>)}</div><div className="extras-card"><p className="panel-label">PADDOCK NEWS</p><h2>HEADLINES</h2>{news.map((item) => <p className="news-item" key={item}>{item}</p>)}</div><div className="extras-card achievements"><p className="panel-label">ACHIEVEMENTS</p><h2>TROPHY CABINET</h2><span className={history.length > 0 ? 'unlocked' : ''}>✓ FIRST START</span><span className={podiums > 0 ? 'unlocked' : ''}>★ FIRST PODIUM</span><span className={wins > 0 ? 'unlocked' : ''}>♛ FIRST WIN</span><span className={driverRating >= 90 ? 'unlocked' : ''}>↑ RATING 90</span></div></section>;
}
