/*
 * sig.js — Temel sinyaller ve sayısal yardımcılar (DOM'dan bağımsız).
 * Node.js ile de çalışır: module.exports = SS.sig
 */
(function (root) {
  'use strict';
  const SS = (root.SS = root.SS || {});

  const u = (t) => (t >= 0 ? 1 : 0);              // birim basamak (u(0)=1 çizim kolaylığı için)
  const r = (t) => (t >= 0 ? t : 0);              // birim rampa
  const rect = (t) => (Math.abs(t) < 0.5 ? 1 : Math.abs(t) === 0.5 ? 1 : 0); // Π(t): genişlik 1
  const tri = (t) => (Math.abs(t) < 1 ? 1 - Math.abs(t) : 0);              // Λ(t): taban [-1, 1]
  const dU = (n) => (n >= 0 ? 1 : 0);             // u[n]
  const dDelta = (n) => (n === 0 ? 1 : 0);        // δ[n]

  // Parçalı fonksiyon: [[başlangıç, bitiş, f(t)], ...] dışarıda 0.
  function piecewise(pieces) {
    return (t) => {
      for (const [a, b, f] of pieces) if (t >= a && t < b) return f(t);
      return 0;
    };
  }

  function linspace(a, b, n) {
    const out = new Float64Array(n);
    const h = (b - a) / (n - 1);
    for (let i = 0; i < n; i++) out[i] = a + i * h;
    return out;
  }

  // Sürekli konvolüsyon (sayısal): f ve g [a,b] aralığında dt ile örneklenir.
  // Sonuç: y(t) için örnek dizisi ve t ekseni.
  function convolveContinuous(f, g, a, b, dt) {
    const n = Math.round((b - a) / dt) + 1;
    const F = new Float64Array(n), G = new Float64Array(n);
    for (let i = 0; i < n; i++) { const t = a + i * dt; F[i] = f(t); G[i] = g(t); }
    // y(t) = Σ f(τ) g(t-τ) dt;  t = 2a + k dt
    const m = 2 * n - 1;
    const Y = new Float64Array(m);
    for (let i = 0; i < n; i++) {
      const fi = F[i];
      if (fi === 0) continue;
      for (let j = 0; j < n; j++) Y[i + j] += fi * G[j];
    }
    for (let k = 0; k < m; k++) Y[k] *= dt;
    const t0 = 2 * a;
    return {
      t0, dt, Y,
      at(t) {
        const x = (t - t0) / dt;
        const k = Math.floor(x);
        if (k < 0 || k >= m - 1) return 0;
        const w = x - k;
        return Y[k] * (1 - w) + Y[k + 1] * w;
      }
    };
  }

  // Ayrık konvolüsyon: x ve h nesneleri {start, v:[...]}.
  function convolveDiscrete(x, h) {
    const v = new Array(x.v.length + h.v.length - 1).fill(0);
    for (let i = 0; i < x.v.length; i++) for (let j = 0; j < h.v.length; j++) v[i + j] += x.v[i] * h.v[j];
    return { start: x.start + h.start, v };
  }
  const seqAt = (s, n) => {
    const k = n - s.start;
    return k >= 0 && k < s.v.length ? s.v[k] : 0;
  };

  // Güvenli küçük ifade çözücü: sayılar, + - * / ( ), pi / π, sqrt
  function evalExpr(str) {
    const s = String(str).trim().replace(/π/g, 'pi').replace(/,/g, '.');
    if (!s || !/^[0-9.+\-*/()\s pisqrt]*$/.test(s)) return NaN;
    const js = s.replace(/sqrt/g, 'Math.sqrt').replace(/pi/g, '(Math.PI)').replace(/(\d|\))\s*\(/g, '$1*(').replace(/(\d)\s*\(Math/g, '$1*(Math');
    try {
      // Yalnızca yukarıdaki karakterlere izin verildiği için güvenlidir.
      const v = Function('"use strict";return (' + js + ')')();
      return typeof v === 'number' && isFinite(v) ? v : NaN;
    } catch (e) {
      return NaN;
    }
  }

  // Bir oranı küçük paydalı kesre yaklaştır (sürekli kesir). Bulamazsa null.
  function toFraction(x, maxDen = 200, tol = 1e-9) {
    if (!isFinite(x)) return null;
    let h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
    for (let iter = 0; iter < 40; iter++) {
      const a = Math.floor(b);
      const h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > maxDen) break;
      if (Math.abs(x - h2 / k2) < tol * Math.max(1, Math.abs(x))) return [h2, k2];
      h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      const frac = b - a;
      if (frac < 1e-12) break;
      b = 1 / frac;
    }
    return null;
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

  // Bir sayıyı π katı olarak okunur yaz: 2.0944 → "2π/3"
  function fmtPi(x, opts) {
    if (!isFinite(x)) return '∞';
    if (Math.abs(x) < 1e-12) return '0';
    const fr = toFraction(x / Math.PI, 60, 1e-9);
    if (fr) {
      const [p, q] = fr;
      const sign = p < 0 ? '−' : '';
      const ap = Math.abs(p);
      const num = ap === 1 ? 'π' : ap + 'π';
      return sign + (q === 1 ? num : num + '/' + q);
    }
    return fmt(x, opts && opts.digits);
  }
  function texPi(x) {
    if (!isFinite(x)) return '\\infty';
    if (Math.abs(x) < 1e-12) return '0';
    const fr = toFraction(x / Math.PI, 60, 1e-9);
    if (fr) {
      const [p, q] = fr;
      const sign = p < 0 ? '-' : '';
      const ap = Math.abs(p);
      const num = ap === 1 ? '\\pi' : ap + '\\pi';
      return sign + (q === 1 ? num : '\\frac{' + num + '}{' + q + '}');
    }
    const f2 = toFraction(x, 60, 1e-9);
    if (f2 && f2[1] !== 1) return (f2[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f2[0]) + '}{' + f2[1] + '}';
    return fmt(x);
  }

  function fmt(x, digits = 3) {
    if (!isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '—';
    if (Math.abs(x) < 1e-10) return '0';
    const s = Number(x.toFixed(digits)).toString();
    return s.replace('-', '−');
  }

  // Sayısal integral (yamuk kuralı)
  function integrate(f, a, b, n = 2000) {
    if (b <= a) return 0;
    const h = (b - a) / n;
    let s = 0.5 * (f(a) + f(b));
    for (let i = 1; i < n; i++) s += f(a + i * h);
    return s * h;
  }

  SS.sig = { u, r, rect, tri, dU, dDelta, piecewise, linspace, convolveContinuous, convolveDiscrete, seqAt, evalExpr, toFraction, gcd, lcm, fmtPi, texPi, fmt, integrate };
  if (typeof module !== 'undefined' && module.exports) module.exports = SS.sig;
})(typeof window !== 'undefined' ? window : globalThis);
