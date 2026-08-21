import { useState } from 'react';

type Props = { onClose: () => void };

const steps = [
  { title: 'WELCOME, TEAM PRINCIPAL', text: 'You are in charge of the whole team: drivers, car development, race preparation and the budget.' },
  { title: 'TEAM & GARAGE', text: 'Choose which driver you control, improve the pit crew and open the garage to buy car upgrades. Better upgrades increase your race pace.' },
  { title: 'PLAN THE SEASON', text: 'The Season section shows the race calendar, your contract and your sponsor. You can check the next Grand Prix at any time.' },
  { title: 'CONTROL YOUR BUDGET', text: 'Use Finance to apply for a loan when the team needs money. Remember: loans must be repaid before their deadline.' },
  { title: 'PREPARE FOR THE RACE', text: 'Return to Team & Garage and use SKIP DAYS when you are ready. Then press OPEN WEEKEND to start your next race.' },
  { title: 'YOUR CAREER STARTS NOW', text: 'Your results, driver rating and trophies are saved in Career. Good luck in your first Grand Prix!' },
];

export function CareerTutorial({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLastStep = step === steps.length - 1;

  return <div className="tutorial-backdrop" role="dialog" aria-modal="true" aria-label="Career tutorial">
    <section className="career-tutorial">
      <p className="panel-label">NEW CAREER · {step + 1}/{steps.length}</p>
      <h2>{current.title}</h2>
      <p>{current.text}</p>
      <div><button className="tutorial-skip" onClick={onClose}>SKIP TUTORIAL</button><button className="action-button" onClick={() => isLastStep ? onClose() : setStep((value) => value + 1)}>{isLastStep ? 'START CAREER →' : 'NEXT →'}</button></div>
    </section>
  </div>;
}
