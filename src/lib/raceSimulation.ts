export type RaceMode = 'ATTACK' | 'BALANCED' | 'SAVE';

export type RaceDriver = {
  name: string;
  distance: number;
  tyreWear: number;
  stopped: boolean;
};

type SimulationInput = {
  carPace: number;
  driverRating: number;
  opponentChallenge: number;
  player: string;
  mode: RaceMode;
  playerWear: number;
  useErs: boolean;
  hasDrs: boolean;
  weatherIsWet: boolean;
  playerInPit: boolean;
  step: number;
};

export type SimulationResult = {
  drivers: RaceDriver[];
  message: string | null;
  playerGap: number;
  drsAvailable: boolean;
};

export function createRaceDrivers(names: string[]): RaceDriver[] {
  return names.map((name, index) => ({
    name,
    distance: 1 - index * 0.012,
    tyreWear: 7 + (index * 9) % 24,
    stopped: false,
  }));
}

export function advanceRace(drivers: RaceDriver[], input: SimulationInput): SimulationResult {
  const next = drivers.map((driver, index) => {
    const isPlayer = driver.name === input.player;
    const modeBoost = input.mode === 'ATTACK' ? 0.022 : input.mode === 'SAVE' ? -0.014 : 0;
    const skill = isPlayer ? (input.carPace + input.driverRating) / 700 : 0.22 + input.opponentChallenge / 5000 + ((index * 13) % 17) / 1000;
    const tyrePenalty = (isPlayer ? input.playerWear : driver.tyreWear) / 9000;
    const weatherPenalty = input.weatherIsWet && !isPlayer ? 0.006 : 0;
    const ersBoost = isPlayer && input.useErs ? 0.035 : 0;
    const drsBoost = isPlayer && input.hasDrs ? 0.018 : 0;
    const randomRaceMoment = (Math.random() - 0.5) * 0.026;
    const pitLoss = isPlayer && input.playerInPit ? 0.42 : 0;
    const pace = Math.max(0.09, skill + modeBoost + ersBoost + drsBoost + randomRaceMoment - tyrePenalty - weatherPenalty - pitLoss) * input.step;

    return {
      ...driver,
      distance: driver.distance + pace,
      tyreWear: Math.min(100, driver.tyreWear + (1 + Math.random() * 2.2) * input.step),
      stopped: pitLoss > 0,
    };
  }).sort((left, right) => right.distance - left.distance);

  const playerIndex = next.findIndex((driver) => driver.name === input.player);
  const ahead = next[playerIndex - 1];
  const player = next[playerIndex];
  const gap = ahead && player ? Math.max(0.08, (ahead.distance - player.distance) * 2.9) : 0;
  const drsAvailable = Boolean(ahead && gap < 1 && !input.weatherIsWet);
  const movedUp = playerIndex >= 0 && drivers.findIndex((driver) => driver.name === input.player) > playerIndex;
  const movedDown = playerIndex >= 0 && drivers.findIndex((driver) => driver.name === input.player) < playerIndex;
  const message = movedUp
    ? `Great move — P${playerIndex + 1}. Keep the pressure on.`
    : movedDown
      ? `Lost a place. Use clean air and plan the next attack.`
      : drsAvailable
        ? `DRS available: ${gap.toFixed(1)}s to ${ahead?.name}.`
        : null;

  return { drivers: next, message, playerGap: gap, drsAvailable };
}
