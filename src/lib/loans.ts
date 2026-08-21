import { supabase } from './supabase';

export type CareerLoan = {
  id: string;
  amount: number;
  reason: string;
  termRaces: number;
  remainingRaces: number;
  repayment: number;
  status: 'active' | 'repaid' | 'defaulted';
};

type LoanRow = {
  id: string; amount_millions: number; reason: string; term_races: number;
  remaining_races: number; repayment_millions: number; status: CareerLoan['status'];
};

function mapLoan(row: LoanRow): CareerLoan {
  return { id: row.id, amount: row.amount_millions, reason: row.reason, termRaces: row.term_races, remainingRaces: row.remaining_races, repayment: row.repayment_millions, status: row.status };
}

export function repaymentFor(amount: number, termRaces: number) {
  return Math.ceil(amount * (1 + 0.08 + termRaces * 0.012));
}

export function reviewLoanReason(reason: string) {
  const goodWords = ['car', 'upgrade', 'driver', 'team', 'race', 'aero', 'pit', 'machine', 'болид', 'машин', 'пилот', 'команд', 'гонк', 'прокач'];
  const normalized = reason.trim().toLowerCase();
  return normalized.length >= 25 && goodWords.some((word) => normalized.includes(word));
}

export async function loadCareerLoan(userId: string, slot: number): Promise<CareerLoan | null> {
  const { data } = await supabase.from('career_loans').select('*').eq('user_id', userId).eq('career_slot', slot).eq('status', 'active').maybeSingle();
  return data ? mapLoan(data as LoanRow) : null;
}

export async function createCareerLoan(userId: string, slot: number, amount: number, reason: string, termRaces: number) {
  const repayment = repaymentFor(amount, termRaces);
  const { data, error } = await supabase.from('career_loans').insert({ user_id: userId, career_slot: slot, amount_millions: amount, reason, term_races: termRaces, remaining_races: termRaces, repayment_millions: repayment }).select().single();
  if (error || !data) return null;
  return mapLoan(data as LoanRow);
}

export async function updateCareerLoan(id: string, values: Partial<Pick<CareerLoan, 'remainingRaces' | 'status'>>) {
  const update = { ...(values.remainingRaces === undefined ? {} : { remaining_races: values.remainingRaces }), ...(values.status === undefined ? {} : { status: values.status }), updated_at: new Date().toISOString() };
  await supabase.from('career_loans').update(update).eq('id', id);
}
