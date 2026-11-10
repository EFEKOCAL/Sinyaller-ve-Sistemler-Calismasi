/*
 * lab-transform.js — Sinyal işlemleri: zamanda ters çevirme, ölçekleme, öteleme, genlik dönüşümü.
 *   y(t) = A·x(a t + b) + B  ve ayrık  y[n] = x[a n + b]
 * "Kritik noktalar" tablosu: x'in her kırılma noktası t_k, y'de (t_k − b)/a noktasına taşınır.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);

  const BASES = {
    s50: { label: 'Yamuk: 3t (0<t<1), 3 (1<t<2)  · s. 50', f: (t) => (t > 0 && t < 1 ? 3 * t : t >= 1 && t < 2 ? 3 : 0), bp: [0, 1, 2], y: [-1, 3.6] },
    s47: { label: '−1 (−1<t<0), 1−t (0<t<2)  · s. 47–49', f: (t) => (t > -1 && t < 0 ? -1 : t >= 0 && t < 2 ? 1 - t : 0), bp: [-1, 0, 2], y: [-1.6, 1.6] },
    tri: { label: 'Üçgen Λ(t)', f: S.tri, bp: [-1, 0, 1], y: [-0.4, 1.4] }
  };
  const CPRE = [
    ['', 'Nottaki soru seç…'],
    ['s50|2|-6|1|0', 'x(2t − 6)  · s. 51a'],
    ['s50|0.5|1|1|0', 'x(t/2 + 1)  · s. 51b'],
    ['s50|1|0|2|-1', 'y(t) = −1 + 2x(t)  · s. 52c'],
    ['s50|2|4|1|0', 'x(2t + 4)  · ödev s. 52'],
    ['s50|1|-1|-2|0', '−2x(t − 1)  · ödev s. 52'],
    ['s50|-1|0|1|2', '2 + x(−t)  · ödev s. 52'],
    ['s47|1|-2|1|0', 'x(t − 2)  · s. 49'],
    ['s47|1|1|1|0', 'x(t + 1)  · s. 49'],
    ['s47|-1|0|1|0', 'x(−t)  · s. 47']
  ];

  SS.labs.transform = {
    title: 'Dönüşüm tezgâhı: A·x(at + b) + B',
    blurb: 'Öteleme, ölçekleme, ters çevirme ve genlik dönüşümünü adım adım uygula.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Güvenli sıra: <strong>önce öteleme</strong> ($x(t+b)$), <strong>sonra ölçekleme</strong> ($t \\to at$, $a<0$ ise ayrıca ayna), <strong>en son genlik</strong> ($A\\cdot{} + B$). Adım seçicisiyle her ara sonucu gör.');
      holder.append(L.root);
      const tabs = ui.tabs(['Sürekli zaman', 'Ayrık zaman'], (i) => show(i));
      L.root.insertBefore(tabs.el, L.controls);
      function show(i) { L.controls.innerHTML = ''; L.body.innerHTML = ''; L.readout.innerHTML = ''; (i === 0 ? cont : disc)(); SS.fixMath(L.root); }

      function cont() {
        const base = ui.select({ label: 'Temel sinyal $x(t)$', options: Object.keys(BASES).map((k) => ({ value: k, label: BASES[k].label })), value: 's50', onChange: draw });
        const pre = ui.select({ label: 'Hazır soru', options: CPRE.map(([v, l]) => ({ value: v, label: l })), value: '', onChange: (v) => {
          if (!v) return;
          const [bk, a, b, A, B] = v.split('|');
          base.set(bk, true); sa.set(AV.indexOf(+a), true); sb.set(+b, true); sA.set(+A, true); sB.set(+B, true); stage.set(3, true); draw();
        } });
        const AV = [-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3];
        const sa = ui.slider({ label: 'Ölçek $a$', min: 0, max: AV.length - 1, step: 1, value: AV.indexOf(2), fmt: (v) => S.fmt(AV[v], 2), onInput: draw });
        const sb = ui.slider({ label: 'Öteleme $b$', min: -6, max: 6, step: 0.5, value: -6, fmt: (v) => S.fmt(v, 1), onInput: draw });
        const sA = ui.slider({ label: 'Genlik $A$', min: -3, max: 3, step: 0.5, value: 1, fmt: (v) => S.fmt(v, 1), onInput: draw });
        const sB = ui.slider({ label: 'Kaydırma $B$', min: -3, max: 3, step: 0.5, value: 0, fmt: (v) => S.fmt(v, 1), onInput: draw });
        const stage = ui.seg({ label: 'Gösterilen adım', options: [{ value: 1, label: '1 · $x(t+b)$' }, { value: 2, label: '2 · $x(at+b)$' }, { value: 3, label: '3 · $A\\,x(at+b)+B$' }], value: 3, onChange: draw });
        L.controls.append(base.el, pre.el, el('div', { class: 'ctl-row' }, sa.el, sb.el, sA.el, sB.el), stage.el);
        const c1 = ui.canvas(170), c2 = ui.canvas(230);
        L.body.append(pbox(c1, null, 'Temel sinyal $x(t)$'), pbox(c2, [['muted', 'önceki adım', true], ['y', 'bu adım']]));
        function draw() {
          const B0 = BASES[base.get()];
          const a = AV[sa.get()];
          const b = sb.get(), A = sA.get(), Bv = sB.get(), st = +stage.get();
          const x = B0.f;
          const f1 = (t) => x(t + b), f2 = (t) => x(a * t + b), f3 = (t) => A * x(a * t + b) + Bv;
          const cur = [f1, f2, f3][st - 1], prev = [x, f1, f2][st - 1];
          SS.plot(c1, { x: [-8, 8], y: B0.y, h: 170, xLabel: 't', xStep: 1, layers: [{ kind: 'fn', f: x, color: 'x', fill: true, alpha: 0.12, n: 3000 }].concat(B0.bp.map((t) => ({ kind: 'dot', x: t, y: x(t + 1e-9) || x(t - 1e-9), color: 'x', r: 4 }))) });
          const yr = SS.autoY([cur, prev], -8, 8, { pad: 0.15 });
          const layers = [{ kind: 'fn', f: prev, color: 'muted', dash: [5, 4], w: 1.5, n: 3000 }, { kind: 'fn', f: cur, color: 'y', fill: true, alpha: 0.12, n: 3000 }];
          if (st >= 2) B0.bp.forEach((tk) => layers.push({ kind: 'vline', x: (tk - b) / a, color: 'h', dash: [2, 3], w: 1 }));
          SS.plot(c2, { x: [-8, 8], y: yr, h: 230, xLabel: 't', xStep: 1, layers });
          const tex = (st === 1 ? 'x(t' + (b ? (b > 0 ? '+' : '-') + S.fmt(Math.abs(b), 2) : '') + ')'
            : (st === 3 && A !== 1 ? S.fmt(A, 2) + '\\,' : '') + 'x(' + (a === 1 ? '' : a === -1 ? '-' : S.fmt(a, 2)) + 't' + (b ? (b > 0 ? '+' : '-') + S.fmt(Math.abs(b), 2) : '') + ')' + (st === 3 && Bv ? (Bv > 0 ? '+' : '-') + S.fmt(Math.abs(Bv), 2) : '')).replace(/−/g, '-');
          const map = B0.bp.map((tk) => '$t_k=' + S.fmt(tk, 2).replace('−', '-') + ' \\;\\to\\; \\frac{' + S.fmt(tk, 2).replace('−', '-') + (b ? (b > 0 ? '-' : '+') + S.fmt(Math.abs(b), 2) : '') + '}{' + S.fmt(a, 2).replace('−', '-') + '} = ' + S.fmt((tk - b) / a, 3).replace('−', '-') + '$').join('<br>');
          const desc = st === 1
            ? (b > 0 ? 'b > 0: sinyal ' + S.fmt(b, 2) + ' birim <strong>sola</strong> kaydı.' : b < 0 ? 'b < 0: sinyal ' + S.fmt(-b, 2) + ' birim <strong>sağa</strong> kaydı.' : 'b = 0: öteleme yok.')
            : st === 2
              ? (Math.abs(a) > 1 ? '|a| > 1: zaman ekseni ' + S.fmt(Math.abs(a), 2) + ' kat <strong>sıkıştı</strong>. ' : Math.abs(a) < 1 ? '|a| < 1: zaman ekseni ' + S.fmt(1 / Math.abs(a), 2) + ' kat <strong>genişledi</strong>. ' : '') + (a < 0 ? 'a < 0 olduğundan dikey eksene göre <strong>ayna</strong> alındı. ' : '') + 'Sıkıştırma ve aynalama $t=0$ etrafında yapılır. Sonuçta merkez $-b/a = ' + S.fmt(-b / a, 3) + '$ noktasına taşınmış olur.'
              : 'Genlik: ' + (A < 0 ? 'A < 0 olduğu için yatay eksene göre ters çevrildi, ' : '') + (Math.abs(A) !== 1 ? '|A| = ' + S.fmt(Math.abs(A), 2) + ' kat ölçeklendi, ' : '') + (Bv ? 'B = ' + S.fmt(Bv, 2) + ' kadar ' + (Bv > 0 ? 'yukarı' : 'aşağı') + ' kaydırıldı (sinyalin sıfır olduğu yerler de kayar!).' : 'dikey kaydırma yok.');
          ui.readout(L.readout, [['Bu adım', '$' + tex + '$', 'y'], ['Kritik noktalar $t_k \\to (t_k-b)/a$', map, 'wide']], { tone: 'info', html: desc });
        }
        draw();
      }

      function disc() {
        const X = { 0: 3, 1: 3, 2: 2, 3: 1, 4: 1 };
        const xf = (m) => (Number.isInteger(m) ? X[m] || 0 : 0);
        const sa = ui.seg({ label: 'Ölçek $a$', options: [{ value: -2, label: '−2' }, { value: -1, label: '−1' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 0.5, label: '½' }], value: 1, onChange: draw });
        const sb = ui.slider({ label: 'Öteleme $b$', min: -6, max: 6, step: 1, value: -3, onInput: draw });
        const pre = ui.select({ label: 'Hazır soru', options: [
          { value: '', label: 'Nottaki soru seç…' }, { value: '1|-3', label: 'x[n − 3]  · s. 53a' }, { value: '-1|3', label: 'x[−n + 3]  · s. 53b' }, { value: '2|0', label: 'x[2n]  · s. 53c' },
          { value: '-1|0', label: 'x[−n]  · ödev s. 53' }, { value: '1|2', label: 'x[n + 2]  · ödev s. 53' }, { value: '0.5|0', label: 'x[n/2]  · ödev s. 53' }], value: '', onChange: (v) => { if (!v) return; const [a, b] = v.split('|'); sa.set(+a, true); sb.set(+b, true); draw(); } });
        L.controls.append(pre.el, sa.el, sb.el);
        const c1 = ui.canvas(170), c2 = ui.canvas(210);
        const tbl = el('div', { class: 'trace-wrap' });
        L.body.append(pbox(c1, null, '$x[n]$ (notun dizisi)'), pbox(c2, null, 'Sonuç $y[n] = x[an+b]$'), tbl);
        function draw() {
          const a = +sa.get(), b = sb.get();
          const n0 = [], v0 = [];
          for (let k = -8; k <= 10; k++) { n0.push(k); v0.push(xf(k)); }
          SS.plot(c1, { x: [-8.6, 10.6], y: [-0.5, 3.8], h: 170, xLabel: 'n', xStep: 1, layers: [{ kind: 'stem', n: n0, v: v0, color: 'x', labels: true }] });
          const n1 = [], v1 = [], rows = [];
          for (let n = -8; n <= 10; n++) {
            const m = a * n + b;
            const v = xf(m);
            n1.push(n); v1.push(v);
            if (v !== 0 || (Number.isInteger(m) && m >= -1 && m <= 5)) rows.push([n, m, v]);
          }
          SS.plot(c2, { x: [-8.6, 10.6], y: [-0.5, 3.8], h: 210, xLabel: 'n', xStep: 1, layers: [{ kind: 'stem', n: n1, v: v1, color: 'y', labels: true }] });
          tbl.innerHTML = '';
          const t = el('table', { class: 'trace' }, el('thead', null, el('tr', null, el('th', null, 'n'), el('th', { html: SS.renderMath('$m = an+b$') }), el('th', { html: SS.renderMath('$y[n] = x[m]$') }))),
            el('tbody', null, rows.map(([n, m, v]) => el('tr', null, el('td', null, String(n)), el('td', null, Number.isInteger(m) ? String(m) : S.fmt(m, 1) + ' (tam sayı değil)'), el('td', null, String(v))))));
          tbl.append(t);
          const msg = a === 2 || a === -2 ? '$x[2n]$ <strong>seyreltme</strong>dir: yalnızca çift indisli örnekler kalır, diğerleri kaybolur. Sürekli zamandaki sıkıştırmadan farkı budur, bilgi kaybolur.'
            : a === 0.5 ? '$x[n/2]$ <strong>genişletme</strong>dir: $n/2$ tam sayı değilse dizi orada tanımsızdır ve 0 alınır. Örnekler arasına sıfır eklenir.'
              : 'Tablo yöntemi: her $n$ için $m=an+b$ indeksini hesapla, $x[m]$ değerini oku. Ezberlemen gereken tek kural bu.';
          ui.readout(L.readout, [], { tone: 'info', html: msg });
        }
        draw();
      }
      show(opts.tab || 0);
      if (opts.tab) tabs.set(opts.tab, true);
    }
  };
})();
