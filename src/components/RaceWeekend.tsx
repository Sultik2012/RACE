import { useEffect, useState } from "react";
import type { Session } from "../lib/racingData";
import { trackLayoutUrl } from "../lib/trackLayouts";
import {
  advanceRace,
  createRaceDrivers,
  type RaceMode,
  type RaceDriver,
} from "../lib/raceSimulation";
type Props = {
  pace: number;
  driverRating: number;
  pitCrewLevel: number;
  driver: string;
  teammate: string;
  gridDrivers: string[];
  round: number;
  track: string;
  onBack: () => void;
  onRetire?: () => void;
  onRaceFinish: (
    prize: number,
    playerPosition: number,
    teammatePosition: number,
  ) => void;
};
type Tyre = "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
const sessions: Session[] = ["Practice 1", "Practice 2", "Qualifying", "Race"];
const labels: Record<Session, string> = {
  "Practice 1": "FP1",
  "Practice 2": "FP2",
  Qualifying: "QUALI",
  Race: "RACE",
};
const tyres: Tyre[] = ["SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"];
const prizes = [22, 16, 12, 9, 7, 5, 4, 3, 2, 1];
const weatherList = ["Sunny", "Light rain", "Cloudy", "Heavy rain"];
const tyreData: Record<Tyre, { pace: number; life: number }> = {
  SOFT: { pace: 5, life: 14 },
  MEDIUM: { pace: 2, life: 22 },
  HARD: { pace: -2, life: 32 },
  INTERMEDIATE: { pace: 0, life: 26 },
  WET: { pace: -1, life: 30 },
};
export function RaceWeekend({
  pace,
  driverRating,
  pitCrewLevel,
  driver,
  teammate,
  gridDrivers,
  round,
  track,
  onBack,
  onRetire,
  onRaceFinish,
}: Props) {
  // Race mode is already factored into the simulation; controls are added with the race strategy panel.
  const [session, setSession] = useState<Session>("Practice 1");
  const [done, setDone] = useState<Session[]>([]);
  const [setup, setSetup] = useState(0);
  const [grid, setGrid] = useState<number | null>(null);
  const [tyre, setTyre] = useState<Tyre>("MEDIUM");
  const [pitTyre, setPitTyre] = useState<Tyre>("MEDIUM");
  const [lap, setLap] = useState(1);
  const [wear, setWear] = useState(8);
  const [speed, setSpeed] = useState(3);
  const [pitTime, setPitTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [paid, setPaid] = useState(false);
  const [weather, setWeather] = useState(
    () => weatherList[Math.floor(Math.random() * 2)],
  );
  const [raceMode, setRaceMode] = useState<RaceMode>("BALANCED");
  const [ers, setErs] = useState(100);
  const [drsAvailable, setDrsAvailable] = useState(false);
  const [ersActive, setErsActive] = useState(false);
  const [radioMessage, setRadioMessage] = useState(
    "Engineer: Build tyre temperature and keep the car clean.",
  );
  const [raceDrivers, setRaceDrivers] = useState<RaceDriver[]>(() =>
    createRaceDrivers(
      Array.from(new Set([driver, teammate, ...gridDrivers])).slice(0, 22),
    ),
  );
  const [retired, setRetired] = useState(false);
  const [flag, setFlag] = useState<"YELLOW" | "RED" | null>(null);
  const [startLights, setStartLights] = useState(false);
  const [safetyCar, setSafetyCar] = useState(false);
  const [penalty, setPenalty] = useState<string | null>(null);
  const [breakdownLap] = useState<number | null>(() =>
    Math.random() < 0.1 ? Math.floor(Math.random() * 58) + 1 : null,
  );
  const race = session === "Race";
  const canRace =
    done.includes("Practice 1") &&
    done.includes("Practice 2") &&
    done.includes("Qualifying");
  const wet = weather.includes("rain");
  const modePace = raceMode === "ATTACK" ? 4 : raceMode === "SAVE" ? -2 : 0;
  const strength =
    pace +
    driverRating +
    tyreData[tyre].pace +
    modePace +
    (wet && (tyre === "INTERMEDIATE" || tyre === "WET") ? 8 : wet ? -8 : 0);
  const base = Math.max(1, Math.min(22, 25 - Math.floor(strength / 8)));
  const simulatedPosition =
    raceDrivers.findIndex((entry) => entry.name === driver) + 1;
  const simulatedTeammatePosition =
    raceDrivers.findIndex((entry) => entry.name === teammate) + 1;
  const position =
    race && simulatedPosition > 0 ? simulatedPosition : Math.max(1, base);
  const teammatePosition =
    race && simulatedTeammatePosition > 0
      ? simulatedTeammatePosition
      : Math.max(1, Math.min(22, base + ((round * 5) % 7) - 3));
  useEffect(() => {
    if (!race || finished || retired || pitTime > 0 || startLights) return;
    const timer = window.setInterval(() => {
      setLap((v) => Math.min(58, v + 1));
      setWear((v) =>
        Math.min(
          100,
          v +
            (100 / tyreData[tyre].life) *
              (raceMode === "ATTACK" ? 1.35 : raceMode === "SAVE" ? 0.68 : 1),
        ),
      );
      setErs((value) =>
        Math.max(0, Math.min(100, value + (ersActive ? -18 : 7))),
      );
      setErsActive(false);
    }, speed * 1000 * (safetyCar ? 1.6 : 1));
    return () => window.clearInterval(timer);
  }, [
    race,
    finished,
    retired,
    pitTime,
    speed,
    tyre,
    raceMode,
    pace,
    driverRating,
    driver,
    wear,
    ersActive,
    drsAvailable,
    wet,
    startLights,
    safetyCar,
  ]);
  useEffect(() => {
    if (!race || finished || retired || pitTime > 0 || startLights) return;
    const timer = window.setInterval(() => {
      setRaceDrivers((current) => {
        const result = advanceRace(current, {
          carPace: pace,
          driverRating,
          player: driver,
          mode: safetyCar ? "SAVE" : raceMode,
          playerWear: wear,
          useErs: safetyCar ? false : ersActive,
          hasDrs: safetyCar ? false : drsAvailable,
          weatherIsWet: wet,
          playerInPit: false,
          step: (safetyCar ? 0.22 : 1) / (speed * 4),
        });
        setDrsAvailable(result.drsAvailable);
        if (result.message && Math.random() < 0.12) setRadioMessage(`Engineer: ${result.message}`);
        return result.drivers;
      });
    }, 250);
    return () => window.clearInterval(timer);
  }, [race, finished, retired, pitTime, pace, driverRating, driver, raceMode, wear, ersActive, drsAvailable, wet, speed, startLights, safetyCar]);
  useEffect(() => {
    if (pitTime <= 0) return;
    const timer = window.setInterval(
      () => setPitTime((v) => Math.max(0, +(v - 0.1).toFixed(1))),
      100,
    );
    return () => window.clearInterval(timer);
  }, [pitTime]);
  useEffect(() => {
    if (race && lap > 1 && lap % 12 === 0 && Math.random() < 0.22)
      setWeather(
        (current) =>
          weatherList.filter((item) => item !== current)[
            Math.floor(Math.random() * 3)
          ],
      );
  }, [lap, race]);
  useEffect(() => {
    if (!startLights) return;
    const timer = window.setTimeout(() => {
      setStartLights(false);
      setRadioMessage("Engineer: LIGHTS OUT! Good luck.");
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [startLights]);
  useEffect(() => {
    if (!race || safetyCar || lap < 4 || lap % 11 !== 0 || Math.random() > 0.16) return;
    setSafetyCar(true);
    setFlag("YELLOW");
    setRadioMessage("Engineer: Safety Car deployed. Hold position and prepare for a strategic pit stop.");
    const timer = window.setTimeout(() => {
      setSafetyCar(false);
      setFlag(null);
      setRadioMessage("Engineer: Safety Car is in this lap. Racing resumes.");
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [race, safetyCar, lap]);
  useEffect(() => {
    if (!race || penalty || lap < 5 || Math.random() > 0.025) return;
    setPenalty("+5s");
    setRadioMessage("Engineer: Warning — 5 second time penalty for a track-limits violation.");
  }, [race, penalty, lap]);
  useEffect(() => {
    if (!race) return;
    if (wear > 72) setRadioMessage("Engineer: Tyres are fading. Consider the pit window or switch to Save mode.");
    else if (wet && tyre !== "INTERMEDIATE" && tyre !== "WET") setRadioMessage("Engineer: Rain is here. Intermediate or wet tyres will be faster.");
  }, [race, wear, wet, tyre]);
  useEffect(() => {
    if (race && wear >= 100) setRetired(true);
  }, [race, wear]);
  useEffect(() => {
    if (race && breakdownLap === lap) setRetired(true);
  }, [breakdownLap, lap, race]);
  useEffect(() => {
    if (!race || lap < 6 || lap % 9 !== 0) return;
    const roll = Math.random();
    if (roll < 0.15) {
      setFlag(roll < 0.03 ? "RED" : "YELLOW");
    }
    return undefined;
  }, [lap, race]);
  useEffect(() => {
    if (!flag || safetyCar) return;
    const timer = window.setTimeout(() => setFlag(null), 4000);
    return () => window.clearTimeout(timer);
  }, [flag, safetyCar]);
  useEffect(() => {
    if (!race) return;
    const panel = document.createElement("div");
    panel.className = "race-mode-panel";
    ["ATTACK", "BALANCED", "SAVE"].forEach((mode) => {
      const button = document.createElement("button");
      button.textContent =
        mode === "ATTACK"
          ? "ATTACK · FAST"
          : mode === "SAVE"
            ? "SAVE TYRES"
            : "BALANCED";
      button.onclick = () =>
        setRaceMode(mode as "ATTACK" | "BALANCED" | "SAVE");
      panel.append(button);
    });
    document.body.append(panel);
    return () => panel.remove();
  }, [race]);
  useEffect(() => {
    if (race && lap === 58 && !paid) {
      setFinished(true);
      setPaid(true);
      onRaceFinish(prizes[position - 1] ?? 0, position, teammatePosition);
    }
  }, [lap, onRaceFinish, paid, position, race, teammatePosition]);
  useEffect(() => {
    if (!retired) return;
    const panel = document.createElement("div");
    panel.className = "dnf-message";
    panel.innerHTML =
      "<b>OUT OF THE RACE</b><span>Your car has retired. Return to Team HQ to prepare for the next round.</span>";
    document.body.append(panel);
    return () => panel.remove();
  }, [retired]);
  useEffect(() => {
    if (!race) return;
    const panel = document.createElement("aside");
    panel.className = "track-map-panel";
    const points = [
      driver,
      teammate,
      ...gridDrivers
        .filter((name) => name !== driver && name !== teammate)
        .slice(0, 6),
    ];
    const colours = [
      "#e63234",
      "#2f8ce8",
      "#ff8700",
      "#27f4d2",
      "#e10600",
      "#adadad",
      "#ff87bc",
      "#c5a66a",
    ];
    const dots = points
      .map((name, index) => {
        const angle = (((lap / 58) * 360 + index * 45) * Math.PI) / 180;
        const x = 50 + Math.cos(angle) * (index % 2 ? 31 : 39);
        const y = 50 + Math.sin(angle * 1.35) * (index % 2 ? 26 : 33);
        return `<g><circle cx="${x}" cy="${y}" r="3.7" fill="${colours[index]}"/><text x="${x + 5}" y="${y + 2}" fill="#fff">${name}</text></g>`;
      })
      .join("");
    panel.innerHTML = `<b>LIVE CIRCUIT MAP</b><small>${track.toUpperCase()} · LAP ${lap}/58</small><svg viewBox="0 0 100 100" aria-label="Top down circuit map"><path d="M18 48 C18 20 42 14 62 25 C87 39 85 70 61 76 C39 84 22 68 29 53 C35 40 57 54 65 40 C72 29 54 28 46 37" fill="none" stroke="#f0eee8" stroke-width="9" stroke-linecap="round"/><path d="M18 48 C18 20 42 14 62 25 C87 39 85 70 61 76 C39 84 22 68 29 53 C35 40 57 54 65 40 C72 29 54 28 46 37" fill="none" stroke="#292927" stroke-width="6" stroke-linecap="round"/>${dots}</svg><p>● YOU &nbsp; ● TEAMMATE &nbsp; coloured team markers</p>`;
    document.body.append(panel);
    return () => panel.remove();
  }, [race, lap, track, driver, teammate, gridDrivers]);
  useEffect(() => {
    if (!flag) return;
    const panel = document.createElement("div");
    panel.className = `flag-message ${flag.toLowerCase()}`;
    panel.textContent =
      flag === "RED" ? "RED FLAG · SESSION STOPPED" : "YELLOW FLAG · SLOW DOWN";
    document.body.append(panel);
    return () => panel.remove();
  }, [flag]);
  useEffect(() => {
    if (!race) return;
    let cancelled = false;
    const panel = document.createElement("aside");
    panel.className = "real-track-map-panel";
    panel.innerHTML = `<b>LIVE CIRCUIT MAP</b><small>${track.toUpperCase()} · LAP ${lap}/58</small><div class="track-map-visual"><span class="map-loading">LOADING TRACK…</span></div><p>Every driver is positioned on the circuit.</p><small class="track-credit">Circuit layouts: Jules Roy / F1 Circuits SVG (CC BY 4.0)</small>`;
    document.body.append(panel);
    void fetch(trackLayoutUrl(track))
      .then((response) => response.text())
      .then((svgText) => {
        if (cancelled) return;
        const visual = panel.querySelector(".track-map-visual");
        if (!visual) return;
        visual.innerHTML = svgText;
        const svg = visual.querySelector("svg");
        if (!svg) return;
        svg.classList.add("circuit-svg");
        const paths = Array.from(svg.querySelectorAll("path"));
        const path = paths.sort(
          (a, b) => b.getTotalLength() - a.getTotalLength(),
        )[0];
        if (!path) return;
        const total = path.getTotalLength();
        const names = raceDrivers;
        const colours = [
          "#e63234",
          "#2f8ce8",
          "#ff8700",
          "#27f4d2",
          "#e10600",
          "#adadad",
          "#ff87bc",
          "#c5a66a",
          "#6c7ee8",
          "#e8d06c",
          "#bb65d6",
        ];
        names.forEach((entry, index) => {
          const name = entry.name;
          const point = path.getPointAtLength(
            total * (entry.distance % 1),
          );
          const group = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g",
          );
          group.dataset.driver = name;
          group.setAttribute("transform", `translate(${point.x} ${point.y})`);
          const dot = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          dot.setAttribute("cx", "0");
          dot.setAttribute("cy", "0");
          dot.setAttribute("r", "7");
          dot.setAttribute("fill", colours[index % colours.length]);
          dot.setAttribute(
            "class",
            name === driver ? "circuit-dot player-dot" : "circuit-dot",
          );
          const label = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text",
          );
          label.setAttribute("x", "9");
          label.setAttribute("y", "4");
          label.setAttribute("class", "circuit-label");
          label.textContent = name.slice(0, 3).toUpperCase();
          group.append(dot, label);
          svg.append(group);
        });
      })
      .catch(() => {
        const visual = panel.querySelector(".track-map-visual");
        if (visual)
          visual.innerHTML =
            '<span class="map-loading">TRACK MAP UNAVAILABLE</span>';
      });
    return () => {
      cancelled = true;
      panel.remove();
    };
  }, [race, track, driver, teammate]);
  useEffect(() => {
    const svg = document.querySelector<SVGSVGElement>(".real-track-map-panel .circuit-svg");
    if (!race || !svg) return;
    const path = Array.from(svg.querySelectorAll("path")).sort((a, b) => b.getTotalLength() - a.getTotalLength())[0];
    if (!path) return;
    const total = path.getTotalLength();
    raceDrivers.forEach((entry) => {
      const marker = svg.querySelector<SVGGElement>(`g[data-driver="${entry.name}"]`);
      if (!marker) return;
      const point = path.getPointAtLength(total * (entry.distance % 1));
      const nextTransform = `translate(${point.x} ${point.y})`;
      const previousTransform = marker.getAttribute("transform") ?? nextTransform;
      marker.animate([{ transform: previousTransform }, { transform: nextTransform }], { duration: 260, easing: "linear", fill: "forwards" });
      marker.setAttribute("transform", nextTransform);
    });
  }, [race, raceDrivers, speed]);
  useEffect(() => {
    if (!race) return;
    const panel = document.querySelector(".real-track-map-panel");
    if (!panel || panel.querySelector(".circuit-timing")) return;
    const ranked = raceDrivers.map((entry, index) => ({ name: entry.name, score: index + 1 }));
    const fastest = ranked[lap % ranked.length]?.name;
    const rows = ranked
      .map((entry, index) => {
        const penalty = lap > 10 && (index + round) % 11 === 0 ? "+5s" : "—";
        const fastestLap =
          entry.name === fastest ? "1:2" + ((lap + index) % 10) + ".8" : "";
        return `<div class="circuit-timing-row ${entry.name === driver ? "you" : ""}"><b>P${index + 1}</b><span>${entry.name}</span><small>${fastestLap}</small><i>${penalty}</i></div>`;
      })
      .join("");
    const timing = document.createElement("section");
    timing.className = "circuit-timing";
    timing.innerHTML = `<header><b>LIVE TIMING</b><span>FASTEST LAP</span><i>PENALTY</i></header><div>${rows}</div><footer>● Fastest lap &nbsp; | &nbsp; +5s = time penalty</footer>`;
    panel.insertBefore(timing, panel.querySelector("p"));
  }, [
    race,
    lap,
    raceDrivers,
    driver,
    teammate,
    position,
    teammatePosition,
    round,
  ]);
  useEffect(() => {
    if (!retired) return;
    const message = document.querySelector(".dnf-message");
    if (!message || message.querySelector("button")) return;
    const garageButton = document.createElement("button");
    garageButton.className = "dnf-garage-button";
    garageButton.textContent = "NEXT GRAND PRIX →";
    garageButton.onclick = () => {
      window.dispatchEvent(new Event("apex-race-retired"));
      (onRetire ?? onBack)();
    };
    message.append(garageButton);
  }, [retired, onRetire, onBack]);
  useEffect(() => {
    if (!race) return;
    const panel = document.querySelector(".real-track-map-panel");
    const table = document.querySelector(".race-screen");
    if (panel && table) table.before(panel);
  }, [race, lap]);
  const open = (next: Session) => {
    if (next === "Race" && !canRace) return;
    setSession(next);
    setLap(1);
    setWear(8);
    setFinished(false);
    setPaid(false);
    setRetired(false);
    if (next === "Race") {
      setRaceDrivers(createRaceDrivers(Array.from(new Set([driver, teammate, ...gridDrivers])).slice(0, 22)));
      setErs(100);
      setDrsAvailable(false);
      setPenalty(null);
      setSafetyCar(false);
      setStartLights(true);
      setRadioMessage("Engineer: Formation complete. Wait for the lights.");
    }
  };
  const finishSession = () => {
    if (session === "Qualifying") {
      setGrid(Math.max(1, base - setup));
      setDone((v) => (v.includes("Qualifying") ? v : [...v, session]));
    } else {
      setSetup((v) => Math.min(2, v + 1));
      setDone((v) => (v.includes(session) ? v : [...v, session]));
    }
  };
  const callPit = () => {
    const service = Math.max(2.3, 5 - (pitCrewLevel - 1) * 0.3);
    setRaceDrivers((current) => {
      const next = [...current];
      const playerIndex = next.findIndex((entry) => entry.name === driver);
      if (playerIndex < 0) return current;
      const maximumDrop = Math.min(5, next.length - playerIndex - 1);
      const placesLost = maximumDrop > 0 ? Math.floor(Math.random() * maximumDrop) + 1 : 0;
      const [player] = next.splice(playerIndex, 1);
      const targetIndex = playerIndex + placesLost;
      const ahead = next[targetIndex - 1];
      const behind = next[targetIndex];
      const distance = ahead && behind ? (ahead.distance + behind.distance) / 2 : ahead ? ahead.distance - 0.001 : player.distance;
      next.splice(targetIndex, 0, { ...player, distance, stopped: true });
      setRadioMessage(`Engineer: Box, box. Fitting ${pitTyre.toLowerCase()} tyres. You lost ${placesLost} position${placesLost === 1 ? "" : "s"} in the pit lane.`);
      return next;
    });
    setTyre(pitTyre);
    setWear(5);
    setPitTime(service);
  };
  const order = raceDrivers.map((entry) => entry.name);
  return (
    <section className="weekend">
      <button className="back-button" onClick={onBack}>
        ← TEAM HQ
      </button>
      <p className="eyebrow">
        ROUND {round} · {track.toUpperCase()} GRAND PRIX
      </p>
      <header className="weekend-head">
        <h1>
          {finished ? "FINISH" : `P${position}`} <em>{labels[session]}</em>
        </h1>
        <div>
          {driver}
          <small>
            RATING {driverRating.toFixed(1)} · CAR {pace}
          </small>
        </div>
      </header>
      <div className="weather-box">
        <b>FORECAST / LIVE WEATHER: {weather.toUpperCase()}</b>
        <span>
          {weather === "Sunny" ? "☀" : weather === "Cloudy" ? "☁" : "🌧"}{" "}
          {race
            ? "Conditions can change every 16 laps."
            : "Race-day forecast may change."}
        </span>
      </div>
      <div className="session-tabs">
        {sessions.map((s) => (
          <button
            disabled={s === "Race" && !canRace}
            onClick={() => open(s)}
            className={session === s ? "active" : ""}
            key={s}
          >
            {labels[s]} {done.includes(s) ? "✓" : ""}
          </button>
        ))}
      </div>
      {!canRace && (
        <p className="race-lock">
          Complete FP1, FP2 and qualifying to unlock the race.
        </p>
      )}
      {canRace && !race && (
        <section className="tyre-selector">
          <p className="panel-label">RACE START TYRE · F1 2026 RANGE</p>
          {tyres.map((t) => (
            <button
              className={tyre === t ? "selected" : ""}
              onClick={() => setTyre(t)}
              key={t}
            >
              {t}
            </button>
          ))}
        </section>
      )}
      {race && (
        <>
          <section className="race-command-center">
            <div className="engineer-radio"><b>ENGINEER RADIO</b><span>{radioMessage}</span></div>
            <div className="race-command-stats"><span>ERS <b>{Math.round(ers)}%</b></span><span>GAP AHEAD <b>{drsAvailable ? "< 1.0s" : "OUT OF RANGE"}</b></span><span>RACE CONTROL <b>{startLights ? "LIGHTS" : safetyCar ? "SAFETY CAR" : penalty ?? "CLEAR"}</b></span></div>
            <div className="race-command-actions">
              {(["SAVE", "BALANCED", "ATTACK"] as RaceMode[]).map((mode) => <button key={mode} className={raceMode === mode ? "selected" : ""} onClick={() => { setRaceMode(mode); setRadioMessage(`Engineer: ${mode === "SAVE" ? "Tyre saving mode selected." : mode === "ATTACK" ? "Attack mode selected. Push now." : "Balanced race pace selected."}`); }}>{mode}</button>)}
              <button className="ers-button" disabled={ers < 15} onClick={() => { setErsActive(true); setRadioMessage("Engineer: ERS overtake deployed for the next lap."); }}>ERS OVERTAKE</button>
              <button className="drs-button" disabled={!drsAvailable} onClick={() => { setErsActive(true); setRadioMessage("Engineer: DRS open — go for the move!"); }}>DRS {drsAvailable ? "READY" : "LOCKED"}</button>
            </div>
          </section>
          <label className="lap-speed">
            LAP TIME SIMULATION <b>{speed} SEC</b>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>
          <section className="pit-strategy">
            <div>
              <b>PIT STRATEGY · CREW LVL {pitCrewLevel}</b>
              <small>
                Service time:{" "}
                {Math.max(1.8, 4 - pitCrewLevel * 0.35).toFixed(2)} sec
              </small>
            </div>
            {tyres.map((t) => (
              <button
                className={pitTyre === t ? "selected" : ""}
                onClick={() => setPitTyre(t)}
                key={t}
              >
                {t}
              </button>
            ))}
            <button
              className="pit-call"
              disabled={pitTime > 0}
              onClick={callPit}
            >
              {pitTime > 0
                ? `PIT STOP ${pitTime.toFixed(1)}s`
                : "CALL PIT STOP →"}
            </button>
          </section>
        </>
      )}
      <div className="race-screen">
        {race ? (
          <div className="live-timing">
            <header>
              <b>
                LIVE · {weather} · {tyre}
              </b>
              <span>LAP {lap}/58</span>
            </header>
            <div className="timing-list">
              {order.slice(0, 22).map((n, i) => (
                <div
                  className={
                    n === driver
                      ? "timing-row player"
                      : n === teammate
                        ? "timing-row teammate"
                        : "timing-row"
                  }
                  key={`${n}-${i}`}
                >
                  <b>P{i + 1}</b>
                  <span>{n}</span>
                  <small>
                    {i === 0
                      ? "LEADER"
                      : `+${((i + 1) * 0.72 + lap * 0.04).toFixed(3)}`}
                  </small>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="session-brief">
            <b>{labels[session]} PROGRAM</b>
            <p>
              {session === "Qualifying"
                ? "Set a fast lap to secure your grid position."
                : "Complete this programme to prepare the car."}
            </p>
          </div>
        )}
        <div className="telemetry-grid">
          <span>
            {race ? "LAP" : "SETUP"}
            <b>{race ? `${lap}/58` : `${setup}/2`}</b>
          </span>
          <span>
            TYRES<b className={wear > 70 ? "danger" : ""}>{wear}%</b>
          </span>
          <span>
            WEATHER<b>{weather}</b>
          </span>
          <span>
            GRID<b>{grid ? `P${grid}` : "—"}</b>
          </span>
        </div>
      </div>
      {session !== "Race" && (
        <div className="race-actions">
          <button className="pit-call" onClick={finishSession}>
            {session === "Qualifying"
              ? "SET QUALIFYING LAP →"
              : `RUN ${labels[session]} PROGRAM →`}
          </button>
        </div>
      )}
      {finished && (
        <button className="action-button" onClick={onBack}>
          COLLECT PRIZE MONEY →
        </button>
      )}
    </section>
  );
}
