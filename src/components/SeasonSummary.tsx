import type { RaceHistoryItem } from '../lib/career';

type Props = { drivers: string[]; points: Record<string, number>; history: RaceHistoryItem[] };

export function SeasonSummary({ drivers, points, history }: Props) {
  const standings = [...drivers].sort((a, b) => (points[b] ?? 0) - (points[a] ?? 0));
  return <section className="season-summary"><div className="championship"><header><span>DRIVER CHAMPIONSHIP</span><strong>PTS</strong></header>{standings.map((driver, index) => <div key={driver}><b>P{index + 1}</b><span>{driver}</span><strong>{points[driver] ?? 0}</strong></div>)}</div><div className="race-history"><p className="panel-label">SEASON HISTORY</p><h2>RACE RESULTS</h2>{history.length === 0 ? <p>No races completed yet.</p> : history.slice().reverse().map((race) => <article key={`${race.round}-${race.track}`}><b>R{race.round}</b><span>{race.track}</span><strong>P{race.position}</strong><small>TEAMMATE P{race.teammatePosition} · €{race.prize}M</small></article>)}</div></section>;
}
