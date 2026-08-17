import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AiAssistant } from '../components/AiAssistant';
import { CareerControls, sponsorBonus } from '../components/CareerControls';
import { CareerExtras } from '../components/CareerExtras';
import { CareerSlots } from '../components/CareerSlots';
import { DeviceChooser } from '../components/DeviceChooser';
import { DailyStreak } from '../components/DailyStreak';
import { LanguageSelector } from '../components/LanguageSelector';
import { RaceWeekend } from '../components/RaceWeekend';
import { SeasonCalendar } from '../components/SeasonCalendar';
import { SettingsPanel } from '../components/SettingsPanel';
import { TeamHQ } from '../components/TeamHQ';
import { TeamPicker } from '../components/TeamPicker';
import { loadCareer, saveCareer, type RaceHistoryItem } from '../lib/career';
import { calendar, driverMarketByYear, teams, type Driver, type Team } from '../lib/racingData';
import { supabase } from '../lib/supabase';

type View = 'pick' | 'hq' | 'weekend';

export function GamePage() {
  const [view, setView] = useState<View>('pick'); const [team, setTeam] = useState<Team>(teams[0]);
  const [budget, setBudget] = useState(team.budget); const [pace, setPace] = useState(team.pace); const [driver, setDriver] = useState(team.driver);
  const [upgrades, setUpgrades] = useState<string[]>([]); const [round, setRound] = useState(1); const [contractYears, setContractYears] = useState(3); const [year, setYear] = useState(2026);
  const [driverPoints, setDriverPoints] = useState<Record<string, number>>({}); const [driverRating, setDriverRating] = useState(85); const [racesCompleted, setRacesCompleted] = useState(0);
  const [pitCrewLevel, setPitCrewLevel] = useState(1); const [daysUntilRace, setDaysUntilRace] = useState(17); const [raceHistory, setRaceHistory] = useState<RaceHistoryItem[]>([]); const [sponsor, setSponsor] = useState('APEX PARTNERS');
  const [userId, setUserId] = useState<string | null>(null); const [authChecked, setAuthChecked] = useState(false); const [hydrated, setHydrated] = useState(false); const [slot, setSlot] = useState<number | null>(null); const [device, setDevice] = useState<'desktop' | 'tablet' | 'phone' | null>(() => localStorage.getItem('apex-device') as 'desktop' | 'tablet' | 'phone' | null);

  useEffect(() => { void supabase.auth.getUser().then(({ data }) => { setUserId(data.user?.id ?? null); setAuthChecked(true); }); const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserId(session?.user.id ?? null)); return () => data.subscription.unsubscribe(); }, []);
  useEffect(() => { if (!device) return; localStorage.setItem('apex-device', device); document.documentElement.dataset.device = device; }, [device]);
  useEffect(() => { const advanceAfterRetirement = () => { setRound((value) => Math.min(24, value + 1)); setDaysUntilRace(14); setView('hq'); }; window.addEventListener('apex-race-retired', advanceAfterRetirement); return () => window.removeEventListener('apex-race-retired', advanceAfterRetirement); }, []);
  useEffect(() => { if (!authChecked) return; if (!userId) { setHydrated(true); return; } if (slot === null) { setHydrated(false); return; } let active = true; setHydrated(false); void loadCareer(userId, slot).then((career) => { if (!active) return; if (career) { setTeam(career.team); setDriver(career.activeDriver); setBudget(career.budget); setPace(career.pace); setUpgrades(career.upgrades); setRound(career.round); setContractYears(career.contractYears); setYear(career.seasonYear); setDriverPoints(career.driverPoints); setDriverRating(career.driverRating); setRacesCompleted(career.racesCompleted); setPitCrewLevel(career.pitCrewLevel); setDaysUntilRace(career.daysUntilRace); setRaceHistory(career.raceHistory); setSponsor(career.sponsor); setView('hq'); } setHydrated(true); }); return () => { active = false; }; }, [authChecked, userId, slot]);
  useEffect(() => { if (!userId || slot === null || !hydrated) return; const timer = window.setTimeout(() => { void saveCareer(userId, slot, { team, activeDriver: driver, budget, pace, upgrades, round, contractYears, seasonYear: year, driverPoints, driverRating, racesCompleted, pitCrewLevel, daysUntilRace, raceHistory, sponsor }); }, 500); return () => window.clearTimeout(timer); }, [userId, slot, hydrated, team, driver, budget, pace, upgrades, round, contractYears, year, driverPoints, driverRating, racesCompleted, pitCrewLevel, daysUntilRace, raceHistory, sponsor]);

  const choose = (next: Team) => { setTeam(next); setBudget(next.budget); setPace(next.pace); setDriver(next.driver); setUpgrades([]); setDriverPoints({}); setDriverRating(85); setRacesCompleted(0); setRaceHistory([]); setSponsor('APEX PARTNERS'); };
  const upgrade = (name: string, cost: number) => { setBudget((value) => value - cost); setPace((value) => value + 2); setUpgrades((value) => [...value, name]); };
  const train = () => { setBudget((value) => value - 4); setDriverRating((value) => Math.min(100, value + 1)); };
  const upgradePitCrew = () => { const cost = Math.round(6 * 1.5 ** (pitCrewLevel - 1)); setBudget((value) => value - cost); setPitCrewLevel((value) => Math.min(10, value + 1)); };
  const hire = (next: Driver) => { setBudget((value) => value - next.salary); setTeam((current) => driver === current.teammate ? { ...current, teammate: next.name } : { ...current, driver: next.name }); setDriver(next.name); };
  const finishRace = (prize: number, playerPosition: number, teammatePosition: number) => { const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]; const teammate = team.driver === driver ? team.teammate : team.driver; const track = calendar[round - 1] ?? 'Season finale'; const totalIncome = prize + sponsorBonus(sponsor); setBudget((value) => value + totalIncome); setDriverRating((value) => Math.min(100, value + .625)); setRacesCompleted((value) => Math.min(24, value + 1)); setDriverPoints((value) => ({ ...value, [driver]: (value[driver] ?? 0) + (points[playerPosition - 1] ?? 0), [teammate]: (value[teammate] ?? 0) + (points[teammatePosition - 1] ?? 0) })); setRaceHistory((value) => [...value, { round, track, position: playerPosition, teammatePosition, prize: totalIncome }]); setRound((value) => Math.min(24, value + 1)); setDaysUntilRace(14); if (round === 24) setContractYears((value) => Math.max(0, value - 1)); };
  const start = (years: number, name: string | null) => { if (name) { setTeam((value) => ({ ...value, driver: name })); setDriver(name); } setContractYears(years); setView('hq'); };
  const teamDrivers = [team.driver, team.teammate]; const teammate = teamDrivers.find((name) => name !== driver) ?? team.teammate; const gridDrivers = teams.flatMap((item) => [item.driver, item.teammate]);
  if (!device) return <DeviceChooser onSelect={setDevice} />;
  if (authChecked && !userId) return <main className="manager-wrap auth-game-gate"><p className="eyebrow">APEX RACING</p><h1 className="manager-title">SIGN IN TO CONTINUE</h1><p className="manager-copy">Log in to open your saved careers on this phone.</p><Link href="/auth" className="action-button">SIGN IN OR CREATE ACCOUNT →</Link></main>;
  if (authChecked && userId && slot === null) return <CareerSlots userId={userId} onSelect={setSlot} />;
  return <main className="game-shell"><nav className="topbar"><Link href="/" className="brand">APEX <i>RACING</i></Link><span><LanguageSelector /> MANAGER CAREER</span></nav>{view === 'pick' && <TeamPicker teams={teams} selected={team} year={year} onYear={setYear} onSelect={choose} onStart={start} />}{view === 'hq' && <><TeamHQ team={team} driver={driver} driverRating={driverRating} racesCompleted={racesCompleted} teamDrivers={teamDrivers} gridDrivers={gridDrivers} raceHistory={raceHistory} driverPoints={driverPoints} budget={budget} pace={pace} upgrades={upgrades} market={driverMarketByYear[year]} round={round} contractYears={contractYears} canSwitch={contractYears === 0} pitCrewLevel={pitCrewLevel} onUpgrade={upgrade} onPitCrew={upgradePitCrew} onHire={hire} onTrain={train} onDriver={setDriver} onWeekend={() => setView('weekend')} onSwitch={() => setView('pick')} /><div className="hq"><SeasonCalendar currentRound={round} daysUntilRace={daysUntilRace} onSkipDays={() => setDaysUntilRace(0)} /><DailyStreak /><CareerControls sponsor={sponsor} contractYears={contractYears} budget={budget} onSponsor={setSponsor} onRenew={() => { const cost = 12 + (3 - Math.min(contractYears, 3)) * 4; setBudget((value) => value - cost); setContractYears((value) => Math.min(5, value + 1)); }} onChangeTeam={() => setView('pick')} /><CareerExtras driver={driver} driverRating={driverRating} history={raceHistory} round={round} /><AiAssistant /><SettingsPanel /></div></>}{view === 'weekend' && <RaceWeekend pace={pace} driverRating={driverRating} pitCrewLevel={pitCrewLevel} driver={driver} teammate={teammate} gridDrivers={gridDrivers} round={round} track={calendar[round - 1]} onBack={() => setView('hq')} onRaceFinish={finishRace} />}</main>;
}
