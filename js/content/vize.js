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
      { t: 'def', title: 'Sınav formatında pratik', h: T`Hocanın vizesi 3 ana soru ve altlarında 1.1, 1.2… gibi alt sorulardan oluşacak. Bu formatta hazırlanmış 4 tam deneme için <a href="#/deneme"><strong>Deneme vizeleri</strong></a> sayfasına git (Schaum kitabının Bölüm 1 problemleri, Türkçe ve çözümlü). Bu sayfadaki sorular ise konu konu ısınma içindir.` },
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

      { t: 'h', h: 'Karma soru: hepsi tek soruda' },
      { t: 'p', h: T`Hoca bir giriş sinyali ve bir sistem verip temel periyodu, lineerliği, ötelemeyle değişmezliği, nedenselliği ve kararlılığı <strong>aynı soruda</strong> sorabilir. Her parça ayrı puan getirir; birinde takılırsan diğerlerine geç. Çözümlü örnekler <a href="#/deneme/5">Deneme 5</a>’te, rastgele üretilen sınırsız benzeri <a href="#/antrenman">Antrenman</a> sayfasının “Sınav tipi karma soru” modunda.` },
      { t: 'recipe', title: 'Karma soru reçetesi: 6 bakışta sistem', steps: [
        T`<strong>Periyot:</strong> her $\omega$ için $T_i = 2\pi/\omega_i$ yaz → oranlar rasyonel mi → EKOK. Ayrıkta $\Omega/2\pi$’nin paydası. (Sistemi beklemeden önce bunu bitir; sistemden bağımsızdır.)`,
        T`<strong>Lineer mi?</strong> Önce sıfır giriş testi ($+3$ gibi sabit var mı?). Sonra $x$’e uygulanan işlem: kare, mutlak değer, $\sin x$, $e^{x}$, $x\cdot x$ varsa lineer değil. $t$ ile, $\cos t$ ile çarpmak lineerliği <em>bozmaz</em>.`,
        T`<strong>Ötelemeyle değişmez mi?</strong> $x$’in dışında açık $t$ / $n$ var mı ($t\,x$, $\cos(t)\,x$, $n\,x[n]$, $+n$)? Argümanda $t$’nin katsayısı $\pm1$ dışında mı ya da işaret ters mi ($x(2t)$, $x(-t)$, $x[1-n]$)? İkisinden biri varsa değişen.`,
        T`<strong>Nedensel mi?</strong> $x$’in bütün argümanlarını $t$ ile karşılaştır: $t+1$ gibi bir şey varsa değil. $x(2t)$, $x(t/2)$, $x(-t)$ için hem pozitif hem negatif bir $t$ dene.`,
        T`<strong>Kararlı mı?</strong> Kuralda $t$/$n$ ile büyüyen çarpan ($t$, $n$, $2^n$), $\int_{-\infty}^{t}$ veya $\sum_{-\infty}^{n}$, girişe bölme varsa $x = 1$ veya $u$ ile karşı örnek ara. Yoksa $|y| \le$ (B’li bir sayı) yaz.`,
        T`<strong>Çıkış periyodik mi?</strong> Sistem zamanla değişmezse <em>her zaman</em> evet, periyot girişinkiyle aynı (ya da onun böleni). Zamanla değişense $y$’yi açıkça yazıp kontrol et: $x(2t)$ periyodu yarıya indirir, $n\,x[n]$ periyodikliği bozar.`] },
      { t: 'h', h: 'Deneme 1 · Periyodiklik', src: 's. 6–15' },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki sinyal periyodik midir? Periyodikse temel periyodu nedir?
$$x(t) = 3\cos\left(4t + \frac{\pi}{3}\right) + 2\sin(6t) - \cos(10t)$$`, hint: T`Fazlar ve genlikler önemsiz. Yalnızca $\omega = 4, 6, 10$ değerlerine bak.`,
        steps: [T`Her terimin periyodu:
