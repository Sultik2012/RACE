export type HqCategory = 'team' | 'season' | 'finance' | 'career';

type Props = {
  active: HqCategory;
  onChange: (category: HqCategory) => void;
};

const categories: Array<{ id: HqCategory; label: string; number: string }> = [
  { id: 'team', label: 'TEAM & GARAGE', number: '01' },
  { id: 'season', label: 'SEASON', number: '02' },
  { id: 'finance', label: 'FINANCE', number: '03' },
  { id: 'career', label: 'CAREER', number: '04' },
];

export function HqCategoryTabs({ active, onChange }: Props) {
  return <nav className="hq-categories" aria-label="Career sections">
    {categories.map((category) => <button
      className={active === category.id ? 'active' : ''}
      key={category.id}
      onClick={() => onChange(category.id)}
    ><small>{category.number}</small>{category.label}</button>)}
  </nav>;
}
