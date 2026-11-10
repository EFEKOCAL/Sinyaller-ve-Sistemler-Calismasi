/*
 * math.js — Küçük bir TeX alt kümesini HTML'e çevirir. Dış kütüphane yoktur.
 *
 * Desteklenenler: \frac \sqrt \int \sum \lim \left( \right) \begin{cases} \begin{aligned}
 * \text \mathrm \boxed \underbrace \overline, Yunan harfleri, üst/alt indis,
 * renk komutları: \cx{..} (giriş, mavi) \ch{..} (impuls cevabı, turuncu)
 * \cy{..} (çıkış, yeşil) \hl{..} (vurgu).
 *
 * Kullanım: SS.tex('x(t)=e^{-at}u(t)', display) → HTML dizgisi
 *           SS.renderMath(html) → metindeki $..$ ve $$..$$ bölümlerini çevirir
 *           SS.fixMath(kök) → \left \right ve süslü parantezleri boylarına göre büyütür
 */
(function () {
  'use strict';
  const SS = (window.SS = window.SS || {});

  const GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
    theta: 'θ', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ',
    tau: 'τ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω'
  };
  // Büyük harf Yunanlar dik yazılır (Π, Λ fonksiyon adı olarak kullanılıyor).
  const GREEK_UPRIGHT = new Set(['Gamma', 'Delta', 'Theta', 'Lambda', 'Pi', 'Sigma', 'Phi', 'Psi', 'Omega']);

  const REL = {
    le: '≤', leq: '≤', ge: '≥', geq: '≥', neq: '≠', ne: '≠', approx: '≈', equiv: '≡', to: '→',
    rightarrow: '→', Rightarrow: '⇒', Leftrightarrow: '⇔', iff: '⇔', leftarrow: '←', implies: '⇒',
    in: '∈', notin: '∉', sim: '∼', propto: '∝', mapsto: '↦', longrightarrow: '⟶', Longrightarrow: '⟹', Longleftrightarrow: '⟺'
  };
  const BIN = { cdot: '·', times: '×', pm: '±', mp: '∓', ast: '∗', star: '∗', circ: '∘', cup: '∪', cap: '∩' };
  const SYM = {
    infty: '∞', partial: '∂', forall: '∀', exists: '∃', ldots: '…', cdots: '⋯', dots: '…', vdots: '⋮',
    prime: '′', mid: '|', lvert: '|', rvert: '|', langle: '⟨', rangle: '⟩', uparrow: '↑', downarrow: '↓',
    checkmark: '✓', emptyset: '∅', nabla: '∇', angle: '∠', degree: '°', ell: 'ℓ', Re: 'Re', Im: 'Im'
  };
  const SPACE = { quad: ' ', qquad: '  ', ',': ' ', ';': ' ', ':': ' ', ' ': ' ', '!': '' };
  const FUN = new Set(['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'exp', 'max', 'min', 'sgn', 'sinc',
    'arg', 'det', 'sup', 'inf', 'arctan', 'Re', 'Im']);
  const LIMOP = { sum: '∑', prod: '∏', lim: 'lim' };
  const INTOP = { int: '∫', iint: '∬', oint: '∮' };
  const COLOR = { cx: 'm-cx', ch: 'm-ch', cy: 'm-cy', hl: 'm-hl', hlb: 'm-hlb', cm: 'm-cm', cw: 'm-cw' };

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function Parser(src) { this.s = src; this.i = 0; }
  const P = Parser.prototype;

  P.eof = function () { return this.i >= this.s.length; };
  P.skip = function () { while (!this.eof() && /\s/.test(this.s[this.i])) this.i++; };
  P.at = function (str) { return this.s.startsWith(str, this.i); };

  // Ters eğik çizgiden sonraki komut adını okur.
  P.readCmd = function () {
    this.i++; // '\'
    const m = /^[A-Za-z]+/.exec(this.s.slice(this.i));
    if (m) { this.i += m[0].length; return m[0]; }
    const c = this.s[this.i++];
    return c === undefined ? '' : c;
  };

  // Ham süslü parantez içeriği (\text için)
  P.readRawGroup = function () {
    this.skip();
    if (this.s[this.i] !== '{') return '';
    let depth = 0, start = this.i + 1;
    for (; this.i < this.s.length; this.i++) {
      const c = this.s[this.i];
      if (c === '\\') { this.i++; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { const out = this.s.slice(start, this.i); this.i++; return out; } }
    }
    return this.s.slice(start);
  };

  // stop(p) true dönünce durur (karakter tüketilmez).
  P.parseSeq = function (stop) {
    const atoms = [];
    for (;;) {
      this.skip();
      if (this.eof() || (stop && stop(this))) break;
      const c = this.s[this.i];
      if (c === '^' || c === '_') {
        let base = atoms.pop() || { html: '', kind: 'ord' };
        let sup = null, sub = null;
        while (!this.eof() && (this.s[this.i] === '^' || this.s[this.i] === '_')) {
          const t = this.s[this.i++];
          const arg = this.parseArg();
          if (t === '^') sup = arg; else sub = arg;
          this.skip();
        }
        atoms.push(this.attachScripts(base, sup, sub));
        continue;
      }
      const a = this.parseAtom(atoms);
      if (a) atoms.push(a);
    }
    return atoms.map((a) => a.html).join('');
  };

  P.attachScripts = function (base, sup, sub) {
    if (base.kind === 'limop') {
      return {
        kind: 'ord',
        html: '<span class="m-oplim">' + (sup !== null ? '<span class="m-lim">' + sup + '</span>' : '') +
          '<span class="m-big">' + base.sym + '</span>' +
          (sub !== null ? '<span class="m-lim">' + sub + '</span>' : '') + '</span>'
      };
    }
    if (base.kind === 'intop') {
      return {
        kind: 'ord',
        html: '<span class="m-intwrap"><span class="m-int">' + base.sym + '</span><span class="m-intlim">' +
          '<span>' + (sup !== null ? sup : '&#8203;') + '</span><span>' + (sub !== null ? sub : '&#8203;') + '</span></span></span>'
      };
    }
    if (base.kind === 'ub') {
      return { kind: 'ord', html: '<span class="m-ub"><span class="m-ub-body">' + base.body + '</span><span class="m-ub-lbl">' + (sub || '') + '</span></span>' };
    }
    let h = base.html;
    if (sup !== null && sub !== null) {
      h += '<span class="m-ss"><span class="m-ss-sup">' + sup + '</span><span class="m-ss-sub">' + sub + '</span></span>';
    } else if (sup !== null) {
      h += '<sup class="m-sup">' + sup + '</sup>';
    } else if (sub !== null) {
      h += '<sub class="m-sub">' + sub + '</sub>';
    }
    return { kind: 'ord', html: h };
  };

  P.parseArg = function () {
    this.skip();
    const c = this.s[this.i];
    if (c === '{') {
      this.i++;
      const h = this.parseSeq((p) => p.s[p.i] === '}');
      this.i++;
      return h;
    }
    if (c === '\\') {
      const a = this.parseAtom([]);
      return a ? (a.html || a.sym || '') : '';
    }
    this.i++;
    return this.charHtml(c);
  };

  P.charHtml = function (c) {
    if (/[A-Za-z]/.test(c)) return '<i class="m-v">' + c + '</i>';
    if (/[α-ω]/.test(c)) return '<i class="m-v">' + c + '</i>';
    if (c === '-') return '−';
    if (c === "'") return '′';
    if (c === '*') return '∗';
    return esc(c);
  };

  const isOpenish = (atoms) => {
    if (!atoms.length) return true;
    const k = atoms[atoms.length - 1].kind;
    return k === 'bin' || k === 'rel' || k === 'open' || k === 'punct';
  };

  P.parseDelim = function () {
    this.skip();
    if (this.at('\\')) {
      const name = this.readCmd();
      if (name === '{') return '{';
      if (name === '}') return '}';
      if (name === '|') return '‖';
      if (name === 'langle') return '⟨';
      if (name === 'rangle') return '⟩';
      if (name === 'lvert' || name === 'rvert' || name === 'vert') return '|';
      return '';
    }
    const c = this.s[this.i++];
    return c === '.' ? '' : esc(c);
  };

  P.parseEnv = function (name) {
    const rows = [];
    let row = [];
    const endTok = '\\end{' + name + '}';
    const stop = (p) => p.at('&') || p.at('\\\\') || p.at(endTok);
    for (;;) {
      const cell = this.parseSeq(stop);
      row.push(cell);
      if (this.at('&')) { this.i++; continue; }
      if (this.at('\\\\')) { this.i += 2; rows.push(row); row = []; continue; }
      if (this.at(endTok)) { this.i += endTok.length; rows.push(row); break; }
      rows.push(row); break; // eof
    }
    const clean = rows.filter((r) => r.some((c) => c.trim() !== ''));
    if (name === 'cases') {
      const cells = clean.map((r) => '<span class="m-cc">' + (r[0] || '') + '</span><span class="m-cc m-cc2">' + (r[1] || '') + '</span>').join('');
      return '<span class="m-lr m-cases"><span class="m-dl">{</span><span class="m-casegrid">' + cells + '</span></span>';
    }
    // aligned / gathered: iki sütun (sağa ve sola yaslı)
    const cells = clean.map((r) => '<span class="m-al1">' + (r[0] || '') + '</span><span class="m-al2">' + (r.slice(1).join('') || '') + '</span>').join('');
    return '<span class="m-aligned">' + cells + '</span>';
  };

  P.parseAtom = function (atoms) {
    const c = this.s[this.i];
    if (c === '\\') {
      if (this.at('\\\\')) { this.i += 2; return { kind: 'ord', html: '<span class="m-br"></span>' }; }
      const name = this.readCmd();
      if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
        const a = this.parseArg(), b = this.parseArg();
        return { kind: 'ord', html: '<span class="m-frac' + (name === 'tfrac' ? ' m-tfrac' : '') + '"><span class="m-num">' + a + '</span><span class="m-den">' + b + '</span></span>' };
      }
      if (name === 'sqrt') {
        const a = this.parseArg();
        return { kind: 'ord', html: '<span class="m-sqrt"><span class="m-rad">√</span><span class="m-sqb">' + a + '</span></span>' };
      }
      if (name === 'text' || name === 'textrm' || name === 'mbox') {
        return { kind: 'ord', html: '<span class="m-text">' + esc(this.readRawGroup()) + '</span>' };
      }
      if (name === 'mathrm' || name === 'operatorname' || name === 'rm') {
        return { kind: 'ord', html: '<span class="m-fn">' + esc(this.readRawGroup()) + '</span>' };
      }
      if (name === 'boxed') return { kind: 'ord', html: '<span class="m-box">' + this.parseArg() + '</span>' };
      if (name === 'overline' || name === 'bar') return { kind: 'ord', html: '<span class="m-over">' + this.parseArg() + '</span>' };
      if (name === 'underbrace') return { kind: 'ub', body: this.parseArg(), html: '' };
      if (COLOR[name]) return { kind: 'ord', html: '<span class="' + COLOR[name] + '">' + this.parseArg() + '</span>' };
      if (name === 'left') {
        const l = this.parseDelim();
        const body = this.parseSeq((p) => p.at('\\right'));
        let r = '';
        if (this.at('\\right')) { this.i += 6; r = this.parseDelim(); }
        return { kind: 'ord', html: '<span class="m-lr"><span class="m-dl">' + l + '</span><span class="m-lrb">' + body + '</span><span class="m-dl">' + r + '</span></span>' };
      }
      if (name === 'right') return null;
      if (name === 'begin') {
        const env = this.readRawGroup();
        return { kind: 'ord', html: this.parseEnv(env) };
      }
      if (name === 'big' || name === 'Big' || name === 'bigg' || name === 'Bigg' || name === 'bigl' || name === 'bigr' || name === 'Bigl' || name === 'Bigr') {
        const d = this.parseDelim();
        return { kind: 'ord', html: '<span class="m-bigd">' + d + '</span>' };
      }
      if (name === 'displaystyle' || name === 'limits' || name === 'nolimits') return null;
      if (LIMOP[name]) return { kind: 'limop', sym: name === 'lim' ? '<span class="m-fn">lim</span>' : LIMOP[name], html: '<span class="m-big">' + (name === 'lim' ? '<span class="m-fn">lim</span>' : LIMOP[name]) + '</span>' };
      if (INTOP[name]) return { kind: 'intop', sym: INTOP[name], html: '<span class="m-int">' + INTOP[name] + '</span>' };
      if (GREEK[name]) {
        return { kind: 'ord', html: GREEK_UPRIGHT.has(name) ? '<span class="m-gu">' + GREEK[name] + '</span>' : '<i class="m-v">' + GREEK[name] + '</i>' };
      }
      if (FUN.has(name)) return { kind: 'ord', html: '<span class="m-fn">' + name + '</span>' };
      if (REL[name]) return { kind: 'rel', html: '<span class="m-rel">' + REL[name] + '</span>' };
      if (BIN[name]) return { kind: 'bin', html: '<span class="m-bin">' + BIN[name] + '</span>' };
      if (SYM[name]) return { kind: 'ord', html: SYM[name] };
      if (name in SPACE) return { kind: 'ord', html: SPACE[name] };
      if (name === '{' || name === '}' || name === '%' || name === '#' || name === '&' || name === '_' || name === '$') {
        return { kind: name === '{' ? 'open' : 'ord', html: esc(name) };
      }
      if (name === '|') return { kind: 'ord', html: '‖' };
      return { kind: 'ord', html: '<span class="m-err">\\' + esc(name) + '</span>' };
    }
    if (c === '{') {
      this.i++;
      const h = this.parseSeq((p) => p.s[p.i] === '}');
      this.i++;
      return { kind: 'ord', html: '<span class="m-g">' + h + '</span>' };
    }
    if (c === '}') { this.i++; return null; }
    if (/[0-9.]/.test(c)) {
      const m = /^[0-9]*\.?[0-9]+|^[0-9]+\.?/.exec(this.s.slice(this.i));
      const t = m ? m[0] : c;
      this.i += t.length;
      return { kind: 'ord', html: '<span class="m-n">' + t + '</span>' };
    }
    this.i++;
    if (c === '+' || c === '-' || c === '*') {
      const sym = c === '-' ? '−' : c === '*' ? '∗' : '+';
      if ((c === '-' || c === '+') && isOpenish(atoms)) return { kind: 'ord', html: '<span class="m-un">' + sym + '</span>' };
      return { kind: 'bin', html: '<span class="m-bin">' + sym + '</span>' };
    }
    if (c === '=' || c === '<' || c === '>') return { kind: 'rel', html: '<span class="m-rel">' + esc(c) + '</span>' };
    if (c === ',' || c === ';') return { kind: 'punct', html: '<span class="m-punct">' + c + '</span>' };
    if (c === '(' || c === '[') return { kind: 'open', html: c };
    if (c === '~') return { kind: 'ord', html: ' ' };
    if (c === '&') return null;
    if (c === '|') return { kind: 'ord', html: '|' };
    if (c === "'") return { kind: 'ord', html: '′' };
    if (c === '→' || c === '≤' || c === '≥' || c === '≠' || c === '⇒') return { kind: 'rel', html: '<span class="m-rel">' + c + '</span>' };
    return { kind: 'ord', html: this.charHtml(c) };
  };

  SS.tex = function (src, display) {
    let html;
    try {
      html = new Parser(String(src)).parseSeq(null);
    } catch (e) {
      html = '<span class="m-err">' + esc(src) + '</span>';
    }
    return display ? '<span class="m m-display">' + html + '</span>' : '<span class="m">' + html + '</span>';
  };

  // Metin içindeki $$..$$ (blok) ve $..$ (satır içi) bölümlerini çevirir. \$ gerçek dolar işaretidir.
  SS.renderMath = function (text) {
    if (text == null) return '';
    let s = String(text);
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => SS.tex(m, true));
    s = s.replace(/(^|[^\\])\$([^$]+?)\$/g, (_, pre, m) => pre + SS.tex(m, false));
    return s.replace(/\\\$/g, '$');
  };

  // \left..\right ve cases parantezlerini içerik yüksekliğine göre esnetir.
  SS.fixMath = function (root) {
    const run = () => {
      (root || document).querySelectorAll('.m-lr').forEach((lr) => {
        const body = lr.querySelector(':scope > .m-lrb, :scope > .m-casegrid');
        if (!body) return;
        const h = body.getBoundingClientRect().height;
        const fs = parseFloat(getComputedStyle(lr).fontSize) || 16;
        const k = h / (fs * 1.18);
        lr.querySelectorAll(':scope > .m-dl').forEach((d) => {
          if (k > 1.15) {
            d.style.transform = 'scaleY(' + k.toFixed(3) + ')';
            d.style.margin = '0 ' + (0.04 + 0.05 * Math.min(k, 4)).toFixed(2) + 'em';
          } else {
            d.style.transform = '';
            d.style.margin = '';
          }
        });
      });
    };
    requestAnimationFrame(run);
  };
})();
