import { useState } from 'react';
import { repaymentFor, reviewLoanReason, type CareerLoan } from '../lib/loans';

type Props = { loan: CareerLoan | null; budget: number; onApply: (amount: number, reason: string, term: number) => void; onRepay: () => void };

export function BankCenter({ loan, budget, onApply, onRepay }: Props) {
  const [amount, setAmount] = useState(10);
  const [term, setTerm] = useState(6);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('Explain clearly how the investment will improve your team.');
  const repayment = repaymentFor(amount, term);

  if (loan) return <section className="bank-center"><header><div><p className="panel-label">APEX FINANCIAL</p><h2>ACTIVE LOAN</h2></div><b>€{loan.amount}M</b></header><div className="bank-loan-grid"><span>REPAYMENT <b>€{loan.repayment}M</b></span><span>RACES LEFT <b className={loan.remainingRaces <= 2 ? 'danger' : ''}>{loan.remainingRaces}</b></span><span>STATUS <b>{loan.remainingRaces === 0 ? 'DUE NOW' : 'ACTIVE'}</b></span></div><p className="bank-warning">If you reach the repayment date without paying, the bank repossesses all car upgrades.</p><button disabled={budget < loan.repayment} onClick={onRepay}>REPAY €{loan.repayment}M</button></section>;

  const apply = () => {
    if (!reviewLoanReason(reason)) { setMessage('Loan declined: write at least 25 characters and explain a team, driver, car or race investment.'); return; }
    setMessage(`Loan approved: €${amount}M arrives in your team budget.`);
    onApply(amount, reason, term);
  };
  return <section className="bank-center"><header><div><p className="panel-label">APEX FINANCIAL</p><h2>TEAM BANK</h2></div><b>LOANS</b></header><p className="bank-copy">Borrow €1M—€100M for a real team investment. A weak explanation is rejected by the bank.</p><div className="bank-form"><label>LOAN AMOUNT <b>€{amount}M</b><input type="range" min="1" max="100" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></label><label>REPAYMENT TERM <b>{term} RACES</b><input type="range" min="1" max="24" value={term} onChange={(event) => setTerm(Number(event.target.value))} /></label><label>WHY DO YOU NEED THE MONEY?<textarea maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="For example: We need funding to upgrade the car's aerodynamics before the next races." /></label></div><div className="bank-offer"><span>YOU RECEIVE <b>€{amount}M</b></span><span>YOU REPAY <b>€{repayment}M</b></span><button onClick={apply}>SEND TO BANK →</button></div><small className="bank-message">{message}</small></section>;
}
