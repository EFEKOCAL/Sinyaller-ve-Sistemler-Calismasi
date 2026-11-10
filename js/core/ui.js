/*
 * ui.js — Laboratuvarlar için küçük arayüz parçaları (kaydırıcı, seçim kutusu, sekme, oynat düğmesi).
 */
(function () {
  'use strict';
  const SS = (window.SS = window.SS || {});

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
        else e.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
    return e;
  }
  SS.el = el;

  // Matematik içeren HTML'i bir öğeye yazar ve parantezleri düzeltir.
  SS.setMath = function (node, html) {
    node.innerHTML = SS.renderMath(html);
    SS.fixMath(node);
  };

  const ui = (SS.ui = {});

  ui.lab = function (title, desc) {
    const head = el('div', { class: 'lab-head' },
      el('span', { class: 'lab-badge' }, 'Laboratuvar'),
      el('h3', { class: 'lab-title' }, title));
    const root = el('section', { class: 'lab' }, head);
    if (desc) root.append(el('p', { class: 'lab-desc', html: SS.renderMath(desc) }));
    const controls = el('div', { class: 'lab-controls' });
    const body = el('div', { class: 'lab-body' });
    const readout = el('div', { class: 'lab-readout' });
    root.append(controls, body, readout);
    SS.fixMath(root);
    return { root, head, controls, body, readout };
  };

  ui.canvas = function (h, cls) {
    const c = el('canvas', { class: 'plot' + (cls ? ' ' + cls : '') });
    c.style.height = (h || 200) + 'px';
    return c;
  };

  ui.slider = function ({ label, min, max, step, value, fmt, onInput, wide }) {
    const out = el('output', { class: 'ctl-val' });
    const input = el('input', { type: 'range', min, max, step: step || 'any', value });
    const show = () => { out.innerHTML = SS.renderMath(fmt ? fmt(+input.value) : String(+input.value)); };
    input.addEventListener('input', () => { show(); onInput && onInput(+input.value); });
    show();
    const wrap = el('label', { class: 'ctl ctl-slider' + (wide ? ' ctl-wide' : '') },
      el('span', { class: 'ctl-label', html: SS.renderMath(label) }), input, out);
    return {
      el: wrap, input,
      get: () => +input.value,
      set: (v, silent) => { input.value = v; show(); if (!silent && onInput) onInput(+input.value); },
      setRange: (a, b, s) => { input.min = a; input.max = b; if (s) input.step = s; show(); }
    };
  };

  ui.select = function ({ label, options, value, onChange }) {
    const sel = el('select', null, options.map((o) => el('option', { value: o.value }, o.label)));
    if (value != null) sel.value = value;
    sel.addEventListener('change', () => onChange && onChange(sel.value));
    const wrap = el('label', { class: 'ctl ctl-select' }, label ? el('span', { class: 'ctl-label', html: SS.renderMath(label) }) : null, sel);
    return { el: wrap, sel, get: () => sel.value, set: (v, silent) => { sel.value = v; if (!silent && onChange) onChange(v); } };
  };

  ui.seg = function ({ label, options, value, onChange }) {
    const wrap = el('div', { class: 'ctl ctl-seg', role: 'group' });
    if (label) wrap.append(el('span', { class: 'ctl-label', html: SS.renderMath(label) }));
    const box = el('div', { class: 'seg' });
    let cur = value != null ? value : options[0].value;
    const btns = options.map((o) => {
      const b = el('button', { type: 'button', class: 'seg-btn', html: SS.renderMath(o.label), 'aria-pressed': String(o.value === cur) });
      b.addEventListener('click', () => { api.set(o.value); });
      box.append(b);
      return [o.value, b];
    });
    wrap.append(box);
    const api = {
      el: wrap,
      get: () => cur,
      set: (v, silent) => {
        cur = v;
        btns.forEach(([val, b]) => b.setAttribute('aria-pressed', String(val === v)));
        if (!silent && onChange) onChange(v);
      }
    };
    return api;
  };

  ui.check = function ({ label, value, onChange }) {
    const input = el('input', { type: 'checkbox' });
    input.checked = !!value;
    input.addEventListener('change', () => onChange && onChange(input.checked));
    return { el: el('label', { class: 'ctl ctl-check' }, input, el('span', { html: SS.renderMath(label) })), get: () => input.checked, set: (v) => { input.checked = v; } };
  };

  ui.button = function (label, onClick, cls) {
    return el('button', { type: 'button', class: 'btn ' + (cls || ''), html: SS.renderMath(label), onclick: onClick });
  };

  ui.tabs = function (names, onSwitch) {
    const bar = el('div', { class: 'lab-tabs', role: 'tablist' });
    let cur = 0;
    const btns = names.map((n, i) => {
      const b = el('button', { type: 'button', role: 'tab', class: 'lab-tab', 'aria-selected': String(i === 0), html: SS.renderMath(n) });
      b.addEventListener('click', () => api.set(i));
      bar.append(b);
      return b;
    });
    const api = {
      el: bar,
      get: () => cur,
      set: (i, silent) => {
        cur = i;
        btns.forEach((b, j) => b.setAttribute('aria-selected', String(i === j)));
        if (!silent) onSwitch(i);
      }
    };
    return api;
  };

  // Oynat/duraklat: tick(dt saniye) false dönerse durur.
  ui.player = function (tick, label) {
    let raf = 0, last = 0;
    const b = el('button', { type: 'button', class: 'btn btn-play' });
    const paint = () => { b.innerHTML = raf ? '❚❚ Duraklat' : '▶ ' + (label || 'Oynat'); };
    const loop = (ts) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      if (!b.isConnected || tick(dt) === false) { raf = 0; last = 0; paint(); return; }
      raf = requestAnimationFrame(loop);
    };
    const api = {
      el: b,
      playing: () => !!raf,
      play() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); paint(); } },
      stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; paint(); }
    };
    b.addEventListener('click', () => (raf ? api.stop() : api.play()));
    paint();
    return api;
  };

  // Okuma satırı: [["etiket", "değer(html/math)"], ...]
  ui.readout = function (node, rows, verdict) {
    node.innerHTML = '';
    const grid = el('div', { class: 'ro-grid' });
    for (const [k, v, cls] of rows) {
      grid.append(el('div', { class: 'ro-item' + (cls ? ' ' + cls : '') },
        el('span', { class: 'ro-k', html: SS.renderMath(k) }),
        el('span', { class: 'ro-v', html: SS.renderMath(v) })));
    }
    node.append(grid);
    if (verdict) node.append(el('div', { class: 'verdict verdict-' + (verdict.tone || 'info'), html: SS.renderMath(verdict.html) }));
    SS.fixMath(node);
  };

  // Lejant: [['x', 'x(t)'], ['h', 'h(t-τ)']]
  ui.legend = function (items) {
    return el('div', { class: 'legend' }, items.map(([c, t, dash]) =>
      el('span', { class: 'lg-item' }, el('span', { class: 'lg-sw lg-' + c + (dash ? ' lg-dash' : '') }), el('span', { html: SS.renderMath(t) }))));
  };

  ui.row = (...kids) => el('div', { class: 'ctl-row' }, ...kids);
})();