$$T_1 = \frac{2\pi}{4} = \frac{\pi}{2}, \qquad T_2 = \frac{2\pi}{6} = \frac{\pi}{3}, \qquad T_3 = \frac{2\pi}{10} = \frac{\pi}{5}$$`,
          T`Oranlar:
$$\frac{T_1}{T_2} = \frac{3}{2}, \qquad \frac{T_1}{T_3} = \frac{5}{2}$$
İkisi de rasyonel: periyodik.`,
          T`Paydaların EKOK’u 2:
$$T_0 = 2\,T_1 = \pi$$
Kısa yol: $\text{EBOB}(4, 6, 10) = 2$, $\;T_0 = \frac{2\pi}{2} = \pi$ ✓`],
        ans: T`Periyodik, $T_0 = \pi$` },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki sinyal periyodik midir?
$$x(t) = \cos(2t) + \sin(2\pi t)$$`,
        steps: [T`Periyotlar:
$$T_1 = \frac{2\pi}{2} = \pi, \qquad T_2 = \frac{2\pi}{2\pi} = 1$$`, T`Oran:
$$\frac{T_1}{T_2} = \pi \quad \text{irrasyonel}$$`], ans: T`Periyodik değil. Bileşenlerin ikisi de tek başına periyodiktir, ama hiçbir $T$ için ikisi aynı anda başa dönmez.` },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki diziler periyodik midir? Periyodikse temel periyodu nedir?
$$\text{(a)}\;\; x[n] = \cos\left(\frac{\pi n}{6}\right) + \sin\left(\frac{\pi n}{4}\right) \qquad\qquad \text{(b)}\;\; x[n] = \cos\left(\frac{n}{4}\right)$$`,
        steps: [T`(a) Her terim için $\frac{\Omega}{2\pi}$:
$$\frac{\pi/6}{2\pi} = \frac{1}{12} \;\Rightarrow\; N_1 = 12, \qquad \frac{\pi/4}{2\pi} = \frac{1}{8} \;\Rightarrow\; N_2 = 8$$
$$N_0 = \text{EKOK}(12, 8) = 24$$`,
          T`(b)
$$\frac{\Omega}{2\pi} = \frac{1/4}{2\pi} = \frac{1}{8\pi}$$
İçinde $\pi$ var: irrasyonel.`],
        ans: T`(a) Periyodik, $N_0 = 24$<br>(b) Periyodik değil (sürekli $\cos(t/4)$ periyodik olduğu hâlde!)` },

      { t: 'h', h: 'Deneme 2 · Enerji ve güç', src: 's. 16–21' },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki sinyaller enerji mi, güç mü, hiçbiri mi?
$$\text{(a)}\;\; x(t) = 2e^{-3t}u(t) \qquad\qquad \text{(b)}\;\; x(t) = 4\sin(5t)$$
$$\text{(c)}\;\; x[n] = (-0.5)^n u[n] \qquad\qquad \text{(d)}\;\; x(t) = 3u(t)$$`,
        hint: T`(c)’de $|x[n]|^2 = (0.25)^n$. (d)’de pencerenin yalnızca yarısında sinyal var.`,
        steps: [T`(a)
$$E = \int_0^\infty 4e^{-6t}\,dt = \frac{4}{6} = \frac{2}{3}$$
<strong>Enerji sinyali</strong>.`,
          T`(b) Sinüs:
$$P = \frac{A^2}{2} = \frac{16}{2} = 8$$
<strong>Güç sinyali</strong>.`,
          T`(c) İşaretin değişmesi enerjiyi etkilemez, çünkü kare alınıyor:
$$E = \sum_{n=0}^{\infty}(0.25)^n = \frac{1}{1 - 0.25} = \frac{4}{3}$$
<strong>Enerji sinyali</strong>.`,
          T`(d)
$$E = \int_0^\infty 9\,dt = \infty, \qquad P = \lim_{T\to\infty}\frac{1}{T}\int_0^{T/2}9\,dt = \frac{9}{2}$$
<strong>Güç sinyali</strong>.`],
        ans: T`(a) Enerji, $E = \frac{2}{3}$<br>(b) Güç, $P = 8$<br>(c) Enerji, $E = \frac{4}{3}$<br>(d) Güç, $P = \frac{9}{2}$` },

      { t: 'h', h: 'Deneme 3 · Çift ve tek', src: 's. 22–27' },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki sinyallerin çift ve tek bileşenlerini bulunuz.
