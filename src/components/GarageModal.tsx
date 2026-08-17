type Upgrade = { name: string; detail: string; cost: number };
type Props = { budget: number; completed: string[]; onClose: () => void; onUpgrade: (name: string, cost: number) => void };

const upgrades: Upgrade[] = [
  { name: 'AERODYNAMICS', detail: 'More downforce in fast corners', cost: 12 },
  { name: 'CHASSIS', detail: 'Sharper turn-in and lower weight', cost: 11 },
  { name: 'SUSPENSION', detail: 'Better tyre life over a race stint', cost: 9 },
  { name: 'POWER UNIT', detail: 'Higher top speed on straights', cost: 14 },
  { name: 'ERS SYSTEM', detail: 'Stronger energy deployment', cost: 10 },
];

export function GarageModal({ budget, completed, onClose, onUpgrade }: Props) {
  const total = completed.length;
  const nextCost = Math.round(8 * 1.5 ** total);
  return <div className="modal-backdrop" role="presentation"><section className="garage-modal" role="dialog" aria-modal="true" aria-label="Car garage"><header><div><p className="eyebrow">CAR DEVELOPMENT</p><h2>GARAGE</h2></div><button onClick={onClose}>×</button></header><p className="garage-copy">15 upgrades available: 3 levels in each area. Every next upgrade costs 1.5× more and adds +2 car pace.</p><p className="garage-progress">UPGRADES {total}/15 · NEXT COST €{nextCost}M</p><div className="garage-upgrades">{upgrades.map((upgrade, index) => { const level = completed.filter((item) => item.startsWith(upgrade.name)).length; const maxed = level === 3; return <article key={upgrade.name}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{upgrade.name} · LVL {level}/3</b><small>{upgrade.detail}</small></div><button disabled={maxed || budget < nextCost} onClick={() => onUpgrade(`${upgrade.name}-${level + 1}`, nextCost)}>{maxed ? 'MAXED' : `€${nextCost}M`}</button></article>; })}</div></section></div>;
}
