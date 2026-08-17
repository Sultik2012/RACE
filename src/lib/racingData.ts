export type Team = { name: string; color: string; pace: number; budget: number; driver: string; teammate: string };
export type Driver = { name: string; rating: number; salary: number; trait: string };
export type Session = 'Practice 1' | 'Practice 2' | 'Qualifying' | 'Race';
// Kept for the standalone driving prototype components.
export type Tyre = 'soft' | 'medium' | 'hard';
export type Track = { name: string; country: string; laps: number; weather: string; pitLoss: number };

export const teams: Team[] = [
  { name: 'McLaren', color: '#ff8700', pace: 90, budget: 48, driver: 'L. Norris', teammate: 'O. Piastri' },
  { name: 'Ferrari', color: '#e10600', pace: 88, budget: 44, driver: 'C. Leclerc', teammate: 'L. Hamilton' },
  { name: 'Mercedes', color: '#27f4d2', pace: 86, budget: 40, driver: 'G. Russell', teammate: 'K. Antonelli' },
  { name: 'Aston Martin', color: '#229971', pace: 79, budget: 32, driver: 'F. Alonso', teammate: 'L. Stroll' },
  { name: 'Williams', color: '#1e5bc6', pace: 74, budget: 26, driver: 'A. Albon', teammate: 'C. Sainz' },
  { name: 'Haas', color: '#b6b8bc', pace: 69, budget: 22, driver: 'O. Bearman', teammate: 'E. Ocon' },
  { name: 'Red Bull Racing', color: '#1e41ff', pace: 92, budget: 50, driver: 'M. Verstappen', teammate: 'Y. Tsunoda' },
  { name: 'Alpine', color: '#ff87bc', pace: 72, budget: 25, driver: 'P. Gasly', teammate: 'F. Colapinto' },
  { name: 'Racing Bulls', color: '#5e7bff', pace: 76, budget: 29, driver: 'I. Hadjar', teammate: 'L. Lawson' },
  { name: 'Audi', color: '#d61920', pace: 78, budget: 34, driver: 'N. Hulkenberg', teammate: 'G. Bortoleto' },
  { name: 'Cadillac', color: '#c5a66a', pace: 70, budget: 24, driver: 'S. Perez', teammate: 'V. Bottas' },
];

export const drivers: Driver[] = [
  { name: 'A. Antonelli', rating: 84, salary: 16, trait: 'Стабильный в дождь' },
  { name: 'C. Sainz', rating: 88, salary: 22, trait: 'Бережёт шины' },
  { name: 'A. Piastri', rating: 91, salary: 29, trait: 'Быстрый на одном круге' },
  { name: 'Y. Tsunoda', rating: 80, salary: 11, trait: 'Сильный старт' },
];

export const driverMarketByYear: Record<number, Driver[]> = {
  2024: [
    { name: 'C. Sainz', rating: 88, salary: 22, trait: 'Race craft' }, { name: 'L. Lawson', rating: 78, salary: 10, trait: 'Quick learner' },
    { name: 'K. Magnussen', rating: 79, salary: 11, trait: 'Defensive driver' }, { name: 'A. Albon', rating: 84, salary: 16, trait: 'Tyre management' },
  ],
  2025: [
    { name: 'C. Sainz', rating: 88, salary: 22, trait: 'Tyre management' }, { name: 'Y. Tsunoda', rating: 80, salary: 11, trait: 'Strong starts' },
    { name: 'L. Lawson', rating: 81, salary: 13, trait: 'Aggressive' }, { name: 'A. Antonelli', rating: 84, salary: 16, trait: 'High potential' },
  ],
  2026: drivers,
};

export const upgrades = [
  { name: 'Аэродинамика', detail: '+3 темпа на квалификации', cost: 12 },
  { name: 'Подвеска', detail: 'Меньше износ шин', cost: 9 },
  { name: 'ERS', detail: '+6% энергии на обгон', cost: 14 },
] as const;

export const calendar = ['Melbourne', 'Shanghai', 'Suzuka', 'Sakhir', 'Jeddah', 'Miami', 'Montreal', 'Monaco', 'Barcelona', 'Spielberg', 'Silverstone', 'Spa', 'Budapest', 'Zandvoort', 'Monza', 'Madrid', 'Baku', 'Singapore', 'Austin', 'Mexico City', 'Interlagos', 'Las Vegas', 'Lusail', 'Abu Dhabi'];

export const calendarDetails = [
  ['🇦🇺', 'Melbourne', '06–08 MAR'], ['🇨🇳', 'Shanghai', '13–15 MAR · SPRINT'], ['🇯🇵', 'Suzuka', '27–29 MAR'], ['🇧🇭', 'Sakhir', '10–12 APR'], ['🇸🇦', 'Jeddah', '17–19 APR'], ['🇺🇸', 'Miami', '01–03 MAY · SPRINT'], ['🇨🇦', 'Montreal', '22–24 MAY · SPRINT'], ['🇲🇨', 'Monaco', '05–07 JUN'], ['🇪🇸', 'Barcelona', '12–14 JUN'], ['🇦🇹', 'Spielberg', '26–28 JUN'], ['🇬🇧', 'Silverstone', '03–05 JUL'], ['🇧🇪', 'Spa', '17–19 JUL'], ['🇭🇺', 'Budapest', '24–26 JUL'], ['🇳🇱', 'Zandvoort', '21–23 AUG'], ['🇮🇹', 'Monza', '04–06 SEP'], ['🇪🇸', 'Madrid', '11–13 SEP'], ['🇦🇿', 'Baku', '25–26 SEP'], ['🇸🇬', 'Singapore', '09–11 OCT'], ['🇺🇸', 'Austin', '23–25 OCT'], ['🇲🇽', 'Mexico City', '30 OCT–01 NOV'], ['🇧🇷', 'Interlagos', '06–08 NOV'], ['🇺🇸', 'Las Vegas', '19–21 NOV'], ['🇶🇦', 'Lusail', '27–29 NOV'], ['🇦🇪', 'Abu Dhabi', '04–06 DEC'],
] as const;