$$\text{(a)}\;\; x(t) = (t+1)^2 \qquad\qquad \text{(b)}\;\; x(t) = \begin{cases} t, & 0 < t < 2 \\ 0, & \text{diğer} \end{cases}$$`,
        steps: [T`(a) Parantezi aç:
$$x(t) = t^2 + 2t + 1$$
Çift kuvvetler ve sabit çift parçaya, tek kuvvetler tek parçaya gider:
$$x_e(t) = t^2 + 1, \qquad x_o(t) = 2t$$`,
          T`(b) Ayna:
$$x(-t) = \begin{cases} -t, & -2 < t < 0 \\ 0, & \text{diğer} \end{cases}$$`,
          T`Çift bileşen, bölge bölge:
$$x_e(t) = \begin{cases} \frac{0 + (-t)}{2} = -\frac{t}{2}, & -2 < t < 0 \\ \frac{t + 0}{2} = \frac{t}{2}, & 0 < t < 2 \end{cases} \;=\; \frac{|t|}{2}, \quad |t| < 2$$`,
          { h: T`Tek bileşen:
$$x_o(t) = \begin{cases} \frac{0 - (-t)}{2} = \frac{t}{2}, & -2 < t < 0 \\ \frac{t - 0}{2} = \frac{t}{2}, & 0 < t < 2 \end{cases} \;=\; \frac{t}{2}, \quad |t| < 2$$`,
            fig: [spec([-3, 3], [-1.3, 1.3], [fn((t) => (Math.abs(t) < 2 ? Math.abs(t) / 2 : 0), 'h')], { title: 'xₑ(t) = |t|/2' }), spec([-3, 3], [-1.3, 1.3], [fn((t) => (Math.abs(t) < 2 ? t / 2 : 0), 'y')], { title: 'xₒ(t) = t/2' })] }],
        ans: T`(a) $x_e(t) = t^2 + 1$, $\;x_o(t) = 2t$<br>(b) $x_e(t) = \frac{|t|}{2}$, $\;x_o(t) = \frac{t}{2}$ $\;(|t| < 2)$<br>Kontrol: $t > 0$ için $x_e + x_o = t$ ✓, $t < 0$ için $0$ ✓.` },

      { t: 'h', h: 'Deneme 4 · Temel sinyaller ve δ', src: 's. 28–40' },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki ifadeleri hesaplayınız.
$$\text{(a)}\;\; \int_{-\infty}^{\infty}(t^3 + 2)\,\delta(t+1)\,dt \qquad \text{(b)}\;\; \int_{-2}^{2}e^{t}\,\delta(t-3)\,dt \qquad \text{(c)}\;\; \int_{-\infty}^{\infty}e^{t}\,\delta(2t-4)\,dt$$`,
        hint: T`(c)’de önce $\delta(2t-4) = \delta(2(t-2)) = \frac12\delta(t-2)$ yaz.`,
        steps: [T`(a) İmpuls $t = -1$’de:
$$(t^3 + 2)\,\Big|_{t=-1} = -1 + 2 = 1$$`,
          T`(b) İmpuls $t = 3$’te, ama integral aralığı $[-2, 2]$. İmpuls aralığın dışında kalıyor, sonuç 0.`,
          T`(c) Önce impulsu sadeleştir:
$$\delta(2t - 4) = \delta\big(2(t-2)\big) = \frac{1}{2}\,\delta(t-2)$$
$$\int_{-\infty}^{\infty}e^{t}\cdot\frac{1}{2}\,\delta(t-2)\,dt = \frac{1}{2}\,e^{2}$$`],
        ans: T`(a) $1$<br>(b) $0$<br>(c) $\frac{e^2}{2} \approx 3.69$` },
      { t: 'hw', title: 'Deneme sorusu', q: T`Şekildeki fonksiyonu birim basamak fonksiyonları ile yazıp türevini bulunuz.
$$x(t) = \begin{cases} 2, & -1 < t < 1 \\ 1, & 1 < t < 3 \\ 0, & \text{diğer} \end{cases}$$`,
        fig: spec([-2, 4], [-0.3, 2.5], [fn((t) => (t > -1 && t < 1 ? 2 : t >= 1 && t < 3 ? 1 : 0), 'x')]),
        steps: [T`Sıçramalar:<br>• $t = -1$’de $0 \to 2$: $+2$<br>• $t = 1$’de $2 \to 1$: $-1$<br>• $t = 3$’te $1 \to 0$: $-1$`,
          T`$$x(t) = 2u(t+1) - u(t-1) - u(t-3)$$`,
          T`Her basamak bir impulsa dönüşür:
$$\frac{dx}{dt} = 2\delta(t+1) - \delta(t-1) - \delta(t-3)$$`],
        ans: T`$$x(t) = 2u(t+1) - u(t-1) - u(t-3)$$
$$\frac{dx}{dt} = 2\delta(t+1) - \delta(t-1) - \delta(t-3)$$
Kontrol: impuls alanlarının toplamı $2 - 1 - 1 = 0$, çünkü sinyal 0’dan başlayıp 0’a dönüyor.` },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki sinyali çiziniz ve parçalı olarak yazınız.
$$y(t) = 4\,\Lambda\!\left(\frac{t+1}{2}\right)$$`,
        steps: [T`Aralık:
