/*
 * lab-systems.js — Sistem test tezgâhı
 * Nottaki sistemleri dört özellik için sayısal olarak sınar:
 *   lineerlik, zamanla (ötelemeyle) değişmezlik, nedensellik, kararlılık (+ bellek).
 * Bir testin "eşit" çıkması ispat değildir; "eşit değil" çıkması ise kesin bir karşı örnektir.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el, ui = SS.ui, S = SS.sig;
  SS.labs = SS.labs || {};
  const pbox = (canvas, legend, cap) => el('div', { class: 'plot-box' }, cap ? el('div', { class: 'plot-cap', html: SS.renderMath(cap) }) : null, legend ? ui.legend(legend) : null, canvas);

  // Izgarada çözülen sistemler (integral, diferansiyel denklem)
  function gridSys(xf, step) {
    const a = -14, b = 42, dt = 0.004;
    const n = Math.round((b - a) / dt) + 1;
    const Y = new Float64Array(n);
    let y = 0;
    for (let i = 0; i < n; i++) { const t = a + i * dt; Y[i] = y; y = step(y, xf(t), t, dt); }
    return (t) => {
      const k = (t - a) / dt, i = Math.floor(k);
      if (i < 0) return 0;
      if (i >= n - 1) return Y[n - 1];
      return Y[i] + (Y[i + 1] - Y[i]) * (k - i);
    };
  }

  const Y = true, N = false;
  // [özellik, açıklama]
  const SYS = [
    { id: 'sq', d: 0, tex: 'y(t) = x^2(t)', src: 's. 55', f: (x) => (t) => x(t) ** 2,
      L: [N, '$(ax_1+bx_2)^2 \\ne ax_1^2 + bx_2^2$. Çapraz terim $2ab\\,x_1x_2$ fazladan çıkar.'], TI: [Y, 'Kural zamana bağlı değil: $x(t-t_0)^2 = y(t-t_0)$.'], C: [Y, 'Yalnızca şu anki $x(t)$ kullanılıyor.'], St: [Y, '$|x|\\le B \\Rightarrow |y| \\le B^2$.'], M: [N, 'Belleksiz: $y(t)$ yalnızca $x(t)$’ye bağlı.'] },
    { id: 'tx', d: 0, tex: 'y(t) = t\\,x(t)', src: 's. 56, 68', f: (x) => (t) => t * x(t),
      L: [Y, '$t(ax_1+bx_2) = a\\,t x_1 + b\\,t x_2$.'], TI: [N, 'Çarpan $t$ zamanla değişiyor: $T\\{x(t-t_0)\\} = t\\,x(t-t_0)$ ama $y(t-t_0) = (t-t_0)x(t-t_0)$.'], C: [Y, 'Yalnızca şu anki $x(t)$.'], St: [N, '$x(t)=1$ (sınırlı) için $y(t)=t$ sınırsız büyür.'], M: [N, 'Belleksiz.'] },
    { id: 'd2', d: 1, tex: 'y[n] = x[n-2]', src: 's. 56', f: (x) => (n) => x(n - 2),
      L: [Y, 'Gecikme lineerdir: $a x_1[n-2] + b x_2[n-2]$.'], TI: [Y, 'Saf gecikme zamanla değişmez.'], C: [Y, 'Yalnızca geçmiş ($n-2$).'], St: [Y, '$|y[n]| = |x[n-2]| \\le B$.'], M: [Y, 'Bellekli: 2 adım öncesini hatırlıyor.'] },
    { id: 'xu', d: 1, tex: 'y[n] = x[n]\\,u[n-1]', src: 'ödev s. 56', f: (x) => (n) => x(n) * (n >= 1 ? 1 : 0),
      L: [Y, '$u[n-1]$ girişten bağımsız bir çarpan: lineer.'], TI: [N, '$n=1$’de “açılan” bir anahtar var. Girişi kaydırırsan anahtar kaymaz.'], C: [Y, 'Şu anki $x[n]$.'], St: [Y, '$|y| \\le |x| \\le B$.'], M: [N, 'Belleksiz.'] },
    { id: 'sin', d: 0, tex: 'y(t) = \\sin[x(t)]', src: 's. 56, 66', f: (x) => (t) => Math.sin(x(t)),
      L: [N, '$\\sin(a+b) \\ne \\sin a + \\sin b$.'], TI: [Y, 'Kural $t$ içermiyor.'], C: [Y, 'Şu anki değer.'], St: [Y, '$|\\sin(\\cdot)| \\le 1$: her giriş için sınırlı.'], M: [N, 'Belleksiz.'] },
    { id: 'cube', d: 0, tex: 'y(t) = x^3(t)', src: 's. 56', f: (x) => (t) => x(t) ** 3,
      L: [N, '$(x_1+x_2)^3 \\ne x_1^3 + x_2^3$.'], TI: [Y, 'Kural $t$ içermiyor.'], C: [Y, 'Şu anki değer.'], St: [Y, '$|y| \\le B^3$.'], M: [N, 'Belleksiz.'] },
    { id: 'ode3', d: 0, tex: '\\frac{dy}{dt} + 3y(t) = x(t)', src: 's. 57', f: (x) => gridSys(x, (y, xv, t, dt) => y + dt * (xv - 3 * y)),
      L: [Y, 'Sabit katsayılı lineer diferansiyel denklem (sıfır başlangıç koşuluyla): iki denklemi $k_1$, $k_2$ ile çarpıp topla.'], TI: [Y, 'Katsayılar sabit (zamana bağlı değil).'], C: [Y, 'Çözüm $y(t) = \\int_{-\\infty}^t e^{-3(t-\\tau)}x(\\tau)d\\tau$: yalnızca geçmiş.'], St: [Y, 'Sönümlü ($e^{-3t}$): sınırlı giriş sınırlı çıkış.'], M: [Y, 'Bellekli (integral geçmişi biriktirir).'] },
    { id: 'aff', d: 1, tex: 'y[n] = 2x[n] + 3', src: 's. 58', f: (x) => (n) => 2 * x(n) + 3,
      L: [N, '“Sıfır giriş → sıfır çıkış” sağlanmıyor: $x=0$ için $y=3$. (Böyle sistemlere artımsal lineer denir.)'], TI: [Y, 'Kural $n$ içermiyor.'], C: [Y, 'Şu anki değer.'], St: [Y, '$|y| \\le 2B + 3$.'], M: [N, 'Belleksiz.'] },
    { id: 'fut', d: 0, tex: 'y(t) = x(t+1) + 2x(t) - 3x(t-1)', src: 's. 60', f: (x) => (t) => x(t + 1) + 2 * x(t) - 3 * x(t - 1),
      L: [Y, 'Kaydırılmış girişlerin lineer birleşimi.'], TI: [Y, 'Sabit kaydırmalar ve sabit katsayılar.'], C: [N, '$x(t+1)$ terimi geleceğe bakıyor.'], St: [Y, '$|y| \\le 6B$.'], M: [Y, 'Bellekli.'] },
    { id: 'past', d: 0, tex: 'y(t) = 2x(t) - x(t-1) + 3x(t-2)', src: 'ödev s. 60', f: (x) => (t) => 2 * x(t) - x(t - 1) + 3 * x(t - 2),
      L: [Y, 'Lineer birleşim.'], TI: [Y, 'Sabit kaydırmalar.'], C: [Y, 'Yalnızca şimdi ve geçmiş.'], St: [Y, '$|y| \\le 6B$.'], M: [Y, 'Bellekli.'] },
    { id: 'd3', d: 1, tex: 'y[n] = 3x[n-1]', src: 's. 60, 63', f: (x) => (n) => 3 * x(n - 1),
      L: [Y, 'Lineer.'], TI: [Y, '$T\\{x[n-k]\\} = 3x[n-k-1] = y[n-k]$.'], C: [Y, 'Geçmiş değer.'], St: [Y, '$|y| \\le 3B$.'], M: [Y, 'Bellekli (1 adım).'] },
    { id: 'sqf', d: 1, tex: 'y[n] = 2x^2[n+1]', src: 's. 60', f: (x) => (n) => 2 * x(n + 1) ** 2,
      L: [N, 'Kare var.'], TI: [Y, 'Kural $n$ içermiyor.'], C: [N, '$x[n+1]$: bir sonraki örneğe bakıyor.'], St: [Y, '$|y| \\le 2B^2$.'], M: [Y, 'Bellekli (gelecek de bellek sayılır: $n$ dışındaki bir ana bakıyor).'] },
    { id: 'mod1', d: 0, tex: 'y(t) = x(t)\\cos(t+1)', src: 's. 60', f: (x) => (t) => x(t) * Math.cos(t + 1),
      L: [Y, '$g(t)=\\cos(t+1)$ girişten bağımsız bir çarpan.'], TI: [N, 'Çarpan zamanla değişiyor.'], C: [Y, 'Yalnızca $x(t)$’nin o anki değeri.'], St: [Y, '$|y| \\le |x|$.'], M: [N, 'Belleksiz.'] },
    { id: 'rev', d: 1, tex: 'y[n] = x[-n]', src: 's. 59', f: (x) => (n) => x(-n),
      L: [Y, 'Yeniden indisleme lineerdir.'], TI: [N, '$T\\{x[n-k]\\} = x[-n-k]$ ama $y[n-k] = x[-n+k]$.'], C: [N, '$n=-4$ için $y[-4] = x[4]$: gelecek.'], St: [Y, '$|y| = |x[-n]| \\le B$.'], M: [Y, 'Bellekli ($n\\ne0$’da başka anlara bakıyor).'] },
    { id: 'x2t', d: 0, tex: 'y(t) = x(2t)', src: 's. 64', f: (x) => (t) => x(2 * t),
      L: [Y, 'Zaman ölçekleme lineerdir.'], TI: [N, '$T\\{x(t-t_0)\\} = x(2t-t_0)$ ama $y(t-t_0) = x(2t-2t_0)$. Kayma yarıya iner.'], C: [N, '$t=1$ için $y(1) = x(2)$: gelecek.'], St: [Y, '$|y| \\le B$.'], M: [Y, 'Bellekli.'] },
    { id: 'int', d: 0, tex: 'y(t) = \\int_{-\\infty}^{t} x(\\tau)\\,d\\tau', src: 's. 62, 66', f: (x) => gridSys(x, (y, xv, t, dt) => y + dt * xv),
      L: [Y, 'İntegral lineerdir.'], TI: [Y, '$\\int_{-\\infty}^{t} x(\\tau-t_0)d\\tau = \\int_{-\\infty}^{t-t_0} x(s)ds = y(t-t_0)$.'], C: [Y, 'Yalnızca $\\tau \\le t$ kullanılıyor.'], St: [N, '$x=u(t)$ sınırlı, ama $y = r(t)$ (rampa) sınırsız.'], M: [Y, 'Bellekli (tüm geçmişi toplar).'] },
    { id: 'nx', d: 1, tex: 'y[n] = 2n\\,x[n]', src: 's. 63, 66', f: (x) => (n) => 2 * n * x(n),
      L: [Y, 'Lineer.'], TI: [N, '$T\\{x[n-k]\\} = 2n\\,x[n-k] \\ne 2(n-k)x[n-k] = y[n-k]$.'], C: [Y, 'Şu anki değer.'], St: [N, '$x=1$ için $y=2n$ sınırsız.'], M: [N, 'Belleksiz.'] },
    { id: 'mod', d: 0, tex: 'y(t) = x(t)\\cos(\\omega_c t)', src: 's. 63', f: (x) => (t) => x(t) * Math.cos(2 * t),
      L: [Y, 'Lineer (modülasyon).'], TI: [N, '$x(t-t_0)\\cos\\omega_c t \\ne x(t-t_0)\\cos\\omega_c(t-t_0)$.'], C: [Y, 'Girişin gelecek değerleri yok.'], St: [Y, '$|y| \\le |x|$.'], M: [N, 'Belleksiz.'] },
    { id: 'del3', d: 0, tex: 'y(t) = x(t-3)', src: 'ödev s. 63', f: (x) => (t) => x(t - 3),
      L: [Y, 'Lineer.'], TI: [Y, 'Saf gecikme.'], C: [Y, 'Geçmiş.'], St: [Y, '$|y|\\le B$.'], M: [Y, 'Bellekli.'] },
    { id: 'r1n', d: 1, tex: 'y[n] = x[1-n]', src: 's. 66–67', f: (x) => (n) => x(1 - n),
      L: [Y, '$\\alpha x_1[1-n] + \\beta x_2[1-n] = \\alpha y_1 + \\beta y_2$.'], TI: [N, '$y_1[n] = x[1-n-N] \\ne y[n-N] = x[1-n+N]$.'], C: [N, '$y[0] = x[1]$: geleceğe bağlı.'], St: [Y, '$|y[n]| = |x[1-n]| < B$.'], M: [Y, 'Bellekli.'] },
    { id: 'frac', d: 0, tex: 'y(t) = \\frac{x(t)}{1 + x(t-1)}', src: 'ödev s. 67', f: (x) => (t) => x(t) / (1 + x(t - 1)),
      L: [N, 'Kesir: $T\\{2x\\} \\ne 2T\\{x\\}$.'], TI: [Y, 'Kural $t$ içermiyor: $T\\{x(t-t_0)\\} = y(t-t_0)$.'], C: [Y, '$x(t)$ ve $x(t-1)$: şimdi ve geçmiş.'], St: [N, '$x(t) = -1$ (sınırlı) için payda $1 + (-1) = 0$: çıkış sınırsız.'], M: [Y, 'Bellekli ($t-1$).'] },
    { id: 'expx', d: 0, tex: 'y(t) = e^{x(t)}', src: 's. 68', f: (x) => (t) => Math.exp(x(t)),
      L: [N, '$x=0$ için $y=1$: sıfır giriş sıfır çıkış vermiyor.'], TI: [Y, 'Kural $t$ içermiyor.'], C: [Y, 'Şu anki değer.'], St: [Y, '$|x|<B \\Rightarrow e^{-B} < y < e^{B}$.'], M: [N, 'Belleksiz.'] },
    { id: 'ode1', d: 0, tex: '\\frac{dy}{dt} + y(t) = x(t)', src: 's. 62', f: (x) => gridSys(x, (y, xv, t, dt) => y + dt * (xv - y)),
      L: [Y, 'Lineer (sıfır başlangıç).'], TI: [Y, '$x_1 = x(t-t_0) \\Rightarrow y_1 = y(t-t_0)$ (notta gösterildi).'], C: [Y, 'Geçmiş birikiyor.'], St: [Y, 'Sönümlü.'], M: [Y, 'Bellekli.'] }
  ];

  const CIN = {
    pulse: { label: 'Darbe Π((t−1)/2)', f: (t) => (t >= 0 && t < 2 ? 1 : 0) },
    tri: { label: 'Üçgen Λ(t−1)', f: (t) => S.tri(t - 1) },
    step: { label: 'Basamak u(t)', f: S.u },
    exp: { label: 'e^(−t) u(t)', f: (t) => (t >= 0 ? Math.exp(-t) : 0) },
    sin: { label: 'sin(t)', f: Math.sin },
    one: { label: 'Sabit x(t) = 1', f: () => 1 },
    m1: { label: 'Sabit x(t) = −1', f: () => -1 }
  };
  const DIN = {
    pulse: { label: 'Darbe u[n] − u[n−3]', f: (n) => (n >= 0 && n < 3 ? 1 : 0) },
    tri: { label: '{1, 2, 1} (n = 0, 1, 2)', f: (n) => ({ 0: 1, 1: 2, 2: 1 }[n] || 0) },
    step: { label: 'Basamak u[n]', f: S.dU },
    exp: { label: '0.8ⁿ u[n]', f: (n) => (n >= 0 ? Math.pow(0.8, n) : 0) },
    alt: { label: '(−1)ⁿ', f: (n) => (n % 2 === 0 ? 1 : -1) },
    one: { label: 'Sabit x[n] = 1', f: () => 1 },
    m1: { label: 'Sabit x[n] = −1', f: () => -1 }
  };

  const PROP = ['L', 'TI', 'C', 'St'];
  const PROP_NAME = { L: 'Lineerlik', TI: 'Zamanla değişmezlik', C: 'Nedensellik', St: 'Kararlılık', M: 'Bellek' };

  SS.labs.systems = {
    title: 'Sistem test tezgâhı',
    blurb: 'Nottaki 23 sistemi lineerlik, zamanla değişmezlik, nedensellik ve kararlılık için sayısal olarak sına.',
    mount(holder, opts) {
      const L = ui.lab(this.title, 'Bir sistem ve bir özellik seç. Tezgâh testi senin yerine çalıştırır ve iki eğriyi üst üste çizer. <strong>Örtüşmüyorsa</strong> bu kesin bir karşı örnektir. Örtüşmesi ise yalnızca bir ipucudur, ispat cebirle yapılır.');
      holder.append(L.root);
      let prop = opts.prop || 'L';
      const tabs = ui.tabs(PROP.map((p) => PROP_NAME[p]), (i) => { prop = PROP[i]; build(); });
      L.root.insertBefore(tabs.el, L.controls);
      const sysSel = ui.select({ label: 'Sistem', options: SYS.map((s, i) => ({ value: String(i), label: (s.d ? '[ayrık] ' : '[sürekli] ') + s.tex.replace(/\\,/g, ' ').replace(/\\frac\{dy\}\{dt\}/g, 'dy/dt').replace(/\\frac\{x\(t\)\}\{1 \+ x\(t-1\)\}/, 'x(t)/(1+x(t−1))').replace(/\\int_\{-\\infty\}\^\{t\}/, '∫').replace(/\\[a-z]+/g, (m) => ({ '\\cos': 'cos', '\\sin': 'sin', '\\omega': 'ω', '\\tau': 'τ', '\\left': '', '\\right': '', '\\,': ' ' }[m] || '')).replace(/[{}]/g, '') + '  · ' + s.src })), value: String(opts.sys != null ? SYS.findIndex((s) => s.id === opts.sys) : 0), onChange: () => build() });
      const showAns = el('div');
      const ansBtn = ui.button('Notun cevabını göster (5 özellik)', () => {
        const s = SYS[+sysSel.get()];
        showAns.innerHTML = '';
        const t = el('table', { class: 'tbl' }, el('tbody', null, ['L', 'TI', 'C', 'St', 'M'].map((p) => el('tr', null,
          el('th', null, PROP_NAME[p]),
          el('td', { html: p === 'M' ? (s.M[0] ? '<strong>Bellekli</strong>' : '<strong>Belleksiz</strong>') : (s[p][0] ? '<strong style="color:var(--c-y)">Evet</strong>' : '<strong style="color:var(--c-warn)">Hayır</strong>') }),
          el('td', { html: SS.renderMath(s[p][1]) })))));
        showAns.append(el('div', { class: 'tbl-wrap' }, t));
        SS.fixMath(showAns);
      }, 'btn-quiet');
      const head = el('div', { class: 'ctl-row' }, sysSel.el);
      const testCtl = el('div', { class: 'ctl-row' });
      L.controls.append(head, testCtl);
      const cA = ui.canvas(190), cB = ui.canvas(220);
      const capA = el('div', { class: 'plot-cap' }), capB = el('div', { class: 'plot-cap' });
      const legB = el('div');
      L.body.append(el('div', { class: 'plot-box' }, capA, cA), el('div', { class: 'plot-box' }, capB, legB, cB));
      L.root.append(el('div', { class: 'card-actions' }, ansBtn), showAns);

      let ctl = {};
      function build() {
        const s = SYS[+sysSel.get()];
        const IN = s.d ? DIN : CIN;
        const opt = Object.keys(IN).map((k) => ({ value: k, label: IN[k].label }));
        testCtl.innerHTML = '';
        showAns.innerHTML = '';
        ctl = {};
        if (prop === 'L') {
          ctl.x1 = ui.select({ label: '$x_1$', options: opt, value: 'pulse', onChange: run });
          ctl.x2 = ui.select({ label: '$x_2$', options: opt, value: s.d ? 'tri' : 'sin', onChange: run });
          ctl.a = ui.slider({ label: '$\\alpha$', min: -2, max: 3, step: 0.5, value: 2, onInput: run });
          ctl.b = ui.slider({ label: '$\\beta$', min: -2, max: 3, step: 0.5, value: 1, onInput: run });
          testCtl.append(ctl.x1.el, ctl.x2.el, ctl.a.el, ctl.b.el);
        } else if (prop === 'TI') {
          ctl.x = ui.select({ label: 'Giriş', options: opt, value: 'pulse', onChange: run });
          ctl.t0 = ui.slider({ label: 'Kaydırma $t_0$', min: s.d ? -4 : -3, max: s.d ? 6 : 4, step: s.d ? 1 : 0.5, value: s.d ? 3 : 2, onInput: run });
          testCtl.append(ctl.x.el, ctl.t0.el);
        } else if (prop === 'C') {
          ctl.x = ui.select({ label: 'Giriş', options: opt, value: s.d ? 'step' : 'exp', onChange: run });
          ctl.t1 = ui.slider({ label: 'Bu andan sonra girişi değiştir: $t_1$', min: s.d ? -2 : -2, max: s.d ? 6 : 4, step: s.d ? 1 : 0.5, value: s.d ? 2 : 1, onInput: run });
          testCtl.append(ctl.x.el, ctl.t1.el);
        } else {
          ctl.x = ui.select({ label: 'Sınırlı giriş ($|x| \\le 1$)', options: opt, value: s.id === 'frac' ? 'm1' : 'step', onChange: run });
          testCtl.append(ctl.x.el);
        }
        SS.fixMath(L.controls);
        run();
      }

      function run() {
        const s = SYS[+sysSel.get()];
        const IN = s.d ? DIN : CIN;
        const R = s.d ? [-6, 10] : [-4, 8];
        const base = { x: s.d ? [R[0] - 0.6, R[1] + 0.6] : R, xLabel: s.d ? 'n' : 't', xStep: s.d ? 1 : 1 };
        const draw = (cv, h, list) => {
          const fs = list.filter((l) => l.f).map((l) => l.f);
          let yr;
          if (s.d) {
            const vals = [];
            for (const f of fs) for (let n = R[0]; n <= R[1]; n++) vals.push(f(n));
            yr = SS.autoYv([vals.map((v) => Math.max(-40, Math.min(40, v)))]);
          } else yr = SS.autoY(fs.map((f) => (t) => Math.max(-40, Math.min(40, f(t)))), R[0], R[1]);
          const layers = [];
          list.forEach((l, i) => {
            if (l.band) { layers.push(l.band); return; }
            if (s.d) {
              const n = [], v = [];
              for (let k = R[0]; k <= R[1]; k++) { n.push(k); v.push(l.f(k)); }
              layers.push({ kind: 'stem', n, v, color: l.c, r: l.dash ? 7 : 3.6, ringOnly: !!l.dash, w: l.dash ? 1.8 : 2 });
            } else layers.push({ kind: 'fn', f: l.f, color: l.c, dash: l.dash ? [7, 5] : [], w: l.dash ? 2.6 : 2.2, n: 2400 });
            void i;
          });
          SS.plot(cv, Object.assign({}, base, { y: yr, h, layers }));
        };
        const maxDiff = (f, g, a, b) => {
          let m = 0;
          if (s.d) { for (let n = a; n <= b; n++) { const d = Math.abs(f(n) - g(n)); if (isFinite(d)) m = Math.max(m, d); else m = Infinity; } }
          else for (let i = 0; i <= 1200; i++) { const t = a + ((b - a) * i) / 1200; const d = Math.abs(f(t) - g(t)); m = isFinite(d) ? Math.max(m, d) : Infinity; }
          return m;
        };
        const T = s.f;
        legB.innerHTML = '';
        if (prop === 'L') {
          const x1 = IN[ctl.x1.get()].f, x2 = IN[ctl.x2.get()].f, a = ctl.a.get(), b = ctl.b.get();
          const lhs = T((t) => a * x1(t) + b * x2(t));
          const y1 = T(x1), y2 = T(x2);
          const rhs = (t) => a * y1(t) + b * y2(t);
          capA.innerHTML = SS.renderMath('Girişler: $x_1$ (mavi), $x_2$ (turuncu)');
          capB.innerHTML = SS.renderMath('Çıkışlar');
          legB.append(ui.legend([['y', '$T\\{\\alpha x_1 + \\beta x_2\\}$'], ['h', '$\\alpha T\\{x_1\\} + \\beta T\\{x_2\\}$', false]]));
          draw(cA, 190, [{ f: x1, c: 'x' }, { f: x2, c: 'h' }]);
          draw(cB, 220, [{ f: lhs, c: 'y' }, { f: rhs, c: 'h', dash: true }]);
          const d = maxDiff(lhs, rhs, R[0], R[1]);
          report(d < 1e-3 ? 'ok' : 'bad', d < 1e-3 ? 'Bu girişler ve katsayılar için iki taraf <strong>eşit</strong>. Lineer olabilir. Başka girişler ve katsayılar da dene; kesin sonuç için cebirsel ispat gerekir.' : 'İki taraf <strong>farklı</strong> (en büyük fark ' + S.fmt(d, 3) + '). Bu bir karşı örnek: sistem <strong>lineer değil</strong>.', s);
        } else if (prop === 'TI') {
          const x = IN[ctl.x.get()].f, t0 = ctl.t0.get();
          const xs = (t) => x(t - t0);
          const y = T(x);
          const yShiftIn = T(xs);
          const yShiftOut = (t) => y(t - t0);
          capA.innerHTML = SS.renderMath('Giriş $x$ (mavi) ve kaydırılmış giriş $x(t-t_0)$ (turuncu)');
          capB.innerHTML = SS.renderMath('Çıkışlar');
          legB.append(ui.legend([['y', 'Önce kaydır, sonra sistem: $T\\{x(t-t_0)\\}$'], ['h', 'Önce sistem, sonra kaydır: $y(t-t_0)$']]));
          draw(cA, 190, [{ f: x, c: 'x' }, { f: xs, c: 'h' }]);
          draw(cB, 220, [{ f: yShiftIn, c: 'y' }, { f: yShiftOut, c: 'h', dash: true }]);
          const d = maxDiff(yShiftIn, yShiftOut, R[0] + Math.abs(t0), R[1] - 0.01);
          report(d < 1e-3 ? 'ok' : 'bad', d < 1e-3 ? 'Kaydırma ile sistem yer değiştirebiliyor: bu test için <strong>zamanla değişmez</strong> görünüyor.' : 'Önce kaydırmak ile sonra kaydırmak <strong>farklı</strong> sonuç veriyor (fark ' + S.fmt(d, 3) + '): sistem <strong>zamanla değişen</strong> bir sistem.', s);
        } else if (prop === 'C') {
          const x = IN[ctl.x.get()].f, t1 = ctl.t1.get();
          const bump = s.d ? (n) => (n > t1 ? 1.5 : 0) : (t) => (t > t1 ? 1.5 * Math.min(1, (t - t1) * 3) : 0);
          const xb = (t) => x(t) + bump(t);
          const ya = T(x), yb = T(xb);
          capA.innerHTML = SS.renderMath('İki giriş, $t_1$ anına kadar <strong>aynı</strong>, sonrasında farklı');
          capB.innerHTML = SS.renderMath('Çıkışlar: kırmızı bölgede (geçmiş) farklılaşıyorlar mı?');
          legB.append(ui.legend([['y', '$x_a$’nın çıkışı'], ['h', '$x_b$’nin çıkışı']]));
          const band = { band: { kind: 'band', from: s.d ? -50 : -50, to: s.d ? t1 + 0.5 : t1, color: 'warn', alpha: 0.07, label: 't ≤ t₁: girişler aynı' } };
          draw(cA, 190, [band, { f: xb, c: 'h', dash: true }, { f: x, c: 'x' }]);
          draw(cB, 220, [band, { f: yb, c: 'h', dash: true }, { f: ya, c: 'y' }]);
          const d = maxDiff(ya, yb, R[0], s.d ? t1 : t1 - 0.02);
          report(d < 1e-3 ? 'ok' : 'bad', d < 1e-3 ? 'Girişin geleceğini değiştirmek, $t_1$’den önceki çıkışı <strong>etkilemedi</strong>. Bu test nedensel bir davranışla uyumlu.' : 'Girişin <strong>gelecekte</strong> değişmesi, çıkışı <strong>şimdiden</strong> değiştirdi (fark ' + S.fmt(d, 3) + '). Sistem geleceği görüyor: <strong>nedensel değil</strong>.', s);
        } else {
          const x = IN[ctl.x.get()].f;
          const y = T(x);
          // Pencere iki katına çıkınca maksimum büyüyorsa çıkış sınırsız büyüyor demektir.
          const maxAbs = (b) => {
            let m = 0;
            if (s.d) { for (let n = R[0]; n <= b; n++) m = Math.max(m, Math.abs(y(n))); }
            else for (let i = 0; i <= 3000; i++) m = Math.max(m, Math.abs(y(R[0] + ((b - R[0]) * i) / 3000)));
            return m;
          };
          const m1 = maxAbs(20), m = maxAbs(40);
          capA.innerHTML = SS.renderMath('Sınırlı giriş');
          capB.innerHTML = SS.renderMath('Çıkış (kırpılmış gösterim, $|y|\\le 40$)');
          legB.append(ui.legend([['y', 'Çıkış $y$']]));
          draw(cA, 190, [{ f: x, c: 'x' }]);
          draw(cB, 220, [{ f: y, c: 'y' }]);
          const big = !isFinite(m) || (m > 1.3 * m1 && m > 3) || m > 1e3;
          report(big ? 'bad' : 'ok', big ? 'Sınırlı bir giriş verdik ama çıkış büyüyor ($\\max|y| = ' + (isFinite(m) ? S.fmt(m, 1) : '\\infty') + '$, pencere büyüdükçe artar). Bu giriş bir <strong>karşı örnek</strong>: sistem <strong>kararsız</strong>.' : 'Bu giriş için çıkış sınırlı kaldı ($\\max|y| = ' + S.fmt(m, 2) + '$). Kararlılık için <em>her</em> sınırlı giriş için geçerli olmalı: diğer girişleri de dene.', s);
        }
      }
      function report(tone, html) {
        ui.readout(L.readout, [], { tone, html });
      }
      if (opts.prop) tabs.set(PROP.indexOf(opts.prop), true);
      build();
    }
  };
  SS.SYSTEMS = SYS;
})();
