import { useEffect, useState } from 'react';

export function LanguageSelector() {
  const [language, setLanguage] = useState(() => localStorage.getItem('apex-language') ?? 'RU');
  useEffect(() => { document.documentElement.lang = language === 'RU' ? 'ru' : 'en'; localStorage.setItem('apex-language', language); }, [language]);
  return <label className="language-selector">LANG <select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="RU">RU</option><option value="EN">EN</option></select></label>;
}
