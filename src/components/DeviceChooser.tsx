type Device = 'desktop' | 'tablet' | 'phone';
type Props = { onSelect: (device: Device) => void };

export function DeviceChooser({ onSelect }: Props) {
  return <main className="device-chooser"><p className="eyebrow">APEX RACING SETUP</p><h1>HOW ARE YOU PLAYING?</h1><p>Choose a device layout. You can change it later in browser settings.</p><div>{([['desktop', '🖥', 'COMPUTER'], ['tablet', '▣', 'TABLET'], ['phone', '▯', 'PHONE']] as const).map(([device, icon, label]) => <button onClick={() => onSelect(device)} key={device}><i>{icon}</i><b>{label}</b><small>{device === 'desktop' ? 'Full timing and wide race map' : device === 'tablet' ? 'Balanced touch layout' : 'Large controls and single-column panels'}</small></button>)}</div></main>;
}
