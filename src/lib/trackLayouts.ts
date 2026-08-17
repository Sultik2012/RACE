const layoutIds: Record<string, string> = {
  Melbourne: 'melbourne-2', Shanghai: 'shanghai-1', Suzuka: 'suzuka-2', Sakhir: 'bahrain-1',
  Jeddah: 'jeddah-1', Miami: 'miami-1', Montreal: 'montreal-6', Monaco: 'monaco-6',
  Barcelona: 'catalunya-6', Spielberg: 'spielberg-3', Silverstone: 'silverstone-8',
  Spa: 'spa-francorchamps-4', Budapest: 'hungaroring-3', Zandvoort: 'zandvoort-5',
  Monza: 'monza-7', Madrid: 'madring-1', Baku: 'baku-1', Singapore: 'marina-bay-4',
  Austin: 'austin-1', 'Mexico City': 'mexico-city-3', Interlagos: 'interlagos-2',
  'Las Vegas': 'las-vegas-1', Lusail: 'lusail-1', 'Abu Dhabi': 'yas-marina-2',
};

export function trackLayoutUrl(track: string) {
  const layoutId = layoutIds[track] ?? 'melbourne-2';
  return `https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed/white-outline/${layoutId}.svg`;
}
