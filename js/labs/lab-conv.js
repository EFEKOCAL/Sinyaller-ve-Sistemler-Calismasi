/*
 * lab-conv.js — Konvolüsyon
 *   decomp : girişi ince darbelere böl, her darbenin cevabını topla → konvolüsyon integrali
 *   conv   : sürekli grafik konvolüsyon (çevir, kaydır, çarp, integral al)
 *   dconv  : ayrık konvolüsyon toplamı (kaydırma ve tablo yöntemi)
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);

  /* ===================== İmpulslara ayırma ===================== */
  const DX = {
    bump: { label: 'Yarım sinüs: 1.2 sin(πt/3), 0<t<3', f: (t) => (t > 0 && t < 3 ? 1.2 * Math.sin((Math.PI * t) / 3) : 0), T: 3 },
    step: { label: 'Basamak u(t)  (s. 73 girişi)', f: S.u, T: 8 },
    tri: { label: 'Üçgen 2Λ(t − 1.5)', f: (t) => 2 * S.tri(t - 1.5), T: 3 }
  };
  const DH = {
    e1: { label: 'h(t) = e^(−t) u(t)', f: (t) => (t >= 0 ? Math.exp(-t) : 0) },
    e3: { label: 'h(t) = e^(−3t) u(t)  (s. 73)', f: (t) => (t >= 0 ? Math.exp(-3 * t) : 0) },
    box: { label: 'h(t) = u(t) − u(t − 1)', f: (t) => (t >= 0 && t < 1 ? 1 : 0) }
  };

  SS.labs.decomp = {
    title: 'Girişi impulslara ayır',
    blurb: 'Konvolüsyon integrali nereden geliyor? Girişi ince darbelere böl ve cevapları topla.',
    mount(holder) {
      const L = ui.lab(this.title, 'Giriş, genişliği $\\Delta$ olan dikdörtgenlerle yaklaşıklanır. $k$’ıncı darbe yaklaşık olarak $x(k\\Delta)\\,\\Delta\\,\\delta(t-k\\Delta)$’dır ve LTI sistem buna $x(k\\Delta)\\,\\Delta\\,h(t-k\\Delta)$ ile cevap verir. Bütün cevapları topla: $\\Delta\\to0$ iken toplam integrale, yani $y = x * h$’ye dönüşür.');
      holder.append(L.root);
      const sx = ui.select({ label: 'Giriş', options: Object.keys(DX).map((k) => ({ value: k, label: DX[k].label })), value: 'bump', onChange: draw });
      const sh = ui.select({ label: 'Sistem', options: Object.keys(DH).map((k) => ({ value: k, label: DH[k].label })), value: 'e1', onChange: draw });
      const D = ui.slider({ label: 'Darbe genişliği $\\Delta$', min: 0.1, max: 1, step: 0.05, value: 0.5, fmt: (v) => v.toFixed(2), onInput: draw });
      const K = ui.slider({ label: 'Vurgulanan darbe $k$', min: 0, max: 20, step: 1, value: 2, onInput: draw });
      L.controls.append(sx.el, sh.el, D.el, K.el);
      const c1 = ui.canvas(200), c2 = ui.canvas(250);
      L.body.append(pbox(c1, [['x', 'Giriş $x(t)$'], ['h', 'Vurgulanan darbe']]), pbox(c2, [['h', 'Tek bir darbenin cevabı'], ['muted', 'Diğer darbelerin cevapları'], ['y', 'Gerçek çıkış $y(t)$'], ['accent', 'Cevapların toplamı', true]]));
      let cache = {};
      function draw() {
        const X = DX[sx.get()], H = DH[sh.get()], d = D.get();
        const key = sx.get() + sh.get();
        if (!cache[key]) cache[key] = S.convolveContinuous(X.f, H.f, -1, 10, 0.01);
        const yx = cache[key];
        const nk = Math.ceil(X.T / d - 1e-9);
        K.setRange(0, Math.max(0, nk - 1), 1);
        const k0 = Math.min(K.get(), nk - 1);
        const amp = (k) => X.f(k * d + d / 2);
        const stair = (t) => { if (t < 0) return 0; const k = Math.floor(t / d); return k < nk ? amp(k) : 0; };
        const resp = (k) => (t) => amp(k) * d * H.f(t - k * d);
        const sum = (t) => { let s = 0; for (let k = 0; k < nk; k++) s += amp(k) * d * H.f(t - k * d); return s; };
        const L1 = [{ kind: 'fn', f: stair, color: 'x', fill: true, alpha: 0.15, w: 1.2, n: 2000 }, { kind: 'fn', f: X.f, color: 'x', w: 2.4 },
          { kind: 'fn', f: (t) => (t >= k0 * d && t < (k0 + 1) * d ? amp(k0) : 0), color: 'h', fill: true, alpha: 0.45, w: 0, n: 2000 }];
        SS.plot(c1, { x: [-1, 9], y: [-0.2, Math.max(1.4, X.f(1.5) * 1.3)], h: 200, xLabel: 't', layers: L1 });
        const L2 = [];
        for (let k = 0; k < nk && k < 80; k++) if (k !== k0) L2.push({ kind: 'fn', f: resp(k), color: 'muted', w: 1, opacity: 0.55 });
        L2.push({ kind: 'fn', f: resp(k0), color: 'h', w: 2.4, fill: true, alpha: 0.18 });
        L2.push({ kind: 'fn', f: (t) => yx.at(t), color: 'y', w: 2.6 });
        L2.push({ kind: 'fn', f: sum, color: 'accent', w: 2.2, dash: [6, 4], n: 1200 });
        const ym = Math.max(...Array.from({ length: 200 }, (_, i) => yx.at(-1 + (10 * i) / 200))) * 1.25 || 1;
        SS.plot(c2, { x: [-1, 9], y: [-ym * 0.06, ym], h: 250, xLabel: 't', layers: L2 });
        let err = 0;
        for (let i = 0; i <= 300; i++) { const t = -1 + (10 * i) / 300; err = Math.max(err, Math.abs(sum(t) - yx.at(t))); }
        ui.readout(L.readout, [['Darbe sayısı', String(nk)], ['Vurgulanan darbenin alanı', S.fmt(amp(k0) * d, 3), 'h'], ['Toplam ile gerçek çıkış farkı (en büyük)', S.fmt(err, 3), 'y']], {
          tone: 'info', html: '$\\Delta$’yı küçült: mor kesikli toplam, yeşil gerçek çıkışa yapışır. Toplam, $\\sum_k x(k\\Delta)\\,h(t-k\\Delta)\\,\\Delta$ biçimindeki bir Riemann toplamıdır. Limitte $y(t) = \\int_{-\\infty}^{\\infty} x(\\tau)\\,h(t-\\tau)\\,d\\tau$ olur.' });
      }
      draw();
    }
  };

  /* ===================== Sürekli grafik konvolüsyon ===================== */
  const piece = (a, b, tex, f) => ({ a, b, tex, f });
  const CPRE = {
    s75: {
      label: 'x(t) = u(t), h(t) = 2+t (−2<t<0), 2 (0<t<2)  · s. 75–78',
      x: S.u, h: (t) => (t >= -2 && t < 0 ? 2 + t : t >= 0 && t < 2 ? 2 : 0), move: 'x', xn: 'x(t) = u(t)', hn: 'h(t)',
      t: [-4, 5], tau: [-6, 6], pieces: [piece(-Infinity, -2, '0', () => 0), piece(-2, 0, '0.5t^2 + 2t + 2', (t) => 0.5 * t * t + 2 * t + 2), piece(0, 2, '2(t+1)', (t) => 2 * (t + 1)), piece(2, Infinity, '6', () => 6)]
    },
    s79: {
      label: 'x(t) = e^(−at) u(t), h(t) = u(t), a = 1  · s. 79–80',
      x: (t) => (t >= 0 ? Math.exp(-t) : 0), h: S.u, move: 'h', xn: 'x(t) = e^{-t}u(t)', hn: 'h(t) = u(t)',
      t: [-2, 6], tau: [-4, 7], pieces: [piece(-Infinity, 0, '0', () => 0), piece(0, Infinity, '\\frac{1}{a}(1 - e^{-at}) = 1 - e^{-t}', (t) => 1 - Math.exp(-t))]
    },
    s73: {
      label: 'h(t) = e^(−3t) u(t), x(t) = u(t)  · s. 73',
      x: S.u, h: (t) => (t >= 0 ? Math.exp(-3 * t) : 0), move: 'h', xn: 'x(t) = u(t)', hn: 'h(t) = e^{-3t}u(t)',
      t: [-2, 5], tau: [-3, 6], pieces: [piece(-Infinity, 0, '0', () => 0), piece(0, Infinity, '\\frac{1}{3}(1 - e^{-3t})', (t) => (1 - Math.exp(-3 * t)) / 3)]
    },
    s81: {
      label: 'x₁(t) = t² (0<t<1), x₂(t) = 1 (−1<t<1)  · s. 81–83',
      x: (t) => (t >= 0 && t < 1 ? t * t : 0), h: (t) => (t >= -1 && t < 1 ? 1 : 0), move: 'x', xn: 'x_1(t) = t^2', hn: 'x_2(t)',
      t: [-2.5, 3.5], tau: [-3.5, 3.5], pieces: [piece(-Infinity, -1, '0', () => 0), piece(-1, 0, '\\frac{(t+1)^3}{3}', (t) => Math.pow(t + 1, 3) / 3), piece(0, 1, '\\frac{1}{3}', () => 1 / 3), piece(1, 2, '\\frac{1}{3} - \\frac{(t-1)^3}{3}', (t) => 1 / 3 - Math.pow(t - 1, 3) / 3), piece(2, Infinity, '0', () => 0)]
    },
    rr: {
      label: 'İki dikdörtgen: Π(t − ½) ∗ Π(t − ½)',
      x: (t) => (t >= 0 && t < 1 ? 1 : 0), h: (t) => (t >= 0 && t < 1 ? 1 : 0), move: 'h', xn: 'x(t)', hn: 'h(t)',
      t: [-1.5, 3.5], tau: [-2.5, 3.5], pieces: [piece(-Infinity, 0, '0', () => 0), piece(0, 1, 't', (t) => t), piece(1, 2, '2 - t', (t) => 2 - t), piece(2, Infinity, '0', () => 0)]
    },
    hw78: {
      label: 'x(t) = 1 (0<t<1), y(t) = t (0<t<2)  · ödev s. 78',
      x: (t) => (t >= 0 && t < 1 ? 1 : 0), h: (t) => (t >= 0 && t < 2 ? t : 0), move: 'x', xn: 'x(t)', hn: 'y(t) = t',
      t: [-1.5, 4.5], tau: [-2.5, 4.5], pieces: [piece(-Infinity, 0, '0', () => 0), piece(0, 1, '\\frac{t^2}{2}', (t) => t * t / 2), piece(1, 2, 't - \\frac{1}{2}', (t) => t - 0.5), piece(2, 3, '\\frac{4 - (t-1)^2}{2}', (t) => (4 - Math.pow(t - 1, 2)) / 2), piece(3, Infinity, '0', () => 0)]
    },
    hw84: {
      label: 'x(t) = sin(πt) (0<t<1), y(t) = 1 (0<t<1)  · s. 84',
      x: (t) => (t >= 0 && t < 1 ? Math.sin(Math.PI * t) : 0), h: (t) => (t >= 0 && t < 1 ? 1 : 0), move: 'h', xn: 'x(t) = \\sin\\pi t', hn: 'y(t)',
      t: [-1.5, 3.5], tau: [-2.5, 3.5], pieces: [piece(-Infinity, 0, '0', () => 0), piece(0, 2, '\\frac{1 - \\cos\\pi t}{\\pi}', (t) => (1 - Math.cos(Math.PI * t)) / Math.PI), piece(2, Infinity, '0', () => 0)]
    },
    hw74: {
      label: 'x(t) = r(t) = t u(t), h(t) = u(t)  · ödev s. 74',
      x: S.r, h: S.u, move: 'h', xn: 'x(t) = t\\,u(t)', hn: 'h(t) = u(t)',
      t: [-2, 4], tau: [-3, 5], pieces: [piece(-Infinity, 0, '0', () => 0), piece(0, Infinity, '\\frac{t^2}{2}', (t) => t * t / 2)]
    }
  };

  SS.labs.conv = {
    title: 'Grafik konvolüsyon',
    blurb: 'Çevir, kaydır, çarp, alanı al. Nottaki her konvolüsyon örneği adım adım.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Üstte $\\tau$ ekseni var: biri sabit, diğeri <strong>çevrilmiş ve $t$ kadar kaydırılmış</strong> iki sinyal. Yeşil alan çarpımın integrali, yani o andaki $y(t)$. Alttaki grafik, $t$ ilerledikçe bu alanların çizdiği eğri.');
      holder.append(L.root);
      const pre = ui.select({ label: 'Örnek', options: Object.keys(CPRE).map((k) => ({ value: k, label: CPRE[k].label })), value: opts.preset || 's75', onChange: () => { reset(); } });
      const tS = ui.slider({ label: 'Kaydırma $t$', min: -4, max: 5, step: 0.01, value: -3, fmt: (v) => v.toFixed(2), onInput: () => draw(), wide: true });
      const play = ui.player((dt) => {
        const P = CPRE[pre.get()];
        let v = tS.get() + dt * (P.t[1] - P.t[0]) / 9;
        if (v > P.t[1]) { tS.set(P.t[1], true); draw(); return false; }
        tS.set(v, true); draw();
      }, 'Kaydır');
      const mv = ui.seg({ label: 'Kayan sinyal', options: [{ value: 'h', label: 'h kayar: $x(\\tau)h(t-\\tau)$' }, { value: 'x', label: 'x kayar: $x(t-\\tau)h(\\tau)$' }], value: 'h', onChange: () => draw() });
      L.controls.append(pre.el, mv.el, el('div', { class: 'ctl-row' }, play.el, ui.button('Başa sar', () => { play.stop(); tS.set(CPRE[pre.get()].t[0], true); draw(); }, ''), tS.el));
      const c1 = ui.canvas(230), c2 = ui.canvas(200);
      const leg1 = el('div');
      const pcs = el('div', { class: 'pieces' });
      L.body.append(el('div', { class: 'plot-box' }, el('div', { class: 'plot-cap', html: SS.renderMath('$\\tau$ ekseni: sabit sinyal, kayan sinyal ve çarpımları') }), leg1, c1),
        pbox(c2, [['y', '$y(t) = \\int x(\\tau)h(t-\\tau)d\\tau$'], ['muted', 'tam sonuç', true]]), el('div', null, el('div', { class: 'plot-cap', html: 'Notun parçalı sonucu (etkin aralık vurgulanır)' }), pcs));
      let Y = null;
      function reset() {
        play.stop();
        const P = CPRE[pre.get()];
        Y = S.convolveContinuous(P.x, P.h, Math.min(P.tau[0], P.t[0]) - 4, Math.max(P.tau[1], P.t[1]) + 4, 0.01);
        mv.set(P.move, true);
        tS.setRange(P.t[0], P.t[1], 0.01);
        tS.set(P.t[0], true);
        pcs.innerHTML = '';
        P.pieces.forEach((p) => pcs.append(el('div', { class: 'piece' },
          el('span', { class: 'piece-int', html: SS.renderMath('$' + (p.a === -Infinity ? 't < ' + S.fmt(p.b) : p.b === Infinity ? 't > ' + S.fmt(p.a) : S.fmt(p.a) + ' < t < ' + S.fmt(p.b)).replace(/−/g, '-') + '$') }),
          el('span', { html: SS.renderMath('$y(t) = ' + p.tex + '$') }))));
        SS.fixMath(pcs);
        draw();
      }
      function draw() {
        const P = CPRE[pre.get()];
        const t = tS.get();
        const moveH = mv.get() === 'h';
        const fixed = moveH ? P.x : P.h;
        const moving = moveH ? (tau) => P.h(t - tau) : (tau) => P.x(t - tau);
        const prod = (tau) => fixed(tau) * moving(tau);
        // örtüşme aralığı
        let lo = null, hi = null;
        const [a, b] = P.tau;
        const span = [a - 6, b + 6];
        for (let i = 0; i <= 3000; i++) {
          const tau = span[0] + ((span[1] - span[0]) * i) / 3000;
          if (Math.abs(prod(tau)) > 1e-9) { if (lo === null) lo = tau; hi = tau; }
        }
        const yr = SS.autoY([P.x, P.h, moving], a, b, { pad: 0.15 });
        leg1.innerHTML = '';
        leg1.append(ui.legend(moveH ? [['x', '$x(\\tau)$ (sabit)'], ['h', '$h(t-\\tau)$ (çevrilmiş, $t$ kadar kaymış)'], ['y', 'çarpım alanı = $y(t)$']]
          : [['h', '$h(\\tau)$ (sabit)'], ['x', '$x(t-\\tau)$ (çevrilmiş, $t$ kadar kaymış)'], ['y', 'çarpım alanı = $y(t)$']]));
        SS.fixMath(leg1);
        SS.plot(c1, { x: [a, b], y: yr, h: 230, xLabel: 'τ', xStep: 1, layers: [
          { kind: 'area', f: prod, color: 'y', alpha: 0.35, n: 2400 },
          { kind: 'fn', f: fixed, color: moveH ? 'x' : 'h', n: 2400 },
          { kind: 'fn', f: moving, color: moveH ? 'h' : 'x', n: 2400, w: 2.6 },
          { kind: 'vline', x: t, color: 'accent', label: 't = ' + S.fmt(t, 2) }] });
        const yv = Y.at(t);
        let ymax = 0, ymin = 0;
        for (let i = 0; i <= 400; i++) { const v = Y.at(P.t[0] + ((P.t[1] - P.t[0]) * i) / 400); ymax = Math.max(ymax, v); ymin = Math.min(ymin, v); }
        SS.plot(c2, { x: P.t, y: [ymin - 0.1 * (ymax - ymin + 0.1), ymax * 1.18 + 0.05], h: 200, xLabel: 't', xStep: 1, layers: [
          { kind: 'fn', f: (s) => Y.at(s), color: 'muted', w: 1.2, dash: [5, 4] },
          { kind: 'fn', f: (s) => Y.at(s), color: 'y', to: t, w: 2.6, fill: true, alpha: 0.12 },
          { kind: 'dot', x: t, y: yv, color: 'y', r: 6, ring: true, label: S.fmt(yv, 3) }] });
        const act = P.pieces.findIndex((p) => t >= p.a && t < p.b);
        Array.from(pcs.children).forEach((n, i) => n.classList.toggle('on', i === act));
        const pc = P.pieces[act];
        ui.readout(L.readout, [
          ['$t$', S.fmt(t, 2)],
          ['Örtüşme aralığı', lo === null ? 'yok → $y(t)=0$' : '$' + S.fmt(lo, 2).replace('−', '-') + ' < \\tau < ' + S.fmt(hi, 2).replace('−', '-') + '$', 'h'],
          ['$y(t)$ (sayısal alan)', S.fmt(yv, 4), 'y'],
          ['Notun formülüyle', pc ? S.fmt(pc.f(t), 4) : '—', 'y']
        ], { tone: 'info', html: lo === null ? 'Kayan sinyal henüz sabit sinyale <strong>değmiyor</strong>: çarpım her yerde sıfır, $y(t)=0$.' : 'İntegralin sınırları örtüşme aralığıdır. Notta her yeni aralık, kayan sinyalin bir kenarının sabit sinyalin bir kenarını geçtiği andır. Etkin aralık: <strong>' + (pc ? '$y(t)=' + pc.tex + '$' : '') + '</strong>.' });
      }
      reset();
      if (opts.t != null) { tS.set(opts.t, true); draw(); }
    }
  };

  /* ===================== Ayrık konvolüsyon ===================== */
  const fin = (start, v) => ({ start, v, f: (n) => S.seqAt({ start, v }, n), finite: true });
  const inf = (f, lab) => ({ f, finite: false, lab });
  const DPRE = {
    s93: { label: 'x = δ[n−1]+δ[n−2]+δ[n−3], h = δ[n]+δ[n−1]+δ[n−2]  · s. 93–94', x: fin(1, [1, 1, 1]), h: fin(0, [1, 1, 1]), N: [-2, 8] },
    s95: { label: 'x = {1, 1}, h = {3, 2, 1}  · s. 95', x: fin(0, [1, 1]), h: fin(0, [3, 2, 1]), N: [-2, 6] },
    uu: { label: 'u[n] ∗ u[n] = (n+1)u[n]  · s. 91–92', x: inf(S.dU), h: inf(S.dU), N: [-3, 10], closed: (n) => (n >= 0 ? n + 1 : 0), ctex: '(n+1)u[n]' },
    ua: { label: 'u[n] ∗ aⁿu[n], a = 0.5  · s. 92', x: inf(S.dU), h: inf((n) => (n >= 0 ? Math.pow(0.5, n) : 0)), N: [-3, 10], closed: (n) => (n >= 0 ? (1 - Math.pow(0.5, n + 1)) / 0.5 : 0), ctex: '\\frac{1-a^{n+1}}{1-a}u[n]' },
    s95b: { label: '(0.7)ⁿu[n] ∗ (0.2)ⁿu[n]  · s. 95–96', x: inf((n) => (n >= 0 ? Math.pow(0.7, n) : 0)), h: inf((n) => (n >= 0 ? Math.pow(0.2, n) : 0)), N: [-3, 10], closed: (n) => (n >= 0 ? 2 * (Math.pow(0.7, n + 1) - Math.pow(0.2, n + 1)) : 0), ctex: '2\\left[(0.7)^{n+1} - (0.2)^{n+1}\\right]u[n]' },
    custom: { label: 'Kendi dizilerin…', x: fin(0, [1, 2, 3]), h: fin(0, [1, -1]), N: [-3, 8] }
  };

  SS.labs.dconv = {
    title: 'Ayrık konvolüsyon toplamı',
    blurb: 'h[n−k]’yı kaydır, çarp, topla. Sonlu dizilerde tablo yöntemiyle de kontrol et.',
    mount(holder, opts) {
      const L = ui.lab(this.title, '$y[n] = \\sum_k x[k]\\,h[n-k]$. Her $n$ için $h$’yi çevir ($h[-k]$), $n$ kadar kaydır, $x[k]$ ile noktadan noktaya çarp ve topla.');
      holder.append(L.root);
      const pre = ui.select({ label: 'Örnek', options: Object.keys(DPRE).map((k) => ({ value: k, label: DPRE[k].label })), value: opts.preset || 's93', onChange: () => reset() });
      const xIn = el('input', { type: 'text', value: '1, 2, 3' }), xs = el('input', { type: 'text', value: '0', style: { width: '54px' } });
      const hIn = el('input', { type: 'text', value: '1, -1' }), hs = el('input', { type: 'text', value: '0', style: { width: '54px' } });
      const custom = el('div', { class: 'ctl-row' },
        el('label', { class: 'ctl' }, el('span', { class: 'ctl-label', html: SS.renderMath('$x$ değerleri') }), xIn), el('label', { class: 'ctl' }, el('span', { class: 'ctl-label' }, 'başladığı n'), xs),
        el('label', { class: 'ctl' }, el('span', { class: 'ctl-label', html: SS.renderMath('$h$ değerleri') }), hIn), el('label', { class: 'ctl' }, el('span', { class: 'ctl-label' }, 'başladığı n'), hs));
      [xIn, xs, hIn, hs].forEach((i) => i.addEventListener('input', () => reset(true)));
      const nS = ui.slider({ label: '$n$', min: -3, max: 10, step: 1, value: 0, onInput: () => draw() });
      const play = ui.player((() => { let acc = 0; return (dt) => { acc += dt; if (acc < 0.7) return true; acc = 0; const P = cur(); if (nS.get() >= P.N[1]) return false; nS.set(nS.get() + 1, true); draw(); return true; }; })(), 'Adım adım');
      L.controls.append(pre.el, custom, el('div', { class: 'ctl-row' }, play.el, nS.el));
      const c1 = ui.canvas(170), c2 = ui.canvas(170), c3 = ui.canvas(150), c4 = ui.canvas(190);
      const tblBox = el('div');
      L.body.append(pbox(c1, null, '$x[k]$'), pbox(c2, null, '$h[n-k]$: çevrilmiş ve $n$ kadar kaydırılmış'), pbox(c3, null, 'Çarpım $x[k]\\,h[n-k]$'), pbox(c4, [['y', '$y[n]$ şimdiye kadar'], ['muted', 'tam sonuç']]), tblBox);
      let P0 = null;
      function parse(s) { return s.split(/[,\s;]+/).filter(Boolean).map((v) => S.evalExpr(v)).map((v) => (isFinite(v) ? v : 0)); }
      function cur() {
        const k = pre.get();
        if (k !== 'custom') return DPRE[k];
        const x = fin(parseInt(xs.value, 10) || 0, parse(xIn.value)), h = fin(parseInt(hs.value, 10) || 0, parse(hIn.value));
        const lo = Math.min(x.start + h.start, x.start, h.start) - 2;
        const hi = x.start + x.v.length + h.start + h.v.length;
        return { x, h, N: [lo, Math.max(hi, lo + 6)] };
      }
      function yAt(P, n) {
        if (P.x.finite && P.h.finite) return S.seqAt(S.convolveDiscrete(P.x, P.h), n);
        let s = 0;
        for (let k = -20; k <= 60; k++) s += P.x.f(k) * P.h.f(n - k);
        return s;
      }
      function reset(keepN) {
        play.stop();
        const k = pre.get();
        custom.style.display = k === 'custom' ? '' : 'none';
        P0 = cur();
        nS.setRange(P0.N[0], P0.N[1], 1);
        if (!keepN) nS.set(P0.N[0] + 2, true);
        draw();
      }
      function draw() {
        const P = cur();
        const n = nS.get();
        const [a, b] = [P.N[0] - 3, P.N[1] + 1];
        const ks = [], xv = [], hv = [], pv = [];
        for (let k = a; k <= b; k++) { ks.push(k); xv.push(P.x.f(k)); hv.push(P.h.f(n - k)); pv.push(P.x.f(k) * P.h.f(n - k)); }
        const yr = SS.autoYv([xv, hv]);
        const base = { x: [a - 0.6, b + 0.6], xStep: 1, xLabel: 'k' };
        SS.plot(c1, Object.assign({}, base, { y: yr, h: 170, layers: [{ kind: 'stem', n: ks, v: xv, color: 'x', labels: P.x.finite }] }));
        SS.plot(c2, Object.assign({}, base, { y: yr, h: 170, layers: [{ kind: 'vline', x: n, color: 'accent', label: 'k = n = ' + n }, { kind: 'stem', n: ks, v: hv, color: 'h', labels: P.h.finite }] }));
        SS.plot(c3, Object.assign({}, base, { y: SS.autoYv([pv]), h: 150, layers: [{ kind: 'stem', n: ks, v: pv, color: 'y', labels: true }] }));
        const ns = [], ys = [], yall = [];
        for (let m = P.N[0]; m <= P.N[1]; m++) { const v = yAt(P, m); yall.push(v); if (m <= n) { ns.push(m); ys.push(v); } }
        const allN = Array.from({ length: P.N[1] - P.N[0] + 1 }, (_, i) => P.N[0] + i);
        SS.plot(c4, { x: [P.N[0] - 0.6, P.N[1] + 0.6], xStep: 1, xLabel: 'n', y: SS.autoYv([yall]), h: 190, layers: [
          { kind: 'stem', n: allN, v: yall, color: 'muted', opacity: 0.35, r: 3 },
          { kind: 'stem', n: ns, v: ys, color: 'y', labels: true }] });
        const terms = [];
        ks.forEach((k, i) => { if (Math.abs(pv[i]) > 1e-12) terms.push(S.fmt(xv[i], 3) + '\\cdot' + S.fmt(hv[i], 3)); });
        const yn = yAt(P, n);
        const rows = [['$y[' + n + ']$', terms.length ? '$' + (terms.length > 6 ? terms.slice(0, 5).join(' + ') + ' + \\cdots' : terms.join(' + ')).replace(/−/g, '-') + ' = ' + S.fmt(yn, 4).replace('−', '-') + '$' : '0 (örtüşme yok)', 'y wide']];
        if (P.closed) rows.push(['Kapalı form $' + P.ctex + '$', S.fmt(P.closed(n), 4), 'y']);
        ui.readout(L.readout, rows, null);
        // tablo yöntemi
        tblBox.innerHTML = '';
        if (P.x.finite && P.h.finite && P.x.v.length <= 8 && P.h.v.length <= 8) {
          const t = el('table', { class: 'tbl', style: { width: 'auto' } });
          const head = el('tr', null, el('th', { html: SS.renderMath('$x$ ↓ &nbsp; $h$ →') }), P.h.v.map((v, j) => el('th', { html: SS.renderMath('$h[' + (P.h.start + j) + ']=' + S.fmt(v, 2).replace('−', '-') + '$') })));
          t.append(el('thead', null, head));
          const tb = el('tbody');
          P.x.v.forEach((xv0, i) => {
            const tr = el('tr', null, el('th', { html: SS.renderMath('$x[' + (P.x.start + i) + ']=' + S.fmt(xv0, 2).replace('−', '-') + '$') }));
            P.h.v.forEach((hv0, j) => {
              const on = P.x.start + i + P.h.start + j === n;
              tr.append(el('td', { style: on ? { background: 'var(--hl)', color: 'var(--hl-ink)', fontWeight: '700' } : null }, S.fmt(xv0 * hv0, 3)));
            });
            tb.append(tr);
          });
          t.append(tb);
          tblBox.append(el('div', { class: 'plot-cap', html: SS.renderMath('<strong>Tablo yöntemi:</strong> satır $x$, sütun $h$. İndisleri toplamı $n$ olan hücreler (vurgulu çapraz) toplanınca $y[n]$ çıkar.') }), el('div', { class: 'tbl-wrap' }, t));
          SS.fixMath(tblBox);
        }
      }
      reset();
    }
  };
})();
