import { type Team, type Track } from '../lib/racingData';

type GarageSelectorProps = { team: Team; track: Track; teams: Team[]; tracks: Track[]; onTeam: (team: Team) => void; onTrack: (track: Track) => void; onStart: () => void };

export function GarageSelector({ team, track, teams, tracks, onTeam, onTrack, onStart }: GarageSelectorProps) {
  return <section className="garage">
    <div className="garage-heading"><p className="eyebrow">DRIVER MODE</p><h1>ВЫБЕРИ БОЛИД <em>И ТРАССУ</em></h1><p>Ты за рулём. Выбери команду, трассу — и выезжай на асфальт.</p></div>
    <div className="select-grid">
      <div className="selection"><p>01 / ВЫБОР КОМАНДЫ</p><div className="team-list">{teams.map((item) => <button key={item.name} onClick={() => onTeam(item)} className={team.name === item.name ? 'active' : ''}><i style={{ background: item.color }} />{item.name}</button>)}</div></div>
      <div className="selection"><p>02 / ВЫБОР ТРАССЫ</p><div className="track-list">{tracks.map((item) => <button key={item.name} onClick={() => onTrack(item)} className={track.name === item.name ? 'active' : ''}><b>{item.name}</b><span>{item.country} · {item.laps} кругов</span></button>)}</div></div>
    </div>
    <div className="race-brief"><div><span>ТРАССА</span><b>{track.name}</b></div><div><span>ПОГОДА</span><b>☀ {track.weather}</b></div><div><span>БОЛИД</span><b style={{ color: team.color }}>{team.name}</b></div><button onClick={onStart}>ЗА РУЛЬ <span>→</span></button></div>
  </section>;
}
