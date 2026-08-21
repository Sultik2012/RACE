import { calendarDetails } from '../lib/racingData';

type Props = { currentRound: number; daysUntilRace: number };

export function SeasonCalendar({ currentRound, daysUntilRace }: Props) {
  return <section className="season-calendar">
    <header><div><p className="panel-label">2026 FORMULA 1 CALENDAR</p><h2>RACE SCHEDULE</h2></div><div className="date-card"><b>{daysUntilRace === 0 ? 'RACE WEEKEND' : `${daysUntilRace} DAYS`}</b><small>{daysUntilRace === 0 ? 'READY TO RACE' : 'UNTIL NEXT GRAND PRIX'}</small><em>LIVE CLOCK · 1 MIN = 1 DAY</em></div></header>
    <div className="calendar-races">{calendarDetails.map(([flag, circuit, date], index) => <article className={index + 1 === currentRound ? 'current' : index + 1 < currentRound ? 'completed' : ''} key={circuit}><span>{String(index + 1).padStart(2, '0')}</span><i>{flag}</i><div><b>{circuit}</b><small>{date}</small></div></article>)}</div>
  </section>;
}
