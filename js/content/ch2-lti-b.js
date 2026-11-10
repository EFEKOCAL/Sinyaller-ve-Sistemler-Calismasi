/*
 * Bölüm 2 · LTI sistemler (2): 2.5 Ayrık konvolüsyon toplamı · 2.6 Basamak cevabı · 2.7 Fark denklemleri
 * Kaynak: Ömer Akgün, Sinyaller ve Sistemler ders notları, s. 90–109
 */
(function () {
  'use strict';
  const SS = window.SS;
  SS.lessons = SS.lessons || [];
  const T = String.raw;
  const stems = (f, a, b, color, o) => () => { const n = [], v = []; for (let k = a; k <= b; k++) { n.push(k); v.push(f(k)); } return Object.assign({ kind: 'stem', n, v, color: color || 'x', labels: true }, o || {}); };
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 165, xLabel: 'n', xStep: 1, layers: layers.map((l) => (typeof l === 'function' ? l() : l)) }, o || {});
  const seq = (start, v) => (n) => (n - start >= 0 && n - start < v.length ? v[n - start] : 0);

  /* ====================================================================== */
  SS.lessons.push({
    id: '2.5', chap: 'lti', title: 'Ayrık konvolüsyon toplamı', pages: 's. 90–97',
    sub: 'y[n] = Σ x[k] h[n−k], kaydırma ve tablo yöntemi',
    lead: 'Sürekli zamandaki her şey burada da geçerli: integral yerine toplam, $\\tau$ yerine $k$. İşin iyi tarafı, sonlu dizilerde hesap tamamen aritmetiktir.',
    goals: ['Konvolüsyon toplamını yazmak', 'δ yöntemi ile hızlı çözüm', 'Grafik (kaydırma) ve tablo yöntemi', 'Geometrik seriyle kapalı form bulmak'],
    blocks: [
      { t: 'def', title: 'Tanım ve özellikler (s. 90)', h: T`$$h[n] = T\{\delta[n]\} \qquad\qquad \boxed{y[n] = x[n] * h[n] = \sum_{k=-\infty}^{\infty} x[k]\,h[n-k]}$$
1. $x*h = h*x$ &nbsp; 2. $f*(x+y) = f*x + f*y$ &nbsp; 3. $f*(x*y) = (f*x)*y$ &nbsp; 4. $x[n-m]*h[n-k] = y[n-m-k]$ &nbsp; 5. $x[n]*\delta[n] = x[n]$` },
      { t: 'p', h: T`Türetme sürekli zamanla aynıdır: $x[n] = \sum_k x[k]\delta[n-k]$ (1.6’daki 5. özellik). Her $\delta[n-k]$ terimi $h[n-k]$ cevabını üretir ve bu cevaplar $x[k]$ ağırlıklarıyla toplanır.` },
      { t: 'recipe', title: 'Üç yöntem: soruya göre seç', steps: [
        T`<strong>δ yöntemi (kısa diziler):</strong> bir diziyi impulslarla yaz. $x * \delta[n-k] = x[n-k]$ olduğundan sonuç, $x$’in kaydırılmış kopyalarının toplamıdır (s. 93).`,
        T`<strong>Kaydırma (grafik) yöntemi:</strong> $h[k]$’yı çevir ($h[-k]$), $n$ kadar kaydır, $x[k]$ ile çarp, topla. Bunu her $n$ için tekrarla (s. 94).`,
        T`<strong>Tablo yöntemi (sonlu diziler):</strong> satırlara $x$, sütunlara $h$ yaz, hücrelere çarpımları koy. İndislerinin toplamı aynı olan hücreleri (çaprazları) topla.`,
        T`<strong>Analitik yöntem (sonsuz diziler):</strong> $u[\cdot]$’ları toplamın sınırına çevir, geometrik seri formülünü uygula (s. 92, 95).`,
        T`<strong>Kontrol:</strong> $x$’in $L_x$, $h$’nin $L_h$ örneği varsa sonucun $L_x + L_h - 1$ örneği olur. Başlangıç indisleri de toplanır.`] },
      { t: 'example', src: 's. 93–94', q: T`$x[n] = \delta[n-1] + \delta[n-2] + \delta[n-3]$ ve $h[n] = \delta[n] + \delta[n-1] + \delta[n-2]$. $y[n]$’yi bul.`,
        fig: [spec([-1.6, 6.6], [-0.3, 1.5], [stems(seq(1, [1, 1, 1]), -1, 6)], { title: 'x[n]' }), spec([-1.6, 6.6], [-0.3, 1.5], [stems(seq(0, [1, 1, 1]), -1, 6, 'h')], { title: 'h[n]' })],
        steps: [T`δ yöntemi: $y = x * \{\delta[n] + \delta[n-1] + \delta[n-2]\} = x[n] + x[n-1] + x[n-2]$`,
          T`$= \delta[n-1] + \delta[n-2] + \delta[n-3]$<br>$\;\;+\,\delta[n-2] + \delta[n-3] + \delta[n-4]$<br>$\;\;+\,\delta[n-3] + \delta[n-4] + \delta[n-5]$`,
          T`Aynı terimleri topla: $\delta[n-1] + 2\delta[n-2] + 3\delta[n-3] + 2\delta[n-4] + \delta[n-5]$`,
          { h: T`Grafik yöntemle kontrol: $n=3$ için $h[3-k]$, $k = 1, 2, 3$ noktalarında 1’dir. $x$ ile tam örtüşür: $y[3] = 1+1+1 = 3$.`, fig: spec([-0.6, 6.6], [-0.3, 3.6], [stems(seq(1, [1, 2, 3, 2, 1]), 0, 6, 'y')], { title: 'y[n]' }) }],
        ans: T`$y[n] = \{\underbrace{0}_{\uparrow}, 1, 2, 3, 2, 1\}$ ($n = 0 \ldots 5$). Uzunluk kontrolü: $3 + 3 - 1 = 5$ sıfır olmayan örnek ✓` },
      { t: 'erratum', src: 's. 94', h: T`Notun s. 94’teki grafik çözümünde “$n = 0, 1, 2, 3, 4, 5$, $y = 1$” satırı yanıltıcı. Doğru değerler $y[0] = 0$, $y[1] = 1$, $y[2] = 2$, $y[3] = 3$, $y[4] = 2$, $y[5] = 1$; $n > 5$ için $y = 0$. Notun en alttaki $[1, 2, 3, 2, 1]$ sonucu doğrudur ve $n = 1$’den başlar.` },
      { t: 'lab', id: 'dconv' },
      { t: 'example', src: 's. 95', q: T`$x[n] = \{\underbrace{1}_{\uparrow}, 1\}$ ve $h[n] = \{\underbrace{3}_{\uparrow}, 2, 1\}$. $y[n]$’yi bul.`,
        steps: [T`Tablo yöntemi: satırlar $x[0]=1$, $x[1]=1$; sütunlar $h[0]=3$, $h[1]=2$, $h[2]=1$. İki satır da $3, 2, 1$ olur.`,
          T`Çaprazlar: $y[0] = 3$, $\;y[1] = 2 + 3 = 5$, $\;y[2] = 1 + 2 = 3$, $\;y[3] = 1$.`],
        ans: T`$y[n] = \{\underbrace{3}_{\uparrow}, 5, 3, 1\}$. Laboratuvarda “s. 95” örneğini seçip tablo yöntemini izle.` },
      { t: 'example', src: 's. 91–92', q: T`$r[n] = u[n] * u[n]$ dizisini bul.`,
        steps: [T`$u[n] * u[n] = \sum_k u[k]\,u[n-k]$`, T`$u[k] = 1$ için $k \ge 0$, $\;u[n-k] = 1$ için $k \le n$. İkisi birden ancak $0 \le k \le n$ olduğunda 1 (ve bunun için $n \ge 0$ gerekir).`, T`$\sum_{k=0}^{n} 1 = n + 1$`],
        ans: T`$u[n] * u[n] = (n+1)\,u[n]$` },
      { t: 'example', src: 's. 92', q: T`$x[n] = u[n]$, $h[n] = a^n u[n]$, $0<a<1$. $y[n]$’yi bul.`,
        steps: [T`$y[n] = \sum_k u[k]\,a^{n-k}u[n-k] = \sum_{k=0}^{n} a^{n-k}$, $\;n \ge 0$`, T`$m = n - k$ koy: $\sum_{m=0}^{n} a^m = \frac{1 - a^{n+1}}{1 - a}$`],
        ans: T`$y[n] = \frac{1 - a^{n+1}}{1-a}\,u[n]$. $n\to\infty$ iken $\frac{1}{1-a}$’ya yaklaşır.` },
      { t: 'example', src: 's. 95–96', q: T`$x[n] = (0.7)^n u[n]$ ve $h[n] = (0.2)^n u[n]$. $y[n]$’yi bul.`,
        steps: [T`$y[n] = \sum_{k=0}^{n}(0.7)^k(0.2)^{n-k} = (0.2)^n\sum_{k=0}^{n}\left(\frac{0.7}{0.2}\right)^k$`,
          T`Sonlu geometrik seri: $\sum_{k=0}^{n} r^k = \frac{1 - r^{n+1}}{1 - r}$, $\;r = 3.5$`,
          T`$y[n] = (0.2)^n\,\frac{1 - (3.5)^{n+1}}{1 - 3.5} = \frac{(0.2)^n - 0.2^n\cdot 3.5^{n+1}}{-2.5}$. $0.2^n\cdot3.5^{n+1} = 0.7^{n+1}/0.2$ olduğu için…`,
          T`$= -2\left[(0.2)^{n+1} - (0.7)^{n+1}\right]$`],
        ans: T`$y[n] = 2\left[(0.7)^{n+1} - (0.2)^{n+1}\right]u[n]$. Kontrol: $y[0] = 2(0.7 - 0.2) = 1 = x[0]h[0]$ ✓` },
      { t: 'erratum', src: 's. 96', h: T`Notta geometrik seri $\sum_{k=0}^{n}(a/b)^k = \frac{1 - (a/b)^{n-1}}{1 - (a/b)}$ olarak yazılmış. Üs <strong>$n+1$</strong> olmalı: $n+1$ terim var. Bir sonraki satırda zaten $(0.7/0.2)^{n+1}$ kullanılıyor, yani sonuç doğru.` },
      { t: 'hw', src: 's. 96', q: T`$x[n] = 4^n u[n]$ ve $h[n] = u[n]$. $y[n]$’yi bul.`, hint: T`$\sum_{k=0}^{n}4^k$, oranı 4 olan sonlu bir geometrik seri. Formül $|r|<1$ şartı istemez.`,
        steps: [T`$y[n] = \sum_{k=0}^{n} 4^k\cdot 1 = \frac{1 - 4^{n+1}}{1 - 4} = \frac{4^{n+1} - 1}{3}$`, T`Kontrol: $y[0] = 1$, $y[1] = 1 + 4 = 5$ ✓ ($\frac{16-1}{3} = 5$)`],
        ans: T`$y[n] = \frac{4^{n+1} - 1}{3}\,u[n]$` },
      { t: 'example', src: 's. 97', title: 'Paralel bağlı ayrık sistem', q: T`$h[n] = \left(\frac14\right)^n u[n] + 4^n u[-n]$, $\;x[n] = u[n]$. $y[n]$’yi bul.`,
        steps: [T`Paralel kollar gibi düşün: $h_1 = (1/4)^n u[n]$, $h_2 = 4^n u[-n]$. $y = x*h_1 + x*h_2$.`,
          T`$y_1[n] = \sum_{k=0}^{n}(1/4)^{n-k} = \frac{1 - (1/4)^{n+1}}{3/4}$, $\;n \ge 0$`,
          T`$y_2[n] = \sum_{k} u[k]\,4^{n-k}u[k-n]$. Toplam $k \ge \max(0, n)$ üzerinden. $n \le 0$ için $\sum_{k=0}^{\infty}4^{n-k} = \frac43 4^n$; $\;n > 0$ için $\sum_{k=n}^{\infty}4^{n-k} = \frac43$.`,
          T`Birleştir. $n<0$: $y = \frac{4^{n+1}}{3}$. $\;n \ge 0$: $y = \frac43\left(1 - \frac{1}{4^{n+1}}\right) + \frac43 = \frac83 - \frac13\left(\frac14\right)^n$.`],
        ans: T`$y[n] = \begin{cases} \frac{1}{3}4^{n+1} & n < 0 \\ \frac{8}{3} - \frac{1}{3}\left(\frac14\right)^n & n \ge 0\end{cases}$ &nbsp; Kontrol: $n = 0$’da iki ifade de $\frac73$ verir.` },
      { t: 'quiz', items: [
        { q: T`$\{1, 2\} * \{1, -1\}$ (ikisi de $n=0$’dan başlıyor) nedir?`, opts: ['$\\{1, 1, -2\\}$', '$\\{1, -2\\}$', '$\\{1, 3, 2\\}$'], a: 0, why: T`$y[0] = 1$, $y[1] = -1 + 2 = 1$, $y[2] = -2$.` },
        { q: T`5 örneklik bir dizi ile 4 örneklik bir dizinin konvolüsyonu en fazla kaç örnek içerir?`, opts: ['9', '8', '20'], a: 1, why: T`$5 + 4 - 1 = 8$.` },
        { q: T`$x[n] * \delta[n+2]$ nedir?`, opts: ['$x[n-2]$', '$x[n+2]$', '$x[2]$'], a: 1, why: T`Sinyal impulsun yerine taşınır: 2 adım sola.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '2.6', chap: 'lti', title: 'Basamak cevabı', pages: 's. 98–99',
    sub: 's = h ∗ u, h = s[n] − s[n−1]',
    lead: 'Laboratuvarda bir impuls üretmek zordur, ama bir anahtarı açmak (basamak) kolaydır. Bu yüzden sistemler genellikle basamak cevabıyla ölçülür, impuls cevabı da ondan türetilir.',
    goals: ['Basamak cevabının tanımı', 'Birikimli toplam / integral olarak hesaplamak', 'Basamak cevabından impuls cevabına dönmek'],
    blocks: [
      { t: 'def', title: 'Tanım (s. 98)', h: T`$$s[n] = h[n] * u[n] = \sum_{k=-\infty}^{n} h[k] \qquad\qquad h[n] = s[n] - s[n-1]$$
Sürekli zamanda: $\;s(t) = h(t) * u(t) = \int_{-\infty}^{t} h(\tau)\,d\tau$, $\quad h(t) = \frac{ds(t)}{dt}$` },
      { t: 'idea', h: T`$u$ ile konvolüsyon “şimdiye kadar biriken toplam” demektir. Basamak cevabı, impuls cevabının <em>birikimli</em> hâlidir. Kararlı bir sistemde $s$ sonunda $\sum h$ (veya $\int h$) değerine yerleşir. Bu değere sistemin “DC kazancı” denir.` },
      { t: 'example', src: 's. 98–99', q: T`İmpuls cevabı $h[n] = 3\delta[n] + \delta[n-1]$ olan sistemin basamak cevabını bul.`,
        steps: [T`$s[n] = \sum_{k=-\infty}^{\infty} h[n-k]\,u[k] = \sum_{k=0}^{\infty} h[n-k]$ ($k<0$ için $u[k] = 0$).`,
          T`$= \sum_{k=0}^{\infty} 3\delta[n-k] + \sum_{k=0}^{\infty}\delta[n-1-k]$`,
          T`$\sum_{k=0}^{\infty}\delta[n-k] = u[n]$ (birikimli impuls basamaktır). Aynı şekilde $\sum_{k=0}^{\infty}\delta[n-1-k] = u[n-1]$.`],
        ans: T`$s[n] = 3u[n] + u[n-1]$: $s[0] = 3$, $n \ge 1$ için $s[n] = 4$.` },
      { t: 'example', src: 's. 73', title: 'Sürekli zamandaki karşılığı', q: T`2.1’de $h(t) = e^{-3t}u(t)$ sistemine $u(t)$ vermiştik. Bulduğumuz şey neydi?`,
        steps: [T`$y(t) = h * u = \frac13(1 - e^{-3t})u(t)$: bu, tanım gereği basamak cevabı $s(t)$’dir.`, T`Ters yön: $\frac{ds}{dt} = \frac13\cdot 3e^{-3t} = e^{-3t}$, $t > 0$. Gerçekten $h(t)$ geri geldi.`],
        ans: T`$s(t) = \frac13(1 - e^{-3t})u(t)$, $\;h = s'$` },
      { t: 'lab', id: 'step' },
      { t: 'quiz', items: [
        { q: T`$s[n] = 2u[n] - u[n-3]$ ise $h[n]$ nedir?`, opts: ['$2\\delta[n] - \\delta[n-3]$', '$2u[n]$', '$\\delta[n] - \\delta[n-3]$'], a: 0, why: T`$h[n] = s[n] - s[n-1]$. Basamakların farkı impulslardır: $u[n] - u[n-1] = \delta[n]$.` },
        { q: T`$h(t) = 5e^{-5t}u(t)$ ise $t \to \infty$ iken $s(t)$ neye yaklaşır?`, opts: ['5', '1', '0'], a: 1, why: T`$\int_0^\infty 5e^{-5t}dt = 1$.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '2.7', chap: 'lti', title: 'Lineer sabit katsayılı fark denklemleri', pages: 's. 101–109',
    sub: 'Özyineleme, blok diyagram, homojen + özel çözüm',
    lead: 'Ayrık LTI sistemlerin çoğu bir fark denklemiyle tanımlanır. Bu ders, Bölüm 2’nin son konusu: denklemi blok diyagramdan yazmak, adım adım çözmek ve kapalı formunu bulmak.',
    goals: ['Genel form ve özyineleme', 'Blok diyagramdan denklem yazmak', 'Homojen + özel çözüm, başlangıç koşulu', 'İmpuls ve basamak cevabını bulmak'],
    blocks: [
      { t: 'def', title: 'Genel form (s. 101)', h: T`$$\sum_{k=0}^{N} a_k\,y[n-k] = \sum_{k=0}^{M} b_k\,x[n-k] \quad\Longrightarrow\quad y[n] = \frac{1}{a_0}\left\{\sum_{k=0}^{M} b_k\,x[n-k] - \sum_{k=1}^{N} a_k\,y[n-k]\right\}$$
<strong>Yinelemeli (recursive):</strong> çıkış, kendi geçmiş değerlerini kullanır (geri besleme var).<br>
<strong>Yinelemesiz (nonrecursive):</strong> $N = 0$, yani $y[n] = \frac{1}{a_0}\sum b_k x[n-k]$. Bu durumda impuls cevabı doğrudan katsayılardır: $h[n] = b_n/a_0$ (sonlu uzunlukta, FIR).` },
      { t: 'idea', h: T`Fark denklemi bir <strong>tariftir</strong>: “bu adımın çıkışı = önceki çıkışların ve girişlerin şu karışımı.” Başlangıç koşulunu ($y[-1]$) ve girişi biliyorsan bütün değerleri sırayla hesaplayabilirsin. Kapalı form (formül) ise aynı diziyi tek satırda verir. Sınavda ikisi de sorulur ve biri diğerini kontrol eder.` },
      { t: 'h', h: 'Blok diyagramdan denklem', src: 's. 102–103' },
      { t: 'p', h: T`Üç yapı taşı var: <strong>toplayıcı</strong> (Σ), <strong>çarpıcı</strong> (üçgen, kazanç) ve <strong>birim gecikme</strong> ($y[n] \to y[n-1]$). Yöntem: toplayıcının çıkışını, girişlerinin toplamı olarak yaz.` },
      { t: 'example', src: 's. 102', q: T`(1) Çıkış $y[n]$ bir birim gecikmeden geçip $a$ ile çarpılarak toplayıcıya geri dönüyor. (2) İkinci şekilde $y$, iki gecikmeden geçiyor: $y[n-1]$ $a_2$ ile, $y[n-2]$ $a_1$ ile çarpılıp toplayıcılara dönüyor.`,
        steps: [T`(1) Toplayıcı: $y[n] = x[n] + a\,y[n-1]$`, T`(2) Toplayıcılar zincir hâlinde: $y[n] = x[n] + a_1 y[n-2] + a_2 y[n-1]$`],
        ans: T`(1) $y[n] = a\,y[n-1] + x[n]$ &nbsp;&nbsp; (2) $y[n] = a_2 y[n-1] + a_1 y[n-2] + x[n]$` },
      { t: 'hw', src: 's. 103', q: T`Şekilde $x[n]$ ilk toplayıcıya girer. Toplayıcının çıkışı $q[n]$’dir. $q[n]$ bir birim gecikmeden geçer ve $q[n-1]$ olur. $q[n-1]$, $2$ ile çarpılıp ilk toplayıcıya, $3$ ile çarpılıp ikinci toplayıcıya gider. İkinci toplayıcı $q[n]$ ile $3q[n-1]$’i toplayıp $y[n]$’yi verir. Fark denklemini yaz.`,
        hint: T`Önce iki ara denklem yaz, sonra $q$’yu yok et: $y[n] - 2y[n-1]$’i hesapla.`,
        steps: [T`$q[n] = x[n] + 2q[n-1]$ &nbsp;&nbsp; ve &nbsp;&nbsp; $y[n] = q[n] + 3q[n-1]$`,
          T`$y[n] - 2y[n-1] = (q[n] - 2q[n-1]) + 3(q[n-1] - 2q[n-2])$`, T`Parantezler ilk denklemden: $q[n] - 2q[n-1] = x[n]$ ve $q[n-1] - 2q[n-2] = x[n-1]$.`],
        ans: T`$y[n] - 2y[n-1] = x[n] + 3x[n-1]$. Çözücü laboratuvarda “Şekildeki sistem” seçeneğiyle impuls cevabını izle: $h[n] = \delta[n] + 5\cdot 2^{n-1}u[n-1]$ (kararsız!).` },
      { t: 'h', h: 'Kapalı form: homojen + özel çözüm', src: 's. 103–106' },
      { t: 'recipe', title: 'Birinci dereceden denklem için', steps: [
        T`<strong>Özel çözüm $y_p$:</strong> girişe benzeyen bir tahmin yap. $x = Kb^n$ ise $y_p = Ab^n$ dene, denkleme koy, $A$’yı bul.`,
        T`<strong>Homojen çözüm $y_h$:</strong> sağ tarafı sıfırla, $y_h = Bz^n$ dene. Karakteristik denklemin kökü $z = a$ çıkar, yani $y_h = Ba^n$.`,
        T`<strong>Tam çözüm:</strong> $y = y_h + y_p$. Bilinmeyen $B$’yi başlangıç koşulundan bul: $y[0] = x[0] + a\,y[-1]$.`,
        T`<strong>Kontrol:</strong> formülden $y[0]$ ve $y[1]$’i hesapla, özyinelemeyle karşılaştır.`] },
      { t: 'example', src: 's. 103–106', q: T`$y[n] - a\,y[n-1] = x[n]$, $\;x[n] = Kb^n u[n]$, $\;y[-1] = y_{-1}$. $y[n]$’yi bul ($b \ne a$).`,
        steps: [T`<strong>Özel:</strong> $y_p = Ab^n$ ⇒ $Ab^n - aAb^{n-1} = Kb^n$ ⇒ $A = \frac{Kb}{b-a}$, $\;y_p = \frac{K}{b-a}b^{n+1}$.`,
          T`<strong>Homojen:</strong> $Bz^n - aBz^{n-1} = (z-a)Bz^{n-1} = 0$ ⇒ $z = a$, $\;y_h = Ba^n$.`,
          T`<strong>Başlangıç:</strong> $n=0$’da denklem $y[0] = K + a\,y_{-1}$. Formülden $y[0] = B + K\frac{b}{b-a}$. Eşitle: $B = a\,y_{-1} - K\frac{a}{b-a}$.`,
          T`Yerine koy ve düzenle.`],
        ans: T`$y[n] = y_{-1}\,a^{n+1} + K\,\dfrac{b^{n+1} - a^{n+1}}{b - a}$, $\;n \ge 0$. İlk terim başlangıç koşulundan (sıfır giriş cevabı), ikincisi girişten (sıfır durum cevabı) gelir.` },
      { t: 'hw', src: 's. 106', q: T`$y[n] + 0.5\,y[n-1] = (-0.8)^n u[n]$ denklemini çöz ($y[-1] = 0$ kabul et).`, hint: T`Bir önceki genel sonuçta $a = -0.5$, $b = -0.8$, $K = 1$, $y_{-1} = 0$.`,
        steps: [T`Denklemi $y[n] - a\,y[n-1] = x[n]$ biçiminde yaz: $a = -0.5$.`, T`$y[n] = \frac{(-0.8)^{n+1} - (-0.5)^{n+1}}{-0.8 - (-0.5)} = \frac{(-0.8)^{n+1} - (-0.5)^{n+1}}{-0.3}$`,
          T`Kontrol: $y[0] = \frac{-0.8 + 0.5}{-0.3} = 1$ ✓ (özyineleme: $y[0] = 1 - 0.5\cdot0 = 1$). $\;y[1] = \frac{0.64 - 0.25}{-0.3} = -1.3$ ✓ ($-0.8 - 0.5 = -1.3$).`],
        ans: T`$y[n] = \frac{10}{3}\left[(-0.5)^{n+1} - (-0.8)^{n+1}\right]u[n]$` },
      { t: 'example', src: 's. 106–107', q: T`$y[n] - a\,y[n-1] = x[n]$, $\;x[n] = K\delta[n]$, $\;y[-1] = \alpha$. Bütün $n$ için $y[n]$’yi bul.`,
        steps: [T`İleri özyineleme: $y[0] = a\alpha + K$, $\;y[1] = a(a\alpha + K)$, $\;y[2] = a^2(a\alpha + K)$, …`, T`$n \ge 0$: $y[n] = a^n(a\alpha + K) = a^{n+1}\alpha + a^nK$`,
          T`Geri özyineleme ($n<0$): $y[n-1] = \frac1a\{y[n] - x[n]\}$. $\;y[-2] = \frac{\alpha}{a} = a^{-1}\alpha$, $\;y[-3] = a^{-2}\alpha$, …, $\;y[-n] = a^{-n+1}\alpha$.`],
        ans: T`$y[n] = a^{n+1}\alpha + K a^n u[n]$ (her $n$ için)` },
      { t: 'example', src: 's. 108–109', q: T`Aynı sistem için ($y[n] - a\,y[n-1] = x[n]$): (a) impuls cevabı $h[n]$, (b) basamak cevabı $s[n]$, (c) $h[n]$’yi (b)’den bul.`,
        steps: [T`(a) $K = 1$, $\alpha = 0$ (başlangıçta sistem boş): $h[n] = a^n u[n]$.`, T`(b) $K = 1$, $b = 1$, $y_{-1} = 0$: $s[n] = \frac{1 - a^{n+1}}{1-a}u[n]$.`,
          T`(c) $h[n] = s[n] - s[n-1]$. $n=0$: $h[0] = \frac{1-a}{1-a} = 1$. $\;n \ge 1$: $h[n] = \frac{1}{1-a}[1 - a^{n+1} - (1 - a^n)] = \frac{a^n(1-a)}{1-a} = a^n$`],
        ans: T`$h[n] = a^n u[n]$, $\;s[n] = \frac{1-a^{n+1}}{1-a}u[n]$, ve (c) yöntemiyle aynı $h$ geri gelir.` },
      { t: 'lab', id: 'diffeq' },
      { t: 'hw', src: 's. 109', q: T`$y[n] - 0.5\,y[n-1] + 0.06\,y[n-2] = x[n-1]$ sisteminin impuls cevabını bul.`, hint: T`Karakteristik denklem: $z^2 - 0.5z + 0.06 = 0$. Kökler 0.3 ve 0.2. Özyinelemeyle $h[0]$ ve $h[1]$’i bulup katsayıları belirle.`,
        steps: [T`Özyineleme ($x = \delta$, sistem başlangıçta boş): $h[0] = 0.5\cdot0 - 0.06\cdot0 + \delta[-1] = 0$, $\;h[1] = 0 + \delta[0] = 1$, $\;h[2] = 0.5\cdot 1 = 0.5$.`,
          T`$n \ge 2$ için sağ taraf 0, yani homojen çözüm: $h[n] = A(0.3)^n + B(0.2)^n$.`,
          T`$h[1] = 0.3A + 0.2B = 1$ ve $h[2] = 0.09A + 0.04B = 0.5$ ⇒ $A = 10$, $B = -10$.`, T`Kontrol: $n = 0$’da $10 - 10 = 0 = h[0]$ ✓, yani formül $n \ge 0$ için geçerli.`],
        ans: T`$h[n] = 10\left[(0.3)^n - (0.2)^n\right]u[n]$. İki kök de birden küçük: sistem kararlı.` },
      { t: 'quiz', items: [
        { q: T`$y[n] = x[n] + x[n-1] + x[n-2]$ sisteminin impuls cevabı nedir?`, opts: ['$\\{1, 1, 1\\}$ ($n = 0, 1, 2$)', '$u[n]$', '$(n+1)u[n]$'], a: 0, why: 'Yinelemesiz denklem: $h[n]$ doğrudan katsayılardır (FIR).' },
        { q: T`$y[n] = 0.9\,y[n-1] + x[n]$ kararlı mı?`, opts: ['Evet', 'Hayır'], a: 0, why: T`$h[n] = 0.9^n u[n]$, $\sum|h| = 10 < \infty$.` },
        { q: T`$y[n] - 2y[n-1] = x[n]$ için $h[3]$ kaçtır?`, opts: ['8', '6', '3'], a: 0, why: T`$h[n] = 2^n u[n]$: $1, 2, 4, 8$. Kararsız bir sistem.` }] }
    ]
  });
})();
