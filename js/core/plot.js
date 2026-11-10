/*
 * plot.js — Canvas üzerine sinyal çizimi. Sürekli eğri, ayrık (stem) dizi, impuls oku,
 * taralı alan, dikey/yatay çizgi ve etiket katmanlarını destekler.
 *
 * SS.plot(canvas, spec)
 *   spec = { x:[a,b], y:[c,d], h:200, xLabel:'t', yLabel:'x(t)', xStep, yStep, piTicks,
 *            layers:[ {kind:'fn', f, color:'x', w, dash, fill}, {kind:'stem', n:[], v:[], color}, ... ] }
 * Renk adları ('x','h','y','muted','warn','ink','accent') CSS değişkenlerinden okunur;
 * böylece açık/koyu temada aynı anlamı korur.
 */
(function () {
  'use strict';
  const SS = (window.SS = window.SS || {});
  const live = new Set();

  const COLOR_VARS = { x: '--c-x', h: '--c-h', y: '--c-y', muted: '--muted', warn: '--c-warn', ink: '--ink', grid: '--grid', axis: '--axis', accent: '--c-acc', soft: '--line', 'surface-solid': '--surface' };
  function color(name, alpha) {
    let c = name || 'x';
    if (COLOR_VARS[c]) c = getComputedStyle(document.documentElement).getPropertyValue(COLOR_VARS[c]).trim() || '#333';
    if (alpha == null || alpha >= 1) return c;
    // #rrggbb → rgba
    const m = /^#([0-9a-f]{6})$/i.exec(c);
    if (m) {
      const n = parseInt(m[1], 16);
      return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
    }
    return c;
  }

  function niceStep(range, target) {
    const raw = range / target;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = raw / p;
    return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
  }

  function fmtTick(v, step) {
    if (Math.abs(v) < step * 1e-6) return '0';
    const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    return Number(v.toFixed(Math.min(d, 3))).toString().replace('-', '−');
  }

  function draw(canvas) {
    const spec = canvas._spec;
    if (!spec || !canvas.isConnected) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 600;
    const H = spec.h || 200;
    canvas.style.height = H + 'px';
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const M = { l: spec.yLabel ? 40 : 34, r: 12, t: spec.title ? 22 : 12, b: 24 };
    const [x0, x1] = spec.x;
    const [y0, y1] = spec.y;
    const pw = W - M.l - M.r, ph = H - M.t - M.b;
    const X = (x) => M.l + ((x - x0) / (x1 - x0)) * pw;
    const Y = (y) => M.t + (1 - (y - y0) / (y1 - y0)) * ph;
    canvas._map = { X, Y, M, pw, ph, x0, x1, y0, y1, W, H };

    const font = '12px ' + getComputedStyle(document.body).fontFamily;
    ctx.font = font;

    // Izgara ve eksen etiketleri
    const xs = spec.xStep || niceStep(x1 - x0, Math.max(4, Math.min(12, pw / 60)));
    const ys = spec.yStep || niceStep(y1 - y0, Math.max(3, Math.min(8, ph / 34)));
    ctx.lineWidth = 1;
    ctx.strokeStyle = color('grid');
    ctx.fillStyle = color('muted');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let v = Math.ceil(x0 / xs) * xs; v <= x1 + 1e-9; v += xs) {
      const px = Math.round(X(v)) + 0.5;
      ctx.beginPath(); ctx.moveTo(px, M.t); ctx.lineTo(px, M.t + ph); ctx.stroke();
      let lbl = spec.piTicks ? SS.sig.fmtPi(v) : fmtTick(v, xs);
      if (spec.xTickFmt) lbl = spec.xTickFmt(v);
      ctx.fillText(lbl, px, M.t + ph + 6);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let v = Math.ceil(y0 / ys) * ys; v <= y1 + 1e-9; v += ys) {
      const py = Math.round(Y(v)) + 0.5;
      ctx.beginPath(); ctx.moveTo(M.l, py); ctx.lineTo(M.l + pw, py); ctx.stroke();
      ctx.fillText(fmtTick(v, ys), M.l - 6, py);
    }

    // Sıfır eksenleri
    ctx.strokeStyle = color('axis');
    ctx.lineWidth = 1.3;
    if (y0 <= 0 && y1 >= 0) { const py = Math.round(Y(0)) + 0.5; ctx.beginPath(); ctx.moveTo(M.l, py); ctx.lineTo(M.l + pw, py); ctx.stroke(); }
    if (x0 <= 0 && x1 >= 0) { const px = Math.round(X(0)) + 0.5; ctx.beginPath(); ctx.moveTo(px, M.t); ctx.lineTo(px, M.t + ph); ctx.stroke(); }

    // Eksen adları
    ctx.fillStyle = color('muted');
    ctx.font = 'italic 13px Cambria, "Times New Roman", serif';
    if (spec.xLabel) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(spec.xLabel, M.l + pw - 2, (y0 <= 0 && y1 >= 0 ? Y(0) : M.t + ph) - 4); }
    if (spec.yLabel) { ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(spec.yLabel, (x0 <= 0 && x1 >= 0 ? X(0) : M.l) + 5, M.t + 2); }
    if (spec.title) { ctx.font = '600 12.5px ' + getComputedStyle(document.body).fontFamily; ctx.fillStyle = color('ink'); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(spec.title, M.l, 4); }
    ctx.font = font;

    // Katmanlar çizim alanına kırpılır
    ctx.save();
    ctx.beginPath(); ctx.rect(M.l - 1, M.t - 8, pw + 2, ph + 9); ctx.clip();
    for (const L of spec.layers || []) {
      if (!L) continue;
      try { drawLayer(ctx, L, { X, Y, x0, x1, y0, y1, M, pw, ph }); } catch (e) { /* tek katman hatası tüm çizimi bozmasın */ console.error(e); }
    }
    ctx.restore();
  }

  function drawLayer(ctx, L, m) {
    const { X, Y, x0, x1, y0, y1 } = m;
    const col = color(L.color || 'x');
    ctx.setLineDash(L.dash || []);
    switch (L.kind) {
      case 'band': {
        ctx.fillStyle = color(L.color || 'warn', L.alpha == null ? 0.08 : L.alpha);
        const a = Math.max(L.from, x0), b = Math.min(L.to, x1);
        if (b > a) ctx.fillRect(X(a), m.M.t, X(b) - X(a), m.ph);
        if (L.label) { ctx.fillStyle = color(L.color || 'warn', 0.9); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.font = '11.5px ' + getComputedStyle(document.body).fontFamily; ctx.fillText(L.label, X(a) + 4, m.M.t + 4); }
        break;
      }
      case 'fn':
      case 'area': {
        const a = Math.max(L.from != null ? L.from : x0, x0);
        const b = Math.min(L.to != null ? L.to : x1, x1);
        if (b <= a) break;
        const n = L.n || Math.max(400, Math.round((X(b) - X(a)) * 2));
        const pts = [];
        for (let i = 0; i <= n; i++) {
          const t = a + ((b - a) * i) / n;
          let v = L.f(t);
          if (L.kind === 'area' && L.g) v = [v, L.g(t)];
          pts.push([t, v]);
        }
        if (L.kind === 'area' || L.fill) {
          ctx.fillStyle = color(L.fillColor || L.color || 'x', L.alpha == null ? 0.22 : L.alpha);
          ctx.beginPath();
          ctx.moveTo(X(a), Y(0));
          for (const [t, v] of pts) { const vv = Array.isArray(v) ? v[0] : v; ctx.lineTo(X(t), Y(isFinite(vv) ? clampV(vv, y0, y1) : 0)); }
          ctx.lineTo(X(b), Y(0));
          ctx.closePath();
          ctx.fill();
        }
        if (L.kind === 'fn') {
          ctx.strokeStyle = col;
          ctx.lineWidth = L.w || 2.2;
          ctx.lineJoin = 'round';
          ctx.globalAlpha = L.opacity == null ? 1 : L.opacity;
          ctx.beginPath();
          let pen = false;
          for (const [t, v] of pts) {
            if (!isFinite(v)) { pen = false; continue; }
            const py = Y(clampV(v, y0 - (y1 - y0), y1 + (y1 - y0)));
            if (!pen) { ctx.moveTo(X(t), py); pen = true; } else ctx.lineTo(X(t), py);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        break;
      }
      case 'stem': {
        const r = L.r || 3.6;
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.lineWidth = L.w || 2;
        ctx.globalAlpha = L.opacity == null ? 1 : L.opacity;
        for (let i = 0; i < L.n.length; i++) {
          const n = L.n[i], v = L.v[i];
          if (n < x0 - 1e-9 || n > x1 + 1e-9 || !isFinite(v)) continue;
          const px = X(n) + (L.offset || 0), py = Y(clampV(v, y0, y1));
          if (L.ringOnly) { ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.stroke(); continue; }
          ctx.beginPath(); ctx.moveTo(px, Y(0)); ctx.lineTo(px, py); ctx.stroke();
          ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
          if (L.hollow) { ctx.fillStyle = color('surface-solid') || '#fff'; ctx.fill(); ctx.stroke(); ctx.fillStyle = col; } else ctx.fill();
          if (L.labels) {
            ctx.font = '600 11px ' + getComputedStyle(document.body).fontFamily;
            ctx.textAlign = 'center';
            ctx.textBaseline = v >= 0 ? 'bottom' : 'top';
            ctx.fillText(SS.sig.fmt(v, 2), px, py + (v >= 0 ? -6 : 6));
          }
        }
        ctx.globalAlpha = 1;
        break;
      }
      case 'impulse': {
        const px = X(L.at), base = Y(0), tip = Y(clampV(L.amp, y0, y1));
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = L.w || 2.4;
        ctx.beginPath(); ctx.moveTo(px, base); ctx.lineTo(px, tip); ctx.stroke();
        const dir = L.amp >= 0 ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(px, tip - dir * 2); ctx.lineTo(px - 6, tip + dir * 9); ctx.lineTo(px + 6, tip + dir * 9); ctx.closePath(); ctx.fill();
        if (L.label) {
          ctx.font = '12px ' + getComputedStyle(document.body).fontFamily;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(L.label, px + 8, tip + dir * 6);
        }
        break;
      }
      case 'vline':
      case 'hline': {
        ctx.strokeStyle = color(L.color || 'muted');
        ctx.lineWidth = L.w || 1.4;
        ctx.setLineDash(L.dash || [5, 4]);
        ctx.beginPath();
        if (L.kind === 'vline') { ctx.moveTo(X(L.x), m.M.t); ctx.lineTo(X(L.x), m.M.t + m.ph); }
        else { ctx.moveTo(m.M.l, Y(L.y)); ctx.lineTo(m.M.l + m.pw, Y(L.y)); }
        ctx.stroke();
        ctx.setLineDash([]);
        if (L.label) {
          ctx.fillStyle = color(L.color || 'muted');
          ctx.font = '600 11.5px ' + getComputedStyle(document.body).fontFamily;
          if (L.kind === 'vline') { ctx.textAlign = L.align || 'left'; ctx.textBaseline = 'top'; ctx.fillText(L.label, X(L.x) + (L.align === 'right' ? -5 : 5), m.M.t + 2); }
          else { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(L.label, m.M.l + m.pw - 4, Y(L.y) - 3); }
        }
        break;
      }
      case 'dot': {
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(X(L.x), Y(L.y), L.r || 5, 0, Math.PI * 2); ctx.fill();
        if (L.ring) { ctx.strokeStyle = color('surface-solid'); ctx.lineWidth = 2; ctx.stroke(); }
        if (L.label) {
          ctx.font = '600 12px ' + getComputedStyle(document.body).fontFamily;
          ctx.textAlign = L.align || 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText(L.label, X(L.x) + (L.align === 'right' ? -8 : 8), Y(L.y) - 6);
        }
        break;
      }
      case 'poly': {
        ctx.strokeStyle = col; ctx.lineWidth = L.w || 2.2; ctx.lineJoin = 'round';
        ctx.beginPath();
        L.pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
        if (L.fill) { ctx.fillStyle = color(L.color, L.alpha || 0.2); ctx.fill(); }
        ctx.stroke();
        break;
      }
      case 'text': {
        ctx.fillStyle = col;
        ctx.font = (L.bold ? '600 ' : '') + (L.size || 12) + 'px ' + (L.serif ? 'Cambria, "Times New Roman", serif' : getComputedStyle(document.body).fontFamily);
        ctx.textAlign = L.align || 'left';
        ctx.textBaseline = L.base || 'middle';
        ctx.fillText(L.text, X(L.x) + (L.dx || 0), Y(L.y) + (L.dy || 0));
        break;
      }
    }
    ctx.setLineDash([]);
  }

  const clampV = (v, a, b) => (v < a ? a : v > b ? b : v);

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver((entries) => {
    for (const e of entries) draw(e.target);
  }) : null;

  SS.plot = function (canvas, spec) {
    canvas._spec = spec;
    if (!live.has(canvas)) {
      live.add(canvas);
      if (ro) ro.observe(canvas);
    }
    draw(canvas);
    return canvas;
  };

  // Yeni tuval oluşturup çizer (statik şekiller için)
  SS.figure = function (spec, cls) {
    const c = document.createElement('canvas');
    c.className = 'plot' + (cls ? ' ' + cls : '');
    c.style.height = (spec.h || 200) + 'px';
    requestAnimationFrame(() => SS.plot(c, spec));
    c._spec = spec;
    return c;
  };

  SS.redrawAll = function () {
    for (const c of Array.from(live)) {
      if (!c.isConnected) { live.delete(c); if (ro) ro.unobserve(c); continue; }
      draw(c);
    }
  };

  // Otomatik y aralığı: fonksiyonları tarar, biraz pay bırakır
  SS.autoY = function (fns, x0, x1, opts = {}) {
    let lo = opts.min != null ? opts.min : 0, hi = opts.max != null ? opts.max : 0;
    for (const f of fns) {
      for (let i = 0; i <= 600; i++) {
        const v = f(x0 + ((x1 - x0) * i) / 600);
        if (isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; }
      }
    }
    if (hi - lo < 1e-9) { hi += 1; lo -= 1; }
    const pad = (hi - lo) * (opts.pad == null ? 0.12 : opts.pad);
    return [lo < 0 ? lo - pad : Math.min(lo, -pad * 0.5), hi + pad];
  };

  // Ayrık dizi için y aralığı
  SS.autoYv = function (arrs, opts = {}) {
    let lo = 0, hi = 0;
    for (const a of arrs) for (const v of a) if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    if (hi - lo < 1e-9) hi = lo + 1;
    const pad = (hi - lo) * (opts.pad == null ? 0.15 : opts.pad);
    return [lo < 0 ? lo - pad : -pad * 0.5, hi + pad];
  };

  window.addEventListener('ss-theme', () => SS.redrawAll());
})();
