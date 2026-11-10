/*
 * Deneme vizeleri — Hsu, Schaum's Outline of Signals and Systems (2. baskı), Bölüm 1 problemlerinden
 * vize kapsamına (ders notu Bölüm 1, s. 2–68) girenler seçildi, Türkçeleştirildi ve adım adım çözüldü.
 * Format: hocanın vizesi gibi 3 ana soru, her birinin altında 1.1, 1.2, … alt soruları.
 * Kapsam dışı bırakılanlar: δ'(t) (türev impuls), RC devresi türetme, geri beslemeli fark denklemi,
 * öz fonksiyon, terslenebilirlik.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const T = String.raw;
  const fn = (f, color, o) => Object.assign({ kind: 'fn', f, color: color || 'x', fill: true, alpha: 0.12, n: 2400 }, o || {});
  const stems = (f, a, b, color, o) => () => { const n = [], v = []; for (let k = a; k <= b; k++) { n.push(k); v.push(f(k)); } return Object.assign({ kind: 'stem', n, v, color: color || 'x', labels: true }, o || {}); };
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 160, xLabel: 't', xStep: 1, layers: layers.map((l) => (typeof l === 'function' ? l() : l)) }, o || {});
  const dspec = (x, y, layers, o) => spec(x, y, layers, Object.assign({ xLabel: 'n' }, o || {}));
  const u = (t) => (t >= 0 ? 1 : 0);
  const tri = (t) => (Math.abs(t) < 1 ? 1 - Math.abs(t) : 0);

  // Şekil sinyalleri
  const x11 = (t) => (t >= 0 && t < 4 ? 0.75 * t : 0);                            // Schaum Şekil 1-17
  const x12 = (n) => ({ 1: 1, 2: 2, 3: 3, 4: 3 }[n] || 0);                        // Şekil 1-19
  const x122 = (t) => (t > -1 && t < 0 ? t + 1 : t >= 0 && t < 1 ? 1 : t >= 1 && t < 2 ? 2 : 0); // Şekil 1-27
  const x123 = (n) => (Math.abs(n) <= 3 ? Math.abs(n) : 0);                       // Şekil 1-29
  const x14a = (n) => ({ 0: 1, 1: 2, 2: 3, 5: 2, 6: 2 }[n] || 0);                 // Şekil 1-22
  const x14b = (n) => ({ '-2': -2, '-1': -2, 0: 2, 1: 2, 3: -2 }[n] || 0);
  const x15a = (t) => (t >= 0 && t < 5 ? 0.8 * t : 0);                            // Şekil 1-24(a)
  const x15b = (t) => (t >= 0 ? 4 * Math.exp(-0.5 * t) : 0);                     // Şekil 1-24(b)

  SS.examIntro = T`Hocanın vizesi <strong>3 ana sorudan</strong> oluşacak ve her ana sorunun altında 1.1, 1.2 gibi alt sorular olacak. Bu sayfadaki 4 deneme aynı formatta hazırlandı. Sorular, ders notunun da büyük ölçüde dayandığı <em>Hsu, Schaum’s Outline of Signals and Systems</em> kitabının 1. bölümünden seçildi. Vize kapsamı dışında kalan konular (δ’nın türevi, devre türetme, geri besleme, terslenebilirlik) alınmadı. Her denemede: <strong>Soru 1</strong> sinyal sınıfları (periyot, enerji/güç, çift/tek), <strong>Soru 2</strong> temel sinyaller ve sinyal işlemleri, <strong>Soru 3</strong> sistem özellikleri. Puanlar tahminîdir.`;

  SS.examSets = [
    /* ================================================================== */
    {
      id: '1', title: 'Periyot, enerji ve sürekli zaman dönüşümleri',
      blurb: 'Isınma denemesi: en sık çıkan üç soru tipi (periyot, enerji/güç, $x(at+b)$ çizimi) ve sistem özelliklerinin en temel örnekleri.',
      questions: [
        { no: 1, title: 'Periyodiklik, enerji ve güç', pts: 34, items: [
          { no: '1.1', pts: 10, ref: '1.10, 1.16(a)(b)', lesson: '1.2',
            q: T`(a) $x(t) = \cos(\omega_0 t + \theta)$ sinyalinin periyodik olduğunu gösteriniz ve temel periyodunu bulunuz.<br>(b) $x(t) = \cos\left(t + \frac{\pi}{4}\right)$ &nbsp; (c) $x(t) = \sin\frac{2\pi}{3}t$ periyodik midir? Periyodikse temel periyot nedir?`,
            hint: T`(a)’da $\cos$’un $2\pi$’de bir tekrar ettiğini kullan: $\omega_0 T = 2\pi m$ olmalı.`,
            steps: [T`(a) Periyodik olması için her $t$ için $\cos[\omega_0(t+T) + \theta] = \cos(\omega_0 t + \theta)$ gerekir.`,
              T`$\cos[\omega_0 t + \theta + \omega_0 T]$ ifadesi $\cos(\omega_0 t + \theta)$’ya ancak $\omega_0 T = 2\pi m$ ($m$ pozitif tam sayı) ise eşittir. Yani $T = m\frac{2\pi}{\omega_0}$.`,
              T`En küçük pozitif değer $m = 1$ ile: $T_0 = \frac{2\pi}{\omega_0}$. ($\theta$ fazı periyodu etkilemez.)`,
              T`(b) $\omega_0 = 1$ ⇒ $T_0 = 2\pi$. &nbsp; (c) $\omega_0 = \frac{2\pi}{3}$ ⇒ $T_0 = \frac{2\pi}{2\pi/3} = 3$.`],
            ans: T`(a) $T_0 = 2\pi/\omega_0$ &nbsp; (b) $T_0 = 2\pi$ &nbsp; (c) $T_0 = 3$` },
          { no: '1.2', pts: 12, ref: '1.16(d)(g)(h)', lesson: '1.2',
            q: T`Aşağıdaki sinyallerin periyodik olup olmadığını belirleyiniz. Periyodikse temel periyodunu bulunuz.<br>(a) $x(t) = \cos t + \sin\sqrt{2}\,t$ &nbsp; (b) $x[n] = e^{j(\pi/4)n}$ &nbsp; (c) $x[n] = \cos\frac{1}{4}n$`,
            hint: T`Ayrık sinyallerde $\Omega_0/2\pi$’nin rasyonel olup olmadığına bak.`,
            steps: [T`(a) $T_1 = 2\pi$, $\;T_2 = \frac{2\pi}{\sqrt2} = \sqrt2\,\pi$. $\;\frac{T_1}{T_2} = \sqrt2$: irrasyonel. Ortak periyot yok.`,
              T`(b) $\Omega_0 = \frac{\pi}{4}$, $\;\frac{\Omega_0}{2\pi} = \frac18$: rasyonel ⇒ periyodik, $N_0 = 8$.`,
              T`(c) $\Omega_0 = \frac14$, $\;\frac{\Omega_0}{2\pi} = \frac{1}{8\pi}$: rasyonel değil ⇒ periyodik değil.`],
            ans: T`(a) periyodik değil &nbsp; (b) $N_0 = 8$ &nbsp; (c) periyodik değil (sürekli $\cos(t/4)$ periyodik olduğu hâlde!)` },
          { no: '1.3', pts: 12, ref: '1.20(a)(b)(c)', lesson: '1.3',
            q: T`Aşağıdaki sinyallerin enerji sinyali mi, güç sinyali mi, yoksa hiçbiri mi olduğunu belirleyiniz.<br>(a) $x(t) = e^{-at}u(t)$, $a>0$ &nbsp; (b) $x(t) = A\cos(\omega_0 t + \theta)$ &nbsp; (c) $x(t) = t\,u(t)$`,
            steps: [T`(a) $E = \int_{-\infty}^{\infty}|x(t)|^2dt = \int_0^\infty e^{-2at}dt = \frac{1}{2a} < \infty$ ⇒ <strong>enerji sinyali</strong>.`,
              T`(b) Sinyal $T_0 = 2\pi/\omega_0$ ile periyodik. Periyodik sinyalin gücü bir periyot üzerinden hesaplanır:<br>$P = \frac{1}{T_0}\int_0^{T_0}A^2\cos^2(\omega_0 t + \theta)\,dt = \frac{A^2\omega_0}{2\pi}\int_0^{2\pi/\omega_0}\frac12[1 + \cos(2\omega_0 t + 2\theta)]\,dt = \frac{A^2}{2} < \infty$ ⇒ <strong>güç sinyali</strong>.`,
              T`(c) $E = \lim_{T\to\infty}\int_0^{T/2}t^2dt = \lim\frac{(T/2)^3}{3} = \infty$. $\;P = \lim_{T\to\infty}\frac1T\cdot\frac{(T/2)^3}{3} = \infty$ ⇒ <strong>ne enerji ne güç</strong>.`],
            ans: T`(a) Enerji, $E = \frac{1}{2a}$ &nbsp; (b) Güç, $P = \frac{A^2}{2}$ &nbsp; (c) Hiçbiri. Not: periyodik sinyaller genellikle güç sinyalidir.` }] },
        { no: 2, title: 'Temel sinyaller ve sinyal işlemleri', pts: 33, items: [
          { no: '2.1', pts: 15, ref: '1.1', lesson: '1.7',
            q: T`Şekildeki $x(t)$ sinyali için (a) $x(t-2)$, (b) $x(2t)$, (c) $x(t/2)$, (d) $x(-t)$ sinyallerini çiziniz.`,
            fig: spec([-2, 6], [-0.4, 3.6], [fn(x11, 'x')], { title: 'x(t): 0 < t < 4 aralığında 0’dan 3’e doğrusal' }),
            hint: T`Kritik noktalar $t_k = 0$ (değer 0) ve $t_k = 4$ (değer 3, sonra düşüş). Her biri için yeni yeri bul.`,
            steps: [T`$x(t) = \frac34 t$, $\;0 < t < 4$. Kritik noktalar: $t = 0$ ve $t = 4$.`,
              T`(a) $x(t-2)$: 2 birim <strong>sağa</strong> kaydır. Rampa $2<t<6$ aralığında, $x = \frac34(t-2)$.`,
              T`(b) $x(2t)$: 2 kat <strong>sıkıştır</strong>. $0 < 2t < 4$ ⇒ $0 < t < 2$, tepe yine 3.`,
              T`(c) $x(t/2)$: 2 kat <strong>genişlet</strong>. $0 < t/2 < 4$ ⇒ $0 < t < 8$.`,
              { h: T`(d) $x(-t)$: dikey eksene göre <strong>ayna</strong>. $-4 < t < 0$, tepe $t = -4$’te.`,
                fig: [spec([-1, 7], [-0.4, 3.6], [fn((t) => x11(t - 2), 'y')], { title: '(a) x(t − 2)' }), spec([-2, 3], [-0.4, 3.6], [fn((t) => x11(2 * t), 'y')], { title: '(b) x(2t)' }),
                  spec([-1, 9], [-0.4, 3.6], [fn((t) => x11(t / 2), 'y')], { title: '(c) x(t/2)' }), spec([-5, 2], [-0.4, 3.6], [fn((t) => x11(-t), 'y')], { title: '(d) x(−t)' })] }],
            ans: T`(a) $2<t<6$ · (b) $0<t<2$ · (c) $0<t<8$ · (d) $-4<t<0$; hepsinde tepe değeri 3. Yükseklik değişmez, yalnızca zaman ekseni değişir.` },
          { no: '2.2', pts: 10, ref: '1.30(a)–(d)', lesson: '1.5',
            q: T`Aşağıdaki integralleri hesaplayınız.<br>(a) $\int_{-1}^{1}(3t^2+1)\,\delta(t)\,dt$ &nbsp; (b) $\int_{1}^{2}(3t^2+1)\,\delta(t)\,dt$ &nbsp; (c) $\int_{-\infty}^{\infty}(t^2 + \cos\pi t)\,\delta(t-1)\,dt$ &nbsp; (d) $\int_{-\infty}^{\infty}e^{-t}\,\delta(2t-2)\,dt$`,
            hint: T`Önce impulsun integral aralığının içinde olup olmadığını kontrol et. (d)’de $\delta(at) = \frac{1}{|a|}\delta(t)$.`,
            steps: [T`(a) İmpuls $t=0$’da, $[-1, 1]$ aralığının içinde: $3\cdot0 + 1 = 1$.`,
              T`(b) İmpuls $t = 0$’da, ama aralık $[1, 2]$: impuls dışarıda kaldığı için sonuç $0$.`,
              T`(c) $t = 1$: $1^2 + \cos\pi = 1 - 1 = 0$.`,
              T`(d) $\delta(2t - 2) = \delta(2(t-1)) = \frac{1}{2}\delta(t-1)$ ⇒ $\frac12 e^{-1} = \frac{1}{2e}$.`],
            ans: T`(a) $1$ · (b) $0$ · (c) $0$ · (d) $\frac{1}{2e} \approx 0.184$` },
          { no: '2.3', pts: 8, ref: '1.27, 1.53', lesson: '1.5',
            q: T`Gösteriniz / bulunuz: (a) $t\,\delta(t) = 0$ &nbsp; (b) $\sin t\,\delta(t) = 0$ &nbsp; (c) $\cos t\,\delta(t-\pi) = -\delta(t-\pi)$ &nbsp; (d) $\delta(2t) = ?$ ve $\delta[2n] = ?$`,
            steps: [T`Kullanılan özellik: $x(t)\delta(t - t_0) = x(t_0)\delta(t-t_0)$ ($x$, $t_0$’da sürekliyse).`,
              T`(a) $t\,\delta(t) = (0)\,\delta(t) = 0$ &nbsp;&nbsp; (b) $\sin t\,\delta(t) = (\sin 0)\,\delta(t) = 0$`,
              T`(c) $\cos t\,\delta(t-\pi) = (\cos\pi)\,\delta(t-\pi) = -\delta(t-\pi)$`,
              T`(d) Sürekli: $\delta(2t) = \frac{1}{|2|}\delta(t) = \frac12\delta(t)$ (genişlik yarıya inince alan da yarıya iner). Ayrık: $\delta[2n]$ yalnızca $2n = 0$, yani $n=0$’da 1’dir: $\delta[2n] = \delta[n]$.`],
            ans: T`(d) $\delta(2t) = \frac12\delta(t)$ ama $\delta[2n] = \delta[n]$. Sürekli ve ayrık impuls bu noktada farklı davranır.` }] },
        { no: 3, title: 'Sistem özellikleri', pts: 33, items: [
          { no: '3.1', pts: 15, ref: '1.33', lesson: '1.11',
            q: T`Bir kondansatörde giriş akım $x(t) = i(t)$, çıkış gerilim $y(t) = v_c(t)$ olsun. (a) Giriş–çıkış ilişkisini yazınız. (b) Sistemin (i) belleksiz, (ii) nedensel, (iii) lineer, (iv) zamanla değişmez, (v) kararlı olup olmadığını belirleyiniz.`,
            hint: T`Kondansatörde $i = C\frac{dv}{dt}$. Bunu $v$ için integralle çöz.`,
            steps: [T`(a) $i(t) = C\frac{dv_c}{dt}$ ⇒ $y(t) = \frac{1}{C}\int_{-\infty}^{t}x(\tau)\,d\tau$ (sabit $C$).`,
              T`(i) Çıkış, girişin geçmiş ve şimdiki bütün değerlerine bağlı: <strong>belleksiz değil</strong> (bellekli).`,
              T`(ii) Gelecek değerler kullanılmıyor ($\tau \le t$): <strong>nedensel</strong>.`,
              T`(iii) $x = a_1x_1 + a_2x_2$ ⇒ $y = \frac1C\int(a_1x_1 + a_2x_2)d\tau = a_1y_1 + a_2y_2$: <strong>lineer</strong>.`,
              T`(iv) $y_1(t) = \frac1C\int_{-\infty}^{t}x(\tau - t_0)d\tau = \frac1C\int_{-\infty}^{t-t_0}x(\lambda)d\lambda = y(t-t_0)$: <strong>zamanla değişmez</strong>.`,
              T`(v) $x(t) = k_1u(t)$ sınırlı. $y(t) = \frac{k_1}{C}\int_0^t d\tau = \frac{k_1}{C}t\,u(t) = \frac{k_1}{C}r(t)$: zamanla sınırsız büyür ⇒ <strong>kararlı değil</strong>.`],
            ans: T`Bellekli · nedensel · lineer · zamanla değişmez · kararsız (integratör)` },
          { no: '3.2', pts: 9, ref: '1.35, 1.58', lesson: '1.8',
            q: T`(a) $y = T\{x\} = x^2$ sisteminin lineer olmadığını gösteriniz. (b) $y[n] = x^2[n]$ sistemi zamanla değişmez midir?`,
            steps: [T`(a) $T\{x_1 + x_2\} = (x_1 + x_2)^2 = x_1^2 + x_2^2 + 2x_1x_2$`, T`$T\{x_1\} + T\{x_2\} = x_1^2 + x_2^2$. Aradaki fark $2x_1x_2$: toplamsallık sağlanmıyor ⇒ <strong>lineer değil</strong>.`,
              T`(b) Girişi kaydır: $T\{x[n-n_0]\} = x^2[n-n_0]$. Çıkışı kaydır: $y[n-n_0] = x^2[n-n_0]$. Eşit ⇒ <strong>zamanla değişmez</strong>.`],
            ans: T`Lineer değil, zamanla değişmez.` },
          { no: '3.3', pts: 9, ref: '1.40', lesson: '1.8',
            q: T`Giriş–çıkış ilişkisi $y = ax + b$ ($a$, $b$ sabit) olan sistem lineer midir?`,
            steps: [T`$x = 0$ girişi için $y = b$.`, T`Lineer bir sistem sıfır girişe sıfır çıkışla cevap vermek zorundadır. $b \ne 0$ ise bu sağlanmaz.`, T`$b = 0$ ise $y = ax$: $a(c_1x_1 + c_2x_2) = c_1y_1 + c_2y_2$ ✓`],
            ans: T`$b \ne 0$ ise lineer <strong>değil</strong>, $b = 0$ ise lineer. Grafiğinin düz çizgi olması (“lineer denklem”) sistemi lineer yapmaz!` }] }
      ]
    },

    /* ================================================================== */
    {
      id: '2', title: 'Ayrık sinyaller, basamak ve impulsla işlemler',
      blurb: 'Ayrık periyot ve güç hesabı, ayrık dönüşümler, basamakla “kesme”, türev ve en çok sorulan üç sistem: modülatör, birim gecikme, sıkıştırıcı.',
      questions: [
        { no: 1, title: 'Periyodiklik, enerji ve güç', pts: 34, items: [
          { no: '1.1', pts: 10, ref: '1.16(e)(f)', lesson: '1.2',
            q: T`Periyodik mi? Periyodikse temel periyot nedir? (a) $x(t) = \sin^2 t$ &nbsp; (b) $x(t) = e^{j[(\pi/2)t - 1]}$`,
            hint: T`(a) $\sin^2\theta = \frac12(1 - \cos 2\theta)$. (b) Üsteki sabiti ayır.`,
            steps: [T`(a) $x(t) = \frac12 - \frac12\cos 2t$. Sabit $\frac12$ her periyoda uyar. $\cos 2t$’nin periyodu $\frac{2\pi}{2} = \pi$ ⇒ $T_0 = \pi$.`,
              T`(b) $x(t) = e^{-j}\,e^{j(\pi/2)t}$. $e^{-j}$ yalnızca karmaşık bir sabit. $\omega_0 = \frac{\pi}{2}$ ⇒ $T_0 = \frac{2\pi}{\pi/2} = 4$.`],
            ans: T`(a) $T_0 = \pi$ (dikkat: $\sin t$’nin periyodu $2\pi$, karesininki $\pi$) &nbsp; (b) $T_0 = 4$` },
          { no: '1.2', pts: 12, ref: '1.16(i)(j)', lesson: '1.2',
            q: T`(a) $x[n] = \cos\frac{\pi}{3}n + \sin\frac{\pi}{4}n$ &nbsp; (b) $x[n] = \cos^2\frac{\pi}{8}n$ periyodik midir? Periyodikse $N_0$’ı bulunuz.`,
            steps: [T`(a) $\frac{\Omega_1}{2\pi} = \frac{\pi/3}{2\pi} = \frac16$ ⇒ $N_1 = 6$. $\;\frac{\Omega_2}{2\pi} = \frac18$ ⇒ $N_2 = 8$.`,
              T`İki periyodik dizinin toplamı her zaman periyodiktir (tam sayıların EKOK’u her zaman vardır): $N_0 = \text{EKOK}(6, 8) = 24$.`,
              T`(b) $\cos^2\frac{\pi}{8}n = \frac12 + \frac12\cos\frac{\pi}{4}n$. Sabit kısım $N_1 = 1$, ikinci kısım $\frac{\pi/4}{2\pi} = \frac18$ ⇒ $N_2 = 8$. $N_0 = 8$.`],
            ans: T`(a) $N_0 = 24$ &nbsp; (b) $N_0 = 8$` },
          { no: '1.3', pts: 12, ref: '1.20(d)(e)(f)', lesson: '1.3',
            q: T`Enerji mi, güç mü, hiçbiri mi? (a) $x[n] = (-0.5)^n u[n]$ &nbsp; (b) $x[n] = u[n]$ &nbsp; (c) $x[n] = 2e^{j3n}$`,
            steps: [T`(a) $E = \sum_{n=0}^{\infty}|(-0.5)^n|^2 = \sum_{n=0}^\infty 0.25^n = \frac{1}{1-0.25} = \frac43 < \infty$ ⇒ <strong>enerji</strong>.`,
              T`(b) $P = \lim_{N\to\infty}\frac{1}{2N+1}\sum_{n=-N}^{N}|u[n]|^2 = \lim\frac{1}{2N+1}\sum_{n=0}^{N}1 = \lim\frac{N+1}{2N+1} = \frac12$ ⇒ <strong>güç</strong>.`,
              T`(c) $|x[n]| = |2e^{j3n}| = 2$. $\;P = \lim\frac{1}{2N+1}\sum_{-N}^{N}2^2 = \lim\frac{4(2N+1)}{2N+1} = 4$ ⇒ <strong>güç</strong>.`],
            ans: T`(a) $E = 4/3$ · (b) $P = 1/2$ · (c) $P = 4$ (dizi periyodik olmasa da gücü sonlu)` }] },
        { no: 2, title: 'Temel sinyaller ve sinyal işlemleri', pts: 33, items: [
          { no: '2.1', pts: 12, ref: '1.2', lesson: '1.7',
            q: T`Şekildeki $x[n]$ için (a) $x[n-2]$, (b) $x[2n]$, (c) $x[-n]$, (d) $x[-n+2]$ dizilerini çiziniz.`,
            fig: dspec([-2.6, 6.6], [-0.3, 3.6], [stems(x12, -2, 6)]),
            hint: T`Tablo yöntemi: her $n$ için içerideki indeksi hesapla ve $x$’ten oku. $x[1]=1$, $x[2]=2$, $x[3]=x[4]=3$.`,
            steps: [T`(a) 2 sağa: $n = 3, 4, 5, 6$’da $1, 2, 3, 3$.`, T`(b) $y[n] = x[2n]$: $y[0] = x[0] = 0$, $y[1] = x[2] = 2$, $y[2] = x[4] = 3$. Tek indisli $x[1]$, $x[3]$ kayboldu.`,
              T`(c) Ayna: $n = -1, -2, -3, -4$’te $1, 2, 3, 3$.`,
              { h: T`(d) $x[-(n-2)]$: önce ayna, sonra 2 sağa. $n=1 \to x[1]=1$, $n=0 \to x[2]=2$, $n=-1 \to x[3]=3$, $n=-2 \to x[4]=3$.`,
                fig: [dspec([-1.6, 7.6], [-0.3, 3.6], [stems((n) => x12(n - 2), -1, 7, 'y')], { title: '(a) x[n − 2]' }), dspec([-2.6, 3.6], [-0.3, 3.6], [stems((n) => x12(2 * n), -2, 3, 'y')], { title: '(b) x[2n]' }),
                  dspec([-5.6, 1.6], [-0.3, 3.6], [stems((n) => x12(-n), -5, 1, 'y')], { title: '(c) x[−n]' }), dspec([-3.6, 2.6], [-0.3, 3.6], [stems((n) => x12(2 - n), -3, 2, 'y')], { title: '(d) x[−n + 2]' })] }],
            ans: T`(b) $x[2n] = \{\underbrace{0}_{\uparrow}, 2, 3\}$ · (d) $x[-n+2] = \{3, 3, 2, \underbrace{1}_{n=1}\}$, $n = -2\ldots1$` },
          { no: '2.2', pts: 11, ref: '1.22', lesson: '1.5',
            q: T`Şekildeki $x(t)$ için (a) $x(t)u(1-t)$, (b) $x(t)[u(t) - u(t-1)]$, (c) $x(t)\,\delta\!\left(t - \frac32\right)$ sinyallerini çiziniz.`,
            fig: spec([-2, 3], [-0.3, 2.5], [fn(x122, 'x')]),
            hint: T`$u(1-t)$, $t<1$ için 1’dir (sola bakan basamak). $u(t) - u(t-1)$, $0<t<1$ penceresidir.`,
            steps: [T`(a) $u(1-t) = 1$ ($t<1$), $0$ ($t>1$). Çarpım, $x$’in $t<1$ kısmını tutar: rampa ($-1<t<0$) ve 1 ($0<t<1$).`,
              T`(b) $u(t) - u(t-1)$ yalnızca $0<t\le1$’de 1: geriye $0<t<1$’deki 1 seviyesi kalır.`,
              { h: T`(c) $x(t)\delta(t - \frac32) = x(\frac32)\,\delta(t-\frac32) = 2\,\delta(t - \frac32)$: alanı 2 olan bir impuls.`,
                fig: [spec([-2, 3], [-0.3, 2.5], [fn((t) => x122(t) * (t < 1 ? 1 : 0), 'y')], { title: '(a)' }), spec([-2, 3], [-0.3, 2.5], [fn((t) => (t > 0 && t < 1 ? 1 : 0), 'y')], { title: '(b)' }),
                  spec([-2, 3], [-0.3, 2.5], [{ kind: 'impulse', at: 1.5, amp: 2, color: 'y', label: '2δ(t − 3/2)' }], { title: '(c)' })] }],
            ans: T`(c) Bir sinyali $\delta(t-t_0)$ ile çarpmak sinyali yok etmez: yüksekliği (alanı) $x(t_0)$ olan bir impuls bırakır.` },
          { no: '2.3', pts: 10, ref: '1.31', lesson: '1.5',
            q: T`Aşağıdaki sinyallerin birinci türevlerini bulup çiziniz ($a>0$).<br>(a) $x(t) = u(t) - u(t-a)$ &nbsp; (b) $x(t) = t[u(t) - u(t-a)]$ &nbsp; (c) $x(t) = \text{sgn}\,t$ ($t>0$ için 1, $t<0$ için $-1$)`,
            hint: T`Her sıçrama, sıçrama miktarı kadar alana sahip bir impuls verir. (b)’de çarpımın türevini al ve $t\delta(t-a) = a\delta(t-a)$ kullan.`,
            steps: [T`(a) $u'(t) = \delta(t)$ ⇒ $x'(t) = \delta(t) - \delta(t-a)$.`,
              T`(b) Çarpımın türevi: $x'(t) = [u(t) - u(t-a)] + t[\delta(t) - \delta(t-a)]$.`,
              T`$t\delta(t) = 0\cdot\delta(t) = 0$ ve $t\delta(t-a) = a\delta(t-a)$ ⇒ $x'(t) = u(t) - u(t-a) - a\,\delta(t-a)$. Rampa $t=a$’da $a$ yüksekliğinden 0’a düştüğü için $-a\delta$ çıkar.`,
              { h: T`(c) $\text{sgn}\,t = u(t) - u(-t)$ ⇒ $x'(t) = \delta(t) - [-\delta(t)] = 2\delta(t)$. ($-1$’den $+1$’e sıçrama: miktar 2.)`,
                fig: [spec([-1, 3], [-2.6, 2.6], [fn((t) => (t >= 0 && t < 2 ? 1 : 0), 'h', { fill: false, w: 1.6 }), { kind: 'impulse', at: 0, amp: 2, color: 'y', label: 'δ(t)' }, { kind: 'impulse', at: 2, amp: -2, color: 'y', label: '−aδ(t−a)' }], { title: '(b) x′(t), a = 2', yStep: 1 }),
                  spec([-2, 2], [-1.4, 2.6], [fn((t) => (t >= 0 ? 1 : -1), 'x', { fill: false }), { kind: 'impulse', at: 0, amp: 2, color: 'y', label: '2δ(t)' }], { title: '(c) sgn t ve türevi', yStep: 1 })] }],
            ans: T`(a) $\delta(t) - \delta(t-a)$ · (b) $u(t) - u(t-a) - a\delta(t-a)$ · (c) $2\delta(t)$` }] },
        { no: 3, title: 'Sistem özellikleri', pts: 33, items: [
          { no: '3.1', pts: 13, ref: '1.34', lesson: '1.10',
            q: T`Bir çarpıcı sistem $y(t) = x(t)\cos\omega_c t$ ilişkisini gerçekliyor. Sistemin (a) belleksiz, (b) nedensel, (c) lineer, (d) zamanla değişmez, (e) kararlı olup olmadığını belirleyiniz.`,
            steps: [T`(a) Çıkış yalnızca girişin o anki değerine bağlı: <strong>belleksiz</strong>.`, T`(b) Gelecek değer yok: <strong>nedensel</strong>.`,
              T`(c) $[a_1x_1 + a_2x_2]\cos\omega_c t = a_1y_1 + a_2y_2$: <strong>lineer</strong>.`,
              T`(d) $y_1(t) = T\{x(t-t_0)\} = x(t-t_0)\cos\omega_c t$, ama $y(t-t_0) = x(t-t_0)\cos\omega_c(t - t_0) \ne y_1(t)$: <strong>zamanla değişen</strong>.`,
              T`(e) $|\cos\omega_c t| \le 1$ ⇒ $|y(t)| \le |x(t)|$: sınırlı giriş sınırlı çıkış verir, <strong>kararlı</strong>.`],
            ans: T`Belleksiz · nedensel · lineer · zamanla değişen · kararlı` },
          { no: '3.2', pts: 10, ref: '1.36', lesson: '1.10',
            q: T`Birim gecikme elemanı $y[n] = x[n-1]$ için (a) belleksiz, (b) nedensel, (c) lineer, (d) zamanla değişmez, (e) kararlı mı?`,
            steps: [T`(a) $y[n]$, $n-1$ anındaki girişe bağlı: <strong>bellekli</strong>.`, T`(b) Yalnızca geçmiş: <strong>nedensel</strong>.`, T`(c) $a_1x_1[n-1] + a_2x_2[n-1] = a_1y_1 + a_2y_2$: <strong>lineer</strong>.`,
              T`(d) $y_1[n] = x_1[n-1] = x[n-1-n_0] = y[n-n_0]$: <strong>zamanla değişmez</strong>.`, T`(e) $|x[n]| \le k$ ⇒ $|y[n]| = |x[n-1]| \le k$: <strong>kararlı</strong>.`],
            ans: T`Bellekli · nedensel · lineer · zamanla değişmez · kararlı (en basit LTI sistem)` },
          { no: '3.3', pts: 10, ref: '1.39', lesson: '1.10',
            q: T`$y[n] = x[k_0n]$, $k_0$ pozitif tam sayı (“sıkıştırıcı”). Sistem zamanla değişmez midir? (Ek: lineer ve nedensel midir?)`,
            hint: T`Girişi $n_0$ kaydırıp sistemden geçir; çıkışı $n_0$ kaydır. İçerideki ifadeleri karşılaştır.`,
            steps: [T`Girişi kaydır: $x_1[n] = x[n-n_0]$ ⇒ $y_1[n] = x_1[k_0n] = x[k_0n - n_0]$.`, T`Çıkışı kaydır: $y[n-n_0] = x[k_0(n-n_0)] = x[k_0n - k_0n_0]$.`,
              T`$k_0n_0 \ne n_0$ (yani $k_0 \ne 1$) ise ikisi farklı: <strong>zamanla değişen</strong>. Sistem her $k_0$’ıncı örneği seçiyor; girişi bir adım kaydırmak bambaşka örneklerin seçilmesine yol açar.`,
              T`Ek: Yeniden indisleme olduğu için <strong>lineer</strong>. $k_0 \ge 2$ ise $y[1] = x[k_0]$ geleceğe baktığı için <strong>nedensel değil</strong>.`],
            ans: T`$k_0 = 1$ dışında zamanla değişen. Lineer, nedensel değil ($k_0 \ge 2$).` }] }
      ]
    },

    /* ================================================================== */
    {
      id: '3', title: 'Çift/tek, örnekleme ve sistemlerde karşı örnek',
      blurb: 'Çift ve tek bileşen çizimi, örnekleme, ayrık dizilerle aritmetik ve şekilden lineerlik testi.',
      questions: [
        { no: 1, title: 'Çift/tek bileşenler ve periyodiklik', pts: 34, items: [
          { no: '1.1', pts: 12, ref: '1.5(a)(b)', lesson: '1.4',
            q: T`Şekildeki sinyallerin çift ve tek bileşenlerini bulup çiziniz. (a) $0<t<5$ aralığında 0’dan 4’e doğrusal artan sinyal. (b) $x(t) = 4e^{-0.5t}u(t)$.`,
            fig: [spec([-1, 6], [-0.4, 4.6], [fn(x15a, 'x')], { title: '(a) x(t)' }), spec([-1, 6], [-0.4, 4.6], [fn(x15b, 'x')], { title: '(b) x(t) = 4e^(−0.5t)u(t)' })],
            hint: T`Önce $x(-t)$’yi çiz. $t>0$ ve $t<0$ bölgelerinde $x_e = \frac{x(t) + x(-t)}{2}$ ve $x_o = \frac{x(t) - x(-t)}{2}$’yi ayrı ayrı hesapla.`,
            steps: [T`(a) $x(t) = 0.8t$ ($0<t<5$), $\;x(-t) = -0.8t$ ($-5<t<0$).`,
              T`$t>0$: $x_e = \frac{0.8t + 0}{2} = 0.4t$, $\;x_o = 0.4t$. $\;t<0$: $x_e = \frac{0 - 0.8t}{2} = -0.4t$, $\;x_o = \frac{0 - (-0.8t)}{2} = 0.4t$.`,
              T`Sonuç: $x_e = 0.4|t|$, $\;x_o = 0.4t$ ($|t|<5$). Uçlarda $x_e = 2$, $x_o = \pm2$.`,
              { h: T`(b) Aynı yolla: $x_e = 2e^{-0.5|t|}$, $\;x_o = 2\,\text{sgn}(t)\,e^{-0.5|t|}$. $t = 0$’da $x_e = 2$; $x_o$ ise $-2$’den $+2$’ye sıçrar.`,
                fig: [spec([-6, 6], [-2.6, 2.6], [fn((t) => (Math.abs(t) < 5 ? 0.4 * Math.abs(t) : 0), 'h')], { title: '(a) xₑ(t)' }), spec([-6, 6], [-2.6, 2.6], [fn((t) => (Math.abs(t) < 5 ? 0.4 * t : 0), 'y')], { title: '(a) xₒ(t)' }),
                  spec([-6, 6], [-2.6, 2.6], [fn((t) => 2 * Math.exp(-0.5 * Math.abs(t)), 'h')], { title: '(b) xₑ(t)' }), spec([-6, 6], [-2.6, 2.6], [fn((t) => Math.sign(t) * 2 * Math.exp(-0.5 * Math.abs(t)), 'y')], { title: '(b) xₒ(t)' })] }],
            ans: T`(a) $x_e = 0.4|t|$, $x_o = 0.4t$ ($|t|<5$) · (b) $x_e = 2e^{-0.5|t|}$, $x_o = 2\,\text{sgn}(t)e^{-0.5|t|}$. Kontrol: $t>0$’da $x_e + x_o = x$, $t<0$’da $x_e + x_o = 0$ ✓` },
          { no: '1.2', pts: 10, ref: '1.6, 1.7, 1.8(b)', lesson: '1.4',
            q: T`(a) $x(t) = e^{jt}$’nin çift ve tek bileşenlerini bulunuz. (b) İki çift ya da iki tek sinyalin çarpımının çift, bir çift ile bir tek sinyalin çarpımının tek olduğunu gösteriniz. (c) Tek bir $x(t)$ için $x(0) = 0$ ve $\int_{-a}^{a}x(t)\,dt = 0$ olduğunu gösteriniz.`,
            steps: [T`(a) $x_e = \frac12(e^{jt} + e^{-jt}) = \cos t$, $\;x_o = \frac12(e^{jt} - e^{-jt}) = j\sin t$ (Euler).`,
              T`(b) $x = x_1x_2$. İkisi çift: $x(-t) = x_1(-t)x_2(-t) = x_1(t)x_2(t) = x(t)$ → çift. İkisi tek: $x(-t) = [-x_1][-x_2] = x(t)$ → çift. Biri çift biri tek: $x(-t) = x_1(t)[-x_2(t)] = -x(t)$ → tek.`,
              T`(c) $x(-0) = -x(0)$ ve $-0 = 0$ ⇒ $x(0) = -x(0)$ ⇒ $x(0) = 0$.`,
              T`$\int_{-a}^{a}x\,dt = \int_{-a}^{0}x\,dt + \int_0^a x\,dt$. Birincide $t = -\lambda$ koy: $\int_{0}^{a}x(-\lambda)d\lambda = -\int_0^a x(\lambda)d\lambda$. Toplam $0$.`],
            ans: T`(a) $\cos t$ ve $j\sin t$. (c)’nin pratik sonucu: tek bir sinyalin simetrik aralıktaki integrali hesap yapmadan 0’dır.` },
          { no: '1.3', pts: 12, ref: '1.51(a)–(d)', lesson: '1.2',
            q: T`Periyodik mi? Periyodikse temel periyot? (a) $\cos\left(2t + \frac{\pi}{4}\right)$ &nbsp; (b) $\cos^2 t$ &nbsp; (c) $(\cos 2\pi t)\,u(t)$ &nbsp; (d) $e^{j\pi t}$`,
            steps: [T`(a) $\omega_0 = 2$ ⇒ $T_0 = \pi$.`, T`(b) $\cos^2 t = \frac12 + \frac12\cos 2t$ ⇒ $T_0 = \pi$.`,
              T`(c) $t<0$ için sinyal hep 0, $t>0$ için salınıyor. Herhangi bir $T>0$ için $-T < t < 0$ aralığında $x(t) = 0$ ama $x(t+T) = \cos 2\pi(t+T)$ genelde sıfır değil. $x(t+T) = x(t)$ her $t$ için sağlanamaz: <strong>periyodik değil</strong>.`,
              T`(d) $\omega_0 = \pi$ ⇒ $T_0 = 2$.`],
            ans: T`(a) $\pi$ · (b) $\pi$ · (c) periyodik değil · (d) $2$. Tuzak (c): periyodik bir sinyali $u(t)$ ile kesmek periyodikliği bozar.` }] },
        { no: 2, title: 'Örnekleme ve ayrık sinyaller', pts: 33, items: [
          { no: '2.1', pts: 11, ref: '1.3', lesson: '1.1',
            q: T`$x(t) = 1 - |t|$ ($-1 \le t \le 1$), diğer yerlerde 0 sinyali $T_s$ aralıklarla örneklenerek $x[n] = x(nT_s)$ elde ediliyor. (a) $T_s = 0.25$ s, (b) $T_s = 0.5$ s, (c) $T_s = 1$ s için dizileri bulunuz.`,
            steps: [T`(a) $x[n] = x(n/4)$: $n = -4\ldots4$ için $0, 0.25, 0.5, 0.75, \underbrace{1}_{n=0}, 0.75, 0.5, 0.25, 0$.`,
              T`(b) $x[n] = x(n/2)$: $\{0, 0.5, \underbrace{1}_{\uparrow}, 0.5, 0\}$.`,
              { h: T`(c) $x[n] = x(n)$: yalnızca $n=0$’da 1 ⇒ $x[n] = \delta[n]$.`,
                fig: [dspec([-5.6, 5.6], [-0.2, 1.3], [fn((t) => tri(t / 4), 'muted', { fill: false, dash: [4, 4], w: 1.2 }), stems((n) => tri(n / 4), -5, 5, 'x', { labels: false })], { title: '(a) Tₛ = 0.25' }),
                  dspec([-3.6, 3.6], [-0.2, 1.3], [stems((n) => tri(n / 2), -3, 3, 'x')], { title: '(b) Tₛ = 0.5' }), dspec([-3.6, 3.6], [-0.2, 1.3], [stems((n) => tri(n), -3, 3, 'x')], { title: '(c) Tₛ = 1' })] }],
            ans: T`$T_s$ büyüdükçe örnek sayısı azalır; $T_s = 1$’de üçgenin şekli tamamen kaybolur, geriye $\delta[n]$ kalır.` },
          { no: '2.2', pts: 11, ref: '1.4', lesson: '1.6',
            q: T`Şekildeki $x_1[n]$ ve $x_2[n]$ dizileri için (a) $y_1 = x_1 + x_2$, (b) $y_2 = 2x_1$, (c) $y_3 = x_1x_2$ dizilerini sayı listesi olarak yazınız.`,
            fig: [dspec([-3.6, 7.6], [-2.6, 3.6], [stems(x14a, -3, 7)], { title: 'x₁[n]' }), dspec([-3.6, 7.6], [-2.6, 3.6], [stems(x14b, -3, 7, 'h')], { title: 'x₂[n]' })],
            hint: T`Noktadan noktaya işlem: aynı $n$’deki değerleri topla veya çarp.`,
            steps: [T`$x_1$: $n=0,1,2,5,6$’da $1, 2, 3, 2, 2$. $\;x_2$: $n=-2,-1,0,1,3$’te $-2, -2, 2, 2, -2$.`,
              T`(a) $n = -2\ldots6$: $-2, -2, 3, 4, 3, -2, 0, 2, 2$.`, T`(b) $n = 0\ldots6$: $2, 4, 6, 0, 0, 4, 4$.`,
              T`(c) Çarpım yalnızca ikisinin de sıfırdan farklı olduğu yerlerde: $n = 0 \to 1\cdot2 = 2$, $n = 1 \to 2\cdot2 = 4$. ($n=2$’de $x_2 = 0$, $n=3$’te $x_1 = 0$.)`],
            ans: T`$y_1 = \{-2, -2, \underbrace{3}_{\uparrow}, 4, 3, -2, 0, 2, 2\}$ · $y_2 = \{\underbrace{2}_{\uparrow}, 4, 6, 0, 0, 4, 4\}$ · $y_3 = \{\underbrace{2}_{\uparrow}, 4\}$` },
          { no: '2.3', pts: 11, ref: '1.23', lesson: '1.6',
            q: T`Şekildeki $x[n] = |n|$ ($|n| \le 3$) dizisi için (a) $x[n]u[1-n]$, (b) $x[n]\{u[n+2] - u[n]\}$, (c) $x[n]\delta[n-1]$ dizilerini çiziniz.`,
            fig: dspec([-4.6, 4.6], [-0.3, 3.6], [stems(x123, -4, 4)]),
            steps: [T`(a) $u[1-n] = 1$ ($n \le 1$): $n = -3\ldots1$ kalır: $3, 2, 1, 0, 1$.`, T`(b) $u[n+2] - u[n] = 1$ yalnızca $-2 \le n < 0$: $x[-2] = 2$, $x[-1] = 1$.`,
              { h: T`(c) $x[n]\delta[n-1] = x[1]\delta[n-1] = \delta[n-1]$.`, fig: [dspec([-4.6, 3.6], [-0.3, 3.6], [stems((n) => (n <= 1 ? x123(n) : 0), -4, 3, 'y')], { title: '(a)' }), dspec([-3.6, 3.6], [-0.3, 3.6], [stems((n) => (n >= -2 && n < 0 ? x123(n) : 0), -3, 3, 'y')], { title: '(b)' }), dspec([-2.6, 4.6], [-0.3, 3.6], [stems((n) => (n === 1 ? 1 : 0), -2, 4, 'y')], { title: '(c)' })] }],
            ans: T`(b) $2\delta[n+2] + \delta[n+1]$ · (c) $\delta[n-1]$` }] },
        { no: 3, title: 'Sistem özellikleri', pts: 33, items: [
          { no: '3.1', pts: 13, ref: '1.38', lesson: '1.11',
            q: T`$y[n] = n\,x[n]$ sisteminin (a) belleksiz, (b) nedensel, (c) lineer, (d) zamanla değişmez, (e) kararlı olup olmadığını belirleyiniz.`,
            steps: [T`(a) Yalnızca $x[n]$ kullanılıyor: <strong>belleksiz</strong>. (b) <strong>Nedensel</strong>.`,
              T`(c) $n(a_1x_1 + a_2x_2) = a_1y_1 + a_2y_2$: <strong>lineer</strong>.`,
              T`(d) $y_1[n] = T\{x[n-n_0]\} = n\,x[n-n_0]$, ama $y[n-n_0] = (n - n_0)x[n-n_0] \ne y_1[n]$: <strong>zamanla değişen</strong>.`,
              T`(e) $x[n] = u[n]$ sınırlı ⇒ $y[n] = n\,u[n]$ sınırsız büyür: <strong>kararsız</strong>.`],
            ans: T`Belleksiz · nedensel · lineer · zamanla değişen · kararsız` },
          { no: '3.2', pts: 10, ref: '1.41', lesson: '1.8',
            q: T`Zamanla değişmez olduğu bilinen bir $T$ sistemine verilen girişler ve elde edilen çıkışlar şunlardır:<br>$x_1 = 2\delta[n-2] \to y_1 = \delta[n-2] + 2\delta[n-3]$<br>$x_2 = \delta[n+1] \to y_2 = 2\delta[n+1] + \delta[n]$<br>$x_3 = \delta[n-1] + 2\delta[n-2] \to y_3 = 2\delta[n-1] + 3\delta[n-2] + \delta[n-3]$<br>Sistem lineer midir?`,
            hint: T`$x_3$’ü $x_1$ ve $x_2$’nin kaydırılmış hâlleri cinsinden yaz. Sistem lineer olsaydı $y_3$ ne olmalıydı?`,
            steps: [T`$x_3 = x_1[n] + x_2[n-2]$ (çünkü $x_2[n-2] = \delta[n-1]$).`,
              T`Sistem lineer olsaydı (zamanla değişmezliği de kullanarak): $y_3 = y_1[n] + y_2[n-2]$.`,
              T`$y_2[n-2] = 2\delta[n-1] + \delta[n-2]$ ⇒ beklenen $y_3 = 2\delta[n-1] + 2\delta[n-2] + 2\delta[n-3]$.`,
              T`Gözlenen $y_3 = 2\delta[n-1] + 3\delta[n-2] + \delta[n-3]$ farklı.`],
            ans: T`Sistem <strong>lineer değil</strong>. Tek bir karşı örnek yeterlidir.` },
          { no: '3.3', pts: 10, ref: '1.56', lesson: '1.11',
            q: T`$y(t) = \frac{1}{T}\int_{t-T/2}^{t+T/2}x(\tau)\,d\tau$ (hareketli ortalama) sisteminin (a) lineer, (b) zamanla değişmez, (c) nedensel olup olmadığını belirleyiniz. (Ek: kararlı mı?)`,
            steps: [T`(a) İntegral lineer: $\frac1T\int(a_1x_1 + a_2x_2) = a_1y_1 + a_2y_2$ ⇒ <strong>lineer</strong>.`,
              T`(b) $\frac1T\int_{t-T/2}^{t+T/2}x(\tau - t_0)d\tau$; $\lambda = \tau - t_0$ ⇒ $\frac1T\int_{t-t_0-T/2}^{t-t_0+T/2}x(\lambda)d\lambda = y(t-t_0)$ ⇒ <strong>zamanla değişmez</strong>.`,
              T`(c) Üst sınır $t + T/2 > t$: çıkış, girişin gelecekteki $T/2$’lik kısmını kullanıyor ⇒ <strong>nedensel değil</strong>.`,
              T`(Ek) $|x| \le B$ ⇒ $|y| \le \frac1T\cdot T\cdot B = B$ ⇒ <strong>kararlı</strong>. ($\int_{-\infty}^{t}$’den farkı: sınırlı uzunlukta bir pencere.)`],
            ans: T`Lineer · zamanla değişmez · nedensel değil · kararlı` }] }
      ]
    },

    /* ================================================================== */
    {
      id: '4', title: 'Basamakla yazma, karmaşık periyot ve kavram soruları',
      blurb: 'En zor deneme: kitabın tamamlayıcı problemleri. Daha az hazır kalıp, daha çok kavram.',
      questions: [
        { no: 1, title: 'Periyodiklik ve çift/tek', pts: 34, items: [
          { no: '1.1', pts: 12, ref: '1.51(e)–(h)', lesson: '1.2',
            q: T`Periyodik mi? Periyodikse $N_0$?<br>(a) $x[n] = e^{j[(n/4) - \pi]}$ &nbsp; (b) $x[n] = \cos\left(\frac{\pi n^2}{8}\right)$ &nbsp; (c) $x[n] = \cos\left(\frac{n}{2}\right)\cos\left(\frac{\pi n}{4}\right)$ &nbsp; (d) $x[n] = \cos\left(\frac{\pi n}{4}\right) + \sin\left(\frac{\pi n}{8}\right) - 2\cos\left(\frac{\pi n}{2}\right)$`,
            hint: T`(b)’de $\Omega$ yok: doğrudan $x[n+N] = x[n]$ koşulunu yaz. (c)’de çarpımı toplama çevir.`,
            steps: [T`(a) $e^{-j\pi}e^{jn/4}$: $\Omega_0 = \frac14$, $\frac{\Omega_0}{2\pi} = \frac{1}{8\pi}$ irrasyonel ⇒ <strong>periyodik değil</strong>.`,
              T`(b) $\cos\frac{\pi(n+N)^2}{8} = \cos\left(\frac{\pi n^2}{8} + \frac{\pi(2nN + N^2)}{8}\right)$. Her $n$ için ek terim $2\pi$’nin katı olmalı: $\frac{2nN + N^2}{16}$ tam sayı. $N = 8$: $\frac{16n + 64}{16} = n + 4$ ✓. $N = 4$: $\frac{8n + 16}{16} = \frac n2 + 1$, tek $n$’de tam sayı değil ✗. ⇒ $N_0 = 8$.`,
              T`(c) $\cos A\cos B = \frac12[\cos(A+B) + \cos(A-B)]$: frekanslar $\frac12 \pm \frac{\pi}{4}$. İçlerindeki $\frac12$ yüzünden $\Omega/2\pi$ rasyonel değil ⇒ <strong>periyodik değil</strong>.`,
              T`(d) $N_1 = 8$, $N_2 = 16$, $N_3 = 4$ ⇒ $N_0 = \text{EKOK}(8, 16, 4) = 16$.`],
            ans: T`(a) değil · (b) $8$ · (c) değil · (d) $16$` },
          { no: '1.2', pts: 10, ref: '1.48', lesson: '1.4',
            q: T`Çift ve tek bileşenleri bulunuz: (a) $u(t)$ &nbsp; (b) $\sin\left(\omega_0 t + \frac{\pi}{4}\right)$ &nbsp; (c) $x[n] = e^{j(\Omega_0 n + \pi/2)}$ &nbsp; (d) $\delta[n]$`,
            steps: [T`(a) $x_e = \frac12$, $\;x_o = \frac12\,\text{sgn}\,t$.`,
              T`(b) $\sin(\omega_0 t + \frac{\pi}{4}) = \frac{1}{\sqrt2}\sin\omega_0 t + \frac{1}{\sqrt2}\cos\omega_0 t$ ⇒ $x_e = \frac{1}{\sqrt2}\cos\omega_0 t$, $\;x_o = \frac{1}{\sqrt2}\sin\omega_0 t$.`,
              T`(c) $e^{j\pi/2} = j$ ⇒ $x[n] = j(\cos\Omega_0 n + j\sin\Omega_0 n) = j\cos\Omega_0 n - \sin\Omega_0 n$ ⇒ $x_e = j\cos\Omega_0 n$, $\;x_o = -\sin\Omega_0 n$.`,
              T`(d) $\delta[-n] = \delta[n]$, yani zaten çift: $x_e = \delta[n]$, $\;x_o = 0$.`],
            ans: T`Kısayol: önce sinüs/kosinüs ya da Euler ile aç, sonra cos’lu terimleri çift, sin’li terimleri tek parçaya ayır.` },
          { no: '1.3', pts: 12, ref: '1.11, 1.13', lesson: '1.2',
            q: T`(a) $x[n] = e^{j\Omega_0 n}$ dizisinin ancak $\Omega_0/2\pi$ rasyonel ise periyodik olduğunu gösteriniz.<br>(b) $x(t) = \cos 15t$ sinyali $T_s$ aralıklarla örnekleniyor. $x[n] = x(nT_s)$’nin periyodik olması için $T_s$ ne olmalı? $T_s = 0.1\pi$ s için $N_0$ kaçtır?`,
            steps: [T`(a) $e^{j\Omega_0(n+N)} = e^{j\Omega_0 n}$ ⇒ $e^{j\Omega_0 N} = 1$ ⇒ $\Omega_0 N = 2\pi m$ ⇒ $\frac{\Omega_0}{2\pi} = \frac{m}{N}$: rasyonel olmalı.`,
              T`(b) $x[n] = \cos(15T_s n)$, $\Omega_0 = 15T_s$. Koşul: $\frac{15T_s}{2\pi} = \frac{T_s}{T_0} = \frac{m}{N_0}$ rasyonel. ($T_0 = 2\pi/15$.) Yani örnekleme aralığının sinyalin periyoduna oranı rasyonel olmalı.`,
              T`$T_s = 0.1\pi$: $\frac{T_s}{T_0} = \frac{\pi/10}{2\pi/15} = \frac{15}{20} = \frac34$ ⇒ $N_0 = 4$ ($m = 3$). Kontrol: $x[n] = \cos(1.5\pi n)$, $\frac{1.5\pi}{2\pi} = \frac34$ ✓`],
            ans: T`(b) $T_s/T_0$ rasyonel olmalı; $T_s = 0.1\pi$ için $N_0 = 4$ (4 örnek = sürekli sinyalin 3 periyodu).` }] },
        { no: 2, title: 'Basamak ve impulsla ifade, integraller', pts: 33, items: [
          { no: '2.1', pts: 11, ref: '1.46', lesson: '1.5',
            q: T`Şekildeki sinyalleri birim basamak fonksiyonlarıyla ifade ediniz.`,
            fig: [spec([-1.5, 3.5], [-0.3, 1.4], [fn((t) => (t > 0 && t < 2 ? t / 2 : 0), 'x')], { title: '(a)' }), spec([-1.5, 4.5], [-0.3, 3.5], [fn((t) => (t > -1 && t < 0 ? 1 : t >= 0 && t < 1 ? 3 : t >= 1 && t < 2 ? 2 : t >= 2 && t < 3 ? 1 : 0), 'x')], { title: '(b)' })],
            hint: T`(a)’da bir rampa parçasını bir pencereyle çarp. (b)’de her sıçramayı sıçrama miktarı kadar bir basamakla yaz.`,
            steps: [T`(a) $0<t<2$’de $x = t/2$: pencere $u(t) - u(t-2)$ ile çarp ⇒ $x(t) = \frac{t}{2}[u(t) - u(t-2)]$.`,
              T`(b) Sıçramalar: $t=-1$’de $+1$, $t=0$’da $+2$ (1→3), $t=1$’de $-1$ (3→2), $t=2$’de $-1$ (2→1), $t=3$’te $-1$ (1→0).`],
            ans: T`(a) $\frac t2[u(t) - u(t-2)]$ · (b) $u(t+1) + 2u(t) - u(t-1) - u(t-2) - u(t-3)$. Kontrol: katsayıların toplamı $1 + 2 - 1 - 1 - 1 = 0$, çünkü sinyal sonunda 0’a dönüyor.` },
          { no: '2.2', pts: 11, ref: '1.47', lesson: '1.6',
            q: T`Şekildeki dizileri birim basamak dizileriyle ifade ediniz.`,
            fig: [dspec([-2.6, 8.6], [-0.3, 1.4], [stems((n) => (n >= 0 && n <= 6 ? 1 : 0), -2, 8, 'x', { labels: false })], { title: '(a) n = 0 … N (burada N = 6)' }), dspec([-5.6, 3.6], [-1.4, 0.4], [stems((n) => (n <= -1 ? -1 : 0), -5, 3, 'x', { labels: false })], { title: '(b) n ≤ −1 için −1' }), dspec([-4.6, 5.6], [-0.3, 1.4], [stems((n) => (n >= -2 && n <= 3 ? 1 : 0), -4, 5, 'x', { labels: false })], { title: '(c)' })],
            steps: [T`(a) $n = 0$’da başlar, $n = N$’de biter: $u[n] - u[n - (N+1)]$. (Bitişte $N+1$’e dikkat: ayrık zamanda son örnek dahildir.)`,
              T`(b) $n \le -1$ için $-1$: $u[-n-1]$, $-n - 1 \ge 0 \iff n \le -1$ için 1’dir ⇒ $x[n] = -u[-n-1]$.`,
              T`(c) $n = -2\ldots3$: $u[n+2] - u[n-4]$.`],
            ans: T`(a) $u[n] - u[n-(N+1)]$ · (b) $-u[-n-1]$ · (c) $u[n+2] - u[n-4]$` },
          { no: '2.3', pts: 11, ref: '1.55', lesson: '1.5',
            q: T`Hesaplayınız: (a) $\int_{-\infty}^{t}(\cos\tau)\,u(\tau)\,d\tau$ &nbsp; (b) $\int_{-\infty}^{t}(\cos\tau)\,\delta(\tau)\,d\tau$ &nbsp; (c) $\int_{-\infty}^{\infty}(\cos t)\,u(t-1)\,\delta(t)\,dt$ &nbsp; (d) $\int_0^{2\pi}t\sin\frac t2\;\delta(\pi - t)\,dt$`,
            hint: T`(a) ve (b)’nin sonucu bir sayı değil, $t$’nin fonksiyonu. (d)’de $\delta(\pi - t) = \delta(t - \pi)$ (impuls çift).`,
            steps: [T`(a) $u(\tau)$ integrali $\tau > 0$’a kısıtlar: $t<0$ için 0, $t>0$ için $\int_0^t\cos\tau\,d\tau = \sin t$ ⇒ $\sin t\,u(t)$.`,
              T`(b) $\cos\tau\,\delta(\tau) = \cos 0\,\delta(\tau) = \delta(\tau)$. $\int_{-\infty}^{t}\delta = u(t)$: $t>0$ için 1, $t<0$ için 0 ($t = 0$’da tanımsız).`,
              T`(c) İmpuls $t = 0$’ı seçer: $\cos 0\cdot u(0 - 1) = 1\cdot u(-1) = 0$.`,
              T`(d) $\delta(\pi - t) = \delta(t - \pi)$, $\pi \in [0, 2\pi]$: $\pi\sin\frac{\pi}{2} = \pi$.`],
            ans: T`(a) $\sin t\,u(t)$ · (b) $u(t)$ · (c) $0$ · (d) $\pi$` }] },
        { no: 3, title: 'Sistem özellikleri: kavram', pts: 33, items: [
          { no: '3.1', pts: 11, ref: '1.57', lesson: '1.10',
            q: T`$y(t) = \sum_{k=-\infty}^{\infty}x(t)\,\delta(t - kT_s)$ (ideal örnekleyici) sistemi (a) lineer, (b) zamanla değişmez midir?`,
            steps: [T`Önce sadeleştir: $x(t)\delta(t-kT_s) = x(kT_s)\delta(t - kT_s)$ ⇒ $y(t) = \sum_k x(kT_s)\,\delta(t-kT_s)$: girişin $kT_s$ anlarındaki değerleri, impuls dizisinin ağırlıkları olur.`,
              T`(a) $x$, $p(t) = \sum_k\delta(t-kT_s)$ gibi girişten bağımsız bir fonksiyonla çarpılıyor: $(a_1x_1 + a_2x_2)p = a_1y_1 + a_2y_2$ ⇒ <strong>lineer</strong>.`,
              T`(b) Girişi $t_0$ kadar kaydır (örneğin $t_0 = T_s/2$): $y_1(t) = \sum_k x(kT_s - t_0)\delta(t - kT_s)$. Çıkışı kaydır: $y(t - t_0) = \sum_k x(kT_s)\delta(t - t_0 - kT_s)$. İmpulsların yerleri farklı ($kT_s$ ile $kT_s + t_0$) ⇒ <strong>zamanla değişen</strong>.`],
            ans: T`Lineer, zamanla değişen. (Örnekleme anları sabittir: girişi kaydırsan da ızgara kaymaz.)` },
          { no: '3.2', pts: 11, ref: '1.42, 1.59', lesson: '1.8',
            q: T`Lineerliğin iki koşulunun birbirinden bağımsız olduğunu örneklerle gösteriniz. (a) Toplamsal ama homojen olmayan bir sistem: $y[n] = x^*[n]$ (karmaşık eşlenik). (b) Homojen ama toplamsal olmayan bir sistem bulunuz.`,
            steps: [T`(a) Toplamsallık: $(x_1 + x_2)^* = x_1^* + x_2^*$ ✓. Homojenlik: karmaşık bir $a$ için $T\{ax\} = (ax)^* = a^*x^* = a^*y \ne ay$ (ör. $a = j$: $-jy \ne jy$) ✗.`,
              T`(b) Örnek: $y(t) = \dfrac{x^2(t)}{x(t-1)}$ (paydanın sıfır olmadığı girişler için). Homojenlik: $\dfrac{k^2x^2(t)}{k\,x(t-1)} = k\,y(t)$ ✓, her $k \ne 0$ için.`,
              T`Toplamsallık için karşı örnek: $x_1(t) = 1$ ve $x_2(t) = t$, $t = 2$ anında. Toplam giriş: $\frac{(1 + 2)^2}{1 + 1} = \frac92$. Ayrı çıkışların toplamı: $\frac{1^2}{1} + \frac{2^2}{1} = 5$. $\frac92 \ne 5$ ✗. (Uyarı: iki <em>sabit</em> giriş seçersen tesadüfen eşit çıkabilir; karşı örnekte en az bir girişin zamanla değişmesi gerekir.)`],
            ans: T`(a) toplamsal, homojen değil · (b) $y = x^2(t)/x(t-1)$ homojen, toplamsal değil. Not: kitabın verdiği $y = \left[\int_a^b x^2(\tau)d\tau\right]^{1/2}$ örneği yalnızca $k \ge 0$ için homojendir ($k = -1$ için $y$ işaret değiştirmez); bu yüzden burada daha güvenli bir örnek seçildi.` },
          { no: '3.3', pts: 11, ref: '1.60', lesson: '1.10',
            q: T`Lineer ve zamanla değişen öyle bir sistem örneği veriniz ki periyodik bir girişe periyodik olmayan bir çıkış versin.`,
            steps: [T`Aday: $y[n] = n\,x[n]$. Lineer (3. denemenin 3.1 sorusu) ve zamanla değişen.`,
              T`Periyodik giriş: $x[n] = \cos(\pi n) = (-1)^n$, $N = 2$.`,
              T`Çıkış: $y[n] = n(-1)^n = \ldots, -1, 2, -3, 4, \ldots$ Genliği büyüyor, hiçbir $N$ için $y[n+N] = y[n]$ olmaz.`],
            ans: T`$y[n] = n\,x[n]$ ve $x[n] = (-1)^n$. Bir LTI sistem periyodik girişi periyodik tutardı; periyodikliği bozan şey zamanla değişen $n$ çarpanıdır.` }] }
      ]
    }
  ];
})();
