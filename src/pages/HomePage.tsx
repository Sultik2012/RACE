import { Link } from 'wouter';
import { LanguageSelector } from '../components/LanguageSelector';

export function HomePage() {
  return <main className="landing landing-new">
    <nav className="topbar home-nav"><span className="brand">APEX <i>RACING</i></span><div><span className="season-tag">MANAGER CAREER · 2026</span><LanguageSelector /><Link className="home-auth" href="/auth">ВОЙТИ</Link></div></nav>
    <section className="home-hero">
      <div className="home-copy"><p className="eyebrow">THE F1 TEAM MANAGEMENT GAME</p><h1>ТВОЯ КОМАНДА.<br /><em>ТВОИ РЕШЕНИЯ.</em></h1><p>Построй путь от первого гаража до титула: подписывай пилотов, развивай болид и управляй каждой гонкой с пит-уолла.</p><div className="home-actions"><Link href="/game" className="action-button">НАЧАТЬ КАРЬЕРУ →</Link><Link href="/auth" className="outline-button">СОЗДАТЬ АККАУНТ</Link></div><div className="home-proof"><span><b>11</b> КОМАНД</span><span><b>24</b> ГРАН-ПРИ</span><span><b>20</b> ПИЛОТОВ</span></div></div>
      <aside className="hero-race-card"><div className="hero-card-top"><span>LIVE · MELBOURNE</span><b>RACE CONTROL</b></div><div className="hero-pos"><small>CURRENT POSITION</small><strong>P<span>3</span></strong></div><div className="mini-timing"><div><b>P1</b><span>M. Verstappen</span><small>LEADER</small></div><div><b>P2</b><span>L. Norris</span><small>+1.284</small></div><div className="you"><b>P3</b><span>YOUR TEAM</span><small>+2.011</small></div><div><b>P4</b><span>C. Leclerc</span><small>+2.749</small></div></div><div className="hero-card-bottom"><span>TYRES <b>62%</b></span><span>FUEL <b>44%</b></span><button>CALL PIT</button></div></aside>
    </section>
    <section className="home-features"><article><span>01</span><h2>СОБЕРИ КОМАНДУ</h2><p>Выбери существующую команду или создай свою с нуля.</p></article><article><span>02</span><h2>УПРАВЛЯЙ УИКЕНДОМ</h2><p>Практики, квалификация, стратегия шин и пит-стопы.</p></article><article><span>03</span><h2>ПОБЕЖДАЙ</h2><p>Зарабатывай призовые и вложи их в новый чемпионский болид.</p></article></section>
  </main>;
}
