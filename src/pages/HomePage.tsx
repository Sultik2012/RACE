import { Link } from 'wouter';
import { LanguageSelector } from '../components/LanguageSelector';

export function HomePage() {
  return <main className="landing-hub">
    <nav className="hub-nav">
      <Link className="hub-brand" href="/">APEX<span>26</span></Link>
      <div><span className="hub-season">OFFICIAL TEAM MANAGER</span><LanguageSelector /><Link href="/auth">ВОЙТИ</Link></div>
    </nav>
    <section className="hub-stage">
      <div className="hub-copy">
        <p>SEASON 2026 · YOUR STORY STARTS NOW</p>
        <h1>ПОСТРОЙ<br /><em>СВОЮ ЭРУ.</em></h1>
        <span className="hub-line" />
        <div className="hub-description"><b>ТЫ — РУКОВОДИТЕЛЬ КОМАНДЫ</b><span>Контракты. Болид. Стратегия. Каждое решение меняет историю чемпионата.</span></div>
        <div className="hub-actions"><Link className="hub-start" href="/game">НАЧАТЬ КАРЬЕРУ <b>→</b></Link><Link className="hub-ghost" href="/auth">СОЗДАТЬ ПРОФИЛЬ</Link></div>
      </div>
      <div className="hub-car" aria-label="Apex Racing race car illustration"><div className="hub-wheel left" /><div className="hub-wheel right" /><div className="hub-body"><i /><b /></div><small>APEX RACING<br />AR-26</small></div>
      <aside className="hub-weekend"><header><span><i /> NEXT EVENT</span><b>01 / 24</b></header><div className="hub-flag">🇦🇺</div><p>AUSTRALIAN GRAND PRIX</p><strong>MELBOURNE</strong><small>06—08 MAR · ALBERT PARK</small><footer><span>RACE WEEKEND</span><b>START →</b></footer></aside>
    </section>
    <footer className="hub-footer"><span>11 TEAMS</span><i /><span>22 DRIVERS</span><i /><span>24 GRAND PRIX</span><b>MAKE THE CALL.</b></footer>
  </main>;
}
