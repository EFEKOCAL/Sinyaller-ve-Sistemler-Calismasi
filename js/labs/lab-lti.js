/*
 * lab-lti.js — LTI sistemler
 *   blocks   : seri (konvolüsyon) ve paralel (toplam) bağlama, nottaki s. 85 sistemi
 *   ltiprops : impuls cevabından bellek, nedensellik, kararlılık
 *   step     : basamak cevabı s = h ∗ u (birikimli toplam/integral) ve tersi
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);
  const eu = (a, k) => (t) => (t >= 0 ? (k || 1) * Math.exp(-a * t) : 0);

  /* --- blok diyagram SVG --- */
  const NS = 'http://www.w3.org/2000/svg';
  function svg(w, h, inner) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    s.setAttribute('class', 'diagram');
    s.innerHTML = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrowhead"/></marker></defs>' + inner;
    return s;
  }
  const blk = (x, y, w, h, label) => '<rect class="blk" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6"/><text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-style="italic">' + label + '</text>';
  const wire = (pts, arrow) => '<path class="wire" d="M' + pts.map((p) => p.join(' ')).join(' L') + '"' + (arrow ? ' marker-end="url(#ah)"' : '') + '/>';
  const sum = (x, y) => '<circle class="blk" cx="' + x + '" cy="' + y + '" r="13"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle">+</text>';
  const txt = (x, y, t, anchor) => '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" font-style="italic">' + t + '</text>';

  const series = (a, b) => svg(620, 90, txt(22, 50, 'x(t)') + wire([[45, 45], [110, 45]], true) + blk(110, 22, 110, 46, a) + wire([[220, 45], [300, 45]], true) + blk(300, 22, 110, 46, b) + wire([[410, 45], [490, 45]], true) + txt(520, 50, 'y(t)') +
    '<text x="560" y="20" fill="currentColor" font-size="12">  </text>');
  const parallel = (a, b) => svg(620, 170, txt(22, 90, 'x(t)') + wire([[45, 85], [90, 85]]) + wire([[90, 85], [90, 40], [180, 40]], true) + wire([[90, 85], [90, 130], [180, 130]], true) +
    blk(180, 18, 120, 44, a) + blk(180, 108, 120, 44, b) + wire([[300, 40], [380, 40], [380, 72]], true) + wire([[300, 130], [380, 130], [380, 98]], true) + sum(380, 85) + wire([[393, 85], [470, 85]], true) + txt(505, 90, 'y(t)'));
  const s85 = () => svg(620, 190, txt(22, 100, 'x(t)') + wire([[45, 95], [80, 95]]) + wire([[80, 95], [80, 40], [120, 40]], true) + wire([[80, 95], [80, 150], [120, 150]], true) +
    blk(120, 20, 80, 40, 'h₃') + wire([[200, 40], [240, 40]], true) + blk(240, 20, 80, 40, 'h₄') +
    blk(120, 130, 80, 40, 'h₁') + wire([[200, 150], [240, 150]], true) + blk(240, 130, 80, 40, 'h₂') +
    wire([[320, 40], [400, 40], [400, 82]], true) + wire([[320, 150], [400, 150], [400, 108]], true) + sum(400, 95) + wire([[413, 95], [480, 95]], true) + txt(515, 100, 'y(t)'));

  const SER = {
    s87: { label: 'h₁ = 2e^(−t)u(t), h₂ = 4e^(−2t)u(t)  · ödev s. 87', h1: eu(1, 2), h2: eu(2, 4), t1: '2e^{-t}u(t)', t2: '4e^{-2t}u(t)', closed: (t) => (t >= 0 ? 8 * (Math.exp(-t) - Math.exp(-2 * t)) : 0), ctex: '8\\left(e^{-t} - e^{-2t}\\right)u(t)' },
    s86: { label: 'h₃ = 4e^(−2t)u(t), h₄ = e^(−3t)u(t)  · s. 86', h1: eu(2, 4), h2: eu(3, 1), t1: '4e^{-2t}u(t)', t2: 'e^{-3t}u(t)', closed: (t) => (t >= 0 ? 4 * (Math.exp(-2 * t) - Math.exp(-3 * t)) : 0), ctex: '4\\left(e^{-2t} - e^{-3t}\\right)u(t)' },
    box: { label: 'İki birim darbe u(t) − u(t−1)', h1: (t) => (t >= 0 && t < 1 ? 1 : 0), h2: (t) => (t >= 0 && t < 1 ? 1 : 0), t1: 'u(t)-u(t-1)', t2: 'u(t)-u(t-1)', closed: (t) => (t < 0 ? 0 : t < 1 ? t : t < 2 ? 2 - t : 0), ctex: '\\text{üçgen (0 ile 2 arası)}' }
  };

  SS.labs.blocks = {
    title: 'Blok diyagramlar',
    blurb: 'Seri bağlı sistemler konvolüsyonla, paralel bağlı sistemler toplamla birleşir.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Seri bağlamada impuls cevapları <strong>konvolüsyonla</strong> ($h_1 * h_2$), paralel bağlamada <strong>toplamla</strong> ($h_1 + h_2$) birleşir. Seri bağlamada sıra önemli değildir, çünkü konvolüsyon değişme özelliğine sahiptir.');
      holder.append(L.root);
      const tabs = ui.tabs(['Seri', 'Paralel', 'Nottaki sistem (s. 85–86)'], (i) => show(i));
      L.root.insertBefore(tabs.el, L.controls);
      function show(i) { L.controls.innerHTML = ''; L.body.innerHTML = ''; L.readout.innerHTML = ''; [ser, par, note][i](); SS.fixMath(L.root); }
      function ser() {
        const pre = ui.select({ label: 'Sistemler', options: Object.keys(SER).map((k) => ({ value: k, label: SER[k].label })), value: 's87', onChange: draw });
        let swapped = false;
        const sw = ui.button('Sırayı değiştir (h₂ önce)', () => { swapped = !swapped; draw(); }, '');
        L.controls.append(pre.el, sw);
        const dg = el('div'), c1 = ui.canvas(170), c2 = ui.canvas(210);
        L.body.append(dg, pbox(c1, [['x', '$h_1$'], ['h', '$h_2$']]), pbox(c2, [['y', '$h = h_1 * h_2$ (sayısal)'], ['accent', 'kapalı form', true]]));
        function draw() {
          const P = SER[pre.get()];
          dg.innerHTML = '';
          dg.append(swapped ? series('h₂(t)', 'h₁(t)') : series('h₁(t)', 'h₂(t)'));
          const Y = S.convolveContinuous(swapped ? P.h2 : P.h1, swapped ? P.h1 : P.h2, -1, 8, 0.005);
          SS.plot(c1, { x: [-0.5, 5], y: SS.autoY([P.h1, P.h2], -0.5, 5), h: 170, xLabel: 't', layers: [{ kind: 'fn', f: P.h1, color: 'x' }, { kind: 'fn', f: P.h2, color: 'h' }] });
          SS.plot(c2, { x: [-0.5, 5], y: SS.autoY([P.closed], -0.5, 5), h: 210, xLabel: 't', layers: [{ kind: 'fn', f: (t) => Y.at(t), color: 'y', fill: true, alpha: 0.12, w: 3 }, { kind: 'fn', f: P.closed, color: 'accent', dash: [6, 4] }] });
          ui.readout(L.readout, [['$h_1$', '$' + P.t1 + '$', 'x'], ['$h_2$', '$' + P.t2 + '$', 'h'], ['$h = h_1 * h_2$', '$' + P.ctex + '$', 'y wide']], { tone: 'info', html: (swapped ? 'Sırayı değiştirdin: eğri <strong>hiç değişmedi</strong>. ' : '') + 'Tek bir sistem gibi davranırlar. Eşdeğer impuls cevabı iki cevabın konvolüsyonudur: $x \\to h_1 \\to h_2 \\to y \\;\\equiv\\; x \\to h_1 * h_2 \\to y$.' });
        }
        draw();
      }
      function par() {
        const k2 = ui.slider({ label: 'İkinci kolun kazancı $k$', min: -3, max: 3, step: 0.5, value: -1, fmt: (v) => S.fmt(v, 1), onInput: draw });
        L.controls.append(k2.el);
        const dg = el('div'), c = ui.canvas(220);
        L.body.append(dg, pbox(c, [['x', '$h_1 = e^{-t}u(t)$'], ['h', '$h_2 = k\\,e^{-2t}u(t)$'], ['y', '$h = h_1 + h_2$']]));
        dg.append(parallel('h₁(t)', 'h₂(t)'));
        function draw() {
          const k = k2.get();
          const h1 = eu(1), h2 = eu(2, k), h = (t) => h1(t) + h2(t);
          SS.plot(c, { x: [-0.5, 5], y: SS.autoY([h1, h2, h], -0.5, 5), h: 220, xLabel: 't', layers: [{ kind: 'fn', f: h1, color: 'x', w: 1.6 }, { kind: 'fn', f: h2, color: 'h', w: 1.6 }, { kind: 'fn', f: h, color: 'y', w: 3, fill: true, alpha: 0.12 }] });
          ui.readout(L.readout, [['$h(t)$', '$\\left(e^{-t} ' + (k < 0 ? '-' : '+') + S.fmt(Math.abs(k), 1) + 'e^{-2t}\\right)u(t)$', 'y wide']], { tone: 'info', html: 'Paralel kollar girişi aynı anda görür ve çıkışları toplanır: $y = x*h_1 + x*h_2 = x*(h_1+h_2)$. Bu, konvolüsyonun dağılma özelliğidir.' });
        }
        draw();
      }
      function note() {
        const dg = el('div'), c = ui.canvas(230);
        dg.append(s85());
        L.body.append(dg, pbox(c, [['x', '$h_3 * h_4 = 4(e^{-2t}-e^{-3t})u(t)$'], ['h', '$h_1 * h_2 = 3\\delta * 2e^{-t}u = 6e^{-t}u(t)$'], ['y', '$h = $ toplam']]));
        const Y = S.convolveContinuous(eu(2, 4), eu(3, 1), -1, 8, 0.005);
        const b1 = (t) => Y.at(t), b2 = eu(1, 6), h = (t) => b1(t) + b2(t);
        SS.plot(c, { x: [-0.5, 5], y: [-0.4, 7], h: 230, xLabel: 't', layers: [{ kind: 'fn', f: b1, color: 'x' }, { kind: 'fn', f: b2, color: 'h' }, { kind: 'fn', f: h, color: 'y', w: 3, fill: true, alpha: 0.1 }] });
        ui.readout(L.readout, [['Üst kol', '$h_3 * h_4 = 4\\left(e^{-2t}-e^{-3t}\\right)u(t)$', 'x wide'], ['Alt kol', '$h_1 * h_2 = 3\\delta(t) * 2e^{-t}u(t) = 6e^{-t}u(t)$', 'h wide'], ['Toplam', '$h(t) = 6e^{-t}u(t) + 4\\left(e^{-2t}-e^{-3t}\\right)u(t)$', 'y wide']],
          { tone: 'info', html: 'Önce her kolu ayrı çöz (seri → konvolüsyon), sonra kolları topla (paralel → toplam). $3\\delta(t)$ ile konvolüsyon, sinyali yalnızca 3 ile çarpar: $x(t)*\\delta(t) = x(t)$.' });
      }
      show(opts.tab || 0);
      if (opts.tab) tabs.set(opts.tab, true);
    }
  };

  /* ===================== LTI özellikleri h'den ===================== */
  const HC = {
    e1: { label: 'h(t) = e^(−t) u(t)  · s. 88', f: eu(1), M: [true, '$h(t) \\ne 0$ ($t>0$): geçmiş girişleri hatırlıyor.'], C: [true, '$t<0$ için $h(t) = 0$.'], St: [true, '$\\int_0^\\infty e^{-t}dt = 1 < \\infty$.'], area: 1 },
    d4: { label: 'h(t) = 4δ(t)  · s. 88–89', imp: [[0, 4]], f: () => 0, M: [false, 'Yalnızca $t=0$’da sıfırdan farklı: $y(t) = 4x(t)$.'], C: [true, '$t<0$ için $h=0$.'], St: [true, '$\\int 4\\delta(t)dt = 4 < \\infty$.'], area: 4 },
    cos: { label: 'h(t) = cos(πt) u(t + 1)  · ödev s. 89', f: (t) => (t >= -1 ? Math.cos(Math.PI * t) : 0), M: [true, 'Sıfırdan farklı olduğu çok sayıda $t$ var.'], C: [false, '$-1 \\le t < 0$ aralığında $h(t) \\ne 0$.'], St: [false, '$\\int |\\cos\\pi t|\\,dt$ her periyotta $2/\\pi$ ekler, toplam $\\infty$.'], area: Infinity },
    eabs: { label: 'h(t) = e^(−|t|)', f: (t) => Math.exp(-Math.abs(t)), M: [true, '—'], C: [false, '$t<0$ tarafında da değer var.'], St: [true, '$\\int e^{-|t|}dt = 2$.'], area: 2 },
    u: { label: 'h(t) = u(t) (integratör)', f: S.u, M: [true, '—'], C: [true, '$t<0$ için 0.'], St: [false, '$\\int_0^\\infty 1\\,dt = \\infty$.'], area: Infinity },
    eup: { label: 'h(t) = e^(0.5t) u(t)', f: (t) => (t >= 0 ? Math.exp(0.5 * t) : 0), M: [true, '—'], C: [true, '$t<0$ için 0.'], St: [false, 'Üstel büyüyor, integral $\\infty$.'], area: Infinity }
  };
  const HD = {
    nu: { label: 'h[n] = n u[n]  · s. 100', f: (n) => (n >= 0 ? n : 0), M: [true, '$h[1]=1, h[2]=2,\\ldots \\ne 0$. Bellekli! (Not burada “belleksiz” diyor, hatalı.)'], C: [true, '$n<0$ için 0.'], St: [false, '$\\sum_{k=0}^{\\infty} k \\to \\infty$.'], area: Infinity },
    al: { label: 'h[n] = αⁿ⁻¹ u[n−2], α = 0.5  · ödev s. 100', f: (n) => (n >= 2 ? Math.pow(0.5, n - 1) : 0), M: [true, '$n \\ge 2$ için sıfırdan farklı.'], C: [true, '$n<0$ için 0 (hatta $n<2$ için 0).'], St: [true, '$\\sum_{n=2}^{\\infty} |\\alpha|^{n-1} = \\frac{|\\alpha|}{1-|\\alpha|} = 1 < \\infty$.'], area: 1 },
    s98: { label: 'h[n] = 3δ[n] + δ[n−1]  · s. 98', f: (n) => (n === 0 ? 3 : n === 1 ? 1 : 0), M: [true, '$h[1] = 1 \\ne 0$.'], C: [true, '$n<0$ için 0.'], St: [true, '$\\sum|h| = 4$.'], area: 4 },
    s97: { label: 'h[n] = (¼)ⁿu[n] + 4ⁿu[−n]  · s. 97', f: (n) => (n >= 0 ? Math.pow(0.25, n) : 0) + (n <= 0 ? Math.pow(4, n) : 0), M: [true, '—'], C: [false, '$4^n u[-n]$ terimi $n<0$ için sıfırdan farklı.'], St: [true, '$\\sum = \\frac{4}{3} + \\frac{4}{3} = \\frac{8}{3}$.'], area: 8 / 3 },
    d2: { label: 'h[n] = 2δ[n]', f: (n) => (n === 0 ? 2 : 0), M: [false, '$h[n] = K\\delta[n]$ biçiminde: $y[n] = 2x[n]$.'], C: [true, '—'], St: [true, '$\\sum|h| = 2$.'], area: 2 },
    a12: { label: 'h[n] = (½)ⁿ u[n]', f: (n) => (n >= 0 ? Math.pow(0.5, n) : 0), M: [true, '—'], C: [true, '—'], St: [true, '$\\sum (1/2)^n = 2$.'], area: 2 }
  };

  SS.labs.ltiprops = {
    title: 'h’ye bak, sistemi tanı',
    blurb: 'LTI sistemin bellek, nedensellik ve kararlılığı yalnızca h(t)’den okunur.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Kırmızı bölge $t<0$: <strong>nedensel</strong> bir sistemde burası boş olmalı. Sağdaki grafik $\\int_{-T}^{T}|h|$ birikimini gösterir: sonlu bir değere yerleşirse sistem <strong>kararlıdır</strong>. $h$ yalnızca $t=0$’da bir impulsa sahipse sistem <strong>belleksizdir</strong>.');
      holder.append(L.root);
      let disc = !!opts.disc;
      const dom = ui.seg({ label: 'Zaman', options: [{ value: 'c', label: 'Sürekli' }, { value: 'd', label: 'Ayrık' }], value: disc ? 'd' : 'c', onChange: (v) => { disc = v === 'd'; fill(); draw(); } });
      const pre = ui.select({ label: 'İmpuls cevabı', options: [], onChange: () => draw() });
      L.controls.append(dom.el, pre.el);
      const c1 = ui.canvas(220), c2 = ui.canvas(220);
      L.body.append(el('div', { class: 'plot-grid' }, pbox(c1, null, 'İmpuls cevabı'), pbox(c2, null, 'Mutlak değerin birikimi $\\int_{-T}^{T}|h|$ veya $\\sum_{-N}^{N}|h|$')));
      function fill() {
        const src = disc ? HD : HC;
        pre.sel.innerHTML = '';
        Object.keys(src).forEach((k) => pre.sel.append(el('option', { value: k }, src[k].label)));
        if (opts.preset && src[opts.preset]) pre.sel.value = opts.preset;
      }
      function draw() {
        const P = (disc ? HD : HC)[pre.get()];
        if (!P) return;
        const layers = [{ kind: 'band', from: -100, to: disc ? -0.5 : 0, color: 'warn', alpha: 0.08, label: 'nedensellik bölgesi (t < 0)' }];
        let acc = [], Tm = disc ? 20 : 12;
        if (disc) {
          const n = [], v = [];
          for (let k = -6; k <= 12; k++) { n.push(k); v.push(P.f(k)); }
          layers.push({ kind: 'stem', n, v, color: 'h', labels: false });
          SS.plot(c1, { x: [-6.6, 12.6], y: SS.autoYv([v.map((x) => Math.min(x, 12))]), h: 220, xLabel: 'n', xStep: 2, layers });
          let s = Math.abs(P.f(0));
          acc.push([0, s]);
          for (let N = 1; N <= Tm; N++) { s += Math.abs(P.f(N)) + Math.abs(P.f(-N)); acc.push([N, s]); }
        } else {
          layers.push({ kind: 'fn', f: P.f, color: 'h', fill: true, alpha: 0.15 });
          (P.imp || []).forEach(([at, amp]) => layers.push({ kind: 'impulse', at, amp: Math.min(amp, 2.2), color: 'h', label: amp + 'δ(t)' }));
          SS.plot(c1, { x: [-3, 6], y: [-1.3, 2.6], h: 220, xLabel: 't', layers });
          const imp = (P.imp || []).reduce((s, [, a]) => s + Math.abs(a), 0);
          for (let T = 0; T <= Tm; T += 0.1) acc.push([T, imp + S.integrate((t) => Math.abs(P.f(t)), -T, T, 600)]);
        }
        const amax = Math.min(Math.max(...acc.map((p) => p[1])) * 1.2, 1e4) || 1;
        SS.plot(c2, { x: [0, Tm], y: [-amax * 0.05, amax], h: 220, xLabel: disc ? 'N' : 'T', layers: [
          isFinite(P.area) ? { kind: 'hline', y: P.area, color: 'y', label: 'limit = ' + S.fmt(P.area, 3) } : null,
          { kind: 'poly', pts: acc, color: isFinite(P.area) ? 'y' : 'warn', w: 2.4 }] });
        const v = (b) => (b ? '<strong style="color:var(--c-y)">Evet</strong>' : '<strong style="color:var(--c-warn)">Hayır</strong>');
        ui.readout(L.readout, [
          ['Bellekli mi?', (P.M[0] ? '<strong>Bellekli</strong>' : '<strong>Belleksiz</strong>') + ' ' + SS.renderMath(P.M[1] === '—' ? '' : P.M[1]), 'wide'],
          ['Nedensel mi?', v(P.C[0]) + ' · ' + SS.renderMath(P.C[1]), 'wide'],
          ['Kararlı mı?', v(P.St[0]) + ' · ' + SS.renderMath(P.St[1]), 'wide']
        ], null);
      }
      fill();
      draw();
    }
  };

  /* ===================== Basamak cevabı ===================== */
  const SD = {
    s98: { label: 'h[n] = 3δ[n] + δ[n−1]  · s. 98–99', h: (n) => (n === 0 ? 3 : n === 1 ? 1 : 0), stex: 's[n] = 3u[n] + u[n-1]' },
    a: { label: 'h[n] = aⁿ u[n], a = 0.6  · s. 108', h: (n) => (n >= 0 ? Math.pow(0.6, n) : 0), stex: 's[n] = \\frac{1-a^{n+1}}{1-a}u[n]' },
    dd: { label: 'h[n] = δ[n] − δ[n−1] (fark alıcı)', h: (n) => (n === 0 ? 1 : n === 1 ? -1 : 0), stex: 's[n] = u[n] - u[n-1] = \\delta[n]' },
    alt: { label: 'h[n] = (−0.5)ⁿ u[n]', h: (n) => (n >= 0 ? Math.pow(-0.5, n) : 0), stex: 's[n] = \\frac{1-(-0.5)^{n+1}}{1.5}u[n]' }
  };
  SS.labs.step = {
    title: 'Basamak cevabı',
    blurb: 's[n] = h[n] ∗ u[n]: impuls cevabının birikimli toplamı. Tersi: h[n] = s[n] − s[n−1].',
    mount(holder) {
      const L = ui.lab(this.title, 'Basamak cevabı, girişe $u[n]$ verildiğinde alınan çıkıştır. $u[n]$ ile konvolüsyon birikimli toplam demektir: $s[n] = \\sum_{k=-\\infty}^{n} h[k]$. Sürekli zamanda bu integral olur: $s(t) = \\int_{-\\infty}^{t} h(\\tau)d\\tau$.');
      holder.append(L.root);
      const pre = ui.select({ label: 'İmpuls cevabı', options: Object.keys(SD).map((k) => ({ value: k, label: SD[k].label })), value: 's98', onChange: draw });
      const nS = ui.slider({ label: '$n$', min: -2, max: 10, step: 1, value: 2, onInput: draw });
      L.controls.append(pre.el, nS.el);
      const c1 = ui.canvas(190), c2 = ui.canvas(190);
      L.body.append(el('div', { class: 'plot-grid' }, pbox(c1, null, '$h[k]$: $k \\le n$ olanlar toplanıyor'), pbox(c2, null, '$s[n]$')));
      function draw() {
        const P = SD[pre.get()], n = nS.get();
        const ks = [], hv = [], hin = [], sv = [];
        let s = 0;
        for (let k = -3; k <= 12; k++) { ks.push(k); hv.push(P.h(k)); hin.push(k <= n ? P.h(k) : NaN); s += P.h(k); sv.push(s); }
        const yr = SS.autoYv([hv, sv]);
        SS.plot(c1, { x: [-3.6, 12.6], y: yr, h: 190, xLabel: 'k', xStep: 1, layers: [{ kind: 'band', from: -10, to: n + 0.5, color: 'y', alpha: 0.08 }, { kind: 'stem', n: ks, v: hv, color: 'muted', opacity: 0.4 }, { kind: 'stem', n: ks, v: hin, color: 'h', labels: true }] });
        SS.plot(c2, { x: [-3.6, 12.6], y: yr, h: 190, xLabel: 'n', xStep: 1, layers: [{ kind: 'stem', n: ks, v: sv, color: 'muted', opacity: 0.35 }, { kind: 'stem', n: ks.filter((k) => k <= n), v: sv.slice(0, ks.filter((k) => k <= n).length), color: 'y', labels: true }] });
        const terms = ks.filter((k) => k <= n && P.h(k) !== 0).map((k) => S.fmt(P.h(k), 3));
        const sn = sv[ks.indexOf(n)];
        const sp = n - 1 >= -3 ? sv[ks.indexOf(n - 1)] : 0;
        ui.readout(L.readout, [['$s[' + n + ']$', '$' + (terms.length ? (terms.length > 6 ? terms.slice(0, 5).join(' + ') + ' + \\cdots' : terms.join(' + ')).replace(/−/g, '-') : '0') + ' = ' + S.fmt(sn, 4).replace('−', '-') + '$', 'y'], ['Ters yön: $s[n]-s[n-1]$', S.fmt(sn - sp, 4) + ' = h[' + n + ']', 'h'], ['Kapalı form', '$' + P.stex + '$', 'wide']],
          { tone: 'info', html: 'Basamak cevabını biliyorsan impuls cevabını <strong>fark alarak</strong> bulursun: $h[n] = s[n] - s[n-1]$. Sürekli zamanda türev alarak: $h(t) = \\frac{ds(t)}{dt}$. Notun s. 108 (c) şıkkı tam olarak budur.' });
      }
      draw();
    }
  };
})();
