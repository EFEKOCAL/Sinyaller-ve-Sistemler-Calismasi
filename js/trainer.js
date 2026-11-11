/*
 * trainer.js — Antrenman motoru (DOM'dan bağımsız; Node.js ile test edilebilir).
 *
 * Her beceri için rastgele ama doğrulanabilir sorular üretir. Bir soru grubu:
 *   { stem: html, parts: [ { skill, q: html, opts: [html], a: doğru indeks, why: html } ] }
 * Tek beceri sorularında tek parça, sistem analizi ve karma (sınav tipi) sorularda birden çok parça vardır.
 *
 * Beceriler (vize kapsamı, Bölüm 1):
 *   perC  sürekli sinüs toplamının temel periyodu      perD  ayrık sinüsün temel periyodu
 *   ep    enerji / güç sınıfı ve değeri                eo    çift / tek / hiçbiri
 *   delta δ'lı integral                                tf    x(ct+d) hangi aralıkta?
 *   lin   lineer mi?   ti  ötelemeyle değişmez mi?     caus  nedensel mi?   stab  kararlı mı?
 */
(function (root) {
  'use strict';
  const SS = (root.SS = root.SS || {});

  /* ---------- küçük yardımcılar ---------- */
  let rand = Math.random;
  const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

  // Kesirler
  const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
  const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
  const fdiv = (a, b) => F(a.n * b.d, a.d * b.n);
  const fval = (a) => a.n / a.d;
  const feq = (a, b) => a.n === b.n && a.d === b.d;
  const fgcd = (list) => { const L = list.reduce((l, f) => lcm(l, f.d), 1); return F(list.reduce((g, f) => gcd(g, (f.n * L) / f.d), 0), L); };
  const texF = (f) => (f.d === 1 ? String(f.n) : (f.n < 0 ? '-' : '') + '\\frac{' + Math.abs(f.n) + '}{' + f.d + '}');
  const texFpi = (f) => {
    if (f.n === 0) return '0';
    const s = f.n < 0 ? '-' : '', a = Math.abs(f.n);
    const num = a === 1 ? '\\pi' : a + '\\pi';
    return s + (f.d === 1 ? num : '\\frac{' + num + '}{' + f.d + '}');
  };
  // Değer: kesir veya kesir·π
  const V = (f, pi) => ({ f, pi: !!pi });
  const texV = (v) => (v.pi ? texFpi(v.f) : texF(v.f));
  const numV = (v) => fval(v.f) * (v.pi ? Math.PI : 1);
  const m = (tex) => '$' + tex + '$';
  const NOPE = 'Periyodik değil';

  // Seçenekleri karıştır, doğru olanın yeni indeksini döndür. Yinelenenleri atar.
  function mkOpts(correct, distractors, n = 4) {
    const seen = new Set([correct]);
    const list = [correct];
    for (const d of distractors) { if (list.length >= n) break; if (d == null || seen.has(d)) continue; seen.add(d); list.push(d); }
    const sh = shuffle(list);
    return { opts: sh, a: sh.indexOf(correct) };
  }

  /* ================= Sürekli periyot ================= */
  const W_INT = [F(1), F(2), F(3), F(4), F(5), F(6), F(8), F(9), F(10), F(12), F(3, 2), F(5, 2), F(1, 2), F(2, 3), F(7, 6)];
  const W_PI = [F(1), F(2), F(3), F(4), F(1, 2), F(1, 3), F(1, 4), F(2, 3), F(3, 4), F(1, 6), F(3, 2), F(2, 5), F(5)];
  const PHASES = ['', '', '', '+1', '-\\frac{\\pi}{3}', '+\\frac{\\pi}{4}', '-2'];
  const wt = (w, pi, v = 't') => {
    if (!pi) return (feq(w, F(1)) ? '' : texF(w)) + v;
    return texFpi(w) + ' ' + v;
  };
  function termTex(tm, v = 't') {
    const amp = tm.A === 1 ? '' : tm.A === -1 ? '-' : String(tm.A);
    const inside = wt(tm.w, tm.pi, v) + tm.ph;
    return amp + '\\' + tm.fn + (/[+\-\\]/.test(inside) || inside.length > 2 ? '\\left(' + inside + '\\right)' : inside.length > 1 ? '(' + inside + ')' : ' ' + inside);
  }
  const sumTex = (terms, v) => terms.map((t, i) => { const s = termTex(t, v); return i === 0 ? s : (s[0] === '-' ? ' - ' + s.slice(1) : ' + ' + s); }).join('');
  function distinct(pool, k) { return shuffle(pool).slice(0, k); }

  function genPerC() {
    const r = rand();
    const kind = r < 0.4 ? 'int' : r < 0.72 ? 'pi' : 'mixed';
    const n = rand() < 0.7 ? 2 : 3;
    let ws;
    if (kind === 'int') ws = distinct(W_INT, n).map((w) => ({ w, pi: false }));
    else if (kind === 'pi') ws = distinct(W_PI, n).map((w) => ({ w, pi: true }));
    else ws = shuffle(distinct(W_INT.slice(0, 10), n - 1).map((w) => ({ w, pi: false })).concat([{ w: pick(W_PI), pi: true }]));
    const terms = ws.map((o) => ({ A: pick([1, 1, 2, 3, 4, -2]), fn: pick(['cos', 'sin']), w: o.w, pi: o.pi, ph: pick(PHASES) }));
    if (terms[0].A < 0) terms[0].A = -terms[0].A;
    const Ts = terms.map((t) => V(fdiv(F(2), t.w), !t.pi));
    const periodic = kind !== 'mixed';
    const f = (t) => terms.reduce((s, tm) => s + tm.A * Math[tm.fn](fval(tm.w) * (tm.pi ? Math.PI : 1) * t + (tm.ph ? evalPh(tm.ph) : 0)), 0);
    const Tlist = Ts.map((T, i) => m('T_' + (i + 1) + ' = \\frac{2\\pi}{\\omega_' + (i + 1) + '} = ' + texV(T))).join(', ');
    let correct, why, T0 = null;
    const dis = [];
    if (periodic) {
      const pi = terms[0].pi;
      const g = fgcd(terms.map((t) => t.w));
      T0 = V(fdiv(F(2), g), !pi);
      correct = m('T_0 = ' + texV(T0));
      Ts.forEach((T) => { if (!(feq(T.f, T0.f))) dis.push(m('T_0 = ' + texV(T))); });
      dis.push(m('T_0 = ' + texV(V(fmul(T0.f, F(1, 2)), T0.pi))), m('T_0 = ' + texV(V(fmul(T0.f, F(2)), T0.pi))));
      const ratios = terms.slice(1).map((t, i) => m('\\frac{T_1}{T_' + (i + 2) + '} = \\frac{\\omega_' + (i + 2) + '}{\\omega_1} = ' + texF(fdiv(t.w, terms[0].w)))).join(', ');
      why = Tlist + '. Oranlar: ' + ratios + ' (rasyonel), yani periyodik. Kısa yol: ' + m('\\omega_0 = \\text{EBOB}(\\omega_i) = ' + (pi ? texFpi(g) : texF(g)) + '\\;\\Rightarrow\\; T_0 = \\frac{2\\pi}{\\omega_0} = ' + texV(T0)) + '. Genlikler ve fazlar periyodu etkilemez.';
      const pos = shuffle(dis.filter((d) => d !== correct)).slice(0, 2);
      const o = mkOpts(correct, pos.concat([NOPE, m('T_0 = ' + texV(V(fmul(T0.f, F(3)), T0.pi)))]));
      return { stem: '', parts: [{ skill: 'perC', q: m('x(t) = ' + sumTex(terms)) + ' sinyalinin temel periyodu nedir?', opts: o.opts, a: o.a, why }], _f: f, _T0: numV(T0), _optVals: [numV(T0) / 2, ...Ts.map(numV)] };
    }
    correct = NOPE;
    Ts.forEach((T) => dis.push(m('T_0 = ' + texV(T))));
    dis.push(m('T_0 = 2\\pi'), m('T_0 = 2'));
    const iPi = terms.findIndex((t) => t.pi), iNo = terms.findIndex((t) => !t.pi);
    why = Tlist + '. ' + m('\\frac{T_' + (iNo + 1) + '}{T_' + (iPi + 1) + '}') + ' oranında ' + m('\\pi') + ' sadeleşmiyor: oran <strong>irrasyonel</strong>. Bileşenlerin her biri periyodik olsa da hiçbir ' + m('T') + ' için hepsi aynı anda başa dönmez.';
    const o = mkOpts(correct, shuffle(dis));
    return { stem: '', parts: [{ skill: 'perC', q: m('x(t) = ' + sumTex(terms)) + ' sinyalinin temel periyodu nedir?', opts: o.opts, a: o.a, why }], _f: f, _T0: null };
  }
  function evalPh(ph) { return { '+1': 1, '-2': -2, '-\\frac{\\pi}{3}': -Math.PI / 3, '+\\frac{\\pi}{4}': Math.PI / 4 }[ph] || 0; }

  /* ================= Ayrık periyot ================= */
  function dTermTex(w, pi) { const fnn = pick(['cos', 'sin', 'exp']); const arg = wt(w, pi, 'n'); return fnn === 'exp' ? 'e^{j' + (arg.length > 3 ? '(' + arg + ')' : arg) + '}' : '\\' + fnn + '\\left(' + arg + '\\right)'; }
  function NofOmega(w) { const r = F(w.n, 2 * w.d); return r.d; } // Ω = wπ ⇒ Ω/2π = w/2
  function genPerD() {
    const r = rand();
    if (r < 0.22) {
      const w = pick([F(1), F(2), F(3), F(4), F(1, 2), F(1, 4), F(5), F(3, 2)]);
      const guess = fdiv(F(2), w);
      const o = mkOpts(NOPE, shuffle([m('N_0 = ' + texFpi(guess)), m('N_0 = ' + (w.d === 1 ? w.n * 2 : w.d * 2)), m('N_0 = ' + (w.d === 1 ? w.n : w.d * 4)), m('N_0 = 8')]));
      return { stem: '', parts: [{ skill: 'perD', q: m('x[n] = ' + dTermTex(w, false)) + ' dizisinin temel periyodu nedir?', opts: o.opts, a: o.a,
        why: m('\\frac{\\Omega_0}{2\\pi} = ' + texF(F(w.n, 2 * w.d)).replace(/\}$/, '\\pi}').replace(/^(\d+)$/, '\\frac{$1}{\\pi}')) + ' içinde ' + m('\\pi') + ' kalıyor: rasyonel değil. ' + m('N') + ' tam sayı olmak zorunda olduğu için hiçbir ' + m('N') + ' işe yaramaz. Sürekli zamandaki karşılığı periyodik olsa bile bu dizi <strong>periyodik değildir</strong>.' }], _W: [fval(w)], _N: null };
    }
    // Sınavdaki tipik frekanslar: Ω = (p/q)π, q ∈ {2,3,4,5,6,8,12}, p küçük
    const mkW = () => { const q = pick([2, 3, 4, 4, 5, 6, 6, 8, 8, 12]); let p; do { p = pick([1, 1, 1, 2, 3, 3, 5, 7]); } while (gcd(p, q) !== 1 || p >= 2 * q); return F(p, q); };
    if (r < 0.7) {
      const w = mkW();
      const N = NofOmega(w);
      const naive = fdiv(F(2), w); // 2π/Ω
      const dis = [];
      if (naive.d !== 1) dis.push(m('N_0 = ' + texF(naive)));
      [w.d, 2 * w.d, 2 * N, N / 2].forEach((x) => { if (Number.isInteger(x) && x !== N && x > 0) dis.push(m('N_0 = ' + x)); });
      const o = mkOpts(m('N_0 = ' + N), shuffle(dis).slice(0, 2).concat([NOPE, m('N_0 = ' + (N + 2))]));
      const red = F(w.n, 2 * w.d);
      return { stem: '', parts: [{ skill: 'perD', q: m('x[n] = ' + dTermTex(w, true)) + ' dizisinin temel periyodu nedir?', opts: o.opts, a: o.a,
        why: m('\\frac{\\Omega_0}{2\\pi} = \\frac{' + texFpi(w) + '}{2\\pi} = ' + texF(red)) + ' rasyonel, yani periyodik. En sade kesrin paydası periyottur: ' + m('N_0 = ' + N) + '.' + (naive.d !== 1 ? ' Dikkat: ' + m('\\frac{2\\pi}{\\Omega_0} = ' + texF(naive)) + ' tam sayı değil, periyot olamaz.' : '') }], _W: [fval(w) * Math.PI], _N: N };
    }
    let w1 = mkW(), w2 = mkW();
    while (feq(w1, w2) || lcm(NofOmega(w1), NofOmega(w2)) > 48) { w1 = mkW(); w2 = mkW(); }
    const N1 = NofOmega(w1), N2 = NofOmega(w2), N = lcm(N1, N2);
    const dis = [N1 * N2, Math.max(N1, N2), Math.min(N1, N2), N * 2, gcd(N1, N2)].filter((x) => x !== N && x > 0).map((x) => m('N_0 = ' + x));
    const o = mkOpts(m('N_0 = ' + N), shuffle(dis).slice(0, 2).concat([NOPE, m('N_0 = ' + (N + 4))]));
    return { stem: '', parts: [{ skill: 'perD', q: m('x[n] = \\cos\\left(' + wt(w1, true, 'n') + '\\right) + \\sin\\left(' + wt(w2, true, 'n') + '\\right)') + ' dizisinin temel periyodu nedir?', opts: o.opts, a: o.a,
      why: m('\\frac{\\Omega_1}{2\\pi} = ' + texF(F(w1.n, 2 * w1.d)) + '\\Rightarrow N_1 = ' + N1) + ', ' + m('\\frac{\\Omega_2}{2\\pi} = ' + texF(F(w2.n, 2 * w2.d)) + '\\Rightarrow N_2 = ' + N2) + '. İki periyodik dizinin toplamı her zaman periyodiktir: ' + m('N_0 = \\text{EKOK}(' + N1 + ', ' + N2 + ') = ' + N) + '.' }], _W: [fval(w1) * Math.PI, fval(w2) * Math.PI], _N: N };
  }

  /* ================= Enerji / güç ================= */
  const lblE = (f) => 'Enerji sinyali, ' + m('E = ' + texF(f));
  const lblP = (f) => 'Güç sinyali, ' + m('P = ' + texF(f));
  const NEITHER = 'Ne enerji ne güç sinyali';
  function genEP() {
    const A = ri(1, 5), a = ri(1, 4), k = ri(0, 10);
    const amp = (x) => (A === 1 ? '' : A) + x;
    let tex, kind, val, wrong, why, f, disc = false;
    switch (k) {
      case 0: tex = 'x(t) = ' + amp('e^{-' + (a === 1 ? '' : a) + 't}u(t)'); kind = 'E'; val = F(A * A, 2 * a); wrong = F(A * A, a);
        why = m('|x|^2 = ' + A * A + 'e^{-' + 2 * a + 't}') + ' sönüyor: ' + m('E = \\int_0^\\infty ' + A * A + 'e^{-' + 2 * a + 't}dt = ' + texF(val)) + '. Sonlu enerji ⇒ ' + m('P = 0') + '.'; f = (t) => (t >= 0 ? A * Math.exp(-a * t) : 0); break;
      case 1: tex = 'x(t) = ' + amp('\\cos\\left(' + (a === 1 ? '' : a) + 't + \\frac{\\pi}{3}\\right)'); kind = 'P'; val = F(A * A, 2); wrong = F(A * A);
        why = 'Sinüzoidal sinyal periyodiktir, enerjisi sonsuzdur. Gücü: ' + m('P = \\frac{A^2}{2} = ' + texF(val)) + '. Frekans ve faz gücü etkilemez.'; f = (t) => A * Math.cos(a * t + Math.PI / 3); break;
      case 2: tex = 'x(t) = ' + amp('u(t)'); kind = 'P'; val = F(A * A, 2); wrong = F(A * A);
        why = m('E = \\int_0^\\infty ' + A * A + '\\,dt = \\infty') + '. ' + m('P = \\lim \\frac{1}{T}\\int_0^{T/2}' + A * A + '\\,dt = ' + texF(val)) + ': sinyal pencerenin yalnızca yarısında var.'; f = (t) => (t >= 0 ? A : 0); break;
      case 3: { const w = 2 * a; tex = 'x(t) = ' + A + '\\;(' + -a + ' < t < ' + a + '),\\;\\; 0\\;(\\text{diğer})'; kind = 'E'; val = F(A * A * w); wrong = F(A * w);
        why = 'Sonlu süreli darbe: ' + m('E = ' + A + '^2 \\cdot ' + w + ' = ' + A * A * w) + '. Karesini almayı unutma.'; f = (t) => (Math.abs(t) < a ? A : 0); break; }
      case 4: { const al = pick([F(1, 2), F(-1, 2), F(1, 3), F(2, 3), F(-1, 3)]); const a2 = fmul(al, al); disc = true;
        tex = 'x[n] = ' + amp('\\left(' + texF(al) + '\\right)^n u[n]'); kind = 'E'; val = fdiv(F(A * A), F(a2.d - a2.n, a2.d)); wrong = fdiv(F(A), F(al.d - Math.abs(al.n), al.d));
        why = m('|x[n]|^2 = ' + A * A + '\\left(' + texF(a2) + '\\right)^n') + ', geometrik seri: ' + m('E = \\frac{' + A * A + '}{1 - ' + texF(a2) + '} = ' + texF(val)) + '.'; f = (n) => (n >= 0 ? A * Math.pow(fval(al), n) : 0); break; }
      case 5: disc = true; tex = 'x[n] = ' + amp('e^{j' + (a + 1) + 'n}'); kind = 'P'; val = F(A * A); wrong = F(A * A, 2);
        why = m('|e^{j\\theta}| = 1') + ' olduğundan ' + m('|x[n]| = ' + A) + '. ' + m('P = \\lim\\frac{1}{2N+1}\\sum_{-N}^{N}' + A * A + ' = ' + A * A) + '. (Karmaşık üstelde ' + m('\\frac12') + ' çarpanı yoktur.)'; f = () => A; break;
      case 6: tex = 'x(t) = ' + amp('t\\,u(t)'); kind = 'N'; why = m('|x|^2 = ' + A * A + 't^2') + ' büyüdüğü için hem ' + m('E') + ' hem ' + m('P') + ' sonsuz.'; f = (t) => (t >= 0 ? A * t : 0); break;
      case 7: tex = 'x(t) = ' + amp('e^{' + (a === 1 ? '' : a) + 't}u(t)'); kind = 'N'; why = 'Üstel <strong>büyüyor</strong> (üs pozitif): ' + m('E = \\infty') + ' ve ' + m('P = \\infty') + '.'; f = (t) => (t >= 0 ? A * Math.exp(a * t) : 0); break;
      case 8: tex = 'x(t) = ' + (A + 1) + '\\quad(\\text{her } t \\text{ için sabit})'; kind = 'P'; val = F((A + 1) * (A + 1)); wrong = F((A + 1) * (A + 1), 2);
        why = 'Sabit sinyal: ' + m('E = \\infty') + ', ' + m('P = \\frac{1}{T}\\int_{-T/2}^{T/2}' + (A + 1) * (A + 1) + '\\,dt = ' + (A + 1) * (A + 1)) + '.'; f = () => A + 1; break;
      case 9: disc = true; tex = 'x[n] = ' + amp('u[n]'); kind = 'P'; val = F(A * A, 2); wrong = F(A * A);
        why = m('P = \\lim\\frac{1}{2N+1}\\sum_{n=0}^{N}' + A * A + ' = \\lim\\frac{' + A * A + '(N+1)}{2N+1} = ' + texF(val)) + '.'; f = (n) => (n >= 0 ? A : 0); break;
      default: tex = 'x(t) = ' + amp('e^{-' + (a === 1 ? '' : a) + '|t|}'); kind = 'E'; val = F(A * A, a); wrong = F(A * A, 2 * a);
        why = 'Çift sinyal: ' + m('E = 2\\int_0^\\infty ' + A * A + 'e^{-' + 2 * a + 't}dt = ' + texF(val)) + '. İki taraf da katkı yapar.'; f = (t) => A * Math.exp(-a * Math.abs(t));
    }
    let correct, dis;
    if (kind === 'E') { correct = lblE(val); dis = [lblP(val), lblE(wrong), NEITHER, lblP(wrong)]; }
    else if (kind === 'P') { correct = lblP(val); dis = [lblE(val), lblP(wrong), NEITHER, lblE(wrong)]; }
    else { correct = NEITHER; dis = [lblE(F(A * A, 2)), lblP(F(A * A, 2)), lblP(F(A * A))]; }
    const o = mkOpts(correct, dis);
    return { stem: '', parts: [{ skill: 'ep', q: m(tex) + ' hangi sınıftadır?', opts: o.opts, a: o.a, why }], _f: f, _kind: kind, _val: val ? fval(val) : null, _disc: disc };
  }

  /* ================= Çift / tek ================= */
  const EVEN = [['\\cos(2t)', (t) => Math.cos(2 * t)], ['t^2', (t) => t * t], ['|t|', Math.abs], ['e^{-|t|}', (t) => Math.exp(-Math.abs(t))], ['t^4', (t) => t ** 4], ['\\cos(5t)', (t) => Math.cos(5 * t)], ['\\cos t', Math.cos]];
  const ODD = [['\\sin(3t)', (t) => Math.sin(3 * t)], ['t', (t) => t], ['t^3', (t) => t ** 3], ['\\sin t', Math.sin], ['\\sin(2t)', (t) => Math.sin(2 * t)]];
  const NEI = [['t + 1', (t) => t + 1, 'Tek ($t$) ile çift ($1$) parçanın toplamı: ikisi de sıfır olmadığı için ne çift ne tek.'], ['e^{-t}', (t) => Math.exp(-t), '$x(-t) = e^{t}$; bu ne $x(t)$’ye ne de $-x(t)$’ye eşit.'],
    ['u(t)', (t) => (t >= 0 ? 1 : 0), '$u(-t) \\ne u(t)$ ve $u(-t) \\ne -u(t)$. (Çift parçası $\\frac12$, tek parçası $\\frac12\\text{sgn}\\,t$.)'], ['t^2 + t', (t) => t * t + t, 'Çift ($t^2$) ve tek ($t$) parça birlikte var.'],
    ['\\cos t + \\sin t', (t) => Math.cos(t) + Math.sin(t), 'Çift ($\\cos$) ve tek ($\\sin$) parça birlikte var.'], ['(t+1)^2', (t) => (t + 1) ** 2, 'Açınca $t^2 + 2t + 1$: çift ($t^2+1$) ve tek ($2t$) parça birlikte var.'], ['e^{-t}u(t)', (t) => (t >= 0 ? Math.exp(-t) : 0), 'Yalnızca $t>0$ tarafında var; aynası $t<0$ tarafında. Ne çift ne tek.']];
  function genEO() {
    const r = rand();
    const OPTS = ['Çift', 'Tek', 'Ne çift ne tek'];
    if (r < 0.25) {
      const [tex, f, why] = pick(NEI);
      return { stem: '', parts: [{ skill: 'eo', q: m('x(t) = ' + tex) + ' sinyali nasıldır?', opts: OPTS, a: 2, why: SSmath(why) }], _f: f, _par: 0 };
    }
    if (r < 0.42) {
      const even = rand() < 0.5;
      const [a, b] = distinct(even ? EVEN : ODD, 2);
      return { stem: '', parts: [{ skill: 'eo', q: m('x(t) = ' + a[0] + ' + ' + b[0]) + ' sinyali nasıldır?', opts: OPTS, a: even ? 0 : 1,
        why: 'İki terim de ' + (even ? 'çift' : 'tek') + '. Aynı türden sinyallerin toplamı da o türdendir.' }], _f: (t) => a[1](t) + b[1](t), _par: even ? 1 : -1 };
    }
    const k = ri(2, 3);
    const facs = [];
    for (let i = 0; i < k; i++) facs.push(rand() < 0.5 ? ['ç'].concat(pick(EVEN)) : ['t'].concat(pick(ODD)));
    const nOdd = facs.filter((x) => x[0] === 't').length;
    const even = nOdd % 2 === 0;
    const tex = facs.map((x) => (/[+]/.test(x[1]) ? '(' + x[1] + ')' : x[1])).join('\\,\\cdot\\,');
    return { stem: '', parts: [{ skill: 'eo', q: m('x(t) = ' + tex) + ' sinyali nasıldır?', opts: OPTS, a: even ? 0 : 1,
      why: 'Çarpanlar: ' + facs.map((x) => m(x[1]) + ' ' + (x[0] === 'ç' ? 'çift' : 'tek')).join(', ') + '. İşaret kuralı gibi düşün (çift = +, tek = −): ' + nOdd + ' tane tek çarpan var, sonuç <strong>' + (even ? 'çift' : 'tek') + '</strong>.' }], _f: (t) => facs.reduce((p, x) => p * x[2](t), 1), _par: even ? 1 : -1 };
  }
  const SSmath = (s) => s; // açıklamalar zaten $...$ içerir

  /* ================= δ integrali ================= */
  function genDelta() {
    const t0 = ri(-3, 4);
    const c = pick([1, 1, 1, 2, -1, 3, -2, 2]);
    const d = c * t0;
    const pa = ri(1, 3), pb = ri(-4, 4), pc = ri(-3, 5);
    const kind = pick(['poly', 'poly', 'cos', 'cube']);
    let ptex, phi;
    if (kind === 'poly') { ptex = (pa === 1 ? '' : pa) + 't^2' + (pb ? (pb > 0 ? '+' : '-') + (Math.abs(pb) === 1 ? '' : Math.abs(pb)) + 't' : '') + (pc ? (pc > 0 ? '+' : '-') + Math.abs(pc) : ''); phi = (t) => pa * t * t + pb * t + pc; }
    else if (kind === 'cube') { ptex = 't^3' + (pc ? (pc > 0 ? '+' : '-') + Math.abs(pc) : ''); phi = (t) => t ** 3 + pc; }
    else { ptex = (pa + 1) + 't\\cos(\\pi t)' + (pc ? (pc > 0 ? '+' : '-') + Math.abs(pc) : ''); phi = (t) => (pa + 1) * t * (Math.abs(t) % 2 === 0 ? 1 : -1) + pc; }
    const dtex = c === 1 ? 't' + (t0 ? (t0 > 0 ? '-' : '+') + Math.abs(t0) : '') : c === -1 ? (t0 ? t0 + '-t' : '-t') : c + 't' + (d ? (d > 0 ? '-' : '+') + Math.abs(d) : '');
    let lo = null, hi = null, inside = true;
    if (rand() < 0.5) {
      if (rand() < 0.45) { // dışarıda
        if (rand() < 0.5) { lo = t0 + ri(1, 2); hi = lo + ri(2, 5); } else { hi = t0 - ri(1, 2); lo = hi - ri(2, 5); }
        inside = false;
      } else { lo = t0 - ri(1, 4); hi = t0 + ri(1, 4); }
    }
    const val = inside ? F(phi(t0), Math.abs(c)) : F(0);
    const lim = lo === null ? '\\int_{-\\infty}^{\\infty}' : '\\int_{' + lo + '}^{' + hi + '}';
    const dis = [];
    if (Math.abs(c) !== 1) dis.push(texF(F(phi(t0))));
    if (val.n !== 0) dis.push('0');
    if (!inside) dis.push(texF(F(phi(t0), Math.abs(c))));
    dis.push(texF(F(phi(d), 1)), texF(F(phi(-t0), Math.abs(c))), texF(F(val.n + val.d, val.d)), texF(F(val.n - val.d, val.d)), texF(F(val.n * Math.abs(c) * Math.abs(c), val.d)));
    const o = mkOpts(m(texF(val)), dis.filter((x) => x !== texF(val)).map(m));
    let why = 'İmpulsun yeri: ' + m(dtex + ' = 0 \\Rightarrow t_0 = ' + t0) + '. ';
    if (!inside) why += 'Ama ' + m('t_0 = ' + t0) + ', integral aralığı ' + m('[' + lo + ', ' + hi + ']') + '’nin <strong>dışında</strong>: sonuç 0.';
    else {
      if (Math.abs(c) !== 1) why += m('\\delta(' + dtex + ') = \\delta(' + c + '(t' + (t0 ? (t0 > 0 ? '-' : '+') + Math.abs(t0) : '') + ')) = \\frac{1}{' + Math.abs(c) + '}\\delta(t' + (t0 ? (t0 > 0 ? '-' : '+') + Math.abs(t0) : '') + ')') + '. ';
      else if (c === -1) why += m('\\delta') + ' çift olduğundan ' + m('\\delta(' + dtex + ') = \\delta(t' + (t0 ? (t0 > 0 ? '-' : '+') + Math.abs(t0) : '') + ')') + '. ';
      why += 'Elek özelliği: ' + m('\\phi(' + t0 + ') = ' + phi(t0)) + (Math.abs(c) !== 1 ? ', ' + m('\\frac{' + phi(t0) + '}{' + Math.abs(c) + '} = ' + texF(val)) : '') + '.';
    }
    return { stem: '', parts: [{ skill: 'delta', q: m(lim + '\\left(' + ptex + '\\right)\\delta(' + dtex + ')\\,dt') + ' kaçtır?', opts: o.opts, a: o.a, why }], _val: fval(val) };
  }

  /* ================= x(ct+d) hangi aralıkta? ================= */
  function genTF() {
    const a = ri(-3, 2), b = a + ri(2, 5);
    const c = pick([F(2), F(-1), F(1, 2), F(-2), F(3), F(1), F(-1, 2)]);
    let d = ri(-4, 4); if (feq(c, F(1)) && d === 0) d = 2;
    const e1 = fdiv(F(a - d), c), e2 = fdiv(F(b - d), c);
    const lo = fval(e1) < fval(e2) ? e1 : e2, hi = fval(e1) < fval(e2) ? e2 : e1;
    const iv = (p, q) => { const [l, h] = fval(p) <= fval(q) ? [p, q] : [q, p]; return m(texF(l) + ' < t < ' + texF(h)); };
    const ct = (feq(c, F(1)) ? '' : feq(c, F(-1)) ? '-' : c.d === 1 ? String(c.n) : (c.n < 0 ? '-' : '') + '\\frac{' + (Math.abs(c.n) === 1 ? '' : Math.abs(c.n)) + 't}{' + c.d + '}');
    const arg = (c.d === 1 ? ct + 't' : ct) + (d ? (d > 0 ? '+' : '-') + Math.abs(d) : '');
    const correct = iv(lo, hi);
    const dis = [iv(fmul(F(a), c), fmul(F(b), c)), iv(F(a * c.n + d * c.d, c.d), F(b * c.n + d * c.d, c.d)), iv(F(fdiv(F(a), c).n - d * fdiv(F(a), c).d, fdiv(F(a), c).d), F(fdiv(F(b), c).n - d * fdiv(F(b), c).d, fdiv(F(b), c).d)), iv(fdiv(F(a + d), c), fdiv(F(b + d), c)), iv(F(a - d), F(b - d))];
    // Yedek yanlış şıklar (simetrik aralıkta x(−t) gibi durumlarda yukarıdakiler doğruyla çakışabilir)
    const spare = [iv(F(lo.n + lo.d, lo.d), F(hi.n + hi.d, hi.d)), iv(F(lo.n - lo.d, lo.d), F(hi.n - hi.d, hi.d)), iv(lo, F(hi.n + 2 * hi.d, hi.d))];
    const o = mkOpts(correct, shuffle(dis).concat(spare));
    const neg = c.n < 0;
    return { stem: '', parts: [{ skill: 'tf', q: m('x(t)') + ' yalnızca ' + m(a + ' < t < ' + b) + ' aralığında sıfırdan farklı. ' + m('y(t) = x\\left(' + arg + '\\right)') + ' hangi aralıkta sıfırdan farklıdır?', opts: o.opts, a: o.a,
      why: 'İçerideki ifadeyi eşitsizliğe koy: ' + m(a + ' < ' + arg + ' < ' + b) + '. ' + (d ? 'Önce ' + m(String(d)) + '’' + 'i karşıya at: ' + m((a - d) + ' < ' + (c.d === 1 ? ct + 't' : ct) + ' < ' + (b - d)) + '. ' : '') + (feq(c, F(1)) ? '' : 'Sonra ' + m(texF(c)) + ' ile böl' + (neg ? ' (negatif sayıyla bölünce eşitsizlik <strong>yön değiştirir</strong>)' : '') + ': ') + correct + '. Kritik nokta kuralı: ' + m('t_k \\to \\frac{t_k - d}{c}') + '.' }], _lo: fval(lo), _hi: fval(hi), _c: fval(c), _d: d, _a: a, _b: b };
  }

  /* ================= Sistemler ================= */
  const Y = true, N = false;
  // Ek sistem havuzu (nottaki 23 sisteme ek). d: 1 = ayrık.
  const EXTRA = [
    { d: 0, tex: 'y(t) = x(t) + 2', L: [N, 'Sıfır giriş testi: $x = 0 \\Rightarrow y = 2 \\ne 0$.'], TI: [Y, 'Kuralda açık $t$ yok: $x(t-t_0) + 2 = y(t-t_0)$.'], C: [Y, 'Yalnızca $x(t)$.'], St: [Y, '$|y| \\le B + 2$.'] },
    { d: 0, tex: 'y(t) = t^2\\,x(t-1)', L: [Y, '$t^2$ girişten bağımsız bir katsayı: $t^2(ax_1 + bx_2)(t-1) = ay_1 + by_2$.'], TI: [N, 'Açık $t^2$ çarpanı: $T\\{x(t-t_0)\\} = t^2x(t-1-t_0) \\ne (t-t_0)^2x(t-1-t_0)$.'], C: [Y, 'Argüman $t-1 < t$.'], St: [N, '$x = 1$ için $y = t^2 \\to \\infty$.'] },
    { d: 1, tex: 'y[n] = x[n]\\,x[n-1]', L: [N, '$2x \\to 4x[n]x[n-1] \\ne 2y$.'], TI: [Y, 'Kuralda açık $n$ yok.'], C: [Y, 'Argümanlar $n$ ve $n-1$.'], St: [Y, '$|y| \\le B^2$.'] },
    { d: 0, tex: 'y(t) = x(-t)', L: [Y, 'Yeniden indisleme lineerdir.'], TI: [N, '$T\\{x(t-t_0)\\} = x(-t-t_0)$ ama $y(t-t_0) = x(-t+t_0)$.'], C: [N, '$t = -1$ için $y(-1) = x(1)$: gelecek.'], St: [Y, '$|y| \\le B$.'] },
    { d: 1, tex: 'y[n] = x[n+1] - x[n]', L: [Y, 'Kaydırılmış girişlerin lineer birleşimi.'], TI: [Y, 'Sabit kaydırmalar, sabit katsayılar.'], C: [N, '$x[n+1]$ gelecekteki örnek.'], St: [Y, '$|y| \\le 2B$.'] },
    { d: 1, tex: 'y[n] = \\sum_{k=-\\infty}^{n} x[k]', L: [Y, 'Toplam lineerdir.'], TI: [Y, '$\\sum_{k \\le n}x[k-n_0] = \\sum_{m \\le n-n_0}x[m] = y[n-n_0]$.'], C: [Y, 'Yalnızca $k \\le n$.'], St: [N, '$x = u[n]$ için $y = (n+1)u[n] \\to \\infty$.'] },
    { d: 0, tex: 'y(t) = |x(t)|', L: [N, '$x = -1 \\to 1$, ama $-1\\cdot T\\{1\\} = -1$: homojenlik bozuluyor.'], TI: [Y, 'Kuralda açık $t$ yok.'], C: [Y, 'Yalnızca $x(t)$.'], St: [Y, '$|y| = |x| \\le B$.'] },
    { d: 0, tex: 'y(t) = x\\left(\\frac{t}{3}\\right)', L: [Y, 'Zaman ölçekleme lineerdir.'], TI: [N, '$T\\{x(t-t_0)\\} = x(\\frac t3 - t_0)$ ama $y(t-t_0) = x(\\frac{t-t_0}{3})$.'], C: [N, '$t = -3$ için $y(-3) = x(-1)$ ve $-1 > -3$: negatif zamanda geleceğe bakıyor.'], St: [Y, '$|y| \\le B$.'] },
    { d: 1, tex: 'y[n] = \\frac{1}{3}\\left(x[n-1] + x[n] + x[n+1]\\right)', L: [Y, 'Lineer birleşim.'], TI: [Y, 'Sabit kaydırmalar.'], C: [N, '$x[n+1]$ gelecek.'], St: [Y, '$|y| \\le B$ (ortalama).'] },
    { d: 0, tex: 'y(t) = e^{-t}x(t)', L: [Y, '$e^{-t}$ girişten bağımsız bir çarpan.'], TI: [N, 'Çarpan zamana bağlı: $e^{-t}x(t-t_0) \\ne e^{-(t-t_0)}x(t-t_0)$.'], C: [Y, 'Yalnızca $x(t)$.'], St: [N, '$x = 1$ için $y = e^{-t}$; $t \\to -\\infty$ iken sınırsız büyür.'] },
    { d: 0, tex: 'y(t) = x(t)\\,u(t)', L: [Y, '$u(t)$ girişten bağımsız bir çarpan.'], TI: [N, '$t=0$’da açılan sabit bir anahtar: girişi kaydırırsan anahtar kaymaz.'], C: [Y, 'Yalnızca $x(t)$.'], St: [Y, '$|y| \\le |x| \\le B$.'] },
    { d: 1, tex: 'y[n] = x[n] + n', L: [N, 'Sıfır giriş: $y = n \\ne 0$.'], TI: [N, '$T\\{x[n-n_0]\\} = x[n-n_0] + n$ ama $y[n-n_0] = x[n-n_0] + n - n_0$.'], C: [Y, 'Yalnızca $x[n]$.'], St: [N, '$x = 0$ (sınırlı) için $y = n \\to \\infty$.'] },
    { d: 0, tex: 'y(t) = x(t)\\,x(t-2)', L: [N, '$2x \\to 4x(t)x(t-2) \\ne 2y$.'], TI: [Y, 'Kuralda açık $t$ yok.'], C: [Y, 'Argümanlar $t$ ve $t-2$.'], St: [Y, '$|y| \\le B^2$.'] },
    { d: 1, tex: 'y[n] = x[2n]', L: [Y, 'Yeniden indisleme lineerdir.'], TI: [N, '$T\\{x[n-n_0]\\} = x[2n-n_0]$ ama $y[n-n_0] = x[2n-2n_0]$.'], C: [N, '$y[1] = x[2]$: gelecek.'], St: [Y, '$|y| \\le B$.'] },
    { d: 0, tex: 'y(t) = \\frac{dx(t)}{dt}', L: [Y, 'Türev lineerdir.'], TI: [Y, '$\\frac{d}{dt}x(t-t_0) = y(t-t_0)$.'], C: [Y, 'Türev, girişin o andaki (ve hemen öncesindeki) davranışına bağlıdır.'], St: [N, '$x = u(t)$ sınırlı, ama türevi $\\delta(t)$ sınırsız. (Ya da $x = \\sin(t^2)$: türevi $2t\\cos(t^2)$ büyür.)'] },
    { d: 0, tex: 'y(t) = \\int_{t-2}^{t} x(\\tau)\\,d\\tau', L: [Y, 'İntegral lineerdir.'], TI: [Y, 'Pencere girişle birlikte kayar: $\\int_{t-2}^{t}x(\\tau - t_0)d\\tau = y(t-t_0)$.'], C: [Y, 'Yalnızca $\\tau \\le t$.'], St: [Y, '$|y| \\le 2B$ (sınırlı uzunlukta pencere).'] },
    { d: 0, tex: 'y(t) = \\int_{-\\infty}^{t+1} x(\\tau)\\,d\\tau', L: [Y, 'İntegral lineerdir.'], TI: [Y, 'Sınır girişle birlikte kayar.'], C: [N, 'Üst sınır $t+1 > t$: gelecek 1 saniyeyi kullanıyor.'], St: [N, '$x = u(t)$ için $y = (t+1)$, $t>-1$: sınırsız.'] },
    { d: 1, tex: 'y[n] = (-1)^n x[n]', L: [Y, '$(-1)^n$ girişten bağımsız bir çarpan.'], TI: [N, '$(-1)^n x[n-n_0] \\ne (-1)^{n-n_0}x[n-n_0]$ ($n_0$ tek ise).'], C: [Y, 'Yalnızca $x[n]$.'], St: [Y, '$|y| = |x| \\le B$.'] },
    { d: 0, tex: 'y(t) = 5x(t)', L: [Y, '$5(ax_1 + bx_2) = ay_1 + by_2$.'], TI: [Y, 'Sabit kazanç.'], C: [Y, 'Yalnızca $x(t)$.'], St: [Y, '$|y| \\le 5B$.'] },
    { d: 1, tex: 'y[n] = x[-n+2]', L: [Y, 'Yeniden indisleme lineerdir.'], TI: [N, '$T\\{x[n-n_0]\\} = x[-n+2-n_0]$ ama $y[n-n_0] = x[-n+n_0+2]$.'], C: [N, '$y[0] = x[2]$: gelecek.'], St: [Y, '$|y| \\le B$.'] },
    { d: 1, tex: 'y[n] = 2^n x[n]', L: [Y, '$2^n$ girişten bağımsız bir çarpan.'], TI: [N, 'Çarpan $n$’ye bağlı.'], C: [Y, 'Yalnızca $x[n]$.'], St: [N, '$x = 1$ için $y = 2^n \\to \\infty$.'] },
    { d: 0, tex: 'y(t) = \\cos(3t)\\,x(t+1)', L: [Y, '$\\cos 3t$ girişten bağımsız bir çarpan.'], TI: [N, 'Çarpan zamana bağlı.'], C: [N, '$x(t+1)$ gelecek. ($\\cos$’un içindeki $t$ değil, $x$’in argümanı önemli.)'], St: [Y, '$|y| \\le B$.'] },
    { d: 1, tex: 'y[n] = x[n-1] + 3', L: [N, 'Sıfır giriş: $y = 3$.'], TI: [Y, 'Kuralda açık $n$ yok.'], C: [Y, 'Geçmiş örnek.'], St: [Y, '$|y| \\le B + 3$.'] },
    { d: 0, tex: 'y(t) = x^2(t-1)', L: [N, 'Kare: $(x_1+x_2)^2 \\ne x_1^2 + x_2^2$.'], TI: [Y, 'Kuralda açık $t$ yok.'], C: [Y, 'Argüman $t-1$.'], St: [Y, '$|y| \\le B^2$.'] }
  ];
  function sysPool() { return (SS.SYSTEMS || []).filter((s) => s.id !== 'ode3' && s.id !== 'ode1').concat(EXTRA); }
  const SYSQ = { lin: ['L', 'Sistem <strong>lineer</strong> midir?'], ti: ['TI', 'Sistem <strong>ötelemeyle (zamanla) değişmez</strong> midir?'], caus: ['C', 'Sistem <strong>nedensel</strong> midir?'], stab: ['St', 'Sistem <strong>kararlı</strong> (BIBO) mıdır?'] };
  function sysPart(s, skill) {
    const [key, q] = SYSQ[skill];
    return { skill, q, opts: ['Evet', 'Hayır'], a: s[key][0] ? 0 : 1, why: (s[key][0] ? '<strong>Evet.</strong> ' : '<strong>Hayır.</strong> ') + s[key][1] };
  }
  function genSys(skill, only) {
    const s = pick(sysPool().filter((x) => only == null || !!x.d === !!only.d));
    const skills = skill === 'all' ? ['lin', 'ti', 'caus', 'stab'] : [skill];
    return { stem: 'Sistem: ' + m(s.tex), parts: skills.map((k) => sysPart(s, k)), _sys: s };
  }

  /* ================= Karma (sınav tipi) ================= */
  // Hocanın tarzı: tek soruda temel periyot + lineerlik + ötelemeyle değişmezlik + nedensellik + kararlılık.
  function genKarma() {
    const disc = rand() < 0.4;
    const sig = disc ? genPerD() : genPerC();
    const s = pick(sysPool().filter((x) => !!x.d === disc));
    const p0 = sig.parts[0];
    const sigTex = p0.q.replace(/ (sinyalinin|dizisinin) temel periyodu nedir\?$/, '');
    const parts = [{ skill: p0.skill, q: 'Giriş sinyalinin <strong>temel periyodu</strong> nedir?', opts: p0.opts, a: p0.a, why: p0.why }].concat(['lin', 'ti', 'caus', 'stab'].map((k) => sysPart(s, k)));
    return { stem: 'Giriş sinyali ' + sigTex + ', sistem ' + m(s.tex) + '.', parts, karma: true };
  }

  const SKILLS = [
    { id: 'perC', name: 'Temel periyot (sürekli)', lesson: '1.2', gen: genPerC },
    { id: 'perD', name: 'Temel periyot (ayrık)', lesson: '1.2', gen: genPerD },
    { id: 'ep', name: 'Enerji mi, güç mü?', lesson: '1.3', gen: genEP },
    { id: 'eo', name: 'Çift mi, tek mi?', lesson: '1.4', gen: genEO },
    { id: 'delta', name: 'δ’lı integral', lesson: '1.5', gen: genDelta },
    { id: 'tf', name: 'x(ct+d) aralığı', lesson: '1.7', gen: genTF },
    { id: 'lin', name: 'Lineer mi?', lesson: '1.8', gen: () => genSys('lin') },
    { id: 'caus', name: 'Nedensel mi?', lesson: '1.9', gen: () => genSys('caus') },
    { id: 'ti', name: 'Ötelemeyle değişmez mi?', lesson: '1.10', gen: () => genSys('ti') },
    { id: 'stab', name: 'Kararlı mı?', lesson: '1.11', gen: () => genSys('stab') }
  ];

  /* ---------- Aralıklı tekrar (Leitner kutuları) ---------- */
  // Kutu → bir sonraki tekrara kadar gün. Bugün çalışılan beceri en erken yarın tekrara düşer.
  const INTERVAL = [1, 1, 3, 7];
  const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5); // yerel gün
  function due(st, day) { return !st || !st.t || day - (st.last || 0) >= INTERVAL[st.box || 0]; }
  function record(stats, skill, ok, day) {
    const st = stats[skill] || (stats[skill] = { c: 0, t: 0, box: 0, last: 0, run: 0 });
    st.t++; if (ok) st.c++;
    st.run = ok ? (st.run || 0) + 1 : 0;
    // Aynı gün içinde art arda 3 doğru bir üst kutuya çıkarır; her yanlış başa döndürür.
    if (!ok) st.box = 0; else if (st.run >= 3) { st.box = Math.min(3, (st.box || 0) + 1); st.run = 0; }
    st.last = day;
    return st;
  }
  function priority(stats, id, day) {
    const st = stats[id];
    if (!st || !st.t) return 3 + rand() * 0.3;
    return (due(st, day) ? 2 : 0) + (1 - st.c / st.t) * 1.5 + (3 - (st.box || 0)) * 0.3 + rand() * 0.3;
  }
  // Karışık oturum: zayıf / süresi gelmiş becerilere ağırlık verir, sonra karıştırır (interleaving).
  function mixedSession(stats, n = 10, day = today()) {
    const order = SKILLS.map((s) => s.id).sort((a, b) => priority(stats, b, day) - priority(stats, a, day));
    const chosen = [];
    for (let i = 0; i < n; i++) chosen.push(i < Math.ceil(n * 0.6) ? order[i % Math.min(order.length, 5)] : pick(order));
    return shuffle(chosen).map((id) => SKILLS.find((s) => s.id === id).gen());
  }

  SS.trainer = { SKILLS, EXTRA, genSys, genKarma, mixedSession, record, due, today, INTERVAL, sysPool, _setRand: (f) => { rand = f; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = SS.trainer;
})(typeof window !== 'undefined' ? window : globalThis);
