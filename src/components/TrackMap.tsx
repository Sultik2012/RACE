import { trackLayoutUrl } from '../lib/trackLayouts';

type Props = { track: string; lap: number; driver: string; teammate: string; gridDrivers: string[] };

const colours = ['#e63234', '#2f8ce8', '#ff8700', '#27f4d2', '#e10600', '#adadad', '#ff87bc', '#c5a66a'];
const spots = [[50, 11], [79, 25], [83, 62], [62, 84], [27, 79], [14, 50], [27, 23], [57, 38]];

export function TrackMap({ track, lap, driver, teammate, gridDrivers }: Props) {
  const drivers = [driver, teammate, ...gridDrivers.filter((name) => name !== driver && name !== teammate)].slice(0, 8);
  return <aside className="real-track-map-panel">
    <b>LIVE CIRCUIT MAP</b><small>{track.toUpperCase()} · LAP {lap}/58</small>
    <div className="track-map-visual">
      <img src={trackLayoutUrl(track)} alt={`Top-down layout of ${track} circuit`} />
      {drivers.map((name, index) => {
        const [x, y] = spots[(index + lap) % spots.length];
        return <span className="track-driver" style={{ left: `${x}%`, top: `${y}%`, background: colours[index] }} key={name}>{name.slice(0, 3).toUpperCase()}</span>;
      })}
    </div>
    <p>Coloured tags show the drivers being tracked.</p>
    <small className="track-credit">Circuit layouts: Jules Roy / F1 Circuits SVG (CC BY 4.0)</small>
  </aside>;
}
