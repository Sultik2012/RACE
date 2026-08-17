import { useEffect, useState } from 'react';
import { deleteCareerSlot, loadCareerSlots, type CareerSlot } from '../lib/career';

type Props = { userId: string; onSelect: (slot: number) => void };

export function CareerSlots({ userId, onSelect }: Props) {
  const [slots, setSlots] = useState<CareerSlot[]>([]);
  const refresh = () => { void loadCareerSlots(userId).then(setSlots); };
  useEffect(refresh, [userId]);
  return <main className="manager-wrap"><p className="eyebrow">YOUR CAREERS</p><h1 className="manager-title">CHOOSE A SAVE</h1><p className="manager-copy">You can keep up to four different careers.</p><div className="career-slots">{[1, 2, 3, 4].map((slot) => { const career = slots.find((item) => item.slot === slot); return <article key={slot}><span>SLOT {slot}</span>{career ? <><b>{career.teamName}</b><small>Saved career</small><button onClick={() => onSelect(slot)}>CONTINUE</button><button className="delete-slot" onClick={() => { if (window.confirm('Delete this career?')) { void deleteCareerSlot(userId, slot).then(refresh); } }}>DELETE</button></> : <><b>EMPTY SLOT</b><small>Start a new team project.</small><button onClick={() => onSelect(slot)}>NEW CAREER</button></>}</article>; })}</div></main>;
}