$$-1 < \frac{t+1}{2} < 1 \;\Longrightarrow\; -3 < t < 1$$
Tepe $t = -1$’de, yükseklik 4.`,
          T`İki kenar:
$$4\left(1 + \frac{t+1}{2}\right) = 2t + 6, \qquad 4\left(1 - \frac{t+1}{2}\right) = 2 - 2t$$`],
        ans: T`$$y(t) = \begin{cases} 2t + 6, & -3 < t < -1 \\ 2 - 2t, & -1 < t < 1 \\ 0, & \text{diğer} \end{cases}$$` },

      { t: 'h', h: 'Deneme 5 · Sinyal işlemleri', src: 's. 41–53' },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki $x(t)$ üçgen sinyaline göre $y(t)$’yi çiziniz.
$$x(t) = \Lambda(t) = \begin{cases} 1 - |t|, & |t| < 1 \\ 0, & \text{diğer} \end{cases} \qquad\qquad y(t) = 2\,x\!\left(1 - \frac{t}{2}\right)$$`,
        hint: T`$a = -\frac12$, $b = 1$. Kritik noktalar $t_k = -1, 0, 1$, $\;t = \frac{t_k - b}{a}$.`,
        steps: [T`Kritik noktaları taşı:
$$t = \frac{t_k - 1}{-1/2} = 2(1 - t_k): \qquad t_k = -1 \to 4, \quad t_k = 0 \to 2, \quad t_k = 1 \to 0$$`,
          T`$a<0$ olduğundan sıra ters döndü, ama üçgen simetrik olduğu için şekil değişmiyor. Taban $0$–$4$ (2 kat genişledi), tepe $t = 2$’de.`,
          { h: T`Genlik 2 ile çarpılır: tepe 2.`, fig: spec([-2, 6], [-0.3, 2.4], [fn((t) => 2 * tri(1 - t / 2), 'y'), fn(tri, 'muted', { fill: false, dash: [5, 4], w: 1.3 })]) }],
        ans: T`$$y(t) = 2\,\Lambda\!\left(\frac{t-2}{2}\right) = \begin{cases} t, & 0 < t < 2 \\ 4 - t, & 2 < t < 4 \\ 0, & \text{diğer} \end{cases}$$
Tepe $t = 2$’de, yükseklik 2.` },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıda verilen diziye göre istenen dizileri bulunuz.
$$x[n] = \{\underbrace{1}_{\uparrow},\, 2,\, 3\} \qquad (n = 0, 1, 2)$$
(a) $x[2-n]$<br>(b) $x[2n-1]$<br>(c) $x[n] + x[-n]$`,
        hint: T`Tablo yöntemi: her $n$ için içerideki indeksi hesapla.`,
        steps: [T`(a) Her $n$ için indeksi hesapla:
