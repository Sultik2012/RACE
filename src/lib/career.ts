import type { Team } from './racingData';
import { supabase } from './supabase';

export type RaceHistoryItem = { round: number; track: string; position: number; teammatePosition: number; prize: number };

export type CareerSnapshot = {
  team: Team; activeDriver: string; budget: number; pace: number; upgrades: string[]; round: number;
  contractYears: number; seasonYear: number; driverPoints: Record<string, number>; driverRating: number;
  racesCompleted: number; pitCrewLevel: number; daysUntilRace: number; raceHistory: RaceHistoryItem[]; sponsor: string;
};
export type CareerSlot = { slot: number; teamName: string; updatedAt: string };

type CareerRow = {
  team: Team; active_driver?: string; activeDriver?: string; budget: number; pace: number; upgrades: string[];
  round: number; contract_years?: number; contractYears?: number; season_year?: number; seasonYear?: number;
  driver_points?: Record<string, number>; driverPoints?: Record<string, number>; driver_rating?: number; driverRating?: number;
  races_completed?: number; racesCompleted?: number; pit_crew_level?: number; pitCrewLevel?: number;
  days_until_race?: number; daysUntilRace?: number; race_history?: RaceHistoryItem[]; raceHistory?: RaceHistoryItem[]; sponsor: string;
};

export async function loadCareer(userId: string, slot: number): Promise<CareerSnapshot | null> {
  const { data, error } = await supabase.from('careers').select('*').eq('user_id', userId).eq('slot', slot).maybeSingle();
  if (error || !data) return null;
  const row = data as unknown as CareerRow;
  return { team: row.team, activeDriver: row.active_driver ?? row.activeDriver ?? row.team.driver, budget: row.budget, pace: row.pace, upgrades: row.upgrades, round: row.round, contractYears: row.contract_years ?? row.contractYears ?? 3, seasonYear: row.season_year ?? row.seasonYear ?? 2026, driverPoints: row.driver_points ?? row.driverPoints ?? {}, driverRating: Number(row.driver_rating ?? row.driverRating ?? 85), racesCompleted: row.races_completed ?? row.racesCompleted ?? 0, pitCrewLevel: row.pit_crew_level ?? row.pitCrewLevel ?? 1, daysUntilRace: row.days_until_race ?? row.daysUntilRace ?? 17, raceHistory: row.race_history ?? row.raceHistory ?? [], sponsor: row.sponsor ?? 'APEX PARTNERS' };
}

export async function saveCareer(userId: string, slot: number, career: CareerSnapshot) {
  return supabase.from('careers').upsert({
    user_id: userId, slot, team: career.team, active_driver: career.activeDriver, budget: career.budget, pace: career.pace,
    upgrades: career.upgrades, round: career.round, contract_years: career.contractYears, season_year: career.seasonYear,
    driver_points: career.driverPoints, driver_rating: career.driverRating, races_completed: career.racesCompleted,
    pit_crew_level: career.pitCrewLevel, days_until_race: career.daysUntilRace, race_history: career.raceHistory,
    sponsor: career.sponsor, updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,slot' });
}

export async function loadCareerSlots(userId: string): Promise<CareerSlot[]> {
  const { data } = await supabase.from('careers').select('slot, team, updated_at').eq('user_id', userId).order('slot');
  return (data ?? []).map((row) => { const item = row as unknown as { slot: number; team: Team; updated_at: string }; return { slot: item.slot, teamName: item.team.name, updatedAt: item.updated_at }; });
}

export async function deleteCareerSlot(userId: string, slot: number) {
  return supabase.from('careers').delete().eq('user_id', userId).eq('slot', slot);
}
