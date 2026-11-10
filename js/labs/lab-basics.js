/*
 * lab-basics.js — Temel sürekli ve ayrık sinyaller
 *   basics  : δ'nın limit olarak doğuşu, elek özelliği, Π/Λ, basamaklarla inşa, üstel ve döner fazör
 *   dbasics : ayrık dizileri δ[n−k] toplamı olarak yazma (tıkla-çiz), temel diziler galerisi
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);
  const sgn = (v) => (v < 0 ? ' - ' : ' + ');
  const num = (v) => S.fmt(Math.abs(v), 2);

  SS.labs.basics = {
    title: 'Temel sürekli sinyaller',
    blurb: 'δ(t) nereden çıkar, elek özelliği nasıl çalışır, Π ve Λ nasıl kaydırılır, basamaklarla sinyal nasıl kurulur?',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Her sekme bir temel sinyali kurcalamak için.');
      holder.append(L.root);
      const tabs = ui.tabs(['δ(t) nereden çıkar?', 'Elek özelliği', 'Π ve Λ', 'Basamaklarla inşa', 'Üstel ve $e^{j\\omega t}$'], (i) => show(i));
      L.root.insertBefore(tabs.el, L.controls);
      let stopAnim = null;
      function show(i) {
        if (stopAnim) { stopAnim(); stopAnim = null; }
        L.controls.innerHTML = ''; L.body.innerHTML = ''; L.readout.innerHTML = '';
        [deltaTab, siftTab, rectTab, stepTab, expTab][i]();
        SS.fixMath(L.root);
      }

      /* --- δ limit --- */
      function deltaTab() {
        const eps = ui.slider({ label: 'Darbe genişliği $\\varepsilon$', min: 0.05, max: 2, step: 0.05, value: 1, fmt: (v) => v.toFixed(2), onInput: draw });
        L.controls.append(eps.el);
        const c1 = ui.canvas(200), c2 = ui.canvas(200);
        L.body.append(el('div', { class: 'plot-grid' },
          pbox(c1, null, 'Darbe $\\frac{1}{\\varepsilon}\\Pi(t/\\varepsilon)$: alanı her zaman 1'),
          pbox(c2, null, 'Darbenin integrali: rampadan basamağa')));
        function draw() {
          const e = eps.get();
          const p = (t) => (Math.abs(t) < e / 2 ? 1 / e : 0);
          const I = (t) => (t < -e / 2 ? 0 : t > e / 2 ? 1 : (t + e / 2) / e);
          SS.plot(c1, { x: [-2, 2], y: [-0.5, 10.5], h: 200, xLabel: 't', layers: [{ kind: 'fn', f: p, color: 'h', fill: true, n: 1600 }, { kind: 'text', x: e / 2 + 0.1, y: Math.min(1 / e, 9.5), text: 'yükseklik 1/ε = ' + S.fmt(1 / e, 2), color: 'h' }] });
          SS.plot(c2, { x: [-2, 2], y: [-0.2, 1.4], h: 200, xLabel: 't', layers: [{ kind: 'fn', f: S.u, color: 'muted', dash: [5, 4], w: 1.4 }, { kind: 'fn', f: I, color: 'x', n: 1600 }] });
          ui.readout(L.readout, [['Genişlik', S.fmt(e, 2)], ['Yükseklik', S.fmt(1 / e, 2)], ['Alan', '1', 'y']], {
            tone: 'info', html: '$\\varepsilon \\to 0$ iken darbe sonsuz ince ve sonsuz yüksek olur, alanı yine 1 kalır. Bu limit $\\delta(t)$’dir. Sağdaki integral de keskin bir basamağa dönüşür: $\\int_{-\\infty}^{t}\\delta(\\tau)d\\tau = u(t)$, yani $\\delta(t) = \\frac{du(t)}{dt}$.' });
        }
        draw();
      }

      /* --- elek --- */
      const PHI = {
        a: { label: '∫ sin(3t)·δ(t − π/2) dt  · s. 36a', f: (t) => Math.sin(3 * t), tex: '\\sin 3t', a0: Math.PI / 2, r: [-1, 4] },
        b: { label: '∫ t⁴·δ(t − 2) dt  · s. 36b', f: (t) => Math.pow(t, 4), tex: 't^4', a0: 2, r: [-1, 3], ymax: 30 },
        c: { label: '∫ sin(t³ + π/2)·δ(t) dt  · ödev s. 36', f: (t) => Math.sin(Math.pow(t, 3) + Math.PI / 2), tex: '\\sin(t^3+\\frac{\\pi}{2})', a0: 0, r: [-2, 2] },
        d: { label: '∫₀¹⁰ (t² + 4t − 2)·δ(t − 1) dt  · ödev s. 36', f: (t) => t * t + 4 * t - 2, tex: 't^2+4t-2', a0: 1, r: [-1, 11], lim: [0, 10], ymax: 150 }
      };
      function siftTab() {
        const pre = ui.select({ label: 'İntegral', options: Object.keys(PHI).map((k) => ({ value: k, label: PHI[k].label })), value: 'a', onChange: () => { const p = PHI[pre.get()]; a.setRange(p.r[0], p.r[1], 0.05); a.set(p.a0); } });
        const a = ui.slider({ label: 'İmpulsun yeri $t_0$', min: -1, max: 4, step: 0.05, value: Math.PI / 2, fmt: (v) => S.fmtPi(v, { digits: 2 }), onInput: draw });
        L.controls.append(pre.el, a.el);
        const c = ui.canvas(240);
        L.body.append(pbox(c, [['x', '$\\varphi(t)$'], ['h', '$\\delta(t-t_0)$'], ['y', 'sonuç $\\varphi(t_0)$']]));
        function draw() {
          const p = PHI[pre.get()];
          const t0 = a.get();
          const inside = !p.lim || (t0 > p.lim[0] && t0 < p.lim[1]);
          const val = inside ? p.f(t0) : 0;
          const ymax = p.ymax || 1.6;
          const layers = [];
          if (p.lim) layers.push({ kind: 'band', from: p.lim[0], to: p.lim[1], color: 'y', alpha: 0.06, label: 'integral sınırları' });
          layers.push({ kind: 'fn', f: p.f, color: 'x' });
          layers.push({ kind: 'impulse', at: t0, amp: ymax * 0.55, color: 'h', label: 'δ(t − t₀)' });
          layers.push({ kind: 'vline', x: t0, color: 'h', dash: [3, 3] });
          layers.push({ kind: 'dot', x: t0, y: p.f(t0), color: 'y', r: 6, ring: true, label: 'φ(t₀) = ' + S.fmt(p.f(t0), 3) });
          SS.plot(c, { x: p.r, y: [-ymax * (p.ymax ? 0.15 : 1), ymax], h: 240, xLabel: 't', layers });
          ui.readout(L.readout, [['$t_0$', S.fmtPi(t0, { digits: 3 })], ['$\\int \\varphi(t)\\,\\delta(t-t_0)\\,dt$', S.fmt(val, 4), 'y']], {
            tone: inside ? 'ok' : 'bad',
            html: inside ? 'δ, integralin içinden yalnızca $t=t_0$ anını “eler”: integralin sonucu $\\varphi(t_0)$ olur. Notun cevabını görmek için kaydırıcıyı başlangıç değerine getir.'
              : 'İmpuls integral sınırlarının <strong>dışında</strong> kaldı. Elenecek bir nokta yok, sonuç 0. Ödevde $\\int_0^{10}$ sınırına bu yüzden dikkat et.'
          });
        }
        a.setRange(-1, 4, 0.05);
        draw();
      }

      /* --- Π / Λ --- */
      function rectTab() {
        const kind = ui.seg({ label: 'Fonksiyon', options: [{ value: 'P', label: '$A\\,\\Pi\\!\\left(\\frac{t-c}{\\tau}\\right)$' }, { value: 'L', label: '$A\\,\\Lambda\\!\\left(\\frac{t-c}{\\tau}\\right)$' }], value: 'P', onChange: draw });
        const A = ui.slider({ label: 'Genlik $A$', min: -5, max: 5, step: 0.5, value: 3, fmt: (v) => S.fmt(v, 1), onInput: draw });
        const C = ui.slider({ label: 'Merkez $c$', min: -4, max: 6, step: 0.5, value: 4, fmt: (v) => S.fmt(v, 1), onInput: draw });
        const W = ui.slider({ label: 'Ölçek $\\tau$', min: 0.5, max: 5, step: 0.5, value: 2, fmt: (v) => S.fmt(v, 1), onInput: draw });
        const pre = ui.select({ label: 'Nottaki örnekler', options: [
          { value: '', label: 'Seç…' }, { value: 'P,3,4,2', label: '3Π((t−4)/2)  · s. 39a' }, { value: 'L,2,3,2', label: '2Λ((t−3)/2)  · s. 39b' },
          { value: 'P,5,2,4', label: '5Π((t−2)/4)  · ödev s. 40a' }, { value: 'L,3,2,3', label: '3Λ((t−2)/3)  · ödev s. 40b' }],
        value: '', onChange: (v) => { if (!v) return; const [k, a, c, w] = v.split(','); kind.set(k, true); A.set(+a, true); C.set(+c, true); W.set(+w, true); draw(); } });
        L.controls.append(kind.el, pre.el, el('div', { class: 'ctl-row' }, A.el, C.el, W.el));
        const cv = ui.canvas(230);
        L.body.append(pbox(cv));
        function draw() {
          const k = kind.get(), a = A.get(), c = C.get(), w = W.get();
          const f = k === 'P' ? (t) => a * S.rect((t - c) / w) : (t) => a * S.tri((t - c) / w);
          const ext = k === 'P' ? w / 2 : w;
          SS.plot(cv, { x: [-6, 10], y: [Math.min(-1, a * 1.25), Math.max(1, a * 1.25)], h: 230, xLabel: 't', xStep: 1, layers: [
            { kind: 'fn', f: k === 'P' ? S.rect : S.tri, color: 'muted', dash: [4, 4], w: 1.3 },
            { kind: 'fn', f, color: 'x', fill: true, alpha: 0.14, n: 2000 },
            { kind: 'vline', x: c - ext, color: 'h', label: S.fmt(c - ext, 2) }, { kind: 'vline', x: c + ext, color: 'h', label: S.fmt(c + ext, 2) }] });
          const P = k === 'P'
            ? '$' + S.fmt(a, 1) + '\\,\\Pi\\!\\left(\\frac{t-' + S.fmt(c, 1) + '}{' + S.fmt(w, 1) + '}\\right) = \\begin{cases} ' + S.fmt(a, 1) + ' & ' + S.fmt(c - ext, 2) + ' < t < ' + S.fmt(c + ext, 2) + ' \\\\ 0 & \\text{diğer yerlerde} \\end{cases}$'
            : '$' + S.fmt(a, 1) + '\\,\\Lambda\\!\\left(\\frac{t-' + S.fmt(c, 1) + '}{' + S.fmt(w, 1) + '}\\right) = \\begin{cases} ' + S.fmt(a, 1) + '\\left(1+\\frac{t-' + S.fmt(c, 1) + '}{' + S.fmt(w, 1) + '}\\right) & ' + S.fmt(c - w, 2) + ' < t < ' + S.fmt(c, 2) + ' \\\\ ' + S.fmt(a, 1) + '\\left(1-\\frac{t-' + S.fmt(c, 1) + '}{' + S.fmt(w, 1) + '}\\right) & ' + S.fmt(c, 2) + ' < t < ' + S.fmt(c + w, 2) + ' \\\\ 0 & \\text{diğer yerlerde} \\end{cases}$';
          ui.readout(L.readout, [['Tanım', P, 'wide']], { tone: 'info', html: 'Kesikli çizgi standart ' + (k === 'P' ? '$\\Pi(t)$ (genişlik 1)' : '$\\Lambda(t)$ (taban 2)') + '. Kural: içerideki ifade $\\frac{t-c}{\\tau}$, ' + (k === 'P' ? '$-\\frac12$ ile $\\frac12$ arasında' : '$-1$ ile $1$ arasında') + ' olduğu sürece sinyal sıfırdan farklıdır. Bu eşitsizliği $t$ için çöz: ' + (k === 'P' ? 'genişlik $\\tau$' : 'taban $2\\tau$') + ', merkez $c$.' });
        }
        draw();
      }

      /* --- basamaklarla inşa --- */
      function stepTab() {
        let terms = [{ A: 10, t0: 2, ty: 'u' }, { A: -10, t0: 5, ty: 'u' }];
        const pre = ui.select({ label: 'Hazır', options: [
          { value: 'v', label: 'v(t) = 10[u(t−2) − u(t−5)]  · s. 37' },
          { value: 'i', label: 'i(t): 10 (0<t<2), −10 (2<t<4)  · ödev s. 38' },
          { value: 'tr', label: 'Üçgen: r(t) − 2r(t−1) + r(t−2)' },
          { value: 'pi', label: 'Π(t) = u(t+½) − u(t−½)  · s. 31' }], value: 'v', onChange: (v) => {
          terms = { v: [{ A: 10, t0: 2, ty: 'u' }, { A: -10, t0: 5, ty: 'u' }], i: [{ A: 10, t0: 0, ty: 'u' }, { A: -20, t0: 2, ty: 'u' }, { A: 10, t0: 4, ty: 'u' }],
            tr: [{ A: 1, t0: 0, ty: 'r' }, { A: -2, t0: 1, ty: 'r' }, { A: 1, t0: 2, ty: 'r' }], pi: [{ A: 1, t0: -0.5, ty: 'u' }, { A: -1, t0: 0.5, ty: 'u' }] }[v];
          buildRows(); draw();
        } });
        const op = ui.seg({ label: 'Alttaki grafik', options: [{ value: 'd', label: 'Türev $d/dt$' }, { value: 'i', label: 'İntegral $\\int$' }], value: 'd', onChange: () => draw() });
        const rows = el('div', { class: 'ctl-row' });
        L.controls.append(pre.el, op.el, rows);
        const c1 = ui.canvas(200), c2 = ui.canvas(200);
        L.body.append(pbox(c1, null, 'Kurulan sinyal'), pbox(c2, null, 'Türevi / integrali'));
        function buildRows() {
          rows.innerHTML = '';
          terms.forEach((tm, i) => {
            const A = el('input', { type: 'text', value: tm.A, style: { width: '64px' } });
            const T = el('input', { type: 'text', value: tm.t0, style: { width: '64px' } });
            const ty = el('select', null, el('option', { value: 'u' }, 'u'), el('option', { value: 'r' }, 'r'));
            ty.value = tm.ty;
            const upd = () => { tm.A = S.evalExpr(A.value) || 0; tm.t0 = S.evalExpr(T.value) || 0; tm.ty = ty.value; draw(); };
            A.addEventListener('input', upd); T.addEventListener('input', upd); ty.addEventListener('change', upd);
            rows.append(el('span', { class: 'ctl', style: { flexDirection: 'row', alignItems: 'center', gap: '4px' } }, A, el('span', null, '·'), ty, el('span', null, '(t −'), T, el('span', null, ')'),
              ui.button('✕', () => { terms.splice(i, 1); buildRows(); draw(); }, 'btn-quiet')));
          });
          if (terms.length < 6) rows.append(ui.button('+ terim', () => { terms.push({ A: 1, t0: 0, ty: 'u' }); buildRows(); draw(); }, ''));
        }
        function draw() {
          const f = (t) => terms.reduce((s, m) => s + m.A * (m.ty === 'u' ? S.u(t - m.t0) : S.r(t - m.t0)), 0);
          const yr = SS.autoY([f], -2, 8);
          SS.plot(c1, { x: [-2, 8], y: yr, h: 200, xLabel: 't', xStep: 1, layers: [{ kind: 'fn', f, color: 'x', fill: true, alpha: 0.12, n: 2000 }] });
          const L2 = [];
          let g;
          if (op.get() === 'd') {
            g = (t) => terms.reduce((s, m) => s + (m.ty === 'r' ? m.A * S.u(t - m.t0) : 0), 0);
            L2.push({ kind: 'fn', f: g, color: 'y', n: 2000 });
            terms.filter((m) => m.ty === 'u' && m.A).forEach((m) => L2.push({ kind: 'impulse', at: m.t0, amp: Math.sign(m.A) * Math.max(1, Math.abs(yr[1]) * 0.6), color: 'h', label: S.fmt(m.A, 2) + 'δ(t' + (m.t0 ? (m.t0 > 0 ? '−' : '+') + S.fmt(Math.abs(m.t0), 2) : '') + ')' }));
          } else {
            g = (t) => terms.reduce((s, m) => s + m.A * (m.ty === 'u' ? S.r(t - m.t0) : (t > m.t0 ? Math.pow(t - m.t0, 2) / 2 : 0)), 0);
            L2.push({ kind: 'fn', f: g, color: 'y', fill: true, alpha: 0.12, n: 2000 });
          }
          const y2 = op.get() === 'd' ? [Math.min(yr[0], -Math.abs(yr[1]) * 0.75), Math.max(yr[1], 1)] : SS.autoY([g], -2, 8);
          SS.plot(c2, { x: [-2, 8], y: y2, h: 200, xLabel: 't', xStep: 1, layers: L2 });
          const expr = terms.map((m, i) => (i === 0 ? (m.A < 0 ? '-' : '') : sgn(m.A)) + num(m.A) + (m.ty === 'u' ? 'u' : 'r') + '(t' + (m.t0 ? (m.t0 > 0 ? '-' : '+') + num(m.t0) : '') + ')').join('');
          const dexpr = terms.map((m, i) => (i === 0 ? (m.A < 0 ? '-' : '') : sgn(m.A)) + num(m.A) + (m.ty === 'u' ? '\\delta' : 'u') + '(t' + (m.t0 ? (m.t0 > 0 ? '-' : '+') + num(m.t0) : '') + ')').join('');
          ui.readout(L.readout, [['Sinyal', '$x(t) = ' + (expr || '0') + '$', 'wide'], ['Türevi', '$\\frac{dx}{dt} = ' + (dexpr || '0') + '$', 'wide']], {
            tone: 'info', html: op.get() === 'd' ? 'Her sıçrama türevde bir impulsa dönüşür. İmpulsun alanı sıçramanın miktarıdır: $\\frac{d}{dt}u(t-t_0) = \\delta(t-t_0)$. Rampanın türevi ise basamaktır.' : 'İntegral alır: $\\int u = r$ (rampa) ve $\\int r = \\frac{t^2}{2}u(t)$. Pozitif bölge birikir, negatif bölge geri alır.' });
        }
        buildRows();
        draw();
      }

      /* --- üstel ve fazör --- */
      function expTab() {
        const a = ui.slider({ label: 'Üs $a$ (gerçel)', min: -1.5, max: 1.5, step: 0.05, value: -0.5, fmt: (v) => S.fmt(v, 2), onInput: () => drawExp() });
        const w = ui.slider({ label: 'Açısal frekans $\\omega$', min: 0.5, max: 4, step: 0.1, value: 1.5, fmt: (v) => S.fmt(v, 1) + ' rad/s', onInput: () => drawPh() });
        const play = ui.player(tick, 'Döndür');
        L.controls.append(a.el, w.el, play.el);
        const c0 = ui.canvas(180), cc = ui.canvas(230), cs = ui.canvas(230);
        L.body.append(pbox(c0, null, '$x(t) = e^{at}$: $a>0$ büyür, $a<0$ söner'),
          el('div', { class: 'plot-grid' }, pbox(cc, null, '$e^{j\\omega t}$ birim çember üzerinde döner'), pbox(cs, [['x', '$\\cos\\omega t$ (gerçel kısım)'], ['h', '$\\sin\\omega t$ (sanal kısım)']])));
        let T = 0;
        function drawExp() {
          const av = a.get();
          SS.plot(c0, { x: [-4, 4], y: [-0.3, 6], h: 180, xLabel: 't', layers: [{ kind: 'fn', f: (t) => Math.exp(av * t), color: 'x', fill: true, alpha: 0.12 }, { kind: 'dot', x: 0, y: 1, color: 'h', label: 'A = 1' }] });
        }
        function drawPh() {
          const om = w.get();
          const circ = [];
          for (let k = 0; k <= 100; k++) circ.push([Math.cos((2 * Math.PI * k) / 100), Math.sin((2 * Math.PI * k) / 100)]);
          const cx = Math.cos(om * T), sy = Math.sin(om * T);
          const W = cc.clientWidth || 300, H = 230;
          const sx = 1.35 * (W - 46) / (H - 36);
          SS.plot(cc, { x: [-sx, sx], y: [-1.35, 1.35], h: H, xLabel: 'Re', yLabel: 'Im', xStep: 1, yStep: 1, layers: [
            { kind: 'poly', pts: circ, color: 'muted', w: 1.2 },
            { kind: 'poly', pts: [[0, 0], [cx, sy]], color: 'y', w: 2.2 },
            { kind: 'poly', pts: [[cx, 0], [cx, sy]], color: 'h', w: 1.4 },
            { kind: 'poly', pts: [[0, 0], [cx, 0]], color: 'x', w: 3 },
            { kind: 'dot', x: cx, y: sy, color: 'y', r: 6, label: 'ωt = ' + S.fmt(((om * T) % (2 * Math.PI)), 2) + ' rad' }] });
          SS.plot(cs, { x: [0, 10], y: [-1.3, 1.3], h: 230, xLabel: 't', layers: [
            { kind: 'fn', f: (t) => Math.cos(om * t), color: 'x', to: Math.min(10, T) },
            { kind: 'fn', f: (t) => Math.sin(om * t), color: 'h', to: Math.min(10, T) },
            { kind: 'fn', f: (t) => Math.cos(om * t), color: 'x', opacity: 0.2, w: 1 },
            { kind: 'fn', f: (t) => Math.sin(om * t), color: 'h', opacity: 0.2, w: 1 },
            { kind: 'vline', x: T % 10, color: 'y' }] });
          ui.readout(L.readout, [['$e^{j\\omega t}$', '$' + S.fmt(cx, 2) + (sy < 0 ? ' - ' : ' + ') + 'j\\,' + S.fmt(Math.abs(sy), 2) + '$'], ['Periyot $T = 2\\pi/\\omega$', S.fmt((2 * Math.PI) / om, 3) + ' s'], ['$|e^{j\\omega t}|$', '1 (her zaman)', 'y']],
            { tone: 'info', html: 'Euler: $e^{j\\omega t} = \\cos\\omega t + j\\sin\\omega t$. Nokta çember üzerinde sabit hızla döner. İzdüşümleri kosinüs ve sinüsü çizer. Genliği hep 1 olduğu için $|x|^2 = 1$ ve bu sinyal bir güç sinyalidir.' });
        }
        function tick(dt) { T += dt * 1.2; if (T > 10) T = 0; drawPh(); }
        drawExp(); drawPh();
        stopAnim = () => play.stop();
      }

      show(opts.tab || 0);
      if (opts.tab) tabs.set(opts.tab, true);
    }
  };

  /* ===================== Ayrık temel diziler ===================== */
  SS.labs.dbasics = {
    title: 'Ayrık diziler: δ ile yaz',
    blurb: 'Grafiğe tıklayıp dizi çiz; ifadesi δ[n−k] toplamı olarak anında yazılsın.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Her ayrık dizi, kaydırılmış impulsların ağırlıklı toplamıdır: $x[n] = \\sum_k x[k]\\,\\delta[n-k]$. Grafiğe tıkla veya sürükle: o noktadaki örneğin değeri değişir.');
      holder.append(L.root);
      const tabs = ui.tabs(['Tıkla ve çiz', 'Temel diziler'], (i) => show(i));
      L.root.insertBefore(tabs.el, L.controls);
      const N0 = -5, N1 = 8;
      let vals = {};
      const PRE = {
        s45a: { label: 'x[n] = δ[n] + 2δ[n−3]  · s. 45', v: { 0: 1, 3: 2 } },
        s45b: { label: 'y[n] = δ[n+2] + 2δ[n+1] + 3δ[n] + 2δ[n−2]  · s. 45', v: { '-2': 1, '-1': 2, 0: 3, 2: 2 } },
        s53: { label: 'Sinyal işlemleri dersindeki dizi  · s. 53', v: { 0: 3, 1: 3, 2: 2, 3: 1, 4: 1 } },
        win: { label: 'u[n] − u[n−4] (pencere)', v: { 0: 1, 1: 1, 2: 1, 3: 1 } },
        clr: { label: 'Temizle', v: {} }
      };
      function show(i) { L.controls.innerHTML = ''; L.body.innerHTML = ''; L.readout.innerHTML = ''; (i === 0 ? drawTab : galTab)(); SS.fixMath(L.root); }
      function drawTab() {
        const pre = ui.select({ label: 'Hazır dizi', options: Object.keys(PRE).map((k) => ({ value: k, label: PRE[k].label })), value: 's45a', onChange: (k) => { vals = Object.assign({}, PRE[k].v); draw(); } });
        L.controls.append(pre.el);
        const cv = ui.canvas(240);
        cv.style.cursor = 'crosshair';
        cv.style.touchAction = 'none';
        L.body.append(pbox(cv, null, 'Tıkla / sürükle: değer −3 ile 4 arasında tam sayı'));
        vals = Object.assign({}, PRE.s45a.v);
        let drag = false;
        const pick = (e) => {
          const m = cv._map; if (!m) return;
          const r = cv.getBoundingClientRect();
          const px = e.clientX - r.left, py = e.clientY - r.top;
          const n = Math.round(m.x0 + ((px - m.M.l) / m.pw) * (m.x1 - m.x0));
          const v = Math.max(-3, Math.min(4, Math.round(m.y0 + (1 - (py - m.M.t) / m.ph) * (m.y1 - m.y0))));
          if (n < N0 || n > N1) return;
          if (v === 0) delete vals[n]; else vals[n] = v;
          draw();
        };
        cv.addEventListener('pointerdown', (e) => { drag = true; cv.setPointerCapture(e.pointerId); pick(e); });
        cv.addEventListener('pointermove', (e) => { if (drag) pick(e); });
        cv.addEventListener('pointerup', () => { drag = false; });
        function draw() {
          const n = [], v = [];
          for (let k = N0; k <= N1; k++) { n.push(k); v.push(vals[k] || 0); }
          SS.plot(cv, { x: [N0 - 0.6, N1 + 0.6], y: [-3.5, 4.5], h: 240, xLabel: 'n', xStep: 1, yStep: 1, layers: [{ kind: 'stem', n, v, color: 'x', r: 4.5, labels: true }] });
          const ks = Object.keys(vals).map(Number).sort((a, b) => a - b);
          const term = (k) => '\\delta[n' + (k === 0 ? '' : k > 0 ? '-' + k : '+' + -k) + ']';
          const expr = ks.map((k, i) => { const a = vals[k]; return (i === 0 ? (a < 0 ? '-' : '') : sgn(a)) + (Math.abs(a) === 1 ? '' : Math.abs(a)) + term(k); }).join('');
          ui.readout(L.readout, [['δ ile ifade', '$x[n] = ' + (expr || '0') + '$', 'wide'], ['Örnek sayısı (sıfır olmayan)', String(ks.length)], ['Enerji $\\sum |x[n]|^2$', String(ks.reduce((s, k) => s + vals[k] * vals[k], 0))]],
            { tone: 'info', html: 'Okuma kuralı: $n=k$ noktasındaki $a$ yüksekliğindeki çubuk $a\\,\\delta[n-k]$ terimini verir. $\\delta[n-3]$ <em>sağa</em> 3 kaymıştır, $\\delta[n+2]$ <em>sola</em> 2.' });
        }
        draw();
      }
      function galTab() {
        const kind = ui.select({ label: 'Dizi', options: [
          { value: 'u', label: 'u[n] birim basamak' }, { value: 'd', label: 'δ[n] birim impuls' }, { value: 'r', label: 'r[n] = n·u[n] rampa' },
          { value: 'a', label: 'αⁿ u[n] üstel' }, { value: 'c', label: 'cos(2πn/N) sinüs' }, { value: 'y44', label: 'y[n] = 2r[1 − n]  · s. 44' }, { value: 'z45', label: 'z[n] = r[n + 2]  · ödev s. 45' }], value: 'u', onChange: draw });
        const al = ui.slider({ label: '$\\alpha$', min: -1.2, max: 1.2, step: 0.05, value: 0.8, fmt: (v) => S.fmt(v, 2), onInput: draw });
        const Nn = ui.slider({ label: '$N$', min: 2, max: 16, step: 1, value: 12, onInput: draw });
        L.controls.append(kind.el, al.el, Nn.el);
        const cv = ui.canvas(230);
        L.body.append(pbox(cv));
        function draw() {
          const k = kind.get();
          al.el.style.display = k === 'a' ? '' : 'none';
          Nn.el.style.display = k === 'c' ? '' : 'none';
          const a = al.get(), N = Nn.get();
          const f = { u: S.dU, d: S.dDelta, r: (n) => (n >= 0 ? n : 0), a: (n) => (n >= 0 ? Math.pow(a, n) : 0), c: (n) => Math.cos((2 * Math.PI * n) / N), y44: (n) => 2 * Math.max(0, 1 - n), z45: (n) => Math.max(0, n + 2) }[k];
          const n = [], v = [];
          for (let i = -8; i <= 12; i++) { n.push(i); v.push(f(i)); }
          SS.plot(cv, { x: [-8.6, 12.6], y: SS.autoYv([v.map((x) => Math.max(-6, Math.min(12, x)))]), h: 230, xLabel: 'n', xStep: 2, layers: [{ kind: 'stem', n, v, color: 'x' }] });
          const info = {
            u: ['$u[n] = 1$ ($n\\ge0$), 0 ($n<0$)', 'Ayrık basamakta $u[0]=1$ tanımlıdır, sürekli $u(t)$’deki gibi belirsizlik yoktur. Ayrıca $u[n] = \\sum_{k=-\\infty}^{n} \\delta[k]$.'],
            d: ['$\\delta[n] = 1$ ($n=0$), 0 (diğer)', 'Ayrık impuls sonsuz yüksek değildir, değeri tam olarak 1’dir. $\\delta[n] = u[n]-u[n-1]$.'],
            r: ['$r[n] = n\\,u[n]$', 'Her adımda 1 artar. Basamağın birikimli toplamıdır: $r[n] = \\sum_{k=-\\infty}^{n-1} u[k]$.'],
            a: ['$x[n] = \\alpha^n u[n]$', '$|\\alpha|<1$ ise söner, $|\\alpha|>1$ ise büyür. $\\alpha<0$ olunca işaret her adımda değişir. Sürekli $e^{-at}$ ile bağı: $\\alpha = e^{-aT}$.'],
            c: ['$x[n] = \\cos(2\\pi n/N)$', 'N örnekte bir tam tur. Periyot buradaki $N$’dir.'],
            y44: ['$y[n] = 2r[1-n] = \\begin{cases} -2n+2 & n \\le 1 \\\\ 0 & n > 1 \\end{cases}$', 'Önce $r[n]$’yi $r[-n]$ (ayna), sonra 1 sağa kaydır: $r[-(n-1)]$. Yükseklik 2 ile çarpılır.'],
            z45: ['$z[n] = r[n+2] = (n+2)\\,u[n+2]$', 'Rampa 2 adım <strong>sola</strong> kaydı: $n=-2$’de başlar, $z[-1]=1$, $z[0]=2$.']
          }[k];
          ui.readout(L.readout, [['Tanım', info[0], 'wide']], { tone: 'info', html: info[1] });
        }
        draw();
      }
      show(opts.tab || 0);
      if (opts.tab) tabs.set(opts.tab, true);
    }
  };
})();
