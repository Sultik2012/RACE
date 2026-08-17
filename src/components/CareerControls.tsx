const sponsors = [
  { name: 'APEX PARTNERS', bonus: 2, detail: 'Reliable base payment after every race.' },
  { name: 'NOVA ENERGY', bonus: 4, detail: 'Higher race bonus for ambitious teams.' },
  { name: 'ORBIT TECH', bonus: 3, detail: 'Technology partner with a balanced payout.' },
];

type Props = { sponsor: string; contractYears: number; budget: number; onSponsor: (name: string) => void; onRenew: () => void; onChangeTeam: () => void; onNewCareer?: () => void };

export function sponsorBonus(sponsor: string) {
  return sponsors.find((item) => item.name === sponsor)?.bonus ?? 2;
}

export function CareerControls({ sponsor, contractYears, budget, onSponsor, onRenew, onChangeTeam, onNewCareer }: Props) {
  const renewalCost = 12 + (3 - Math.min(contractYears, 3)) * 4;
  return <section className="career-controls"><div><p className="panel-label">CONTRACT</p><h2>{contractYears > 0 ? `${contractYears} YEARS LEFT` : 'CONTRACT EXPIRED'}</h2><p>{contractYears > 0 ? 'Your team seat is secured.' : 'You can choose a new team.'}</p><button disabled={contractYears >= 5 || budget < renewalCost} onClick={onRenew}>RENEW +1 YEAR · €{renewalCost}M</button>{contractYears === 0 && <button className="outline-control" onClick={onChangeTeam}>CHOOSE NEW TEAM</button>}<button className="outline-control new-career-button" onClick={onNewCareer ?? onChangeTeam}>NEW CAREER</button></div><div><p className="panel-label">SPONSORS</p><h2>RACE BONUS</h2>{sponsors.map((item) => <button className={item.name === sponsor ? 'sponsor active' : 'sponsor'} onClick={() => onSponsor(item.name)} key={item.name}><b>{item.name}</b><span>+€{item.bonus}M / RACE</span><small>{item.detail}</small></button>)}</div></section>;
}
