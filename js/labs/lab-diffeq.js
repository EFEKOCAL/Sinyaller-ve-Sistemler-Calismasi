/*
 * lab-diffeq.js — Lineer sabit katsayılı fark denklemleri
 *   y[n] = c1·y[n−1] + c2·y[n−2] + b0·x[n] + b1·x[n−1]
 * Özyineleme tablosu adım adım dolar; nottaki kapalı formla karşılaştırılır.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);
  const f2 = (v) => S.fmt(v, 4).replace(/−/g, '-');

  const NS = 'http://www.w3.org/2000/svg';
  function firstOrderSvg(a) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 600 150');
    s.setAttribute('class', 'diagram');
    s.innerHTML = '<defs><marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrowhead"/></marker></defs>' +
      '<text x="30" y="40" font-style="italic">x[n]</text><path class="wire" d="M60 35 L162 35" marker-end="url(#ah2)"/>' +
      '<circle class="blk" cx="176" cy="35" r="14"/><text x="176" y="41" text-anchor="middle">Σ</text>' +
      '<path class="wire" d="M190 35 L470 35" marker-end="url(#ah2)"/><text x="480" y="40" font-style="italic">y[n]</text>' +
      '<path class="wire" d="M400 35 L400 115 L360 115" marker-end="url(#ah2)"/>' +
      '<rect class="blk" x="270" y="96" width="90" height="38" rx="6"/><text x="315" y="113" text-anchor="middle" font-size="12">birim</text><text x="315" y="127" text-anchor="middle" font-size="12">gecikme</text>' +
      '<path class="wire" d="M270 115 L230 115" marker-end="url(#ah2)"/>' +
      '<path class="blk" d="M230 100 L230 130 L200 115 Z"/><text x="221" y="120" text-anchor="middle" font-size="12">' + S.fmt(a, 2) + '</text>' +
      '<path class="wire" d="M200 115 L176 115 L176 51" marker-end="url(#ah2)"/><text x="250" y="148" text-anchor="middle" font-size="12" font-style="italic">y[n−1]</text>';
    return s;
  }

  const PRE = {
    first: { label: 'y[n] − a·y[n−1] = K·bⁿu[n], y[−1] verili  · s. 103–106', kind: 'first' },
    imp: { label: 'y[n] − a·y[n−1] = K·δ[n], y[−1] = α  · s. 106–107', kind: 'imp' },
    s108: { label: 'İmpuls ve basamak cevabı: y[n] − a·y[n−1] = x[n]  · s. 108–109', kind: 's108' },
    hw106: { label: 'y[n] + 0.5y[n−1] = (−0.8)ⁿu[n]  · ödev s. 106', kind: 'hw106' },
    hw109: { label: 'y[n] − 0.5y[n−1] + 0.06y[n−2] = x[n−1] (impuls cevabı)  · ödev s. 109', kind: 'hw109' },
    hw103: { label: 'Şekildeki sistem: y[n] − 2y[n−1] = x[n] + 3x[n−1]  · s. 103', kind: 'hw103' }
  };

  SS.labs.diffeq = {
    title: 'Fark denklemi çözücü',
    blurb: 'Özyinelemeyi tablo hâlinde adım adım çalıştır, nottaki kapalı formla karşılaştır.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Fark denklemi bir <strong>tarif</strong>tir: $y[n]$’yi önceki çıkışlardan ve girişlerden hesaplar. Başlangıç koşulu ($y[-1]$) ve giriş bilinince değerler tek tek bulunur. Kapalı form ise aynı diziyi tek bir formülle verir.');
      holder.append(L.root);
      const pre = ui.select({ label: 'Denklem', options: Object.keys(PRE).map((k) => ({ value: k, label: PRE[k].label })), value: opts.preset || 'first', onChange: () => { setup(); } });
      const sa = ui.slider({ label: '$a$', min: -1.2, max: 1.2, step: 0.05, value: 0.8, fmt: (v) => S.fmt(v, 2), onInput: () => run() });
      const sb = ui.slider({ label: '$b$', min: -1, max: 1, step: 0.05, value: 0.5, fmt: (v) => S.fmt(v, 2), onInput: () => run() });
      const sK = ui.slider({ label: '$K$', min: -2, max: 3, step: 0.5, value: 1, fmt: (v) => S.fmt(v, 1), onInput: () => run() });
      const sy = ui.slider({ label: '$y[-1]$', min: -3, max: 3, step: 0.5, value: 0, fmt: (v) => S.fmt(v, 1), onInput: () => run() });
      const inp = ui.seg({ label: 'Giriş', options: [{ value: 'd', label: '$\\delta[n]$ (impuls cevabı)' }, { value: 'u', label: '$u[n]$ (basamak cevabı)' }], value: 'd', onChange: () => run() });
      const shown = { v: 4 };
      const nextB = ui.button('Sonraki n →', () => { shown.v = Math.min(15, shown.v + 1); run(); }, 'btn-primary');
      const allB = ui.button('Hepsini hesapla', () => { shown.v = 15; run(); }, '');
      const resB = ui.button('Baştan', () => { shown.v = 0; run(); }, 'btn-quiet');
      const eq = el('div', { class: 'box', style: { margin: '4px 0 0', width: '100%' } });
      L.controls.append(pre.el, el('div', { class: 'ctl-row' }, sa.el, sb.el, sK.el, sy.el), inp.el, eq);
      const dg = el('div');
      const cx = ui.canvas(150), cy = ui.canvas(220);
      const tb = el('div', { class: 'trace-wrap' });
      L.body.append(dg, pbox(cx, null, 'Giriş $x[n]$'), pbox(cy, [['y', 'özyinelemeyle bulunan $y[n]$'], ['accent', 'kapalı form (halka)']]), el('div', { class: 'card-actions' }, nextB, allB, resB), tb);

      let M = null;
      function setup() {
        const k = PRE[pre.get()].kind;
        const vis = { first: [1, 1, 1, 1, 0], imp: [1, 0, 1, 1, 0], s108: [1, 0, 0, 0, 1], hw106: [0, 0, 0, 0, 0], hw109: [0, 0, 0, 0, 1], hw103: [0, 0, 0, 0, 1] }[k];
        [sa, sb, sK, sy, inp].forEach((c, i) => { c.el.style.display = vis[i] ? '' : 'none'; });
        if (k === 's108') { sy.set(0, true); }
        shown.v = 4;
        run();
      }

      function model() {
        const k = PRE[pre.get()].kind;
        const a = sa.get(), b = sb.get(), K = sK.get(), y1 = sy.get(), isU = inp.get() === 'u';
        switch (k) {
          case 'first': return {
            c1: a, c2: 0, b0: 1, b1: 0, y1, y2: 0, x: (n) => (n >= 0 ? K * Math.pow(b, n) : 0),
            eq: 'y[n] - ' + f2(a) + '\\,y[n-1] = ' + f2(K) + '\\,(' + f2(b) + ')^n u[n], \\quad y[-1] = ' + f2(y1),
            closed: Math.abs(b - a) > 1e-9 ? (n) => (n < 0 ? NaN : y1 * Math.pow(a, n + 1) + K * (Math.pow(b, n + 1) - Math.pow(a, n + 1)) / (b - a)) : null,
            ctex: 'y[n] = y_{-1}a^{n+1} + K\\frac{b^{n+1} - a^{n+1}}{b - a}, \\quad n \\ge 0', svg: a };
          case 'imp': return {
            c1: a, c2: 0, b0: 1, b1: 0, y1, y2: 0, x: (n) => (n === 0 ? K : 0),
            eq: 'y[n] - ' + f2(a) + '\\,y[n-1] = ' + f2(K) + '\\,\\delta[n], \\quad y[-1] = \\alpha = ' + f2(y1),
            closed: (n) => (n < 0 ? NaN : Math.pow(a, n + 1) * y1 + K * Math.pow(a, n)), ctex: 'y[n] = a^{n+1}\\alpha + K a^n u[n]', svg: a };
          case 's108': return {
            c1: a, c2: 0, b0: 1, b1: 0, y1: 0, y2: 0, x: isU ? S.dU : S.dDelta,
            eq: 'y[n] - ' + f2(a) + '\\,y[n-1] = x[n], \\quad y[-1] = 0',
            closed: isU ? (n) => (n < 0 ? NaN : (1 - Math.pow(a, n + 1)) / (1 - a)) : (n) => (n < 0 ? NaN : Math.pow(a, n)),
            ctex: isU ? 's[n] = \\frac{1-a^{n+1}}{1-a}u[n]' : 'h[n] = a^n u[n]', svg: a };
          case 'hw106': return {
            c1: -0.5, c2: 0, b0: 1, b1: 0, y1: 0, y2: 0, x: (n) => (n >= 0 ? Math.pow(-0.8, n) : 0),
            eq: 'y[n] + 0.5\\,y[n-1] = (-0.8)^n u[n], \\quad y[-1] = 0',
            closed: (n) => (n < 0 ? NaN : (Math.pow(-0.8, n + 1) - Math.pow(-0.5, n + 1)) / (-0.3)),
            ctex: 'y[n] = \\frac{10}{3}\\left[(-0.5)^{n+1} - (-0.8)^{n+1}\\right]u[n]', svg: -0.5 };
          case 'hw109': return {
            c1: 0.5, c2: -0.06, b0: 0, b1: 1, y1: 0, y2: 0, x: isU ? S.dU : S.dDelta,
            eq: 'y[n] - 0.5\\,y[n-1] + 0.06\\,y[n-2] = x[n-1]',
            closed: isU ? null : (n) => (n < 0 ? NaN : 10 * (Math.pow(0.3, n) - Math.pow(0.2, n))), ctex: isU ? '\\text{(yalnızca impuls cevabı için)}' : 'h[n] = 10\\left[(0.3)^n - (0.2)^n\\right]u[n]' };
          case 'hw103': return {
            c1: 2, c2: 0, b0: 1, b1: 3, y1: 0, y2: 0, x: isU ? S.dU : S.dDelta,
            eq: 'y[n] - 2\\,y[n-1] = x[n] + 3\\,x[n-1]',
            closed: isU ? null : (n) => (n < 0 ? NaN : n === 0 ? 1 : 5 * Math.pow(2, n - 1)), ctex: isU ? '\\text{—}' : 'h[n] = \\delta[n] + 5\\cdot 2^{n-1}u[n-1]' };
        }
      }

      function run() {
        M = model();
        SS.setMath(eq, '<strong>Denklem:</strong> $' + M.eq + '$<br><strong>Özyineleme:</strong> $y[n] = ' +
          [M.c1 ? f2(M.c1) + '\\,y[n-1]' : '', M.c2 ? f2(M.c2) + '\\,y[n-2]' : '', M.b0 ? (M.b0 === 1 ? '' : f2(M.b0)) + 'x[n]' : '', M.b1 ? (M.b1 === 1 ? '' : f2(M.b1)) + 'x[n-1]' : ''].filter(Boolean).join(' + ').replace(/\+ -/g, '- ') + '$');
        dg.innerHTML = '';
        if (M.svg != null) dg.append(firstOrderSvg(M.svg));
        const N = 15;
        const y = { '-1': M.y1, '-2': M.y2 };
        const rows = [];
        for (let n = 0; n <= N; n++) {
          const xn = M.x(n), xn1 = M.x(n - 1);
          y[n] = M.c1 * y[n - 1] + M.c2 * y[n - 2] + M.b0 * xn + M.b1 * xn1;
          const parts = [];
          if (M.c1) parts.push(f2(M.c1) + '\\cdot' + f2(y[n - 1]));
          if (M.c2) parts.push(f2(M.c2) + '\\cdot' + f2(y[n - 2]));
          if (M.b0) parts.push((M.b0 === 1 ? '' : f2(M.b0) + '\\cdot') + f2(xn));
          if (M.b1) parts.push((M.b1 === 1 ? '' : f2(M.b1) + '\\cdot') + f2(xn1));
          rows.push([n, xn, parts.join(' + ').replace(/\+ -/g, '- '), y[n]]);
        }
        const ns = [], xs = [], yv = [], cv = [];
        for (let n = -2; n <= N; n++) { ns.push(n); xs.push(n < 0 ? 0 : M.x(n)); yv.push(n < 0 ? (n === -1 ? M.y1 : M.y2) : n <= shown.v ? y[n] : NaN); cv.push(M.closed ? M.closed(n) : NaN); }
        SS.plot(cx, { x: [-2.6, N + 0.6], y: SS.autoYv([xs]), h: 150, xLabel: 'n', xStep: 1, layers: [{ kind: 'stem', n: ns, v: xs, color: 'x', labels: true }] });
        const all = []; for (let n = 0; n <= N; n++) all.push(Math.max(-60, Math.min(60, y[n])));
        all.push(M.y1);
        SS.plot(cy, { x: [-2.6, N + 0.6], y: SS.autoYv([all]), h: 220, xLabel: 'n', xStep: 1, layers: [
          { kind: 'stem', n: ns, v: yv, color: 'y', labels: true },
          { kind: 'stem', n: ns, v: cv, color: 'accent', ringOnly: true, r: 7, w: 1.8 }] });
        tb.innerHTML = '';
        const t = el('table', { class: 'trace' }, el('thead', null, el('tr', null, el('th', null, 'n'), el('th', { html: SS.renderMath('$x[n]$') }), el('th', null, 'hesap'), el('th', { html: SS.renderMath('$y[n]$') }), el('th', null, 'kapalı form'))));
        const body = el('tbody');
        body.append(el('tr', null, el('td', null, '−1'), el('td', null, '0'), el('td', null, 'başlangıç koşulu'), el('td', null, f2(M.y1)), el('td', null, '')));
        rows.slice(0, shown.v + 1).forEach(([n, xn, calc, yn], i) => {
          body.append(el('tr', { class: i === shown.v ? 'cur' : '' }, el('td', null, String(n)), el('td', null, f2(xn)), el('td', { html: SS.tex(calc + ' = ' + f2(yn)) }), el('td', null, f2(yn)), el('td', null, M.closed ? f2(M.closed(n)) : '—')));
        });
        t.append(body);
        tb.append(t);
        nextB.disabled = shown.v >= N;
        let err = 0;
        if (M.closed) for (let n = 0; n <= N; n++) err = Math.max(err, Math.abs(M.closed(n) - y[n]));
        ui.readout(L.readout, [['Kapalı form', '$' + M.ctex + '$', 'wide'], ['Özyineleme ile kapalı form farkı', M.closed ? S.fmt(err, 6) : '—', 'y']],
          { tone: 'info', html: 'Adımları tek tek aç: her satır bir önceki satırın sonucunu kullanır. Halkalar kapalı formun değerleri; özyinelemeyle bulunan çubukların tam tepesine oturuyorsa formül doğrudur.' });
      }
      setup();
    }
  };
})();
