/*
 * Vize hazırlık: Bölüm 1 (s. 2–68) soru tipleri haritası ve notun tarzında yeni deneme soruları.
 * Sorular nottaki örneklerin aynısı değildir; aynı yöntemle çözülen benzerleridir.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const T = String.raw;
  const fn = (f, color, o) => Object.assign({ kind: 'fn', f, color: color || 'x', fill: true, alpha: 0.12, n: 2000 }, o || {});
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 165, xLabel: 't', xStep: 1, layers }, o || {});
  const tri = (t) => (Math.abs(t) < 1 ? 1 - Math.abs(t) : 0);
  const L = (id, t) => '<a href="#/ders/' + id + '">' + (t || id) + '</a>';

  SS.examPrep = {
    lead: T`Bölüm 1’de sorulabilecek bütün soru tipleri burada. Önce tabloya bak: hangi tipte zorlanıyorsan o dersin <strong>çözüm reçetesine</strong> dön. Sonra deneme sorularını kâğıt kalemle çöz ve adımları <em>ancak takıldığında</em> aç. Sorular notun örnekleriyle aynı tarzda ama yeni sorulardır.`,
    blocks: [
      { t: 'h', h: 'Soru tipleri haritası' },
      { t: 'table', head: ['Soru tipi', 'Ders', 'Akılda tutulacak tek cümle'], rows: [
        ['Periyodik mi? Temel periyot?', L('1.2'), T`$T_i = 2\pi/\omega_i$. Oranlar rasyonelse periyodik, $T_0$ = EKOK. Kısa yol: $\omega_0 = $ EBOB.`],
        ['Ayrık sinüs periyodik mi?', L('1.2'), T`$\Omega/2\pi$ rasyonel olmalı. $N$ = sadeleşmiş kesrin paydası.`],
        ['Enerji mi, güç mü?', L('1.3'), T`Söneni $E$ ile, periyodik veya sabiti $P$ ile hesapla. Sinüs: $P = A^2/2$.`],
        ['Çift ve tek bileşen', L('1.4'), T`$x_e = \frac{x(t)+x(-t)}{2}$, $\;x_o = \frac{x(t)-x(-t)}{2}$. Önce $x(-t)$’yi çiz.`],
        ['δ’lı integral', L('1.5'), T`$\int\phi(t)\delta(t-a)dt = \phi(a)$. Aralık dışındaysa 0. $\delta(at) = \delta(t)/|a|$.`],
        ['Π, Λ çizimi; basamakla yazma; türev', L('1.5'), T`İçerideki ifadeyi eşitsizliğe koy. Her sıçrama $A\,u(t-t_0)$ olur, türevde $A\,\delta(t-t_0)$.`],
        ['Ayrık diziyi δ ile yazma', L('1.6'), T`$n=k$’deki $a$ yüksekliği $a\,\delta[n-k]$ terimini verir.`],
        ['$x(at+b)$, $Ax+B$ çizimi', L('1.7'), T`Kritik noktalar $t_k \to (t_k-b)/a$. En son genlik.`],
        ['Lineer mi?', L('1.8'), T`Önce sıfır giriş testi. Sonra $T\{ax_1+bx_2\}$ ile $ay_1+by_2$’yi karşılaştır.`],
        ['Nedensel mi? Bellekli mi?', L('1.9'), T`$x$’in bütün argümanları $\le t$ mi? Negatif $t$’yi de dene.`],
        ['Zamanla değişmez mi?', L('1.10'), T`Girişi kaydır ve çıkışı kaydır, karşılaştır. Açık $t$ veya $x(at)$ görürsen dikkat.`],
        ['Kararlı mı? / Dört özellik analizi', L('1.11'), T`Kararlılık için $|y|$’yi $B$ ile sınırla. Kararsızlık için $x=1$ veya $u(t)$ dene.`]] },
      { t: 'trap', title: 'Sınavda en çok puan kaybettiren 6 hata', h: T`<ol style="margin:0">
<li>Ayrık sinüste $N = 2\pi/\Omega$ yazmak. $N$ tam sayı olmalı: $\Omega = 3\pi/4$ için $N=8$, $8/3$ değil.</li>
<li>$x(2t-6)$’yı “6 sağa kaydır, 2 kat sıkıştır” diye ters sırayla çizmek. Doğrusu 3 sağa kaydırmaktır.</li>
<li>$B + x(t)$ çizerken sinyalin sıfır olduğu yerlerin de $B$ olduğunu unutmak.</li>
<li>δ integralinde impulsun integral sınırlarının dışında kaldığını gözden kaçırmak.</li>
<li>$t\,x(t)$’yi lineer değil sanmak (lineerdir, ama zamanla değişen ve kararsızdır).</li>
<li>$x[-n]$ ve $x(2t)$ gibi sistemlerde negatif zamanı kontrol etmeden “nedensel” demek.</li></ol>` },

      { t: 'h', h: 'Deneme 1 · Periyodiklik', src: 's. 6–15' },
      { t: 'hw', title: 'Deneme sorusu', q: T`$x(t) = 3\cos\left(4t + \frac{\pi}{3}\right) + 2\sin(6t) - \cos(10t)$ periyodik midir? Periyodikse temel periyodu nedir?`, hint: T`Fazlar ve genlikler önemsiz. Yalnızca $\omega = 4, 6, 10$ değerlerine bak.`,
        steps: [T`$T_1 = \frac{2\pi}{4} = \frac{\pi}{2}$, $\;T_2 = \frac{2\pi}{6} = \frac{\pi}{3}$, $\;T_3 = \frac{2\pi}{10} = \frac{\pi}{5}$`,
          T`$\frac{T_1}{T_2} = \frac{3}{2}$, $\;\frac{T_1}{T_3} = \frac{5}{2}$. İkisi de rasyonel: periyodik.`,
          T`Paydaların EKOK’u 2: $T_0 = 2T_1 = \pi$. Kısa yol: EBOB(4, 6, 10) = 2, $T_0 = 2\pi/2 = \pi$ ✓`],
        ans: T`Periyodik, $T_0 = \pi$` },
      { t: 'hw', title: 'Deneme sorusu', q: T`$x(t) = \cos(2t) + \sin(2\pi t)$ periyodik midir?`,
        steps: [T`$T_1 = \pi$, $\;T_2 = \frac{2\pi}{2\pi} = 1$`, T`$\frac{T_1}{T_2} = \pi$: irrasyonel.`], ans: T`Periyodik değil. Bileşenlerin ikisi de tek başına periyodiktir, ama hiçbir $T$ için ikisi aynı anda başa dönmez.` },
      { t: 'hw', title: 'Deneme sorusu', q: T`(a) $x[n] = \cos\left(\frac{\pi n}{6}\right) + \sin\left(\frac{\pi n}{4}\right)$ &nbsp; (b) $x[n] = \cos\left(\frac{n}{4}\right)$ periyodik mi? Periyodikse $N_0$?`,
        steps: [T`(a) $\frac{\pi/6}{2\pi} = \frac{1}{12}$ → $N_1 = 12$. $\;\frac{\pi/4}{2\pi} = \frac18$ → $N_2 = 8$. EKOK(12, 8) = 24.`,
          T`(b) $\frac{\Omega}{2\pi} = \frac{1/4}{2\pi} = \frac{1}{8\pi}$: içinde $\pi$ var, irrasyonel.`],
        ans: T`(a) Periyodik, $N_0 = 24$. (b) Periyodik değil (sürekli $\cos(t/4)$ periyodik olduğu hâlde!).` },

      { t: 'h', h: 'Deneme 2 · Enerji ve güç', src: 's. 16–21' },
      { t: 'hw', title: 'Deneme sorusu', q: T`Enerji mi, güç mü, hiçbiri mi? (a) $x(t) = 2e^{-3t}u(t)$ &nbsp; (b) $x(t) = 4\sin(5t)$ &nbsp; (c) $x[n] = (-0.5)^n u[n]$ &nbsp; (d) $x(t) = 3u(t)$`,
        hint: T`(c)’de $|x[n]|^2 = (0.25)^n$. (d)’de pencerenin yalnızca yarısında sinyal var.`,
        steps: [T`(a) $E = \int_0^\infty 4e^{-6t}dt = \frac{4}{6} = \frac23$: <strong>enerji</strong>.`,
          T`(b) Sinüs: $P = \frac{A^2}{2} = \frac{16}{2} = 8$: <strong>güç</strong>.`,
          T`(c) $E = \sum_{n=0}^{\infty}(0.25)^n = \frac{1}{1-0.25} = \frac43$: <strong>enerji</strong>. (İşaretin değişmesi enerjiyi etkilemez, kare alınıyor.)`,
          T`(d) $E = \int_0^\infty 9\,dt = \infty$. $\;P = \lim\frac{1}{T}\int_0^{T/2}9\,dt = \frac92$: <strong>güç</strong>.`],
        ans: T`(a) $E = 2/3$ · (b) $P = 8$ · (c) $E = 4/3$ · (d) $P = 9/2$` },

      { t: 'h', h: 'Deneme 3 · Çift ve tek', src: 's. 22–27' },
      { t: 'hw', title: 'Deneme sorusu', q: T`(a) $x(t) = (t+1)^2$ &nbsp; (b) $x(t) = t$ ($0<t<2$), $0$ (diğer). Çift ve tek bileşenleri bul.`,
        steps: [T`(a) Aç: $t^2 + 2t + 1$. Çift kuvvetler ve sabit çift parçaya gider: $x_e = t^2 + 1$, $\;x_o = 2t$.`,
          T`(b) $x(-t) = -t$, $-2<t<0$ aralığında.`,
          T`$x_e$: $0<t<2$ için $\frac{t + 0}{2} = \frac t2$; $\;-2<t<0$ için $\frac{0 + (-t)}{2} = -\frac t2$. Yani $x_e = \frac{|t|}{2}$, $|t|<2$.`,
          { h: T`$x_o$: $0<t<2$ için $\frac t2$; $\;-2<t<0$ için $\frac{0 - (-t)}{2} = \frac t2$. Yani $x_o = \frac{t}{2}$, $|t|<2$.`,
            fig: [spec([-3, 3], [-1.3, 1.3], [fn((t) => (Math.abs(t) < 2 ? Math.abs(t) / 2 : 0), 'h')], { title: 'xₑ(t) = |t|/2' }), spec([-3, 3], [-1.3, 1.3], [fn((t) => (Math.abs(t) < 2 ? t / 2 : 0), 'y')], { title: 'xₒ(t) = t/2' })] }],
        ans: T`(a) $x_e = t^2+1$, $x_o = 2t$. (b) $x_e = \frac{|t|}{2}$, $x_o = \frac t2$ ($|t|<2$). Kontrol: $t>0$ için $x_e + x_o = t$ ✓, $t<0$ için $0$ ✓.` },

      { t: 'h', h: 'Deneme 4 · Temel sinyaller ve δ', src: 's. 28–40' },
      { t: 'hw', title: 'Deneme sorusu', q: T`(a) $\displaystyle\int_{-\infty}^{\infty}(t^3 + 2)\,\delta(t+1)\,dt$ &nbsp; (b) $\displaystyle\int_{-2}^{2}e^{t}\,\delta(t-3)\,dt$ &nbsp; (c) $\displaystyle\int_{-\infty}^{\infty}e^{t}\,\delta(2t-4)\,dt$`,
        hint: T`(c)’de önce $\delta(2t-4) = \delta(2(t-2)) = \frac12\delta(t-2)$ yaz.`,
        steps: [T`(a) $t = -1$: $(-1)^3 + 2 = 1$`, T`(b) İmpuls $t=3$’te, aralık $[-2, 2]$: dışarıda kalıyor. Sonuç 0.`, T`(c) $\delta(2t-4) = \frac{1}{2}\delta(t-2)$ ⇒ $\frac12 e^{2}$`],
        ans: T`(a) 1 · (b) 0 · (c) $\frac{e^2}{2} \approx 3.69$` },
      { t: 'hw', title: 'Deneme sorusu', q: T`$x(t)$: $-1<t<1$ aralığında 2, $1<t<3$ aralığında 1, diğer yerlerde 0. Birim basamaklarla yaz ve $dx/dt$’yi bul.`,
        fig: spec([-2, 4], [-0.3, 2.5], [fn((t) => (t > -1 && t < 1 ? 2 : t >= 1 && t < 3 ? 1 : 0), 'x')]),
        steps: [T`Sıçramalar: $t=-1$’de $+2$, $t=1$’de $-1$ (2’den 1’e), $t=3$’te $-1$ (1’den 0’a).`, T`$x(t) = 2u(t+1) - u(t-1) - u(t-3)$`, T`Her basamak bir impulsa dönüşür: $\frac{dx}{dt} = 2\delta(t+1) - \delta(t-1) - \delta(t-3)$`],
        ans: T`$x = 2u(t+1) - u(t-1) - u(t-3)$, $\;x' = 2\delta(t+1) - \delta(t-1) - \delta(t-3)$. Kontrol: impuls alanlarının toplamı $2 - 1 - 1 = 0$, çünkü sinyal 0’dan başlayıp 0’a dönüyor.` },
      { t: 'hw', title: 'Deneme sorusu', q: T`$y(t) = 4\,\Lambda\!\left(\frac{t+1}{2}\right)$ sinyalini çiz ve parçalı olarak yaz.`,
        steps: [T`$-1 < \frac{t+1}{2} < 1$ → $-3 < t < 1$. Tepe $t = -1$’de, yükseklik 4.`, T`Sol: $4\left(1 + \frac{t+1}{2}\right) = 2t + 6$ ($-3<t<-1$). Sağ: $4\left(1 - \frac{t+1}{2}\right) = 2 - 2t$ ($-1<t<1$).`],
        ans: T`$y = 2t + 6$ ($-3<t<-1$), $\;2 - 2t$ ($-1<t<1$), $\;0$ (diğer)` },

      { t: 'h', h: 'Deneme 5 · Sinyal işlemleri', src: 's. 41–53' },
      { t: 'hw', title: 'Deneme sorusu', q: T`$x(t) = \Lambda(t)$ (taban $-1$ ile $1$, tepe 1). $y(t) = 2x\!\left(1 - \frac{t}{2}\right)$ sinyalini çiz.`,
        hint: T`$a = -\frac12$, $b = 1$. Kritik noktalar $t_k = -1, 0, 1$, $\;t = \frac{t_k - b}{a}$.`,
        steps: [T`$t = \frac{t_k - 1}{-1/2} = 2(1 - t_k)$: $\;t_k = -1 \to 4$, $\;t_k = 0 \to 2$, $\;t_k = 1 \to 0$.`,
          T`$a<0$ olduğundan sıra ters döndü, ama üçgen simetrik olduğu için şekil değişmiyor. Taban $0$–$4$ (2 kat genişledi), tepe $t = 2$’de.`,
          { h: T`Genlik 2 ile çarpılır: tepe 2.`, fig: spec([-2, 6], [-0.3, 2.4], [fn((t) => 2 * tri(1 - t / 2), 'y'), fn(tri, 'muted', { fill: false, dash: [5, 4], w: 1.3 })]) }],
        ans: T`$y(t) = 2\,\Lambda\!\left(\frac{t-2}{2}\right)$: $0<t<4$ aralığında, tepe $t=2$’de 2.` },
      { t: 'hw', title: 'Deneme sorusu', q: T`$x[n] = \{\underbrace{1}_{\uparrow}, 2, 3\}$ ($n = 0, 1, 2$). (a) $x[2-n]$ &nbsp; (b) $x[2n-1]$ &nbsp; (c) $x[n] + x[-n]$`,
        hint: T`Tablo yöntemi: her $n$ için içerideki indeksi hesapla.`,
        steps: [T`(a) $n=0 \to x[2] = 3$, $\;n=1 \to x[1] = 2$, $\;n=2 \to x[0] = 1$. Ayna + 2 sağa.`,
          T`(b) $m = 2n - 1$ tek sayı olmalı ve $0 \le m \le 2$ aralığında olmalı: yalnızca $m=1$, yani $n=1$. $y[1] = x[1] = 2$.`,
          T`(c) $x[-n]$: $n = 0, -1, -2$’de $1, 2, 3$. Toplam: $n=0$’da $1 + 1 = 2$; $n = \pm1$’de 2; $n = \pm2$’de 3.`],
        ans: T`(a) $\{\underbrace{3}_{\uparrow}, 2, 1\}$ · (b) $2\delta[n-1]$ · (c) $\{3, 2, \underbrace{2}_{\uparrow}, 2, 3\}$ (bu, $2x_e[n]$’dir)` },

      { t: 'h', h: 'Deneme 6 · Sistem özellikleri', src: 's. 54–68' },
      { t: 'hw', title: 'Deneme sorusu', q: T`$y(t) = x(t-2) + x(2-t)$ sistemine zamanla değişmezlik, lineerlik, nedensellik ve kararlılık analizi yap.`,
        steps: [T`<strong>Lineerlik:</strong> iki terim de girişin yeniden indislenmesi: $ax_1 + bx_2$ girişi $ay_1 + by_2$ verir. Lineer.`,
          T`<strong>Zamanla değişmezlik:</strong> girişi kaydır: $x(t-2-t_0) + x(2-t-t_0)$. Çıkışı kaydır: $y(t-t_0) = x(t-t_0-2) + x(2-t+t_0)$. İkinci terimler farklı: zamanla değişen.`,
          T`<strong>Nedensellik:</strong> $t = 0$ için $y(0) = x(-2) + x(2)$: $x(2)$ gelecek. Nedensel değil.`,
          T`<strong>Kararlılık:</strong> $|x| \le B$ ⇒ $|y| \le 2B$. Kararlı. (Bellekli.)`],
        ans: T`Lineer · zamanla değişen · nedensel değil · kararlı` },
      { t: 'hw', title: 'Deneme sorusu', q: T`(a) $y(t) = \int_{t-1}^{t}x(\tau)\,d\tau$ &nbsp; (b) $y[n] = x[n]\,x[n-1]$ &nbsp; (c) $y(t) = 3x(t) + 2$. Her biri için dört özelliği belirle.`,
        hint: T`(a) bir “hareketli ortalama”dır. $\int_{-\infty}^{t}$’den farkı: yalnızca son 1 saniyeyi topluyor.`,
        steps: [T`(a) Lineer (integral). Zamanla değişmez ($\int_{t-1}^{t}x(\tau-t_0)d\tau = \int_{t-1-t_0}^{t-t_0}x = y(t-t_0)$). Nedensel ($\tau \le t$). Kararlı: $|y| \le \int_{t-1}^{t}B\,d\tau = B$.`,
          T`(b) Lineer değil ($2x \to 4x[n]x[n-1]$). Zamanla değişmez. Nedensel. Kararlı ($|y| \le B^2$).`,
          T`(c) Lineer değil (sıfır giriş → 2). Zamanla değişmez. Nedensel ve belleksiz. Kararlı ($|y| \le 3B + 2$).`],
        ans: T`(a) L ✓ ZD ✓ N ✓ K ✓ · (b) L ✗ ZD ✓ N ✓ K ✓ · (c) L ✗ ZD ✓ N ✓ K ✓` },

      { t: 'quiz', title: 'Son kontrol: karışık 8 soru', items: [
        { q: T`$x(t) = e^{j(3t + 1)}$ sinyalinin temel periyodu?`, opts: ['$2\\pi/3$', '$2\\pi$', '$3$'], a: 0, why: T`$\omega = 3$, faz periyodu etkilemez.` },
        { q: T`$x[n] = e^{j\frac{4\pi}{5}n}$ dizisinin temel periyodu?`, opts: ['5', '$5/2$', '10'], a: 0, why: T`$\frac{4\pi/5}{2\pi} = \frac25$ → $N = 5$.` },
        { q: T`$x(t) = e^{-|t|}$ hangi sınıfta?`, opts: ['Enerji, $E = 1$', 'Güç', 'Enerji, $E = 2$'], a: 0, why: T`$E = 2\int_0^\infty e^{-2t}dt = 1$.` },
        { q: T`$\cos(t)\sin^2(t)$ nasıl bir sinyal?`, opts: ['Çift', 'Tek', 'Hiçbiri'], a: 0, why: T`$\sin^2$ = tek·tek = çift; çift·çift = çift.` },
        { q: T`$\int_{0}^{5}t\,\delta(t+2)\,dt$ kaçtır?`, opts: ['$-2$', '0', '2'], a: 1, why: T`İmpuls $t=-2$’de, aralık $[0,5]$: dışarıda.` },
        { q: T`$x(t)$ $[2, 6]$ aralığında tanımlı. $x(2t+2)$ hangi aralıkta?`, opts: ['$[0, 2]$', '$[2, 6]$', '$[6, 14]$'], a: 0, why: T`$2 \le 2t + 2 \le 6$ → $0 \le t \le 2$.` },
        { q: T`$y[n] = x[n^2]$ nedensel mi?`, opts: ['Evet', 'Hayır'], a: 1, why: T`$n=2$ için $y[2] = x[4]$: gelecek.` },
        { q: T`$y(t) = \cos(x(t))$ için hangisi doğru?`, opts: ['Lineer, kararlı', 'Lineer değil, kararlı', 'Lineer değil, kararsız'], a: 1, why: T`Kosinüs lineer değil, ama $|\cos| \le 1$.` }] }
    ]
  };
})();