$$n = 0 \to x[2] = 3, \qquad n = 1 \to x[1] = 2, \qquad n = 2 \to x[0] = 1$$
Ayna + 2 sağa kaydırma.`,
          T`(b) $m = 2n - 1$ indeksi hem tek sayı hem de $0 \le m \le 2$ aralığında olmalı. Yalnızca $m = 1$, yani $n = 1$:
$$y[1] = x[1] = 2$$`,
          T`(c) Ayna $x[-n]$: $n = 0, -1, -2$’de $1, 2, 3$. Topla:
$$n = 0: \; 1 + 1 = 2, \qquad n = \pm1: \; 2, \qquad n = \pm2: \; 3$$`],
        ans: T`$$\text{(a)}\;\; \{\underbrace{3}_{\uparrow},\, 2,\, 1\} \qquad \text{(b)}\;\; 2\,\delta[n-1] \qquad \text{(c)}\;\; \{3,\, 2,\, \underbrace{2}_{\uparrow},\, 2,\, 3\}$$
(c)’deki dizi $2x_e[n]$’dir.` },

      { t: 'h', h: 'Deneme 6 · Sistem özellikleri', src: 's. 54–68' },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki sisteme zamanla değişmezlik, lineerlik, nedensellik ve kararlılık analizi yapınız.
$$y(t) = x(t-2) + x(2-t)$$`,
        steps: [T`<strong>Lineerlik:</strong> iki terim de girişin yeniden indislenmesi, bu yüzden $a x_1 + b x_2$ girişi $a y_1 + b y_2$ verir. Lineer.`,
          T`<strong>Zamanla değişmezlik:</strong>
$$\text{Girişi kaydır:}\;\; x(t - 2 - t_0) + x(2 - t - t_0)$$
$$\text{Çıkışı kaydır:}\;\; y(t - t_0) = x(t - t_0 - 2) + x(2 - t + t_0)$$
İkinci terimler farklı: zamanla değişen.`,
          T`<strong>Nedensellik:</strong> $t = 0$ için $y(0) = x(-2) + x(2)$. $x(2)$ gelecek: nedensel değil.`,
          T`<strong>Kararlılık:</strong>
$$|x| \le B \;\Longrightarrow\; |y| \le 2B$$
Kararlı. (Ayrıca bellekli.)`],
        ans: T`Lineer<br>Zamanla değişen<br>Nedensel değil<br>Kararlı` },
      { t: 'hw', title: 'Deneme sorusu', q: T`Aşağıdaki sistemlerin her biri için dört özelliği (lineerlik, zamanla değişmezlik, nedensellik, kararlılık) belirleyiniz.
$$\text{(a)}\;\; y(t) = \int_{t-1}^{t}x(\tau)\,d\tau \qquad \text{(b)}\;\; y[n] = x[n]\,x[n-1] \qquad \text{(c)}\;\; y(t) = 3x(t) + 2$$`,
        hint: T`(a) bir “hareketli ortalama”dır. $\int_{-\infty}^{t}$’den farkı: yalnızca son 1 saniyeyi topluyor.`,
        steps: [T`(a) Lineer (integral lineerdir). Nedensel ($\tau \le t$). Zamanla değişmez:
$$\int_{t-1}^{t}x(\tau - t_0)\,d\tau = \int_{t-1-t_0}^{t-t_0}x(s)\,ds = y(t - t_0)$$
Kararlı:
$$|y| \le \int_{t-1}^{t}B\,d\tau = B$$`,
          T`(b) Lineer değil, çünkü $2x \to 4\,x[n]\,x[n-1]$. Zamanla değişmez. Nedensel. Kararlı: $|y| \le B^2$.`,
          T`(c) Lineer değil (sıfır giriş → 2). Zamanla değişmez. Nedensel ve belleksiz. Kararlı: $|y| \le 3B + 2$.`],
        ans: T`(a) Lineer, zamanla değişmez, nedensel, kararlı<br>(b) Lineer değil, zamanla değişmez, nedensel, kararlı<br>(c) Lineer değil, zamanla değişmez, nedensel, kararlı` },

      { t: 'quiz', title: 'Son kontrol: karışık 8 soru', items: [
        { q: T`$x(t) = e^{j(3t + 1)}$ sinyalinin temel periyodu?`, opts: ['$2\\pi/3$', '$2\\pi$', '$3$'], a: 0, why: T`$\omega = 3$, faz periyodu etkilemez.` },
        { q: T`$x[n] = e^{j\frac{4\pi}{5}n}$ dizisinin temel periyodu?`, opts: ['5', '$5/2$', '10'], a: 0, why: T`$$\frac{\Omega}{2\pi} = \frac{4\pi/5}{2\pi} = \frac{2}{5}$$
Sadeleşmiş kesrin paydası periyottur: $N = 5$.` },
        { q: T`$x(t) = e^{-|t|}$ hangi sınıfta?`, opts: ['Enerji, $E = 1$', 'Güç', 'Enerji, $E = 2$'], a: 0, why: T`$|x|^2 = e^{-2|t|}$ çift, yarısının iki katını al:
$$E = 2\int_0^\infty e^{-2t}\,dt = 2\cdot\frac{1}{2} = 1$$` },
        { q: T`$\cos(t)\sin^2(t)$ nasıl bir sinyal?`, opts: ['Çift', 'Tek', 'Hiçbiri'], a: 0, why: T`$\sin^2$ = tek·tek = çift; çift·çift = çift.` },
        { q: T`$\int_{0}^{5}t\,\delta(t+2)\,dt$ kaçtır?`, opts: ['$-2$', '0', '2'], a: 1, why: T`İmpuls $t=-2$’de, aralık $[0,5]$: dışarıda.` },
        { q: T`$x(t)$ $[2, 6]$ aralığında tanımlı. $x(2t+2)$ hangi aralıkta?`, opts: ['$[0, 2]$', '$[2, 6]$', '$[6, 14]$'], a: 0, why: T`$x$’in içi $2$ ile $6$ arasında olmalı:
$$2 \le 2t + 2 \le 6$$
2 çıkar, sonra 2’ye böl:
$$0 \le 2t \le 4 \quad\Longrightarrow\quad 0 \le t \le 2$$` },
        { q: T`$y[n] = x[n^2]$ nedensel mi?`, opts: ['Evet', 'Hayır'], a: 1, why: T`$n=2$ için $y[2] = x[4]$: gelecek.` },
        { q: T`$y(t) = \cos(x(t))$ için hangisi doğru?`, opts: ['Lineer, kararlı', 'Lineer değil, kararlı', 'Lineer değil, kararsız'], a: 1, why: T`Kosinüs lineer değil, ama $|\cos| \le 1$.` }] }
    ]
  };
})();
