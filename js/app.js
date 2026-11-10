/*
 * app.js — Yönlendirme (hash), ders sayfası, ana sayfa, formül kağıdı, laboratuvar listesi
 * ve tarayıcıda saklanan ilerleme.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const el = SS.el;
  const R = SS.renderMath;

  const CHAPTERS = [
    { id: 's', title: 'Bölüm 1 · Sinyaller', sub: 'Sinyal türleri, temel sinyaller ve sinyal işlemleri', pages: 's. 2–53', exam: true },
    { id: 'sys', title: 'Bölüm 1 · Sistemler', sub: 'Lineerlik, nedensellik, zamanla değişmezlik, kararlılık', pages: 's. 54–68', exam: true },
    { id: 'lti', title: 'Bölüm 2 · LTI Sistemler', sub: 'İmpuls cevabı, konvolüsyon, fark denklemleri', pages: 's. 69–109', exam: false }
  ];
  const lessons = () => SS.lessons || [];
  const examLessons = () => lessons().filter((l) => (CHAPTERS.find((c) => c.id === l.chap) || {}).exam);
  const byId = (id) => lessons().find((l) => l.id === id);

  /* ---------------- İlerleme (yalnızca bu tarayıcıda) ---------------- */
  const store = {
    read() { try { return JSON.parse(localStorage.getItem('ss-progress') || '{}'); } catch (e) { return {}; } },
    write(v) { try { localStorage.setItem('ss-progress', JSON.stringify(v)); } catch (e) { /* gizli pencere vb. */ } }
  };
  let progress = store.read();
  progress.done = progress.done || {};
  progress.quiz = progress.quiz || {};
  const save = () => store.write(progress);
  const isDone = (id) => !!progress.done[id];

  /* ---------------- Tema ---------------- */
  const themeBtn = document.getElementById('themeBtn');
  const THEMES = ['auto', 'light', 'dark'];
  const THEME_LABEL = { auto: 'Otomatik', light: 'Açık', dark: 'Koyu' };
  function applyTheme(t) {
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    try { if (t === 'auto') localStorage.removeItem('ss-theme'); else localStorage.setItem('ss-theme', t); } catch (e) { /* yok say */ }
    themeBtn.textContent = 'Tema: ' + THEME_LABEL[t];
    window.dispatchEvent(new Event('ss-theme'));
  }
  let theme = document.documentElement.getAttribute('data-theme') || 'auto';
  themeBtn.textContent = 'Tema: ' + THEME_LABEL[theme];
  themeBtn.addEventListener('click', () => { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; applyTheme(theme); });
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => SS.redrawAll());

  /* ---------------- Mobil menü ---------------- */
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const closeMenu = () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); };
  document.getElementById('menuBtn').addEventListener('click', () => { sidebar.classList.add('open'); scrim.classList.add('show'); });
  scrim.addEventListener('click', closeMenu);

  /* ---------------- Kenar çubuğu ---------------- */
  function renderNav(route) {
    const nav = document.getElementById('nav');
    nav.innerHTML = '';
    const top = [
      ['#/', '★', 'Başlangıç', route === 'home'],
      ['#/vize', '✎', 'Vize hazırlık', route === 'vize'],
      ['#/deneme', '⏱', 'Deneme vizeleri', route === 'deneme'],
      ['#/formuller', '∑', 'Formül kağıdı', route === 'formuller'],
      ['#/lab', '⚗', 'Laboratuvarlar', route === 'lab']
    ];
    for (const [href, num, title, cur] of top) {
      nav.append(el('a', { class: 'nav-item', href, 'aria-current': cur ? 'page' : null },
        el('span', { class: 'nav-num' }, num), el('span', null, title), el('span')));
    }
    for (const ch of CHAPTERS) {
      nav.append(el('div', { class: 'nav-group' }, ch.title, ch.exam ? null : el('span', { class: 'badge-out' }, 'vize dışı')));
      for (const l of lessons().filter((x) => x.chap === ch.id)) {
        nav.append(el('a', { class: 'nav-item', href: '#/ders/' + l.id, 'aria-current': route === 'ders/' + l.id ? 'page' : null },
          el('span', { class: 'nav-num' }, l.id),
          el('span', null, l.title),
          el('span', { class: 'nav-dot' + (isDone(l.id) ? ' done' : ''), title: isDone(l.id) ? 'Tamamlandı' : '' })));
      }
    }
    const total = examLessons().length;
    const done = examLessons().filter((l) => isDone(l.id)).length;
    const sp = document.getElementById('sideProgress');
    sp.innerHTML = '';
    sp.append(el('div', null, 'Vize konuları: ', el('strong', null, done + ' / ' + total), ' ders'),
      el('div', { class: 'bar' }, el('span', { style: { width: (total ? (100 * done) / total : 0) + '%' } })));
  }

  /* ---------------- Blok çiziciler ---------------- */
  const evalSpec = (s) => (typeof s === 'function' ? s() : s);

  function figNode(spec) {
    const s = evalSpec(spec);
    return SS.figure(s);
  }

  function figs(list, caption) {
    const arr = Array.isArray(list) ? list : [list];
    const f = el('figure', { class: 'fig' });
    const row = el('div', { class: arr.length > 1 ? 'fig-row' : '' });
    arr.forEach((s) => row.append(figNode(s)));
    f.append(row);
    if (caption) f.append(el('figcaption', { html: R(caption) }));
    return f;
  }

  function box(cls, title, html) {
    return el('div', { class: 'box ' + cls }, title ? el('div', { class: 'box-title', html: R(title) }) : null, el('div', { html: R(html) }));
  }

  function stepCard(b, kind) {
    const isQ = kind === 'q';
    const isHw = kind === 'hw' || isQ;
    const card = el('article', { class: 'card' + (isQ ? ' card-q' : '') });
    card.append(el('div', { class: 'card-head' },
      el('span', { class: 'tag ' + (isQ ? 'tag-q' : isHw ? 'tag-hw' : 'tag-ex') }, isQ ? b.no : isHw ? 'Ödev' : 'Çözümlü örnek'),
      b.title ? el('span', { class: 'card-title', html: R(b.title) }) : null,
      b.pts ? el('span', { class: 'tag tag-pts' }, b.pts + ' puan') : null,
      b.ref ? el('span', { class: 'tag tag-src' }, 'Kaynak: Schaum ' + b.ref) : null,
      b.src ? el('span', { class: 'tag tag-src' }, 'Not ' + b.src) : null));
    const body = el('div', { class: 'card-body' });
    body.append(el('div', { class: 'card-q', html: R(b.q) }));
    if (b.fig) body.append(figs(b.fig, b.figCap));
    const steps = el('ol', { class: 'steps' });
    const ansBox = el('div');
    const hintBox = el('div');
    body.append(hintBox, steps, ansBox);
    const actions = el('div', { class: 'card-actions' });
    body.append(actions);
    card.append(body);

    const all = b.steps || [];
    let shown = 0;
    const nextBtn = SS.ui.button('', () => reveal(1), 'btn-primary');
    const allBtn = SS.ui.button('Tümünü göster', () => reveal(all.length + 1), 'btn-quiet');
    const resetBtn = SS.ui.button('Gizle', () => reset(), 'btn-quiet');
    const hintBtn = b.hint ? SS.ui.button('İpucu', () => { hintBox.innerHTML = ''; hintBox.append(el('div', { class: 'hint', html: R('<strong>İpucu:</strong> ' + b.hint) })); SS.fixMath(hintBox); hintBtn.disabled = true; }, '') : null;

    function stepNode(s) {
      const li = el('li', { class: 'step' });
      if (typeof s === 'string') li.innerHTML = R(s);
      else {
        if (s.h) li.append(el('div', { html: R(s.h) }));
        if (s.fig) li.append(figs(s.fig, s.cap));
      }
      return li;
    }
    function paint() {
      const left = all.length - shown;
      if (left > 0) {
        nextBtn.innerHTML = shown === 0 ? (isHw ? 'Çözümü adım adım aç' : 'İlk adımı göster') : 'Sonraki adım (' + (shown + 1) + '/' + all.length + ')';
        nextBtn.style.display = '';
      } else if (!ansBox.childNodes.length && b.ans) {
        nextBtn.innerHTML = 'Sonucu göster';
        nextBtn.style.display = '';
      } else nextBtn.style.display = 'none';
      allBtn.style.display = left > 0 || (!ansBox.childNodes.length && b.ans) ? '' : 'none';
      resetBtn.style.display = shown > 0 || ansBox.childNodes.length ? '' : 'none';
    }
    function reveal(k) {
      for (let i = 0; i < k; i++) {
        if (shown < all.length) { steps.append(stepNode(all[shown])); shown++; }
        else if (b.ans && !ansBox.childNodes.length) {
          ansBox.append(el('div', { class: 'answer', html: '<span class="answer-k">Sonuç</span>' + R(b.ans) }));
          break;
        }
      }
      SS.fixMath(body);
      paint();
    }
    function reset() { steps.innerHTML = ''; ansBox.innerHTML = ''; hintBox.innerHTML = ''; shown = 0; if (hintBtn) hintBtn.disabled = false; paint(); }

    actions.append(nextBtn, allBtn, resetBtn);
    if (hintBtn) actions.prepend(hintBtn);
    if (!isHw) actions.append(el('span', { class: 'think' }, 'Önce kâğıt üzerinde dene, sonra adımları aç.'));
    paint();
    return card;
  }

  function quiz(b, lessonId) {
    const wrap = el('div', { class: 'quiz' });
    wrap.append(el('h3', { style: { margin: '10px 0 2px' } }, b.title || 'Kendini yokla'));
    b.items.forEach((it, qi) => {
      const q = el('div', { class: 'qz' });
      q.append(el('div', { class: 'qz-q', html: R((qi + 1) + '. ' + it.q) }));
      const opts = el('div', { class: 'qz-opts' });
      const why = el('div');
      const btns = it.opts.map((o, oi) => {
        const btn = el('button', { type: 'button', class: 'qz-opt', html: R(o) });
        btn.addEventListener('click', () => {
          btns.forEach((x, k) => { x.disabled = true; if (k === it.a) x.classList.add('right'); });
          if (oi !== it.a) btn.classList.add('wrong');
          why.innerHTML = '';
          why.append(el('div', { class: 'qz-why', html: R((oi === it.a ? '<strong>Doğru.</strong> ' : '<strong>Tekrar bak:</strong> ') + (it.why || '')) }));
          SS.fixMath(why);
          progress.quiz[lessonId] = progress.quiz[lessonId] || {};
          progress.quiz[lessonId][qi] = oi === it.a;
          save();
        });
        opts.append(btn);
        return btn;
      });
      q.append(opts, why);
      wrap.append(q);
    });
    const again = SS.ui.button('Soruları sıfırla', () => {
      const fresh = quiz(b, lessonId);
      wrap.replaceWith(fresh);
      SS.fixMath(fresh);
    }, 'btn-quiet');
    wrap.append(el('div', { class: 'card-actions' }, again));
    return wrap;
  }

  function table(b) {
    const t = el('table', { class: 'tbl' });
    if (b.head) t.append(el('thead', null, el('tr', null, b.head.map((h) => el('th', { html: R(h) })))));
    t.append(el('tbody', null, b.rows.map((r) => el('tr', null, r.map((c) => el('td', { html: R(c) }))))));
    return el('div', { class: 'tbl-wrap' }, t);
  }

  function renderBlock(b, lesson) {
    switch (b.t) {
      case 'h': return el('h2', { html: R(b.h) + (b.src ? ' <span class="h-src">Not ' + b.src + '</span>' : '') });
      case 'h3': return el('h3', { html: R(b.h) });
      case 'p': return el('p', { html: R(b.h) });
      case 'html': return el('div', { html: R(b.h) });
      case 'math': return el('div', { html: SS.tex(b.h, true) });
      case 'list': return el(b.ordered ? 'ol' : 'ul', null, b.items.map((i) => el('li', { html: R(i) })));
      case 'idea': return box('box-idea', '💡 ' + (b.title || 'Sezgi'), b.h);
      case 'def': return box('box-def', b.title || 'Tanım', b.h);
      case 'trap': return box('box-trap', '⚠ ' + (b.title || 'Dikkat'), b.h);
      case 'erratum': return box('box-err', '✎ Notta düzeltme' + (b.src ? ' · ' + b.src : ''), b.h);
      case 'recipe': return el('div', { class: 'box box-recipe' }, el('div', { class: 'box-title' }, '✓ ' + (b.title || 'Çözüm reçetesi')),
        el('ol', null, b.steps.map((s) => el('li', { html: R(s) }))));
      case 'table': return table(b);
      case 'fig': return figs(b.fig, b.cap);
      case 'example': return stepCard(b, 'ex');
      case 'hw': return stepCard(b, 'hw');
      case 'q': return stepCard(b, 'q');
      case 'mq': return el('div', { class: 'mq' },
        el('div', { class: 'mq-no' }, 'SORU ' + b.no),
        el('div', { class: 'mq-body' }, el('h2', { class: 'mq-title', html: R(b.title) }), b.h ? el('p', { class: 'mq-desc', html: R(b.h) }) : null),
        b.pts ? el('div', { class: 'mq-pts' }, b.pts + ' puan') : null);
      case 'quiz': return quiz(b, lesson ? lesson.id : 'x');
      case 'lab': {
        const holder = el('div');
        const lab = SS.labs && SS.labs[b.id];
        if (!lab) { holder.textContent = 'Laboratuvar bulunamadı: ' + b.id; return holder; }
        requestAnimationFrame(() => { lab.mount(holder, b.opts || {}); SS.fixMath(holder); });
        return holder;
      }
      default: return el('div', { text: '' });
    }
  }

  /* ---------------- Sayfalar ---------------- */
  const main = document.getElementById('main');

  function pageLesson(id) {
    const l = byId(id);
    if (!l) return pageNotFound();
    const all = lessons();
    const idx = all.indexOf(l);
    const ch = CHAPTERS.find((c) => c.id === l.chap);
    const page = el('div', { class: 'page' });
    page.append(el('div', { class: 'crumb' },
      el('span', null, ch ? ch.title : ''), el('span', null, '·'), el('span', { class: 'pill' }, 'Ders notu ' + l.pages),
      ch && ch.exam ? el('span', { class: 'pill pill-ok' }, 'Vize konusu') : el('span', { class: 'pill pill-out' }, 'Vize dışı')));
    page.append(el('h1', { html: R(l.id + ' ' + l.title) }));
    if (l.lead) page.append(el('p', { class: 'lead', html: R(l.lead) }));
    if (l.goals) page.append(el('ul', { class: 'goals' }, l.goals.map((g) => el('li', { html: R(g) }))));
    for (const b of l.blocks) page.append(renderBlock(b, l));

    // Ders sonu: tamamlandı + önceki/sonraki
    const foot = el('div', { class: 'lesson-foot' });
    const doneBtn = SS.ui.button('', () => {
      progress.done[l.id] = !progress.done[l.id];
      save();
      paintDone();
      renderNav('ders/' + l.id);
    }, '');
    const paintDone = () => {
      doneBtn.className = 'btn ' + (isDone(l.id) ? 'btn-ok' : 'btn-primary');
      doneBtn.textContent = isDone(l.id) ? '✓ Tamamlandı (geri al)' : 'Bu dersi bitirdim';
    };
    paintDone();
    foot.append(el('div', { class: 'done-row' }, doneBtn, el('span', { class: 'think' }, 'Ödevleri çözmeden işaretleme: sınavda gelen sorular onlara çok benzer.')));
    const pager = el('nav', { class: 'pager', 'aria-label': 'Ders gezinme' });
    const prev = all[idx - 1], next = all[idx + 1];
    if (prev) pager.append(el('a', { href: '#/ders/' + prev.id }, el('small', null, '← Önceki'), prev.id + ' ' + prev.title));
    if (next) pager.append(el('a', { class: 'next', href: '#/ders/' + next.id }, el('small', null, 'Sonraki →'), next.id + ' ' + next.title));
    foot.append(pager);
    page.append(foot);
    document.title = l.id + ' ' + l.title + ' · Sinyal Defteri';
    return page;
  }

  function heroFigures() {
    const { rect, u } = SS.sig;
    const xf = (t) => rect(t - 0.5);
    const hf = (t) => Math.exp(-1.5 * t) * u(t);
    const yf = (t) => (t < 0 ? 0 : t < 1 ? (1 - Math.exp(-1.5 * t)) / 1.5 : (Math.exp(-1.5 * (t - 1)) - Math.exp(-1.5 * t)) / 1.5);
    const base = { x: [-1, 4], h: 130, xStep: 1, yStep: 0.5 };
    const row = el('div', { class: 'fig-row hero-sig' });
    row.append(
      SS.figure(Object.assign({}, base, { y: [-0.2, 1.3], title: 'Giriş  x(t)', layers: [{ kind: 'fn', f: xf, color: 'x', fill: true }] })),
      SS.figure(Object.assign({}, base, { y: [-0.2, 1.3], title: 'İmpuls cevabı  h(t)', layers: [{ kind: 'fn', f: hf, color: 'h', fill: true }] })),
      SS.figure(Object.assign({}, base, { y: [-0.1, 0.65], yStep: 0.2, title: 'Çıkış  y(t) = x(t) ∗ h(t)', layers: [{ kind: 'fn', f: yf, color: 'y', fill: true }] }))
    );
    return row;
  }

  function pageHome() {
    const page = el('div', { class: 'page' });
    const hero = el('section', { class: 'hero' });
    hero.append(el('div', { class: 'crumb' }, el('span', { class: 'pill' }, 'Ders notları: Ömer Akgün · Bölüm 1 ve 2')));
    hero.append(el('h1', null, 'Sinyal Defteri'));
    hero.append(el('p', { class: 'lead', html: R('Sinyaller ve Sistemler dersinin ilk iki bölümü: sinyalleri tanımaktan başlayıp konvolüsyon ve fark denklemlerine kadar. Ders notundaki her konu burada <strong>sezgiyle</strong> açıklanır, <strong>etkileşimli grafiklerle</strong> denenir ve notun kendi örnekleriyle <strong>adım adım</strong> çözülür.') }));
    hero.append(heroFigures());
    hero.append(box('box-def', 'Vize kapsamı', '<strong>Bölüm 1’in tamamı</strong> (1.1–1.11): sinyaller ve sistem özellikleri, kararlılık dahil. Bölüm 2 (LTI sistemler) vizeye <strong>dahil değil</strong>, finalde gelecek. Vizeden önceki son gün <a href="#/vize">Vize hazırlık</a> sayfasındaki deneme sorularını çöz.'));
    const firstUndone = examLessons().find((l) => !isDone(l.id)) || examLessons()[0];
    const cta = el('div', { class: 'cta-row' });
    if (firstUndone) cta.append(el('a', { class: 'btn btn-primary', href: '#/ders/' + firstUndone.id }, (Object.keys(progress.done).some((k) => progress.done[k]) ? 'Kaldığın yerden devam et: ' : 'Başla: ') + firstUndone.id + ' ' + firstUndone.title));
    cta.append(el('a', { class: 'btn', href: '#/vize' }, 'Vize hazırlık'));
    cta.append(el('a', { class: 'btn', href: '#/deneme' }, 'Deneme vizeleri'));
    cta.append(el('a', { class: 'btn', href: '#/formuller' }, 'Formül kağıdı'));
    cta.append(el('a', { class: 'btn', href: '#/lab' }, 'Tüm laboratuvarlar'));
    hero.append(cta);
    page.append(hero);

    page.append(el('h2', null, 'Her ders aynı döngüyü izler'));
    page.append(el('ol', { class: 'cycle' },
      el('li', null, el('strong', null, 'Sezgi'), 'Formülden önce fikir: bu kavram neden var, neyi anlatıyor?'),
      el('li', null, el('strong', null, 'Tanım'), 'Notun kırmızı çerçeveli formülleri, sade bir dille açıklanmış hâlde.'),
      el('li', null, el('strong', null, 'Laboratuvar'), 'Kaydırıcıyı oynat, sinyalin nasıl değiştiğini kendi gözünle gör.'),
      el('li', null, el('strong', null, 'Çözümlü örnek'), 'Notun örnekleri adım adım açılır. Her adımdan önce kendin dene.'),
      el('li', null, el('strong', null, 'Ödev ve yoklama'), 'Notun ödevleri ipucu ve çözümle. Sonunda kısa sorular.')));

    page.append(el('h3', null, 'Renk dili (tüm sitede aynı)'));
    page.append(el('div', { class: 'colors', html:
      '<span><i style="background:var(--c-x)"></i>' + SS.tex('x(t)', false) + ' giriş sinyali</span>' +
      '<span><i style="background:var(--c-h)"></i>' + SS.tex('h(t)', false) + ' impuls cevabı / ikinci sinyal</span>' +
      '<span><i style="background:var(--c-y)"></i>' + SS.tex('y(t)', false) + ' çıkış / sonuç</span>' +
      '<span><i style="background:var(--c-warn)"></i> uyarı, nedensellik ihlali</span>' }));

    for (const ch of CHAPTERS) {
      const sec = el('section', { class: 'chap' });
      sec.append(el('div', { class: 'chap-head' }, el('h2', null, ch.title), el('span', null, ch.sub + ' · ' + ch.pages), ch.exam ? null : el('span', { class: 'pill pill-out' }, 'Vize dışı · final')));
      const grid = el('div', { class: 'lessons' });
      for (const l of lessons().filter((x) => x.chap === ch.id)) {
        grid.append(el('a', { class: 'lesson-card' + (isDone(l.id) ? ' done' : ''), href: '#/ders/' + l.id },
          el('span', { class: 'lc-num' }, l.id + ' · ' + l.pages),
          el('span', { class: 'lc-title', html: R(l.title) }),
          el('span', { class: 'lc-sub', html: R(l.sub || '') })));
      }
      sec.append(grid);
      page.append(sec);
    }
    page.append(box('box-idea', 'Nasıl çalışmalı?', 'Dersleri sırayla git: her konu bir öncekinin üstüne kurulu. Konvolüsyona (2.2) gelmeden önce <strong>1.7 Sinyal işlemleri</strong> rahat olmalı, çünkü konvolüsyon çevirme ve kaydırmadan ibarettir. Sınavdan önce <a href="#/formuller">Formül kağıdına</a> ve her dersin <strong>Çözüm reçetesi</strong> kutusuna bak. Klavye: ders sayfasında <kbd>←</kbd> <kbd>→</kbd> önceki/sonraki ders.'));
    page.append(el('p', { class: 'think', html: 'İlerlemen yalnızca bu tarayıcıda saklanır. <button type="button" class="btn btn-quiet" id="resetProg">İlerlemeyi sıfırla</button>' }));
    setTimeout(() => {
      const b = document.getElementById('resetProg');
      if (b) b.addEventListener('click', () => { if (confirm('Tüm ilerleme ve soru cevapları silinsin mi?')) { progress = { done: {}, quiz: {} }; save(); route(); } });
    });
    document.title = 'Sinyal Defteri · Sinyaller ve Sistemler';
    return page;
  }

  function pageFormulas() {
    const page = el('div', { class: 'page' });
    page.append(el('div', { class: 'crumb' }, el('span', { class: 'pill' }, 'Bölüm 1 ve 2')));
    page.append(el('h1', null, 'Formül kağıdı'));
    page.append(el('p', { class: 'lead', html: R('Sınavdan önce tek sayfada tekrar. Her kartın altındaki bağlantı, konunun anlatıldığı derse götürür.') }));
    const sheet = el('div', { class: 'sheet' });
    for (const c of SS.formulas || []) {
      const card = el('div', { class: 'sheet-card' });
      card.append(el('h3', { html: R(c.title) }));
      for (const it of c.items) {
        if (it.startsWith('$$')) card.append(el('div', { html: R(it) }));
        else card.append(el('p', { html: R(it) }));
      }
      if (c.lesson) card.append(el('p', null, el('a', { href: '#/ders/' + c.lesson }, '→ Ders ' + c.lesson)));
      sheet.append(card);
    }
    page.append(sheet);
    document.title = 'Formül kağıdı · Sinyal Defteri';
    return page;
  }

  function pageLabs(id) {
    const page = el('div', { class: 'page' });
    const labs = SS.labs || {};
    if (id && labs[id]) {
      const lab = labs[id];
      page.append(el('div', { class: 'crumb' }, el('a', { href: '#/lab' }, '← Tüm laboratuvarlar')));
      page.append(el('h1', { html: R(lab.title) }));
      const where = lessons().filter((l) => l.blocks.some((b) => b.t === 'lab' && b.id === id));
      if (where.length) page.append(el('p', { class: 'lead', html: 'Anlatıldığı ders: ' + where.map((l) => '<a href="#/ders/' + l.id + '">' + l.id + ' ' + l.title + '</a>').join(', ') }));
      const holder = el('div');
      page.append(holder);
      requestAnimationFrame(() => { lab.mount(holder, {}); SS.fixMath(holder); });
      document.title = lab.title + ' · Sinyal Defteri';
      return page;
    }
    page.append(el('h1', null, 'Laboratuvarlar'));
    page.append(el('p', { class: 'lead', html: R('Derslerdeki etkileşimli araçların hepsi burada. Bir sinyali veya sistemi denemek ya da ödevin cevabını kontrol etmek için doğrudan açabilirsin.') }));
    const grid = el('div', { class: 'lessons' });
    for (const k of Object.keys(labs)) {
      const lab = labs[k];
      const where = lessons().find((l) => l.blocks.some((b) => b.t === 'lab' && b.id === k));
      grid.append(el('a', { class: 'lesson-card', href: '#/lab/' + k },
        el('span', { class: 'lc-num' }, where ? 'Ders ' + where.id : 'Laboratuvar'),
        el('span', { class: 'lc-title', html: R(lab.title) }),
        el('span', { class: 'lc-sub', html: R(lab.blurb || '') })));
    }
    page.append(grid);
    document.title = 'Laboratuvarlar · Sinyal Defteri';
    return page;
  }

  function pageVize() {
    const V = SS.examPrep;
    const page = el('div', { class: 'page' });
    page.append(el('div', { class: 'crumb' }, el('span', { class: 'pill pill-ok' }, 'Bölüm 1 · ders notu s. 2–68')));
    page.append(el('h1', null, 'Vize hazırlık'));
    if (!V) return page;
    page.append(el('p', { class: 'lead', html: R(V.lead) }));
    for (const b of V.blocks) page.append(renderBlock(b, { id: 'vize' }));
    document.title = 'Vize hazırlık · Sinyal Defteri';
    return page;
  }

  function pageDeneme(id) {
    const sets = SS.examSets || [];
    const page = el('div', { class: 'page' });
    const ex = sets.find((s) => s.id === id);
    if (!ex) {
      page.append(el('div', { class: 'crumb' }, el('span', { class: 'pill pill-ok' }, 'Bölüm 1 · vize formatı')));
      page.append(el('h1', null, 'Deneme vizeleri'));
      page.append(el('p', { class: 'lead', html: R(SS.examIntro || '') }));
      const grid = el('div', { class: 'lessons' });
      sets.forEach((s) => grid.append(el('a', { class: 'lesson-card', href: '#/deneme/' + s.id },
        el('span', { class: 'lc-num' }, 'Deneme ' + s.id + ' · ' + s.questions.reduce((n, q) => n + q.items.length, 0) + ' alt soru'),
        el('span', { class: 'lc-title', html: R(s.title) }),
        el('span', { class: 'lc-sub', html: R(s.questions.map((q) => q.no + '. ' + q.title).join(' · ')) }))));
      page.append(grid);
      page.append(box('box-idea', 'Nasıl kullanılır?', 'Bir denemeyi gerçek sınav gibi çöz: süre tut (75 dakika öner), kâğıt kalemle bütün alt soruları bitir, <strong>sonra</strong> çözümleri aç. Yanlış yaptığın her alt sorunun altında, konunun anlatıldığı derse bağlantı var.'));
      document.title = 'Deneme vizeleri · Sinyal Defteri';
      return page;
    }
    page.append(el('div', { class: 'crumb' }, el('a', { href: '#/deneme' }, '← Tüm denemeler'), el('span', null, '·'), el('span', { class: 'pill pill-ok' }, 'Vize formatı: 3 ana soru')));
    page.append(el('h1', { html: R('Deneme vizesi ' + ex.id + ': ' + ex.title) }));
    page.append(el('p', { class: 'lead', html: R(ex.blurb) }));
    const bar = el('div', { class: 'card-actions' });
    bar.append(SS.ui.button('Bütün çözümleri aç', () => page.querySelectorAll('.card-q').forEach((c) => { const b = [...c.querySelectorAll('button')].find((x) => x.textContent === 'Tümünü göster' && x.style.display !== 'none'); if (b) b.click(); }), ''),
      SS.ui.button('Bütün çözümleri gizle', () => page.querySelectorAll('.card-q').forEach((c) => { const b = [...c.querySelectorAll('button')].find((x) => x.textContent === 'Gizle' && x.style.display !== 'none'); if (b) b.click(); }), 'btn-quiet'),
      el('span', { class: 'think' }, 'Kaynak: H. Hsu, Schaum’s Outline of Signals and Systems (2. baskı), Bölüm 1. Sorular Türkçeleştirildi, çözümler adım adım yeniden yazıldı.'));
    page.append(bar);
    for (const q of ex.questions) {
      page.append(renderBlock({ t: 'mq', no: q.no, title: q.title, pts: q.pts, h: q.h }));
      for (const it of q.items) {
        const card = renderBlock(Object.assign({ t: 'q' }, it));
        if (it.lesson) card.querySelector('.card-body').append(el('p', { class: 'think', style: { marginTop: '10px' }, html: 'Konu tekrarı: <a href="#/ders/' + it.lesson + '">Ders ' + it.lesson + '</a>' }));
        page.append(card);
      }
    }
    const sets2 = sets.map((s) => s.id);
    const i = sets2.indexOf(ex.id);
    const pager = el('nav', { class: 'pager' });
    if (i > 0) pager.append(el('a', { href: '#/deneme/' + sets2[i - 1] }, el('small', null, '← Önceki'), 'Deneme ' + sets2[i - 1]));
    if (i < sets2.length - 1) pager.append(el('a', { class: 'next', href: '#/deneme/' + sets2[i + 1] }, el('small', null, 'Sonraki →'), 'Deneme ' + sets2[i + 1]));
    page.append(el('div', { class: 'lesson-foot' }, pager));
    document.title = 'Deneme ' + ex.id + ' · Sinyal Defteri';
    return page;
  }

  function pageNotFound() {
    return el('div', { class: 'page' }, el('h1', null, 'Sayfa bulunamadı'), el('p', null, el('a', { href: '#/' }, 'Ana sayfaya dön')));
  }

  /* ---------------- Yönlendirme ---------------- */
  let current = '';
  function route() {
    const h = (location.hash || '#/').replace(/^#\/?/, '');
    const parts = h.split('/');
    let node, key;
    if (!h) { node = pageHome(); key = 'home'; }
    else if (parts[0] === 'ders') { node = pageLesson(decodeURIComponent(parts[1] || '')); key = 'ders/' + parts[1]; }
    else if (parts[0] === 'formuller') { node = pageFormulas(); key = 'formuller'; }
    else if (parts[0] === 'vize') { node = pageVize(); key = 'vize'; }
    else if (parts[0] === 'deneme') { node = pageDeneme(parts[1]); key = 'deneme'; }
    else if (parts[0] === 'lab') { node = pageLabs(parts[1]); key = 'lab'; }
    else { node = pageNotFound(); key = '404'; }
    main.innerHTML = '';
    main.append(node);
    SS.fixMath(main);
    renderNav(key);
    closeMenu();
    if (current !== h) window.scrollTo(0, 0);
    current = h;
    main.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (/INPUT|SELECT|TEXTAREA|BUTTON/.test(tag)) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const m = /^#\/ders\/(.+)$/.exec(location.hash);
    if (!m) return;
    const all = lessons();
    const i = all.findIndex((l) => l.id === decodeURIComponent(m[1]));
    const t = all[i + (e.key === 'ArrowRight' ? 1 : -1)];
    if (t) location.hash = '#/ders/' + t.id;
  });

  // Yazı tipleri yüklenince kesir/parantez ölçülerini yenile
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => SS.fixMath(main));
  route();
})();
