/*
 * lab-integral.js — İntegral = işaretli alan. Sınırları kaydır, taralı alanı ve F(b) − F(a) hesabını gör.
 * Alt grafik: üst sınırı değişken integral G(t) = ∫ₐᵗ f(τ)dτ (koşan integral). Konvolüsyona hazırlık.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);
  const PI = Math.PI;

  // f: fonksiyon, F: bir ilkel, tex/Ftex: gösterim. pi: sınırlar π katlarıyla seçilir.
  const FNS = {
    t2: { label: 't²', tex: 't^2', f: (t) => t * t, F: (t) => t ** 3 / 3, Ftex: '\\frac{t^3}{3}', x: [-3, 3], a: 0, b: 2 },
    lin: { label: '3t² − 2t + 1', tex: '3t^2 - 2t + 1', f: (t) => 3 * t * t - 2 * t + 1, F: (t) => t ** 3 - t * t + t, Ftex: 't^3 - t^2 + t', x: [-2, 3], a: 0, b: 2 },
    ex: { label: 'e^(−t)', tex: 'e^{-t}', f: (t) => Math.exp(-t), F: (t) => -Math.exp(-t), Ftex: '-e^{-t}', x: [-1, 6], a: 0, b: 6 },
    e2: { label: '9e^(−2t)  · enerji: 3e^(−t)u(t)', tex: '9e^{-2t}', f: (t) => 9 * Math.exp(-2 * t), F: (t) => -4.5 * Math.exp(-2 * t), Ftex: '-\\frac{9}{2}e^{-2t}', x: [-0.5, 4], a: 0, b: 4 },
    cos: { label: 'cos t', tex: '\\cos t', f: Math.cos, F: Math.sin, Ftex: '\\sin t', x: [-2 * PI, 2 * PI], a: 0, b: 2 * PI, pi: true },
    sin: { label: 'sin t', tex: '\\sin t', f: Math.sin, F: (t) => -Math.cos(t), Ftex: '-\\cos t', x: [-2 * PI, 2 * PI], a: 0, b: PI, pi: true },
    cos2: { label: 'cos² t  · gücün kaynağı', tex: '\\cos^2 t', f: (t) => Math.cos(t) ** 2, F: (t) => t / 2 + Math.sin(2 * t) / 4, Ftex: '\\frac{t}{2} + \\frac{\\sin 2t}{4}', x: [-2 * PI, 2 * PI], a: 0, b: 2 * PI, pi: true },
    tex: { label: 't·e^(−t)  · kısmi integrasyon', tex: 't\\,e^{-t}', f: (t) => t * Math.exp(-t), F: (t) => -(t + 1) * Math.exp(-t), Ftex: '-(t+1)e^{-t}', x: [-0.5, 8], a: 0, b: 8 },
    odd: { label: 't³ (tek fonksiyon)', tex: 't^3', f: (t) => t ** 3, F: (t) => t ** 4 / 4, Ftex: '\\frac{t^4}{4}', x: [-2, 2], a: -1.5, b: 1.5 },
    step: { label: 'u(t) − u(t − 2)  · darbe', tex: 'u(t) - u(t-2)', f: (t) => (t >= 0 && t < 2 ? 1 : 0), F: (t) => Math.min(Math.max(t, 0), 2), Ftex: '\\begin{cases}0 & t<0\\\\ t & 0<t<2\\\\ 2 & t>2\\end{cases}', x: [-2, 4], a: -2, b: 4 }
  };

  const fmtB = (v, pi) => {
    if (!pi) return S.fmt(v, 2);
    const k = Math.round((v / PI) * 4);
    if (k === 0) return '0';
    const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
    const d = g(k, 4), n = k / d, q = 4 / d;
    const num = (n < 0 ? '-' : '') + (Math.abs(n) === 1 ? '' : Math.abs(n)) + '\\pi';
    return q === 1 ? num : (n < 0 ? '-' : '') + '\\frac{' + (Math.abs(n) === 1 ? '' : Math.abs(n)) + '\\pi}{' + q + '}';
  };

  SS.labs.integral = {
    title: 'İntegral = işaretli alan',
    blurb: 'Sınırları kaydır: taralı alan, F(b) − F(a) hesabı ve üst sınırı değişken integral aynı anda değişir.',
    mount(holder) {
      const L = ui.lab(this.title, 'Eksenin <strong>üstündeki</strong> alan artı, <strong>altındaki</strong> alan eksi sayılır. Belirli integral $\\int_a^b f\\,dt = F(b) - F(a)$, yani ilkelin iki uçtaki farkıdır. Alttaki grafik, üst sınır $t$ olarak bırakılırsa ortaya çıkan $G(t) = \\int_a^t f(\\tau)\\,d\\tau$ fonksiyonudur: sağdaki dikey çizgide $G$’nin değeri tam olarak üstteki taralı alandır.');
      holder.append(L.root);
      let P = FNS.t2;
      const fsel = ui.select({ label: 'Fonksiyon $f(t)$', options: Object.keys(FNS).map((k) => ({ value: k, label: FNS[k].label })), value: 't2', onChange: (k) => { P = FNS[k]; setup(); } });
      const sa = ui.slider({ label: 'Alt sınır $a$', min: 0, max: 1, step: 0.05, value: 0, fmt: (v) => '$' + fmtB(v, P.pi) + '$', onInput: draw });
      const sb = ui.slider({ label: 'Üst sınır $b$', min: 0, max: 1, step: 0.05, value: 1, fmt: (v) => '$' + fmtB(v, P.pi) + '$', onInput: draw });
      L.controls.append(fsel.el, el('div', { class: 'ctl-row' }, sa.el, sb.el));
      const c1 = ui.canvas(220), c2 = ui.canvas(170);
      L.body.append(pbox(c1, [['y', 'pozitif alan'], ['warn', 'negatif alan']], 'İntegrand $f(t)$'), pbox(c2, [['h', 'G(t) = ∫ₐᵗ f(τ)dτ']], 'Üst sınırı değişken integral'));

      function setup() {
        const st = P.pi ? PI / 4 : 0.05;
        const hi = P.x[1] + st * 1e-3; // kayan nokta: son adım (örn. 2π) aralığın dışına düşmesin
        sa.setRange(P.x[0], hi, st); sb.setRange(P.x[0], hi, st);
        sa.set(P.a, true); sb.set(P.b, true);
        draw();
      }
      function draw() {
        const a = sa.get(), b = sb.get();
        const lo = Math.min(a, b), hi = Math.max(a, b);
        const pos = (t) => Math.max(P.f(t), 0), neg = (t) => Math.min(P.f(t), 0);
        const yr = SS.autoY([P.f], P.x[0], P.x[1], { pad: 0.15 });
        SS.plot(c1, { x: P.x, y: yr, h: 220, xLabel: 't', piTicks: !!P.pi, xStep: P.pi ? PI / 2 : undefined, layers: [
          { kind: 'area', f: pos, from: lo, to: hi, color: 'y', alpha: 0.3, n: 2000 },
          { kind: 'area', f: neg, from: lo, to: hi, color: 'warn', alpha: 0.3, n: 2000 },
          { kind: 'fn', f: P.f, color: 'x', n: 2000 },
          { kind: 'vline', x: a, color: 'muted', label: 'a' }, { kind: 'vline', x: b, color: 'muted', label: 'b' }] });
        const G = (t) => P.F(t) - P.F(a);
        const gy = SS.autoY([G], P.x[0], P.x[1], { pad: 0.15 });
        SS.plot(c2, { x: P.x, y: gy, h: 170, xLabel: 't', piTicks: !!P.pi, xStep: P.pi ? PI / 2 : undefined, layers: [
          { kind: 'hline', y: 0, color: 'muted' },
          { kind: 'fn', f: G, color: 'h', n: 2000 },
          { kind: 'vline', x: b, color: 'muted', label: 'b' },
          { kind: 'dot', x: b, y: G(b), color: 'h' }] });
        const val = P.F(b) - P.F(a);
        const A = '\\left.' + P.Ftex + '\\right|_{' + fmtB(a, P.pi) + '}^{' + fmtB(b, P.pi) + '}';
        const isCases = P.Ftex.startsWith('\\begin');
        const rows = [
          ['İlkel $F(t)$', '$' + P.Ftex + '$'],
          ['Kontrol', '$F\'(t) = ' + P.tex + '$ olmalı'],
          ['Belirli integral', '$\\int_{' + fmtB(a, P.pi) + '}^{' + fmtB(b, P.pi) + '}' + P.tex + '\\,dt = ' + (isCases ? '' : A + ' = ') + 'F(b) - F(a) = ' + S.fmt(val, 4) + '$', 'wide']];
        let note = '';
        if (b < a) note = 'Üst sınır alttan küçük: integralin işareti değişir, $\\int_a^b = -\\int_b^a$.';
        else if (P === FNS.cos || P === FNS.sin) note = Math.abs(val) < 1e-9 ? 'Pozitif ve negatif alanlar birbirini götürdü. Tam periyot ($2\\pi$) üzerinde $\\sin$ ve $\\cos$’un integrali her zaman 0’dır.' : 'Bir tam periyot seç ($2\\pi$ uzunluk): alanlar birbirini götürür.';
        else if (P === FNS.cos2) note = 'Bir periyot ($\\pi$) veya $2\\pi$ üzerinde ortalama değer: $\\frac{1}{b-a}\\int = ' + S.fmt(val / (b - a || 1), 4) + '$. Tam periyotlarda tam olarak $\\frac12$ çıkar. Sinüsün gücünün $A^2/2$ olmasının sebebi bu.';
        else if (P === FNS.odd) note = Math.abs(a + b) < 1e-9 ? 'Simetrik aralıkta ($-c$’den $c$’ye) tek fonksiyonun integrali 0’dır: sağdaki alan soldakini götürür.' : 'Sınırları simetrik yap ($a = -b$): tek fonksiyonun integrali 0 olur.';
        else if (P === FNS.ex || P === FNS.e2 || P === FNS.tex) note = 'Üst sınırı büyüttükçe $G(t)$ sabit bir değere yerleşir: $\\int_0^\\infty$ sonludur, çünkü $e^{-t} \\to 0$. Bu, sinyalin <strong>enerjisinin sonlu</strong> olmasının integral karşılığıdır.';
        else if (P === FNS.step) note = 'Darbenin koşan integrali rampadır, sonra düzleşir: $G(t) = r(t) - r(t-2)$. Basamaklar sınırları keser: $\\int_{-\\infty}^{\\infty}[u(t) - u(t-2)]\\,dt = \\int_0^2 1\\,dt = 2$.';
        ui.readout(L.readout, rows, note ? { tone: 'info', html: note } : null);
      }
      setup();
    }
  };
})();
