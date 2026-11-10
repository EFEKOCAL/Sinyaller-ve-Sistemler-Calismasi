/*
 * lab-signals.js — Bölüm 1 sinyal sınıfları:
 *   sampling  : analog / ayrık / sayısal (örnekleme ve kuantalama)
 *   periodic  : sinüs toplamının temel periyodu, ayrık sinüsün periyodu
 *   energy    : enerji ve güç sinyalleri (pencere büyüdükçe E ve P)
 *   evenodd   : çift ve tek bileşenlere ayırma
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);

  /* ===================== Örnekleme / kuantalama ===================== */
  SS.labs.sampling = {
    title: 'Analog, ayrık ve sayısal sinyal',
    blurb: 'Örnekleme periyodu ve bit sayısıyla oyna: zaman ve genlik nasıl ayrıklaşıyor?',
    mount(holder) {
      const L = ui.lab(this.title, 'Aynı fiziksel sinyal üç farklı biçimde. <strong>Ayrık</strong> sinyal yalnızca $t=nT$ anlarında tanımlıdır; <strong>sayısal</strong> sinyalde ayrıca genlik de belirli seviyelere yuvarlanır.');
      holder.append(L.root);
      const xa = (t) => 0.8 * Math.sin(2 * Math.PI * 0.35 * t) + 0.35 * Math.sin(2 * Math.PI * 0.9 * t + 0.6);
      const cv = ui.canvas(240);
      let mode = 'analog';
      const modeSeg = ui.seg({ label: 'Gösterim', options: [{ value: 'analog', label: 'Analog' }, { value: 'ayrik', label: 'Ayrık zamanlı' }, { value: 'sayisal', label: 'Sayısal' }], value: mode, onChange: (v) => { mode = v; draw(); } });
      const Ts = ui.slider({ label: 'Örnekleme periyodu $T$', min: 0.1, max: 1.5, step: 0.05, value: 0.4, fmt: (v) => v.toFixed(2) + ' s', onInput: draw });
      const bits = ui.seg({ label: 'Genlik çözünürlüğü', options: [{ value: 2, label: '2 bit (4 seviye)' }, { value: 3, label: '3 bit (8)' }, { value: 4, label: '4 bit (16)' }], value: 2, onChange: draw });
      L.controls.append(modeSeg.el, Ts.el, bits.el);
      L.body.append(pbox(cv, [['x', 'Örneklenen değerler'], ['muted', 'Analog sinyal']]));
      function draw() {
        const T = Ts.get();
        const b = +bits.get();
        const lv = Math.pow(2, b), lo = -1.2, step = 2.4 / (lv - 1);
        const q = (v) => lo + Math.round((v - lo) / step) * step;
        const n = [], v = [];
        for (let k = 0; k * T <= 10 + 1e-9; k++) { n.push(k * T); v.push(mode === 'sayisal' ? q(xa(k * T)) : xa(k * T)); }
        const layers = [];
        if (mode === 'sayisal') for (let k = 0; k < lv; k++) layers.push({ kind: 'hline', y: lo + k * step, color: 'soft', dash: [2, 4], w: 1 });
        layers.push({ kind: 'fn', f: xa, color: mode === 'analog' ? 'x' : 'muted', w: mode === 'analog' ? 2.6 : 1.4, opacity: mode === 'analog' ? 1 : 0.7, dash: mode === 'analog' ? [] : [5, 4] });
        if (mode !== 'analog') layers.push({ kind: 'stem', n, v, color: 'x', r: 3.4 });
        SS.plot(cv, { x: [0, 10], y: [-1.4, 1.4], h: 240, xLabel: 't (s)', layers });
        const rows = [['Zaman', mode === 'analog' ? 'sürekli (her $t$ anında)' : 'ayrık ($t = nT$)'], ['Genlik', mode === 'sayisal' ? lv + ' seviyeden biri' : 'sürekli (her değer)']];
        if (mode !== 'analog') rows.push(['10 saniyedeki örnek', String(n.length)], ['Örnekleme frekansı $f_s=1/T$', S.fmt(1 / T, 2) + ' Hz']);
        if (mode === 'sayisal') rows.push(['En büyük yuvarlama hatası', '$\\pm$' + S.fmt(step / 2, 3)]);
        const msg = {
          analog: 'Analog sinyal hem zamanda hem genlikte süreklidir: her $t$ anında, her değeri alabilir.',
          ayrik: 'Ayrık zamanlı sinyal yalnızca örnekleme anlarında tanımlıdır, örnekler <em>arasında</em> değer yoktur. Genlik hâlâ sürekli. $T$ büyüdükçe sinyalin hızlı değişimleri kaçırılır.',
          sayisal: 'Sayısal sinyal hem zamanda hem genlikte ayrıktır. Bilgisayar ancak bunu saklayabilir. Bit sayısı azaldıkça basamaklar kabalaşır.'
        }[mode];
        ui.readout(L.readout, rows, { tone: 'info', html: msg });
      }
      draw();
    }
  };

  /* ===================== Periyodiklik ===================== */
  const CPRE = {
    s11: { label: '2cos(10t+1) − 2sin(4t−1)  · s. 11', comps: [[2, 10, 1, 'cos'], [-2, 4, -1, 'sin']] },
    s12: { label: 'cos2t + cos3t + cos5t  · s. 12', comps: [[1, 2, 0, 'cos'], [1, 3, 0, 'cos'], [1, 5, 0, 'cos']] },
    s13: { label: 'cos(3.5t) + sin(2t) + 2cos(7t/6)  · s. 13', comps: [[1, 3.5, 0, 'cos'], [1, 2, 0, 'sin'], [2, 7 / 6, 0, 'cos']] },
    s13b: { label: '… + 3sin(5πt) eklenirse  · s. 13', comps: [[1, 3.5, 0, 'cos'], [1, 2, 0, 'sin'], [2, 7 / 6, 0, 'cos'], [3, 5 * Math.PI, 0, 'sin']] },
    hw14: { label: 'cos(πt/3) + sin(πt/4)  · ödev s. 14', comps: [[1, Math.PI / 3, 0, 'cos'], [1, Math.PI / 4, 0, 'sin']] },
    custom: { label: 'Kendi ω değerlerin…', comps: null }
  };

  function periodOf(ws) {
    const Ts = ws.map((w) => (2 * Math.PI) / Math.abs(w));
    const rows = [];
    let n = 1, ok = true;
    for (let i = 1; i < Ts.length; i++) {
      const fr = S.toFraction(Ts[0] / Ts[i], 500, 1e-9);
      if (!fr) { ok = false; rows.push([Ts[0], Ts[i], null, i]); continue; }
      rows.push([Ts[0], Ts[i], fr, i]);
      n = S.lcm(n, fr[1]);
    }
    return { Ts, rows, ok, n, T0: ok ? n * Ts[0] : Infinity };
  }

  SS.labs.periodic = {
    title: 'Periyot bulucu',
    blurb: 'Sinüslerin toplamı ne zaman periyodiktir? Temel periyodu adım adım hesaplar.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Periyotların oranı <strong>rasyonel</strong> ise toplam periyodiktir ve temel periyot periyotların en küçük ortak katıdır. Oran irrasyonelse sinyal hiçbir zaman tam olarak tekrar etmez.');
      holder.append(L.root);
      const tabs = ui.tabs(['Sürekli: sinüs toplamı', 'Ayrık: $\\cos(\\Omega n)$'], (i) => show(i));
      L.root.insertBefore(tabs.el, L.controls);
      const cv = ui.canvas(250);
      L.body.append(pbox(cv, [['x', 'Sinyal'], ['muted', 'Bileşenler (ayrıkta: aynı frekanstaki sürekli kosinüs)']]));
      // --- sürekli
      const pre = ui.select({ label: 'Sinyal', options: Object.keys(CPRE).map((k) => ({ value: k, label: CPRE[k].label })), value: opts.preset || 's11', onChange: () => drawC() });
      const w1 = el('input', { type: 'text', value: '2' }), w2 = el('input', { type: 'text', value: '3*pi' });
      const custom = el('div', { class: 'ctl-row' },
        el('label', { class: 'ctl' }, el('span', { class: 'ctl-label', html: SS.renderMath('$\\omega_1$') }), w1),
        el('label', { class: 'ctl' }, el('span', { class: 'ctl-label', html: SS.renderMath('$\\omega_2$') }), w2),
        el('span', { class: 'think' }, 'Örnek yazımlar: 2,  3.5,  pi/3,  5*pi,  7/6'));
      w1.addEventListener('input', () => drawC()); w2.addEventListener('input', () => drawC());
      // --- ayrık
      const om = ui.select({ label: '$\\Omega$ (rad/örnek)', options: [
        { value: 'pi/8', label: 'π/8  · ödev s. 10' }, { value: 'pi/6', label: 'π/6  · s. 43' }, { value: 'pi/4', label: 'π/4' },
        { value: '3*pi/4', label: '3π/4' }, { value: '2*pi/3', label: '2π/3' }, { value: '1', label: '1 (π yok!)' }, { value: '2', label: '2  · s. 20' }, { value: '0.3*pi', label: '0.3π' }
      ], value: 'pi/8', onChange: () => drawD() });

      function show(i) {
        L.controls.innerHTML = '';
        if (i === 0) { L.controls.append(pre.el, custom); drawC(); }
        else { L.controls.append(om.el); drawD(); }
      }

      function drawC() {
        const key = pre.get();
        custom.style.display = key === 'custom' ? '' : 'none';
        let comps = CPRE[key].comps;
        if (!comps) {
          const a = S.evalExpr(w1.value), b = S.evalExpr(w2.value);
          if (!(a > 0 && b > 0)) { ui.readout(L.readout, [], { tone: 'bad', html: 'ω değerlerini pozitif sayı olarak yaz (ör. 2, pi/3, 3*pi).' }); return; }
          comps = [[1, a, 0, 'cos'], [1, b, 0, 'cos']];
        }
        const f = (t) => comps.reduce((s, [A, w, ph, ty]) => s + A * (ty === 'cos' ? Math.cos(w * t + ph) : Math.sin(w * t + ph)), 0);
        const P = periodOf(comps.map((c) => c[1]));
        const span = P.ok && P.T0 < 120 ? Math.max(2.2 * P.T0, 6) : 40;
        const layers = [];
        if (P.ok && P.T0 < 120) {
          layers.push({ kind: 'band', from: 0, to: P.T0, color: 'accent', alpha: 0.08, label: 'bir temel periyot' });
          for (let k = 1; k * P.T0 <= span; k++) layers.push({ kind: 'vline', x: k * P.T0, color: 'accent', label: k === 1 ? 'T₀' : k + 'T₀' });
        }
        comps.forEach(([A, w, ph, ty]) => layers.push({ kind: 'fn', f: (t) => A * (ty === 'cos' ? Math.cos(w * t + ph) : Math.sin(w * t + ph)), color: 'muted', w: 1, opacity: 0.45 }));
        layers.push({ kind: 'fn', f, color: 'x', w: 2.2, n: 2400 });
        const amp = comps.reduce((s, c) => s + Math.abs(c[0]), 0);
        const piMult = P.ok && P.T0 < 120 && S.toFraction(P.T0 / Math.PI, 60, 1e-9);
        const piStep = Math.PI * Math.max(1, Math.ceil(span / Math.PI / 10));
        SS.plot(cv, { x: [0, span], y: [-amp * 1.15, amp * 1.15], h: 250, xLabel: 't', piTicks: !!piMult, xStep: piMult ? piStep : undefined, layers });
        const rows = P.Ts.map((T, i) => ['$T_' + (i + 1) + ' = 2\\pi/\\omega_' + (i + 1) + '$', '$' + S.texPi(T) + '$']);
        P.rows.forEach(([a, b, fr, i]) => rows.push(['$T_1 / T_' + (i + 1) + '$', fr ? '$' + (fr[1] === 1 ? fr[0] : '\\frac{' + fr[0] + '}{' + fr[1] + '}') + '$ → rasyonel' : 'irrasyonel', fr ? 'y' : '']));
        if (P.ok) rows.push(['Temel periyot', '$T_0 = ' + P.n + ' \\cdot T_1 = ' + S.texPi(P.T0) + '$', 'y']);
        ui.readout(L.readout, rows, P.ok
          ? { tone: 'ok', html: 'Tüm oranlar rasyonel olduğundan sinyal <strong>periyodiktir</strong>. $T_1$’i tam sayı yapan en küçük çarpan: paydaların en küçük ortak katı ' + P.n + '. Bu yüzden $T_0 = ' + P.n + 'T_1 = ' + S.texPi(P.T0) + '$.' }
          : { tone: 'bad', html: 'En az bir periyot oranı <strong>irrasyonel</strong> (π içeren ve içermeyen periyotlar karışmış). Hiçbir $T$ için bütün bileşenler aynı anda başa dönmez: sinyal <strong>periyodik değildir</strong>.' });
      }

      function drawD() {
        const W = S.evalExpr(om.get());
        const fr = S.toFraction(W / (2 * Math.PI), 200, 1e-9);
        const N = fr ? fr[1] : null;
        const n = [], v = [];
        for (let k = 0; k <= 40; k++) { n.push(k); v.push(Math.cos(W * k)); }
        const layers = [{ kind: 'fn', f: (t) => Math.cos(W * t), color: 'muted', w: 1, dash: [4, 4], opacity: 0.8 }];
        if (N && N <= 40) {
          layers.unshift({ kind: 'band', from: -0.5, to: N - 0.5, color: 'accent', alpha: 0.08, label: 'N = ' + N + ' örnek' });
          for (let k = 1; k * N <= 40; k++) layers.push({ kind: 'vline', x: k * N, color: 'accent', label: k === 1 ? 'N' : k + 'N' });
        }
        layers.push({ kind: 'stem', n, v, color: 'x', r: 3.2 });
        SS.plot(cv, { x: [-0.8, 40.8], y: [-1.3, 1.45], h: 250, xLabel: 'n', xStep: 5, layers });
        const rows = [['$\\Omega$', '$' + S.texPi(W) + '$'], ['$\\Omega / 2\\pi$', fr ? '$\\frac{' + fr[0] + '}{' + fr[1] + '}$ (rasyonel)' : S.fmt(W / (2 * Math.PI), 4) + '… (irrasyonel)']];
        if (N) rows.push(['Temel periyot', '$N = ' + N + '$ örnek', 'y']);
        ui.readout(L.readout, rows, N
          ? { tone: 'ok', html: '$\\Omega N = 2\\pi m$ olacak en küçük tam sayı $N=' + N + '$ ($m=' + fr[0] + '$). Kesikli çizgi aynı frekanstaki sürekli kosinüs: ayrık dizi onun yalnızca tam sayı anlarındaki değerleri.' }
          : { tone: 'bad', html: '$\\Omega/2\\pi$ rasyonel değil. Sürekli kosinüs periyodik olduğu hâlde örnekleri <strong>hiçbir N için</strong> tekrar etmez. Ayrık zamanda $\\cos(\\Omega n)$ ancak $\\Omega$, $\\pi$’nin rasyonel katıysa periyodiktir.' });
      }
      show(opts.tab || 0);
      if (opts.tab) tabs.set(opts.tab, true);
    }
  };

  /* ===================== Enerji / güç ===================== */
  const EPRE = {
    exp: { label: 'e^(−at) u(t), a > 0  · s. 19a', d: false, a: true, f: (t, a) => (t >= 0 ? Math.exp(-a * t) : 0), th: (a) => ({ E: 1 / (2 * a), P: 0, kind: 'E', tex: 'E = \\frac{1}{2a} = ' + S.fmt(1 / (2 * a), 3) }) },
    cos: { label: '2cos(t + 0.5)  (A cos(ωt+θ), s. 19b)', d: false, f: (t) => 2 * Math.cos(t + 0.5), th: () => ({ E: Infinity, P: 2, kind: 'P', tex: 'P = \\frac{A^2}{2} = 2' }) },
    exp3: { label: '3e^(−t), t ≥ 0  · s. 18', d: false, f: (t) => (t >= 0 ? 3 * Math.exp(-t) : 0), th: () => ({ E: 4.5, P: 0, kind: 'E', tex: 'E = \\frac{9}{2}' }) },
    ramp: { label: 't·u(t)  · s. 21', d: false, f: (t) => (t >= 0 ? t : 0), th: () => ({ E: Infinity, P: Infinity, kind: 'N', tex: 'E = \\infty,\\; P = \\infty' }) },
    rect: { label: '5 genlikli darbe, −2 < t < 2  · ödev s. 20a', d: false, f: (t) => (Math.abs(t) < 2 ? 5 : 0), th: () => ({ E: 100, P: 0, kind: 'E', tex: 'E = 5^2 \\cdot 4 = 100' }) },
    train: { label: 'Periyodik darbe dizisi  · ödev s. 20b', d: false, f: (t) => { const m = ((t + 2) % 8 + 8) % 8; return m < 4 ? 5 : 0; }, th: () => ({ E: Infinity, P: 12.5, kind: 'P', tex: 'P = \\frac{25 \\cdot 4}{8} = 12.5' }) },
    d1: { label: 'x[n] = 4(0.5)ⁿ, n ≥ 0  · s. 18', d: true, f: (n) => (n >= 0 ? 4 * Math.pow(0.5, n) : 0), th: () => ({ E: 64 / 3, P: 0, kind: 'E', tex: 'E = \\frac{16}{1-0.25} = \\frac{64}{3}' }) },
    d2: { label: 'x[n] = 2cos(2πn/4)  · s. 18', d: true, f: (n) => 2 * Math.cos((2 * Math.PI * n) / 4), th: () => ({ E: Infinity, P: 2, kind: 'P', tex: 'P = \\frac{1}{4}(4+0+4+0) = 2' }) },
    d3: { label: 'f[k] = e^(−0.5k), k ≥ 0  · ödev s. 20c', d: true, f: (n) => (n >= 0 ? Math.exp(-0.5 * n) : 0), th: () => ({ E: 1 / (1 - Math.exp(-1)), P: 0, kind: 'E', tex: 'E = \\frac{1}{1-e^{-1}} \\approx 1.582' }) },
    d4: { label: '|x[n]| = |10e^(j2n)| = 10  · s. 20', d: true, f: () => 10, th: () => ({ E: Infinity, P: 100, kind: 'P', tex: 'P = 10^2 = 100' }) }
  };

  SS.labs.energy = {
    title: 'Enerji mi, güç mü?',
    blurb: 'Pencereyi büyüt: toplam enerji sonlu bir değere mi gidiyor, yoksa ortalama güç mü sabitleniyor?',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Mavi alan $|x|^2$’nin pencere içindeki toplamı, yani $E_T$. Pencere büyüdükçe $E_T$ sonlu bir sayıya yaklaşıyorsa sinyal <strong>enerji</strong> sinyalidir. $E_T$ sonsuza giderken $P_T = E_T / T$ sabit bir sayıya yaklaşıyorsa <strong>güç</strong> sinyalidir.');
      holder.append(L.root);
      const pre = ui.select({ label: 'Sinyal', options: Object.keys(EPRE).map((k) => ({ value: k, label: EPRE[k].label })), value: opts.preset || 'exp', onChange: () => { syncA(); draw(); } });
      const a = ui.slider({ label: '$a$', min: 0.2, max: 2, step: 0.1, value: 1, fmt: (v) => v.toFixed(1), onInput: draw });
      const win = ui.slider({ label: 'Pencere genişliği $T$ (veya $2N+1$)', min: 1, max: 40, step: 0.5, value: 8, fmt: (v) => v.toFixed(1), onInput: draw });
      L.controls.append(pre.el, a.el, win.el);
      const cv = ui.canvas(220), cE = ui.canvas(150), cP = ui.canvas(150);
      L.body.append(pbox(cv, [['x', '$|x|^2$ ve pencere içindeki alan']]), el('div', { class: 'plot-grid' }, pbox(cE, null, '$E_T$ (pencere içindeki enerji)'), pbox(cP, null, '$P_T = E_T / T$ (ortalama güç)')));
      function syncA() { a.el.style.display = EPRE[pre.get()].a ? '' : 'none'; }
      function ET(p, T, av) {
        if (p.d) {
          const N = Math.floor((T - 1) / 2);
          let s = 0;
          for (let n = -N; n <= N; n++) s += Math.pow(p.f(n, av), 2);
          return [s, s / (2 * N + 1), N];
        }
        const e = S.integrate((t) => Math.pow(p.f(t, av), 2), -T / 2, T / 2, Math.max(400, Math.round(T * 80)));
        return [e, e / T];
      }
      function draw() {
        const p = EPRE[pre.get()];
        const av = a.get();
        const T = win.get();
        const th = p.th(av);
        const [E, P, N] = ET(p, T, av);
        const X = 22;
        const sq = (t) => Math.pow(p.f(t, av), 2);
        let ymax = 0;
        if (p.d) { for (let n = -X; n <= X; n++) ymax = Math.max(ymax, sq(n)); }
        else for (let i = 0; i <= 800; i++) ymax = Math.max(ymax, sq(-X + (2 * X * i) / 800));
        ymax = Math.min(ymax, 400) * 1.15 || 1;
        const layers = [];
        if (p.d) {
          const nn = [], vv = [];
          for (let n = -X; n <= X; n++) { nn.push(n); vv.push(sq(n)); }
          layers.push({ kind: 'band', from: -N - 0.5, to: N + 0.5, color: 'x', alpha: 0.1, label: 'n = −' + N + ' … ' + N });
          layers.push({ kind: 'stem', n: nn, v: vv, color: 'x', r: 3 });
        } else {
          layers.push({ kind: 'area', f: sq, from: -T / 2, to: T / 2, color: 'x', alpha: 0.28 });
          layers.push({ kind: 'fn', f: sq, color: 'x', w: 2 });
          layers.push({ kind: 'vline', x: -T / 2, color: 'muted' }, { kind: 'vline', x: T / 2, color: 'muted', label: 'T/2' });
        }
        SS.plot(cv, { x: [-X, X], y: [-ymax * 0.06, ymax], h: 220, xLabel: p.d ? 'n' : 't', layers });
        // E(T) ve P(T) eğrileri
        const Ts = [], Es = [], Ps = [];
        for (let k = 1; k <= 40; k += 0.5) { const r = ET(p, k, av); Ts.push(k); Es.push(r[0]); Ps.push(r[1]); }
        const eMax = Math.max(...Es.filter(isFinite)) * 1.15 || 1, pMax = Math.max(...Ps.filter(isFinite)) * 1.25 || 1;
        const line = (xs, ys) => (t) => { let i = 0; while (i < xs.length - 1 && xs[i + 1] < t) i++; return ys[i]; };
        SS.plot(cE, { x: [0, 40], y: [-eMax * 0.05, eMax], h: 150, xLabel: 'T', layers: [
          isFinite(th.E) ? { kind: 'hline', y: th.E, color: 'y', label: 'E = ' + S.fmt(th.E, 3) } : null,
          { kind: 'fn', f: line(Ts, Es), color: 'x', w: 2 }, { kind: 'dot', x: T, y: E, color: 'x' }] });
        SS.plot(cP, { x: [0, 40], y: [-pMax * 0.05, pMax], h: 150, xLabel: 'T', layers: [
          isFinite(th.P) && th.P > 0 ? { kind: 'hline', y: th.P, color: 'y', label: 'P = ' + S.fmt(th.P, 3) } : null,
          { kind: 'fn', f: line(Ts, Ps), color: 'h', w: 2 }, { kind: 'dot', x: T, y: P, color: 'h' }] });
        const verdict = th.kind === 'E'
          ? { tone: 'ok', html: '<strong>Enerji sinyali.</strong> $E_T$ sonlu bir değere yerleşiyor ($0<E<\\infty$), bu yüzden $P = \\lim E_T/T = 0$. Kural: $' + th.tex + '$.' }
          : th.kind === 'P'
            ? { tone: 'info', html: '<strong>Güç sinyali.</strong> $E_T$ pencereyle birlikte durmadan büyüyor ($E=\\infty$), ama $E_T/T$ sabit bir değere yaklaşıyor ($0<P<\\infty$). Kural: $' + th.tex + '$.' }
            : { tone: 'bad', html: '<strong>Ne enerji ne güç sinyali.</strong> $|x|^2$ zamanla büyüdüğü için $E_T$ de $P_T$ de sınırsız artıyor: $' + th.tex + '$.' };
        ui.readout(L.readout, [['$E_T$ (bu pencere)', S.fmt(E, 3), 'x'], ['$P_T$ (bu pencere)', S.fmt(P, 3), 'h']], verdict);
      }
      syncA();
      draw();
    }
  };

  /* ===================== Çift / tek ===================== */
  const OPRE = {
    s47: { label: 'Nottaki x(t): −1 (−1<t<0), 1−t (0<t<2)  · s. 47', d: false, f: (t) => (t > -1 && t < 0 ? -1 : t >= 0 && t < 2 ? 1 - t : 0), r: [-3, 3] },
    u: { label: 'Birim basamak u(t)  · s. 23b', d: false, f: (t) => (t >= 0 ? 1 : 0), r: [-3, 3] },
    trig: { label: '10sin t + 5cos t − 2cos t sin t  · s. 23a', d: false, f: (t) => 10 * Math.sin(t) + 5 * Math.cos(t) - 2 * Math.cos(t) * Math.sin(t), r: [-7, 7] },
    poly: { label: 't² + 4t − 10  · ödev s. 26a', d: false, f: (t) => t * t + 4 * t - 10, r: [-5, 5] },
    box: { label: 'h(t) = 1, 0 < t < 1  · ödev s. 26b', d: false, f: (t) => (t > 0 && t < 1 ? 1 : 0), r: [-2, 2] },
    exp: { label: 'e^(−t) u(t)', d: false, f: (t) => (t >= 0 ? Math.exp(-t) : 0), r: [-3, 3] },
    d25: { label: 'x[n] = {0, 2, 4, 2} (n = 0…3)  · s. 25', d: true, f: (n) => ({ 1: 2, 2: 4, 3: 2 }[n] || 0), r: [-5, 5] },
    d26: { label: 'x[n] = 4, n = 0…5  · ödev s. 26', d: true, f: (n) => (n >= 0 && n <= 5 ? 4 : 0), r: [-7, 7] }
  };

  SS.labs.evenodd = {
    title: 'Çift ve tek bileşen ayırıcı',
    blurb: 'Her sinyal bir çift ve bir tek parçanın toplamıdır. Ayna görüntüsüyle bul.',
    mount(holder, opts) {
      const L = ui.lab(this.title, '$x_e = \\frac{x(t)+x(-t)}{2}$ ve $x_o = \\frac{x(t)-x(-t)}{2}$. Çift parça dikey eksene göre simetrik, tek parça orijine göre simetriktir. İkisinin toplamı her zaman $x(t)$’yi geri verir.');
      holder.append(L.root);
      const pre = ui.select({ label: 'Sinyal', options: Object.keys(OPRE).map((k) => ({ value: k, label: OPRE[k].label })), value: opts.preset || 's47', onChange: draw });
      const sum = ui.check({ label: '$x_e + x_o$ toplamını $x$ üzerine çiz', value: false, onChange: draw });
      L.controls.append(pre.el, sum.el);
      const c1 = ui.canvas(170), c2 = ui.canvas(170), c3 = ui.canvas(170), c4 = ui.canvas(170);
      L.body.append(el('div', { class: 'plot-grid' }, pbox(c1, null, '$x$'), pbox(c2, null, '$x(-t)$: dikey eksene göre ayna'), pbox(c3, null, '$x_e$: çift bileşen'), pbox(c4, null, '$x_o$: tek bileşen')));
      function draw() {
        const p = OPRE[pre.get()];
        const f = p.f, fr = (t) => f(-t), fe = (t) => (f(t) + f(-t)) / 2, fo = (t) => (f(t) - f(-t)) / 2;
        const [a, b] = p.r;
        let yr;
        if (p.d) {
          const vals = [];
          for (let n = a; n <= b; n++) vals.push(f(n), fe(n), fo(n));
          yr = SS.autoYv([vals]);
        } else yr = SS.autoY([f, fe, fo], a, b);
        const mk = (g, col, extra) => {
          if (p.d) {
            const n = [], v = [];
            for (let k = a; k <= b; k++) { n.push(k); v.push(g(k)); }
            return [{ kind: 'stem', n, v, color: col, labels: true }].concat(extra || []);
          }
          return [{ kind: 'fn', f: g, color: col, fill: true, alpha: 0.12 }].concat(extra || []);
        };
        const base = { x: p.d ? [a - 0.6, b + 0.6] : [a, b], y: yr, h: 170, xLabel: p.d ? 'n' : 't', xStep: p.d ? 1 : undefined };
        const sumLayer = sum.get() ? (p.d ? [] : [{ kind: 'fn', f: (t) => fe(t) + fo(t), color: 'y', dash: [6, 4], w: 2.5 }]) : [];
        SS.plot(c1, Object.assign({}, base, { layers: mk(f, 'x', sumLayer) }));
        SS.plot(c2, Object.assign({}, base, { layers: mk(fr, 'muted') }));
        SS.plot(c3, Object.assign({}, base, { layers: mk(fe, 'h') }));
        SS.plot(c4, Object.assign({}, base, { layers: mk(fo, 'y') }));
        const msgs = {
          s47: '$t>0$ tarafındaki $1-t$ ile $t<0$ tarafındaki $-1$ ortalanır. Bu yüzden çift parça iki tarafta aynıdır. Tek parça ise iki tarafta işaret değiştirir.',
          u: 'Notun sonucu: $u_e(t) = \\tfrac12$ (her yerde), $u_o(t) = -\\tfrac12$ ($t<0$) ve $+\\tfrac12$ ($t>0$).',
          trig: '$\\cos$ çift, $\\sin$ tek fonksiyondur. $\\cos t\\sin t$ ise tek·çift = tek olur. Sonuç: $x_e = 5\\cos t$, $x_o = 10\\sin t - 2\\cos t\\sin t$.',
          poly: 'Çift kuvvetler ve sabit çift parçaya, tek kuvvetler tek parçaya gider: $x_e = t^2 - 10$, $x_o = 4t$.',
          box: '$h_e(t) = \\tfrac12$ ($|t|<1$), $h_o(t) = \\tfrac12$ ($0<t<1$) ve $-\\tfrac12$ ($-1<t<0$).',
          exp: '$x_e = \\tfrac12 e^{-|t|}$, $x_o = \\tfrac12\\,\\mathrm{sgn}(t)\\, e^{-|t|}$. Nedensel bir sinyalin çift ve tek parçaları $t>0$ için eşittir.',
          d25: 'Notun sonucu: $x_e = \\{1,2,1,0,1,2,1\\}$ ($n=-3\\ldots3$) ve $x_o = \\{-1,-2,-1,0,1,2,1\\}$. Yani $x_e[n]=x_e[-n]$, $x_o[n]=-x_o[-n]$ ve $x_o[0]=0$.',
          d26: '$n=0$’da $x_e[0]=x[0]=4$ ve $x_o[0]=0$ olur. Diğer noktalarda değer ikiye bölünür: $x_e=2$, $x_o=\\pm2$ ($1\\le|n|\\le5$).'
        };
        ui.readout(L.readout, [], { tone: 'info', html: msgs[pre.get()] });
      }
      draw();
    }
  };
})();
