import { useState, useEffect } from 'react';

export default function CheatSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem('cheatsheet-open') === '1');
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('pane-open', open);
    localStorage.setItem('cheatsheet-open', open ? '1' : '0');
    return () => document.body.classList.remove('pane-open');
  }, [open]);

  return (
    <>
      <button
        className={`cheatsheet-trigger${open ? ' cheatsheet-trigger--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close SRE cheat sheet' : 'Open SRE cheat sheet'}
      >
        {open ? '[✕] cheatsheet' : '[?] cheatsheet'}
      </button>

      <aside className={`cheatsheet-pane${open ? ' cheatsheet-pane--open' : ''}`} aria-label="SRE cheat sheet">
        <div className="cheatsheet-header">
          <span className="cheatsheet-title"><span className="prompt">$</span> sre-cheatsheet</span>
          <button className="cheatsheet-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>

        <div className="cheatsheet-body">

          <section className="cs-section">
            <h2 className="cs-heading"># latency numbers</h2>
            <table className="cs-table">
              <tbody>
                <tr><td className="cs-label">L1 cache ref</td><td className="cs-value">0.5 ns</td></tr>
                <tr><td className="cs-label">Branch mispredict</td><td className="cs-value">5 ns</td></tr>
                <tr><td className="cs-label">L2 cache ref</td><td className="cs-value">7 ns</td></tr>
                <tr><td className="cs-label">Mutex lock/unlock</td><td className="cs-value">25 ns</td></tr>
                <tr><td className="cs-label">Main memory ref</td><td className="cs-value">100 ns</td></tr>
                <tr><td className="cs-label">Compress 1 KB</td><td className="cs-value">10 µs</td></tr>
                <tr><td className="cs-label">Send 2 KB / 1 Gbps</td><td className="cs-value">20 µs</td></tr>
                <tr><td className="cs-label">SSD random read</td><td className="cs-value">150 µs</td></tr>
                <tr><td className="cs-label">Read 1 MB / memory</td><td className="cs-value">250 µs</td></tr>
                <tr><td className="cs-label">Same-DC round trip</td><td className="cs-value">500 µs</td></tr>
                <tr><td className="cs-label">Read 1 MB / SSD</td><td className="cs-value">1 ms</td></tr>
                <tr><td className="cs-label">Disk seek</td><td className="cs-value">10 ms</td></tr>
                <tr><td className="cs-label">Read 1 MB / network</td><td className="cs-value">10 ms</td></tr>
                <tr><td className="cs-label">Read 1 MB / disk</td><td className="cs-value">30 ms</td></tr>
                <tr><td className="cs-label">CA → EU → CA</td><td className="cs-value">150 ms</td></tr>
              </tbody>
            </table>
          </section>

          <section className="cs-section">
            <h2 className="cs-heading"># powers of two</h2>
            <table className="cs-table">
              <tbody>
                <tr><td className="cs-label">2¹⁰</td><td className="cs-value">1 K &nbsp;<span className="cs-muted">(~thousand)</span></td></tr>
                <tr><td className="cs-label">2²⁰</td><td className="cs-value">1 MB <span className="cs-muted">(~million)</span></td></tr>
                <tr><td className="cs-label">2³⁰</td><td className="cs-value">1 GB <span className="cs-muted">(~billion)</span></td></tr>
                <tr><td className="cs-label">2³²</td><td className="cs-value">4 GB <span className="cs-muted">(max uint32)</span></td></tr>
                <tr><td className="cs-label">2⁴⁰</td><td className="cs-value">1 TB <span className="cs-muted">(~trillion)</span></td></tr>
                <tr><td className="cs-label">2⁶⁴</td><td className="cs-value">~18 EB</td></tr>
              </tbody>
            </table>
          </section>

          <section className="cs-section">
            <h2 className="cs-heading"># availability</h2>
            <table className="cs-table">
              <thead>
                <tr><th className="cs-th">SLA</th><th className="cs-th">downtime / year</th><th className="cs-th">/ month</th></tr>
              </thead>
              <tbody>
                <tr><td className="cs-label">99%</td><td className="cs-value">3.65 days</td><td className="cs-muted">7.3 h</td></tr>
                <tr><td className="cs-label">99.9%</td><td className="cs-value">8.7 hours</td><td className="cs-muted">43 min</td></tr>
                <tr><td className="cs-label">99.99%</td><td className="cs-value">52 min</td><td className="cs-muted">4.4 min</td></tr>
                <tr><td className="cs-label">99.999%</td><td className="cs-value">5.3 min</td><td className="cs-muted">26 s</td></tr>
              </tbody>
            </table>
          </section>

          <section className="cs-section">
            <h2 className="cs-heading"># rules of thumb</h2>
            <ul className="cs-list">
              <li>Writes are <span className="cs-green">~40×</span> more expensive than reads</li>
              <li>Compression saves <span className="cs-green">~2×</span> bandwidth</li>
              <li>Memory &gt;&gt; SSD &gt;&gt; Network &gt;&gt; Disk</li>
              <li>Prefer parallel over serial I/O — up to <span className="cs-green">10×</span> faster</li>
              <li>A server handles <span className="cs-green">~10k</span> req/s for simple endpoints</li>
              <li>Typical DB query: <span className="cs-green">1–10 ms</span></li>
              <li>HTTP overhead: <span className="cs-green">~1 ms</span> on same continent</li>
            </ul>
          </section>

          <footer className="cs-refs">
            <p className="cs-refs-title"># references</p>
            <ol className="cs-refs-list">
              <li><a className="cs-ref-link" href="http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelope-calculations-to-choo.html" target="_blank" rel="noopener noreferrer">J. Dean — Back-of-the-Envelope Calculations (High Scalability, 2011)</a></li>
              <li><a className="cs-ref-link" href="https://youtu.be/modXC5IWTJI?si=Kz_J2DYBSx0r_fKs" target="_blank" rel="noopener noreferrer">J. Dean — Building Software Systems at Google (Stanford, 2010) ▶</a></li>
              <li><a className="cs-ref-link" href="https://github.com/donnemartin/system-design-primer" target="_blank" rel="noopener noreferrer">System Design Primer — donnemartin</a></li>
              <li><a className="cs-ref-link" href="https://colin-scott.github.io/personal_website/research/interactive_latency.html" target="_blank" rel="noopener noreferrer">Latency Numbers Every Programmer Should Know — Colin Scott</a></li>
            </ol>
          </footer>

        </div>
      </aside>
    </>
  );
}
