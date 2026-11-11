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
            q: T`(a) Aşağıdaki sinyalin periyodik olduğunu gösteriniz ve temel periyodunu bulunuz.
$$x(t) = \cos(\omega_0 t + \theta)$$
(b), (c) Aşağıdaki sinyaller periyodik midir? Periyodikse temel periyot nedir?
$$\text{(b)}\;\; x(t) = \cos\left(t + \frac{\pi}{4}\right) \qquad\qquad \text{(c)}\;\; x(t) = \sin\frac{2\pi}{3}t$$`,
            hint: T`(a)’da $\cos$’un $2\pi$’de bir tekrar ettiğini kullan: $\omega_0 T = 2\pi m$ olmalı.`,
            steps: [T`(a) Periyodik olması için her $t$ için şu sağlanmalı:
$$\cos\big[\omega_0(t+T) + \theta\big] = \cos(\omega_0 t + \theta)$$`,
              T`Sol taraf $\cos(\omega_0 t + \theta + \omega_0 T)$’dir. Kosinüs ancak açı $2\pi$’nin tam katı kadar artarsa aynı değeri verir:
$$\omega_0 T = 2\pi m \;\;(m \text{ pozitif tam sayı}) \qquad\Longrightarrow\qquad T = m\,\frac{2\pi}{\omega_0}$$`,
              T`En küçük pozitif değer $m = 1$ ile:
$$T_0 = \frac{2\pi}{\omega_0}$$
$\theta$ fazı periyodu etkilemez.`,
              T`(b) $\omega_0 = 1$:
$$T_0 = 2\pi$$
(c) $\omega_0 = \frac{2\pi}{3}$:
$$T_0 = \frac{2\pi}{2\pi/3} = 3$$`],
            ans: T`(a) $T_0 = \frac{2\pi}{\omega_0}$<br>(b) $T_0 = 2\pi$<br>(c) $T_0 = 3$` },
          { no: '1.2', pts: 12, ref: '1.16(d)(g)(h)', lesson: '1.2',
            q: T`Aşağıdaki sinyallerin periyodik olup olmadığını belirleyiniz. Periyodikse temel periyodunu bulunuz.
$$\text{(a)}\;\; x(t) = \cos t + \sin\sqrt{2}\,t \qquad \text{(b)}\;\; x[n] = e^{j(\pi/4)n} \qquad \text{(c)}\;\; x[n] = \cos\frac{1}{4}n$$`,
            hint: T`Ayrık sinyallerde $\Omega_0/2\pi$’nin rasyonel olup olmadığına bak.`,
            steps: [T`(a) Periyotlar ve oranları:
$$T_1 = 2\pi, \qquad T_2 = \frac{2\pi}{\sqrt{2}} = \sqrt{2}\,\pi, \qquad \frac{T_1}{T_2} = \sqrt{2}$$
$\sqrt{2}$ irrasyonel: ortak periyot yok.`,
              T`(b)
$$\Omega_0 = \frac{\pi}{4}, \qquad \frac{\Omega_0}{2\pi} = \frac{1}{8}$$
Rasyonel, periyodik: $N_0 = 8$.`,
              T`(c)
$$\Omega_0 = \frac{1}{4}, \qquad \frac{\Omega_0}{2\pi} = \frac{1}{8\pi}$$
Rasyonel değil: periyodik değil.`],
            ans: T`(a) Periyodik değil<br>(b) $N_0 = 8$<br>(c) Periyodik değil (sürekli $\cos(t/4)$ periyodik olduğu hâlde!)` },
          { no: '1.3', pts: 12, ref: '1.20(a)(b)(c)', lesson: '1.3',
            q: T`Aşağıdaki sinyallerin enerji sinyali mi, güç sinyali mi, yoksa hiçbiri mi olduğunu belirleyiniz.
$$\text{(a)}\;\; x(t) = e^{-at}u(t), \;\; a > 0 \qquad \text{(b)}\;\; x(t) = A\cos(\omega_0 t + \theta) \qquad \text{(c)}\;\; x(t) = t\,u(t)$$`,
            steps: [T`(a)
$$E = \int_{-\infty}^{\infty}|x(t)|^2\,dt = \int_0^\infty e^{-2at}\,dt = \frac{1}{2a} < \infty$$
<strong>Enerji sinyali</strong>.`,
              T`(b) Sinyal $T_0 = \frac{2\pi}{\omega_0}$ ile periyodik. Periyodik sinyalin gücü bir periyot üzerinden hesaplanır:
$$P = \frac{1}{T_0}\int_0^{T_0}A^2\cos^2(\omega_0 t + \theta)\,dt$$
$$= \frac{A^2\omega_0}{2\pi}\int_0^{2\pi/\omega_0}\frac{1}{2}\big[1 + \cos(2\omega_0 t + 2\theta)\big]\,dt = \frac{A^2}{2} < \infty$$
<strong>Güç sinyali</strong>.`,
              T`(c)
$$E = \lim_{T\to\infty}\int_0^{T/2}t^2\,dt = \lim_{T\to\infty}\frac{(T/2)^3}{3} = \infty$$
$$P = \lim_{T\to\infty}\frac{1}{T}\cdot\frac{(T/2)^3}{3} = \infty$$
<strong>Ne enerji ne güç</strong>.`],
            ans: T`(a) Enerji, $E = \frac{1}{2a}$<br>(b) Güç, $P = \frac{A^2}{2}$<br>(c) Hiçbiri<br>Not: periyodik sinyaller genellikle güç sinyalidir.` }] },
        { no: 2, title: 'Temel sinyaller ve sinyal işlemleri', pts: 33, items: [
          { no: '2.1', pts: 15, ref: '1.1', lesson: '1.7',
            q: T`Şekildeki $x(t)$ sinyali için aşağıdaki sinyalleri çiziniz.
$$x(t) = \begin{cases} \frac{3}{4}t, & 0 < t < 4 \\ 0, & \text{diğer} \end{cases}$$
(a) $x(t-2)$<br>(b) $x(2t)$<br>(c) $x(t/2)$<br>(d) $x(-t)$`,
            fig: spec([-2, 6], [-0.4, 3.6], [fn(x11, 'x')], { title: 'x(t): 0 < t < 4 aralığında 0’dan 3’e doğrusal' }),
            hint: T`Kritik noktalar $t_k = 0$ (değer 0) ve $t_k = 4$ (değer 3, sonra düşüş). Her biri için yeni yeri bul.`,
            steps: [T`$x(t) = \frac34 t$, $\;0 < t < 4$. Kritik noktalar: $t = 0$ ve $t = 4$.`,
              T`(a) $x(t-2)$: 2 birim <strong>sağa</strong> kaydır. Rampa $2<t<6$ aralığında, $x = \frac34(t-2)$.`,
              T`(b) $x(2t)$: 2 kat <strong>sıkıştır</strong>. $0 < 2t < 4$ ⇒ $0 < t < 2$, tepe yine 3.`,
              T`(c) $x(t/2)$: 2 kat <strong>genişlet</strong>. $0 < t/2 < 4$ ⇒ $0 < t < 8$.`,
              { h: T`(d) $x(-t)$: dikey eksene göre <strong>ayna</strong>. $-4 < t < 0$, tepe $t = -4$’te.`,
                fig: [spec([-1, 7], [-0.4, 3.6], [fn((t) => x11(t - 2), 'y')], { title: '(a) x(t − 2)' }), spec([-2, 3], [-0.4, 3.6], [fn((t) => x11(2 * t), 'y')], { title: '(b) x(2t)' }),
                  spec([-1, 9], [-0.4, 3.6], [fn((t) => x11(t / 2), 'y')], { title: '(c) x(t/2)' }), spec([-5, 2], [-0.4, 3.6], [fn((t) => x11(-t), 'y')], { title: '(d) x(−t)' })] }],
            ans: T`(a) $2 < t < 6$<br>(b) $0 < t < 2$<br>(c) $0 < t < 8$<br>(d) $-4 < t < 0$<br>Hepsinde tepe değeri 3. Yükseklik değişmez, yalnızca zaman ekseni değişir.` },
          { no: '2.2', pts: 10, ref: '1.30(a)–(d)', lesson: '1.5',
            q: T`Aşağıdaki integralleri hesaplayınız.
$$\text{(a)}\;\; \int_{-1}^{1}(3t^2 + 1)\,\delta(t)\,dt \qquad\qquad \text{(b)}\;\; \int_{1}^{2}(3t^2 + 1)\,\delta(t)\,dt$$
$$\text{(c)}\;\; \int_{-\infty}^{\infty}(t^2 + \cos\pi t)\,\delta(t-1)\,dt \qquad\qquad \text{(d)}\;\; \int_{-\infty}^{\infty}e^{-t}\,\delta(2t-2)\,dt$$`,
            hint: T`Önce impulsun integral aralığının içinde olup olmadığını kontrol et. (d)’de $\delta(at) = \frac{1}{|a|}\delta(t)$.`,
            steps: [T`(a) İmpuls $t = 0$’da, $[-1, 1]$ aralığının içinde:
$$(3t^2 + 1)\,\Big|_{t=0} = 1$$`,
              T`(b) İmpuls $t = 0$’da, ama aralık $[1, 2]$. İmpuls dışarıda kaldığı için sonuç $0$.`,
              T`(c) İmpuls $t = 1$’de:
$$(t^2 + \cos\pi t)\,\Big|_{t=1} = 1 + \cos\pi = 1 - 1 = 0$$`,
              T`(d) Önce impulsu sadeleştir:
$$\delta(2t - 2) = \delta\big(2(t-1)\big) = \frac{1}{2}\,\delta(t-1)$$
$$\int_{-\infty}^{\infty}e^{-t}\cdot\frac{1}{2}\,\delta(t-1)\,dt = \frac{1}{2}\,e^{-1} = \frac{1}{2e}$$`],
            ans: T`(a) $1$<br>(b) $0$<br>(c) $0$<br>(d) $\frac{1}{2e} \approx 0.184$` },
          { no: '2.3', pts: 8, ref: '1.27, 1.53', lesson: '1.5',
            q: T`Aşağıdaki eşitlikleri gösteriniz.
$$\text{(a)}\;\; t\,\delta(t) = 0 \qquad \text{(b)}\;\; \sin t\,\delta(t) = 0 \qquad \text{(c)}\;\; \cos t\,\delta(t-\pi) = -\delta(t-\pi)$$
(d) $\delta(2t)$ ve $\delta[2n]$ neye eşittir?`,
            steps: [T`Kullanılan özellik ($x$, $t_0$’da sürekliyse):
$$x(t)\,\delta(t - t_0) = x(t_0)\,\delta(t - t_0)$$`,
              T`(a), (b)
$$t\,\delta(t) = (0)\,\delta(t) = 0, \qquad \sin t\,\delta(t) = (\sin 0)\,\delta(t) = 0$$`,
              T`(c)
$$\cos t\,\delta(t-\pi) = (\cos\pi)\,\delta(t-\pi) = -\delta(t-\pi)$$`,
              T`(d) Sürekli: genişlik yarıya inince alan da yarıya iner.
$$\delta(2t) = \frac{1}{|2|}\,\delta(t) = \frac{1}{2}\,\delta(t)$$
Ayrık: $\delta[2n]$ yalnızca $2n = 0$, yani $n = 0$’da 1’dir:
$$\delta[2n] = \delta[n]$$`],
            ans: T`(d) $\delta(2t) = \frac12\delta(t)$ ama $\delta[2n] = \delta[n]$. Sürekli ve ayrık impuls bu noktada farklı davranır.` }] },
        { no: 3, title: 'Sistem özellikleri', pts: 33, items: [
          { no: '3.1', pts: 15, ref: '1.33', lesson: '1.11',
            q: T`Bir kondansatörde giriş akım $x(t) = i(t)$, çıkış gerilim $y(t) = v_c(t)$ olsun.<br>(a) Giriş–çıkış ilişkisini yazınız.<br>(b) Sistemin (i) belleksiz, (ii) nedensel, (iii) lineer, (iv) zamanla değişmez, (v) kararlı olup olmadığını belirleyiniz.`,
            hint: T`Kondansatörde $i = C\frac{dv}{dt}$. Bunu $v$ için integralle çöz.`,
            steps: [T`(a) Kondansatör denkleminden ($C$ sabit):
$$i(t) = C\,\frac{dv_c}{dt} \qquad\Longrightarrow\qquad y(t) = \frac{1}{C}\int_{-\infty}^{t}x(\tau)\,d\tau$$`,
              T`(i) Çıkış, girişin geçmiş ve şimdiki bütün değerlerine bağlı: <strong>belleksiz değil</strong> (bellekli).`,
              T`(ii) Gelecek değerler kullanılmıyor ($\tau \le t$): <strong>nedensel</strong>.`,
              T`(iii)
$$x = a_1 x_1 + a_2 x_2 \;\Longrightarrow\; y = \frac{1}{C}\int(a_1 x_1 + a_2 x_2)\,d\tau = a_1 y_1 + a_2 y_2$$
<strong>Lineer</strong>.`,
              T`(iv) $\lambda = \tau - t_0$ değişken değiştirmesiyle:
$$y_1(t) = \frac{1}{C}\int_{-\infty}^{t}x(\tau - t_0)\,d\tau = \frac{1}{C}\int_{-\infty}^{t - t_0}x(\lambda)\,d\lambda = y(t - t_0)$$
<strong>Zamanla değişmez</strong>.`,
              T`(v) Sınırlı giriş $x(t) = k_1 u(t)$ dene:
$$y(t) = \frac{k_1}{C}\int_0^t d\tau = \frac{k_1}{C}\,t\,u(t) = \frac{k_1}{C}\,r(t)$$
Zamanla sınırsız büyür: <strong>kararlı değil</strong>.`],
            ans: T`Bellekli<br>Nedensel<br>Lineer<br>Zamanla değişmez<br>Kararsız (integratör)` },
          { no: '3.2', pts: 9, ref: '1.35, 1.58', lesson: '1.8',
            q: T`(a) Aşağıdaki sistemin lineer olmadığını gösteriniz.
$$y = T\{x\} = x^2$$
(b) Aşağıdaki sistem zamanla değişmez midir?
$$y[n] = x^2[n]$$`,
            steps: [T`(a) Toplam girişin çıkışı:
$$T\{x_1 + x_2\} = (x_1 + x_2)^2 = x_1^2 + x_2^2 + 2x_1 x_2$$`,
              T`Ayrı ayrı çıkışların toplamı:
$$T\{x_1\} + T\{x_2\} = x_1^2 + x_2^2$$
Aradaki fark $2x_1 x_2$: toplamsallık sağlanmıyor, <strong>lineer değil</strong>.`,
              T`(b)
$$\text{Girişi kaydır:}\;\; T\{x[n - n_0]\} = x^2[n - n_0]$$
$$\text{Çıkışı kaydır:}\;\; y[n - n_0] = x^2[n - n_0]$$
Eşit: <strong>zamanla değişmez</strong>.`],
            ans: T`Lineer değil, zamanla değişmez.` },
          { no: '3.3', pts: 9, ref: '1.40', lesson: '1.8',
            q: T`Giriş–çıkış ilişkisi aşağıdaki gibi olan sistem lineer midir? ($a$ ve $b$ sabit)
$$y = ax + b$$`,
            steps: [T`Sıfır giriş: $x = 0$ için $y = b$.`, T`Lineer bir sistem sıfır girişe sıfır çıkışla cevap vermek zorundadır. $b \ne 0$ ise bu sağlanmaz.`, T`$b = 0$ ise $y = ax$ olur ve:
$$a\,(c_1 x_1 + c_2 x_2) = c_1 y_1 + c_2 y_2 \;\;✓$$`],
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
            q: T`Aşağıdaki sinyaller periyodik midir? Periyodikse temel periyot nedir?
$$\text{(a)}\;\; x(t) = \sin^2 t \qquad\qquad \text{(b)}\;\; x(t) = e^{j[(\pi/2)t - 1]}$$`,
            hint: T`(a) $\sin^2\theta = \frac12(1 - \cos 2\theta)$. (b) Üsteki sabiti ayır.`,
            steps: [T`(a) Kareden kurtul:
$$x(t) = \frac{1}{2} - \frac{1}{2}\cos 2t$$
Sabit $\frac12$ her periyoda uyar. $\cos 2t$’nin periyodu:
$$T_0 = \frac{2\pi}{2} = \pi$$`,
              T`(b) Üsteki sabiti ayır:
$$x(t) = e^{-j}\,e^{j(\pi/2)t}$$
$e^{-j}$ yalnızca karmaşık bir sabit. $\omega_0 = \frac{\pi}{2}$:
$$T_0 = \frac{2\pi}{\pi/2} = 4$$`],
            ans: T`(a) $T_0 = \pi$ (dikkat: $\sin t$’nin periyodu $2\pi$, karesininki $\pi$)<br>(b) $T_0 = 4$` },
          { no: '1.2', pts: 12, ref: '1.16(i)(j)', lesson: '1.2',
            q: T`Aşağıdaki diziler periyodik midir? Periyodikse $N_0$’ı bulunuz.
$$\text{(a)}\;\; x[n] = \cos\frac{\pi}{3}n + \sin\frac{\pi}{4}n \qquad\qquad \text{(b)}\;\; x[n] = \cos^2\frac{\pi}{8}n$$`,
            steps: [T`(a) Her terim için $\frac{\Omega}{2\pi}$:
$$\frac{\Omega_1}{2\pi} = \frac{\pi/3}{2\pi} = \frac{1}{6} \;\Rightarrow\; N_1 = 6, \qquad \frac{\Omega_2}{2\pi} = \frac{1}{8} \;\Rightarrow\; N_2 = 8$$`,
              T`İki periyodik dizinin toplamı her zaman periyodiktir (tam sayıların EKOK’u her zaman vardır):
$$N_0 = \text{EKOK}(6, 8) = 24$$`,
              T`(b) Kareden kurtul:
$$\cos^2\frac{\pi}{8}n = \frac{1}{2} + \frac{1}{2}\cos\frac{\pi}{4}n$$
Sabit kısım $N_1 = 1$. İkinci kısım $\frac{\pi/4}{2\pi} = \frac{1}{8}$, yani $N_2 = 8$. Sonuç $N_0 = 8$.`],
            ans: T`(a) $N_0 = 24$<br>(b) $N_0 = 8$` },
          { no: '1.3', pts: 12, ref: '1.20(d)(e)(f)', lesson: '1.3',
            q: T`Aşağıdaki diziler enerji mi, güç mü, hiçbiri mi?
$$\text{(a)}\;\; x[n] = (-0.5)^n u[n] \qquad \text{(b)}\;\; x[n] = u[n] \qquad \text{(c)}\;\; x[n] = 2e^{j3n}$$`,
            steps: [T`(a)
$$E = \sum_{n=0}^{\infty}\big|(-0.5)^n\big|^2 = \sum_{n=0}^\infty 0.25^n = \frac{1}{1 - 0.25} = \frac{4}{3} < \infty$$
<strong>Enerji sinyali</strong>.`,
              T`(b) $-N$ ile $N$ arasında $u[n] = 1$ olan $N + 1$ örnek var:
$$P = \lim_{N\to\infty}\frac{1}{2N+1}\sum_{n=0}^{N}1 = \lim_{N\to\infty}\frac{N+1}{2N+1} = \frac{1}{2}$$
<strong>Güç sinyali</strong>.`,
              T`(c) $|x[n]| = |2e^{j3n}| = 2$:
$$P = \lim_{N\to\infty}\frac{1}{2N+1}\sum_{n=-N}^{N}2^2 = \lim_{N\to\infty}\frac{4(2N+1)}{2N+1} = 4$$
<strong>Güç sinyali</strong>.`],
            ans: T`(a) $E = \frac{4}{3}$<br>(b) $P = \frac{1}{2}$<br>(c) $P = 4$ (dizi periyodik olmasa da gücü sonlu)` }] },
        { no: 2, title: 'Temel sinyaller ve sinyal işlemleri', pts: 33, items: [
          { no: '2.1', pts: 12, ref: '1.2', lesson: '1.7',
            q: T`Şekildeki $x[n]$ için aşağıdaki dizileri çiziniz.<br>(a) $x[n-2]$<br>(b) $x[2n]$<br>(c) $x[-n]$<br>(d) $x[-n+2]$`,
            fig: dspec([-2.6, 6.6], [-0.3, 3.6], [stems(x12, -2, 6)]),
            hint: T`Tablo yöntemi: her $n$ için içerideki indeksi hesapla ve $x$’ten oku. $x[1]=1$, $x[2]=2$, $x[3]=x[4]=3$.`,
            steps: [T`(a) 2 sağa: $n = 3, 4, 5, 6$’da $1, 2, 3, 3$.`, T`(b) $y[n] = x[2n]$: $y[0] = x[0] = 0$, $y[1] = x[2] = 2$, $y[2] = x[4] = 3$. Tek indisli $x[1]$, $x[3]$ kayboldu.`,
              T`(c) Ayna: $n = -1, -2, -3, -4$’te $1, 2, 3, 3$.`,
              { h: T`(d) $x[-(n-2)]$: önce ayna, sonra 2 sağa. $n=1 \to x[1]=1$, $n=0 \to x[2]=2$, $n=-1 \to x[3]=3$, $n=-2 \to x[4]=3$.`,
                fig: [dspec([-1.6, 7.6], [-0.3, 3.6], [stems((n) => x12(n - 2), -1, 7, 'y')], { title: '(a) x[n − 2]' }), dspec([-2.6, 3.6], [-0.3, 3.6], [stems((n) => x12(2 * n), -2, 3, 'y')], { title: '(b) x[2n]' }),
                  dspec([-5.6, 1.6], [-0.3, 3.6], [stems((n) => x12(-n), -5, 1, 'y')], { title: '(c) x[−n]' }), dspec([-3.6, 2.6], [-0.3, 3.6], [stems((n) => x12(2 - n), -3, 2, 'y')], { title: '(d) x[−n + 2]' })] }],
            ans: T`$$\text{(b)}\;\; x[2n] = \{\underbrace{0}_{\uparrow},\, 2,\, 3\}$$
$$\text{(d)}\;\; x[-n+2] = \{3,\, 3,\, 2,\, \underbrace{1}_{n=1}\}, \qquad n = -2, \ldots, 1$$` },
          { no: '2.2', pts: 11, ref: '1.22', lesson: '1.5',
            q: T`Şekildeki $x(t)$ için aşağıdaki sinyalleri çiziniz.
$$\text{(a)}\;\; x(t)\,u(1-t) \qquad \text{(b)}\;\; x(t)\big[u(t) - u(t-1)\big] \qquad \text{(c)}\;\; x(t)\,\delta\!\left(t - \frac{3}{2}\right)$$`,
            fig: spec([-2, 3], [-0.3, 2.5], [fn(x122, 'x')]),
            hint: T`$u(1-t)$, $t<1$ için 1’dir (sola bakan basamak). $u(t) - u(t-1)$, $0<t<1$ penceresidir.`,
            steps: [T`(a) Sola bakan basamak:
$$u(1-t) = \begin{cases} 1, & t < 1 \\ 0, & t > 1 \end{cases}$$
Çarpım, $x$’in $t < 1$ kısmını tutar: rampa ($-1 < t < 0$) ve 1 ($0 < t < 1$).`,
              T`(b) $u(t) - u(t-1)$ yalnızca $0<t\le1$’de 1: geriye $0<t<1$’deki 1 seviyesi kalır.`,
              { h: T`(c) Alanı 2 olan bir impuls kalır:
$$x(t)\,\delta\!\left(t - \frac{3}{2}\right) = x\!\left(\frac{3}{2}\right)\delta\!\left(t - \frac{3}{2}\right) = 2\,\delta\!\left(t - \frac{3}{2}\right)$$`,
                fig: [spec([-2, 3], [-0.3, 2.5], [fn((t) => x122(t) * (t < 1 ? 1 : 0), 'y')], { title: '(a)' }), spec([-2, 3], [-0.3, 2.5], [fn((t) => (t > 0 && t < 1 ? 1 : 0), 'y')], { title: '(b)' }),
                  spec([-2, 3], [-0.3, 2.5], [{ kind: 'impulse', at: 1.5, amp: 2, color: 'y', label: '2δ(t − 3/2)' }], { title: '(c)' })] }],
            ans: T`(c) Bir sinyali $\delta(t-t_0)$ ile çarpmak sinyali yok etmez: yüksekliği (alanı) $x(t_0)$ olan bir impuls bırakır.` },
          { no: '2.3', pts: 10, ref: '1.31', lesson: '1.5',
            q: T`Aşağıdaki sinyallerin birinci türevlerini bulup çiziniz ($a > 0$).
$$\text{(a)}\;\; x(t) = u(t) - u(t-a) \qquad\qquad \text{(b)}\;\; x(t) = t\big[u(t) - u(t-a)\big]$$
$$\text{(c)}\;\; x(t) = \text{sgn}\,t = \begin{cases} 1, & t > 0 \\ -1, & t < 0 \end{cases}$$`,
            hint: T`Her sıçrama, sıçrama miktarı kadar alana sahip bir impuls verir. (b)’de çarpımın türevini al ve $t\delta(t-a) = a\delta(t-a)$ kullan.`,
            steps: [T`(a) $u'(t) = \delta(t)$ olduğundan:
$$x'(t) = \delta(t) - \delta(t-a)$$`,
              T`(b) Çarpımın türevi:
$$x'(t) = \big[u(t) - u(t-a)\big] + t\,\big[\delta(t) - \delta(t-a)\big]$$`,
              T`$t\,\delta(t) = 0\cdot\delta(t) = 0$ ve $t\,\delta(t-a) = a\,\delta(t-a)$ olduğundan:
$$x'(t) = u(t) - u(t-a) - a\,\delta(t-a)$$
Rampa $t = a$’da $a$ yüksekliğinden 0’a düştüğü için $-a\,\delta$ çıkar.`,
              { h: T`(c) Sgn fonksiyonunu basamaklarla yaz ve türev al. $-1$’den $+1$’e sıçrama miktarı 2’dir:
$$\text{sgn}\,t = u(t) - u(-t) \qquad\Longrightarrow\qquad x'(t) = \delta(t) - \big[-\delta(t)\big] = 2\,\delta(t)$$`,
                fig: [spec([-1, 3], [-2.6, 2.6], [fn((t) => (t >= 0 && t < 2 ? 1 : 0), 'h', { fill: false, w: 1.6 }), { kind: 'impulse', at: 0, amp: 2, color: 'y', label: 'δ(t)' }, { kind: 'impulse', at: 2, amp: -2, color: 'y', label: '−aδ(t−a)' }], { title: '(b) x′(t), a = 2', yStep: 1 }),
                  spec([-2, 2], [-1.4, 2.6], [fn((t) => (t >= 0 ? 1 : -1), 'x', { fill: false }), { kind: 'impulse', at: 0, amp: 2, color: 'y', label: '2δ(t)' }], { title: '(c) sgn t ve türevi', yStep: 1 })] }],
            ans: T`(a) $\delta(t) - \delta(t-a)$<br>(b) $u(t) - u(t-a) - a\,\delta(t-a)$<br>(c) $2\,\delta(t)$` }] },
        { no: 3, title: 'Sistem özellikleri', pts: 33, items: [
          { no: '3.1', pts: 13, ref: '1.34', lesson: '1.10',
            q: T`Bir çarpıcı sistem aşağıdaki ilişkiyi gerçekliyor:
$$y(t) = x(t)\cos\omega_c t$$
Sistemin (a) belleksiz, (b) nedensel, (c) lineer, (d) zamanla değişmez, (e) kararlı olup olmadığını belirleyiniz.`,
            steps: [T`(a) Çıkış yalnızca girişin o anki değerine bağlı: <strong>belleksiz</strong>.`, T`(b) Gelecek değer yok: <strong>nedensel</strong>.`,
              T`(c)
$$\big[a_1 x_1 + a_2 x_2\big]\cos\omega_c t = a_1 y_1 + a_2 y_2$$
<strong>Lineer</strong>.`,
              T`(d)
$$y_1(t) = T\{x(t - t_0)\} = x(t - t_0)\cos\omega_c t$$
$$y(t - t_0) = x(t - t_0)\cos\omega_c(t - t_0) \ne y_1(t)$$
<strong>Zamanla değişen</strong>.`,
              T`(e) $|\cos\omega_c t| \le 1$ olduğundan:
$$|y(t)| \le |x(t)|$$
Sınırlı giriş sınırlı çıkış verir: <strong>kararlı</strong>.`],
            ans: T`Belleksiz<br>Nedensel<br>Lineer<br>Zamanla değişen<br>Kararlı` },
          { no: '3.2', pts: 10, ref: '1.36', lesson: '1.10',
            q: T`Birim gecikme elemanı aşağıdaki gibi tanımlanıyor:
$$y[n] = x[n-1]$$
Sistem (a) belleksiz, (b) nedensel, (c) lineer, (d) zamanla değişmez, (e) kararlı mıdır?`,
            steps: [T`(a) $y[n]$, $n - 1$ anındaki girişe bağlı: <strong>bellekli</strong>.`, T`(b) Yalnızca geçmiş: <strong>nedensel</strong>.`, T`(c)
$$a_1 x_1[n-1] + a_2 x_2[n-1] = a_1 y_1[n] + a_2 y_2[n]$$
<strong>Lineer</strong>.`,
              T`(d)
$$y_1[n] = x_1[n-1] = x[n - 1 - n_0] = y[n - n_0]$$
<strong>Zamanla değişmez</strong>.`, T`(e)
$$|x[n]| \le k \;\Longrightarrow\; |y[n]| = |x[n-1]| \le k$$
<strong>Kararlı</strong>.`],
            ans: T`Bellekli<br>Nedensel<br>Lineer<br>Zamanla değişmez<br>Kararlı (en basit LTI sistem)` },
          { no: '3.3', pts: 10, ref: '1.39', lesson: '1.10',
            q: T`Aşağıdaki “sıkıştırıcı” sistem zamanla değişmez midir? ($k_0$ pozitif tam sayı.) Ek olarak lineer ve nedensel midir?
$$y[n] = x[k_0 n]$$`,
            hint: T`Girişi $n_0$ kaydırıp sistemden geçir; çıkışı $n_0$ kaydır. İçerideki ifadeleri karşılaştır.`,
            steps: [T`Girişi kaydır:
$$x_1[n] = x[n - n_0] \;\Longrightarrow\; y_1[n] = x_1[k_0 n] = x[k_0 n - n_0]$$`, T`Çıkışı kaydır:
$$y[n - n_0] = x\big[k_0(n - n_0)\big] = x[k_0 n - k_0 n_0]$$`,
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
            q: T`Şekildeki sinyallerin çift ve tek bileşenlerini bulup çiziniz.
$$\text{(a)}\;\; x(t) = \begin{cases} 0.8t, & 0 < t < 5 \\ 0, & \text{diğer} \end{cases} \qquad\qquad \text{(b)}\;\; x(t) = 4e^{-0.5t}u(t)$$`,
            fig: [spec([-1, 6], [-0.4, 4.6], [fn(x15a, 'x')], { title: '(a) x(t)' }), spec([-1, 6], [-0.4, 4.6], [fn(x15b, 'x')], { title: '(b) x(t) = 4e^(−0.5t)u(t)' })],
            hint: T`Önce $x(-t)$’yi çiz. $t>0$ ve $t<0$ bölgelerinde $x_e = \frac{x(t) + x(-t)}{2}$ ve $x_o = \frac{x(t) - x(-t)}{2}$’yi ayrı ayrı hesapla.`,
            steps: [T`(a) Ayna:
$$x(-t) = \begin{cases} -0.8t, & -5 < t < 0 \\ 0, & \text{diğer} \end{cases}$$`,
              T`Bölge bölge hesapla:
$$x_e(t) = \begin{cases} \frac{0 + (-0.8t)}{2} = -0.4t, & -5 < t < 0 \\ \frac{0.8t + 0}{2} = 0.4t, & 0 < t < 5 \end{cases} \qquad x_o(t) = \begin{cases} \frac{0 - (-0.8t)}{2} = 0.4t, & -5 < t < 0 \\ \frac{0.8t - 0}{2} = 0.4t, & 0 < t < 5 \end{cases}$$`,
              T`Sonuç ($|t| < 5$):
$$x_e(t) = 0.4\,|t|, \qquad x_o(t) = 0.4\,t$$
Uçlarda $x_e = 2$, $x_o = \pm2$.`,
              { h: T`(b) Aynı yolla:
$$x_e(t) = 2e^{-0.5|t|}, \qquad x_o(t) = 2\,\text{sgn}(t)\,e^{-0.5|t|}$$
$t = 0$’da $x_e = 2$; $x_o$ ise $-2$’den $+2$’ye sıçrar.`,
                fig: [spec([-6, 6], [-2.6, 2.6], [fn((t) => (Math.abs(t) < 5 ? 0.4 * Math.abs(t) : 0), 'h')], { title: '(a) xₑ(t)' }), spec([-6, 6], [-2.6, 2.6], [fn((t) => (Math.abs(t) < 5 ? 0.4 * t : 0), 'y')], { title: '(a) xₒ(t)' }),
                  spec([-6, 6], [-2.6, 2.6], [fn((t) => 2 * Math.exp(-0.5 * Math.abs(t)), 'h')], { title: '(b) xₑ(t)' }), spec([-6, 6], [-2.6, 2.6], [fn((t) => Math.sign(t) * 2 * Math.exp(-0.5 * Math.abs(t)), 'y')], { title: '(b) xₒ(t)' })] }],
            ans: T`$$\text{(a)}\;\; x_e(t) = 0.4\,|t|, \quad x_o(t) = 0.4\,t \quad (|t| < 5)$$
$$\text{(b)}\;\; x_e(t) = 2e^{-0.5|t|}, \quad x_o(t) = 2\,\text{sgn}(t)\,e^{-0.5|t|}$$
Kontrol: $t > 0$’da $x_e + x_o = x$, $t < 0$’da $x_e + x_o = 0$ ✓` },
          { no: '1.2', pts: 10, ref: '1.6, 1.7, 1.8(b)', lesson: '1.4',
            q: T`(a) $x(t) = e^{jt}$ sinyalinin çift ve tek bileşenlerini bulunuz.<br>(b) İki çift ya da iki tek sinyalin çarpımının çift, bir çift ile bir tek sinyalin çarpımının tek olduğunu gösteriniz.<br>(c) Tek bir $x(t)$ sinyali için aşağıdakileri gösteriniz.
$$x(0) = 0, \qquad \int_{-a}^{a}x(t)\,dt = 0$$`,
            steps: [T`(a) Euler formülüyle:
$$x_e(t) = \frac{1}{2}\left(e^{jt} + e^{-jt}\right) = \cos t, \qquad x_o(t) = \frac{1}{2}\left(e^{jt} - e^{-jt}\right) = j\sin t$$`,
              T`(b) $x = x_1 x_2$ olsun.<br>• İkisi çift: $\;x(-t) = x_1(-t)\,x_2(-t) = x_1(t)\,x_2(t) = x(t)$ → çift.<br>• İkisi tek: $\;x(-t) = \big[-x_1(t)\big]\big[-x_2(t)\big] = x(t)$ → çift.<br>• Biri çift, biri tek: $\;x(-t) = x_1(t)\big[-x_2(t)\big] = -x(t)$ → tek.`,
              T`(c) Tek sinyalin tanımı $x(-t) = -x(t)$. $t = 0$ koy:
$$x(0) = -x(0) \;\Longrightarrow\; x(0) = 0$$`,
              T`İntegrali ikiye böl ve birinci parçada $t = -\lambda$ koy:
$$\int_{-a}^{a}x\,dt = \int_{-a}^{0}x\,dt + \int_0^a x\,dt$$
$$\int_{-a}^{0}x(t)\,dt = \int_{0}^{a}x(-\lambda)\,d\lambda = -\int_0^a x(\lambda)\,d\lambda$$
İki parça birbirini götürür, toplam $0$.`],
            ans: T`(a) $\cos t$ ve $j\sin t$<br>(c)’nin pratik sonucu: tek bir sinyalin simetrik aralıktaki integrali hesap yapmadan 0’dır.` },
          { no: '1.3', pts: 12, ref: '1.51(a)–(d)', lesson: '1.2',
            q: T`Aşağıdaki sinyaller periyodik midir? Periyodikse temel periyot nedir?
$$\text{(a)}\;\; \cos\left(2t + \frac{\pi}{4}\right) \qquad \text{(b)}\;\; \cos^2 t \qquad \text{(c)}\;\; (\cos 2\pi t)\,u(t) \qquad \text{(d)}\;\; e^{j\pi t}$$`,
            steps: [T`(a) $\omega_0 = 2$:
$$T_0 = \frac{2\pi}{2} = \pi$$`, T`(b) Kareden kurtul:
$$\cos^2 t = \frac{1}{2} + \frac{1}{2}\cos 2t \;\Longrightarrow\; T_0 = \pi$$`,
              T`(c) $t < 0$ için sinyal hep 0, $t > 0$ için salınıyor. Herhangi bir $T > 0$ için $-T < t < 0$ aralığında $x(t) = 0$, ama $x(t+T) = \cos 2\pi(t+T)$ genelde sıfır değil. $x(t+T) = x(t)$ her $t$ için sağlanamaz: <strong>periyodik değil</strong>.`,
              T`(d) $\omega_0 = \pi$:
$$T_0 = \frac{2\pi}{\pi} = 2$$`],
            ans: T`(a) $T_0 = \pi$<br>(b) $T_0 = \pi$<br>(c) Periyodik değil<br>(d) $T_0 = 2$<br>Tuzak (c): periyodik bir sinyali $u(t)$ ile kesmek periyodikliği bozar.` }] },
        { no: 2, title: 'Örnekleme ve ayrık sinyaller', pts: 33, items: [
          { no: '2.1', pts: 11, ref: '1.3', lesson: '1.1',
            q: T`Aşağıdaki sinyal $T_s$ aralıklarla örneklenerek $x[n] = x(nT_s)$ elde ediliyor.
$$x(t) = \begin{cases} 1 - |t|, & -1 \le t \le 1 \\ 0, & \text{diğer} \end{cases}$$
(a) $T_s = 0.25$ s, (b) $T_s = 0.5$ s, (c) $T_s = 1$ s için dizileri bulunuz.`,
            steps: [T`(a) $x[n] = x(n/4)$, $n = -4, \ldots, 4$:
$$\{0,\, 0.25,\, 0.5,\, 0.75,\, \underbrace{1}_{\uparrow},\, 0.75,\, 0.5,\, 0.25,\, 0\}$$`,
              T`(b) $x[n] = x(n/2)$:
$$\{0,\, 0.5,\, \underbrace{1}_{\uparrow},\, 0.5,\, 0\}$$`,
              { h: T`(c) $x[n] = x(n)$: yalnızca $n = 0$’da 1:
$$x[n] = \delta[n]$$`,
                fig: [dspec([-5.6, 5.6], [-0.2, 1.3], [fn((t) => tri(t / 4), 'muted', { fill: false, dash: [4, 4], w: 1.2 }), stems((n) => tri(n / 4), -5, 5, 'x', { labels: false })], { title: '(a) Tₛ = 0.25' }),
                  dspec([-3.6, 3.6], [-0.2, 1.3], [stems((n) => tri(n / 2), -3, 3, 'x')], { title: '(b) Tₛ = 0.5' }), dspec([-3.6, 3.6], [-0.2, 1.3], [stems((n) => tri(n), -3, 3, 'x')], { title: '(c) Tₛ = 1' })] }],
            ans: T`$T_s$ büyüdükçe örnek sayısı azalır; $T_s = 1$’de üçgenin şekli tamamen kaybolur, geriye $\delta[n]$ kalır.` },
          { no: '2.2', pts: 11, ref: '1.4', lesson: '1.6',
            q: T`Şekildeki $x_1[n]$ ve $x_2[n]$ dizileri için aşağıdaki dizileri sayı listesi olarak yazınız.
$$\text{(a)}\;\; y_1[n] = x_1[n] + x_2[n] \qquad \text{(b)}\;\; y_2[n] = 2x_1[n] \qquad \text{(c)}\;\; y_3[n] = x_1[n]\,x_2[n]$$`,
            fig: [dspec([-3.6, 7.6], [-2.6, 3.6], [stems(x14a, -3, 7)], { title: 'x₁[n]' }), dspec([-3.6, 7.6], [-2.6, 3.6], [stems(x14b, -3, 7, 'h')], { title: 'x₂[n]' })],
            hint: T`Noktadan noktaya işlem: aynı $n$’deki değerleri topla veya çarp.`,
            steps: [T`Şekilden oku:<br>• $x_1$: $n = 0, 1, 2, 5, 6$’da $1, 2, 3, 2, 2$<br>• $x_2$: $n = -2, -1, 0, 1, 3$’te $-2, -2, 2, 2, -2$`,
              T`(a) Aynı $n$’deki değerleri topla, $n = -2, \ldots, 6$:
$$-2,\; -2,\; 3,\; 4,\; 3,\; -2,\; 0,\; 2,\; 2$$`,
              T`(b) $x_1$’i 2 ile çarp, $n = 0, \ldots, 6$:
$$2,\; 4,\; 6,\; 0,\; 0,\; 4,\; 4$$`,
              T`(c) Çarpım yalnızca ikisinin de sıfırdan farklı olduğu yerlerde kalır:
$$n = 0: \; 1\cdot 2 = 2, \qquad n = 1: \; 2\cdot 2 = 4$$
($n = 2$’de $x_2 = 0$, $n = 3$’te $x_1 = 0$.)`],
            ans: T`$$y_1[n] = \{-2,\, -2,\, \underbrace{3}_{\uparrow},\, 4,\, 3,\, -2,\, 0,\, 2,\, 2\}$$
$$y_2[n] = \{\underbrace{2}_{\uparrow},\, 4,\, 6,\, 0,\, 0,\, 4,\, 4\}$$
$$y_3[n] = \{\underbrace{2}_{\uparrow},\, 4\}$$` },
          { no: '2.3', pts: 11, ref: '1.23', lesson: '1.6',
            q: T`Şekildeki dizi için aşağıdaki dizileri çiziniz.
$$x[n] = \begin{cases} |n|, & |n| \le 3 \\ 0, & \text{diğer} \end{cases}$$
$$\text{(a)}\;\; x[n]\,u[1-n] \qquad \text{(b)}\;\; x[n]\big\{u[n+2] - u[n]\big\} \qquad \text{(c)}\;\; x[n]\,\delta[n-1]$$`,
            fig: dspec([-4.6, 4.6], [-0.3, 3.6], [stems(x123, -4, 4)]),
            steps: [T`(a) $u[1-n] = 1$ yalnızca $n \le 1$ için. $n = -3, \ldots, 1$ kalır:
$$3,\; 2,\; 1,\; 0,\; 1$$`, T`(b) $u[n+2] - u[n] = 1$ yalnızca $-2 \le n < 0$ için:
$$x[-2] = 2, \qquad x[-1] = 1$$`,
              { h: T`(c)
$$x[n]\,\delta[n-1] = x[1]\,\delta[n-1] = \delta[n-1]$$`, fig: [dspec([-4.6, 3.6], [-0.3, 3.6], [stems((n) => (n <= 1 ? x123(n) : 0), -4, 3, 'y')], { title: '(a)' }), dspec([-3.6, 3.6], [-0.3, 3.6], [stems((n) => (n >= -2 && n < 0 ? x123(n) : 0), -3, 3, 'y')], { title: '(b)' }), dspec([-2.6, 4.6], [-0.3, 3.6], [stems((n) => (n === 1 ? 1 : 0), -2, 4, 'y')], { title: '(c)' })] }],
            ans: T`(b) $2\,\delta[n+2] + \delta[n+1]$<br>(c) $\delta[n-1]$` }] },
        { no: 3, title: 'Sistem özellikleri', pts: 33, items: [
          { no: '3.1', pts: 13, ref: '1.38', lesson: '1.11',
            q: T`Aşağıdaki sistemin (a) belleksiz, (b) nedensel, (c) lineer, (d) zamanla değişmez, (e) kararlı olup olmadığını belirleyiniz.
$$y[n] = n\,x[n]$$`,
            steps: [T`(a) Yalnızca $x[n]$ kullanılıyor: <strong>belleksiz</strong>.<br>(b) Gelecek değer yok: <strong>nedensel</strong>.`,
              T`(c)
$$n\,(a_1 x_1 + a_2 x_2) = a_1 y_1 + a_2 y_2$$
<strong>Lineer</strong>.`,
              T`(d)
$$y_1[n] = T\{x[n - n_0]\} = n\,x[n - n_0]$$
$$y[n - n_0] = (n - n_0)\,x[n - n_0] \ne y_1[n]$$
<strong>Zamanla değişen</strong>.`,
              T`(e) Sınırlı giriş $x[n] = u[n]$ için $y[n] = n\,u[n]$ sınırsız büyür: <strong>kararsız</strong>.`],
            ans: T`Belleksiz<br>Nedensel<br>Lineer<br>Zamanla değişen<br>Kararsız` },
          { no: '3.2', pts: 10, ref: '1.41', lesson: '1.8',
            q: T`Zamanla değişmez olduğu bilinen bir $T$ sistemine verilen girişler ve elde edilen çıkışlar şunlardır:
$$x_1[n] = 2\delta[n-2] \;\longrightarrow\; y_1[n] = \delta[n-2] + 2\delta[n-3]$$
$$x_2[n] = \delta[n+1] \;\longrightarrow\; y_2[n] = 2\delta[n+1] + \delta[n]$$
$$x_3[n] = \delta[n-1] + 2\delta[n-2] \;\longrightarrow\; y_3[n] = 2\delta[n-1] + 3\delta[n-2] + \delta[n-3]$$
Sistem lineer midir?`,
            hint: T`$x_3$’ü $x_1$ ve $x_2$’nin kaydırılmış hâlleri cinsinden yaz. Sistem lineer olsaydı $y_3$ ne olmalıydı?`,
            steps: [T`$x_2[n-2] = \delta[n-1]$ olduğundan:
$$x_3[n] = x_1[n] + x_2[n-2]$$`,
              T`Sistem lineer olsaydı (zamanla değişmezliği de kullanarak):
$$y_3[n] = y_1[n] + y_2[n-2]$$`,
              T`$y_2[n-2] = 2\delta[n-1] + \delta[n-2]$ olduğundan beklenen çıkış:
$$y_3[n] = 2\delta[n-1] + 2\delta[n-2] + 2\delta[n-3]$$`,
              T`Gözlenen çıkış farklı:
$$y_3[n] = 2\delta[n-1] + 3\delta[n-2] + \delta[n-3]$$`],
            ans: T`Sistem <strong>lineer değil</strong>. Tek bir karşı örnek yeterlidir.` },
          { no: '3.3', pts: 10, ref: '1.56', lesson: '1.11',
            q: T`Aşağıdaki hareketli ortalama sisteminin (a) lineer, (b) zamanla değişmez, (c) nedensel olup olmadığını belirleyiniz. Ek olarak kararlı mıdır?
$$y(t) = \frac{1}{T}\int_{t-T/2}^{t+T/2}x(\tau)\,d\tau$$`,
            steps: [T`(a) İntegral lineerdir:
$$\frac{1}{T}\int(a_1 x_1 + a_2 x_2)\,d\tau = a_1 y_1 + a_2 y_2$$
<strong>Lineer</strong>.`,
              T`(b) Girişi kaydır ve $\lambda = \tau - t_0$ koy:
$$\frac{1}{T}\int_{t-T/2}^{t+T/2}x(\tau - t_0)\,d\tau = \frac{1}{T}\int_{t-t_0-T/2}^{t-t_0+T/2}x(\lambda)\,d\lambda = y(t - t_0)$$
<strong>Zamanla değişmez</strong>.`,
              T`(c) Üst sınır $t + T/2 > t$: çıkış, girişin gelecekteki $T/2$’lik kısmını kullanıyor. <strong>Nedensel değil</strong>.`,
              T`(Ek)
$$|x| \le B \;\Longrightarrow\; |y| \le \frac{1}{T}\cdot T\cdot B = B$$
<strong>Kararlı</strong>. $\int_{-\infty}^{t}$’den farkı: sınırlı uzunlukta bir pencere.`],
            ans: T`Lineer<br>Zamanla değişmez<br>Nedensel değil<br>Kararlı` }] }
      ]
    },

    /* ================================================================== */
    {
      id: '4', title: 'Basamakla yazma, karmaşık periyot ve kavram soruları',
      blurb: 'En zor deneme: kitabın tamamlayıcı problemleri. Daha az hazır kalıp, daha çok kavram.',
      questions: [
        { no: 1, title: 'Periyodiklik ve çift/tek', pts: 34, items: [
          { no: '1.1', pts: 12, ref: '1.51(e)–(h)', lesson: '1.2',
            q: T`Aşağıdaki diziler periyodik midir? Periyodikse $N_0$ nedir?
$$\text{(a)}\;\; x[n] = e^{j[(n/4) - \pi]} \qquad\qquad \text{(b)}\;\; x[n] = \cos\left(\frac{\pi n^2}{8}\right)$$
$$\text{(c)}\;\; x[n] = \cos\left(\frac{n}{2}\right)\cos\left(\frac{\pi n}{4}\right)$$
$$\text{(d)}\;\; x[n] = \cos\left(\frac{\pi n}{4}\right) + \sin\left(\frac{\pi n}{8}\right) - 2\cos\left(\frac{\pi n}{2}\right)$$`,
            hint: T`(b)’de $\Omega$ yok: doğrudan $x[n+N] = x[n]$ koşulunu yaz. (c)’de çarpımı toplama çevir.`,
            steps: [T`(a) Sabit çarpanı ayır: $x[n] = e^{-j\pi}\,e^{jn/4}$.
$$\Omega_0 = \frac{1}{4}, \qquad \frac{\Omega_0}{2\pi} = \frac{1}{8\pi} \quad \text{irrasyonel}$$
<strong>Periyodik değil</strong>.`,
              T`(b) $n$ yerine $n + N$ yaz:
$$\cos\frac{\pi(n+N)^2}{8} = \cos\left(\frac{\pi n^2}{8} + \frac{\pi(2nN + N^2)}{8}\right)$$
Her $n$ için ek terim $2\pi$’nin katı olmalı, yani $\frac{2nN + N^2}{16}$ tam sayı olmalı:
$$N = 8: \;\; \frac{16n + 64}{16} = n + 4 \;\;✓ \qquad\qquad N = 4: \;\; \frac{8n + 16}{16} = \frac{n}{2} + 1 \;\;✗$$
($N = 4$ tek $n$’lerde tam sayı vermez.) Sonuç $N_0 = 8$.`,
              T`(c) Çarpımı toplama çevir:
$$\cos A\cos B = \frac{1}{2}\big[\cos(A+B) + \cos(A-B)\big]$$
Frekanslar $\frac12 \pm \frac{\pi}{4}$. İçlerindeki $\frac12$ yüzünden $\frac{\Omega}{2\pi}$ rasyonel değil: <strong>periyodik değil</strong>.`,
              T`(d) Üç terimin periyotları:
$$N_1 = 8, \qquad N_2 = 16, \qquad N_3 = 4 \qquad\Longrightarrow\qquad N_0 = \text{EKOK}(8, 16, 4) = 16$$`],
            ans: T`(a) Periyodik değil<br>(b) $N_0 = 8$<br>(c) Periyodik değil<br>(d) $N_0 = 16$` },
          { no: '1.2', pts: 10, ref: '1.48', lesson: '1.4',
            q: T`Aşağıdaki sinyallerin çift ve tek bileşenlerini bulunuz.
$$\text{(a)}\;\; u(t) \qquad \text{(b)}\;\; \sin\left(\omega_0 t + \frac{\pi}{4}\right) \qquad \text{(c)}\;\; x[n] = e^{j(\Omega_0 n + \pi/2)} \qquad \text{(d)}\;\; \delta[n]$$`,
            steps: [T`(a)
$$x_e(t) = \frac{1}{2}, \qquad x_o(t) = \frac{1}{2}\,\text{sgn}\,t$$`,
              T`(b) Toplam formülüyle aç:
$$\sin\left(\omega_0 t + \frac{\pi}{4}\right) = \frac{1}{\sqrt{2}}\sin\omega_0 t + \frac{1}{\sqrt{2}}\cos\omega_0 t$$
$$x_e(t) = \frac{1}{\sqrt{2}}\cos\omega_0 t, \qquad x_o(t) = \frac{1}{\sqrt{2}}\sin\omega_0 t$$`,
              T`(c) $e^{j\pi/2} = j$ olduğundan:
$$x[n] = j\,(\cos\Omega_0 n + j\sin\Omega_0 n) = j\cos\Omega_0 n - \sin\Omega_0 n$$
$$x_e[n] = j\cos\Omega_0 n, \qquad x_o[n] = -\sin\Omega_0 n$$`,
              T`(d) $\delta[-n] = \delta[n]$, yani zaten çift:
$$x_e[n] = \delta[n], \qquad x_o[n] = 0$$`],
            ans: T`Kısayol: önce sinüs/kosinüs ya da Euler ile aç, sonra cos’lu terimleri çift, sin’li terimleri tek parçaya ayır.` },
          { no: '1.3', pts: 12, ref: '1.11, 1.13', lesson: '1.2',
            q: T`(a) Aşağıdaki dizinin ancak $\Omega_0/2\pi$ rasyonel ise periyodik olduğunu gösteriniz.
$$x[n] = e^{j\Omega_0 n}$$
(b) Aşağıdaki sinyal $T_s$ aralıklarla örnekleniyor. $x[n] = x(nT_s)$’nin periyodik olması için $T_s$ ne olmalı? $T_s = 0.1\pi$ s için $N_0$ kaçtır?
$$x(t) = \cos 15t$$`,
            steps: [T`(a) Periyodiklik koşulundan:
$$e^{j\Omega_0(n+N)} = e^{j\Omega_0 n} \;\Longrightarrow\; e^{j\Omega_0 N} = 1 \;\Longrightarrow\; \Omega_0 N = 2\pi m \;\Longrightarrow\; \frac{\Omega_0}{2\pi} = \frac{m}{N}$$
Yani $\frac{\Omega_0}{2\pi}$ rasyonel olmalı.`,
              T`(b) Örneklenmiş dizi $x[n] = \cos(15T_s n)$, yani $\Omega_0 = 15T_s$. Sürekli periyot $T_0 = \frac{2\pi}{15}$ olmak üzere koşul:
$$\frac{15T_s}{2\pi} = \frac{T_s}{T_0} = \frac{m}{N_0} \quad \text{rasyonel}$$
Yani örnekleme aralığının sinyalin periyoduna oranı rasyonel olmalı.`,
              T`$T_s = 0.1\pi$ için:
$$\frac{T_s}{T_0} = \frac{\pi/10}{2\pi/15} = \frac{15}{20} = \frac{3}{4} \;\Longrightarrow\; N_0 = 4 \;\; (m = 3)$$
Kontrol: $x[n] = \cos(1.5\pi n)$ ve $\frac{1.5\pi}{2\pi} = \frac34$ ✓`],
            ans: T`(b) $T_s/T_0$ rasyonel olmalı; $T_s = 0.1\pi$ için $N_0 = 4$ (4 örnek = sürekli sinyalin 3 periyodu).` }] },
        { no: 2, title: 'Basamak ve impulsla ifade, integraller', pts: 33, items: [
          { no: '2.1', pts: 11, ref: '1.46', lesson: '1.5',
            q: T`Şekildeki sinyalleri birim basamak fonksiyonlarıyla ifade ediniz.`,
            fig: [spec([-1.5, 3.5], [-0.3, 1.4], [fn((t) => (t > 0 && t < 2 ? t / 2 : 0), 'x')], { title: '(a)' }), spec([-1.5, 4.5], [-0.3, 3.5], [fn((t) => (t > -1 && t < 0 ? 1 : t >= 0 && t < 1 ? 3 : t >= 1 && t < 2 ? 2 : t >= 2 && t < 3 ? 1 : 0), 'x')], { title: '(b)' })],
            hint: T`(a)’da bir rampa parçasını bir pencereyle çarp. (b)’de her sıçramayı sıçrama miktarı kadar bir basamakla yaz.`,
            steps: [T`(a) $0 < t < 2$’de $x = \frac{t}{2}$. Bu parçayı $u(t) - u(t-2)$ penceresiyle çarp:
$$x(t) = \frac{t}{2}\big[u(t) - u(t-2)\big]$$`,
              T`(b) Sıçramalar:<br>• $t = -1$’de $0 \to 1$: $+1$<br>• $t = 0$’da $1 \to 3$: $+2$<br>• $t = 1$’de $3 \to 2$: $-1$<br>• $t = 2$’de $2 \to 1$: $-1$<br>• $t = 3$’te $1 \to 0$: $-1$`],
            ans: T`$$\text{(a)}\;\; x(t) = \frac{t}{2}\big[u(t) - u(t-2)\big]$$
$$\text{(b)}\;\; x(t) = u(t+1) + 2u(t) - u(t-1) - u(t-2) - u(t-3)$$
Kontrol: katsayıların toplamı $1 + 2 - 1 - 1 - 1 = 0$, çünkü sinyal sonunda 0’a dönüyor.` },
          { no: '2.2', pts: 11, ref: '1.47', lesson: '1.6',
            q: T`Şekildeki dizileri birim basamak dizileriyle ifade ediniz.`,
            fig: [dspec([-2.6, 8.6], [-0.3, 1.4], [stems((n) => (n >= 0 && n <= 6 ? 1 : 0), -2, 8, 'x', { labels: false })], { title: '(a) n = 0 … N (burada N = 6)' }), dspec([-5.6, 3.6], [-1.4, 0.4], [stems((n) => (n <= -1 ? -1 : 0), -5, 3, 'x', { labels: false })], { title: '(b) n ≤ −1 için −1' }), dspec([-4.6, 5.6], [-0.3, 1.4], [stems((n) => (n >= -2 && n <= 3 ? 1 : 0), -4, 5, 'x', { labels: false })], { title: '(c)' })],
            steps: [T`(a) $n = 0$’da başlar, $n = N$’de biter. Bitişte $N + 1$’e dikkat: ayrık zamanda son örnek dahildir.
$$x[n] = u[n] - u[n - (N+1)]$$`,
              T`(b) $u[-n-1]$, $\;-n - 1 \ge 0 \iff n \le -1$ için 1’dir. Değer $-1$ olduğu için:
$$x[n] = -u[-n-1]$$`,
              T`(c) $n = -2, \ldots, 3$ aralığında 1:
$$x[n] = u[n+2] - u[n-4]$$`],
            ans: T`(a) $u[n] - u[n-(N+1)]$<br>(b) $-u[-n-1]$<br>(c) $u[n+2] - u[n-4]$` },
          { no: '2.3', pts: 11, ref: '1.55', lesson: '1.5',
            q: T`Aşağıdaki ifadeleri hesaplayınız.
$$\text{(a)}\;\; \int_{-\infty}^{t}(\cos\tau)\,u(\tau)\,d\tau \qquad\qquad \text{(b)}\;\; \int_{-\infty}^{t}(\cos\tau)\,\delta(\tau)\,d\tau$$
$$\text{(c)}\;\; \int_{-\infty}^{\infty}(\cos t)\,u(t-1)\,\delta(t)\,dt \qquad\qquad \text{(d)}\;\; \int_0^{2\pi}t\sin\frac{t}{2}\;\delta(\pi - t)\,dt$$`,
            hint: T`(a) ve (b)’nin sonucu bir sayı değil, $t$’nin fonksiyonu. (d)’de $\delta(\pi - t) = \delta(t - \pi)$ (impuls çift).`,
            steps: [T`(a) $u(\tau)$ integrali $\tau > 0$’a kısıtlar. $t < 0$ için sonuç 0, $t > 0$ için:
$$\int_0^t\cos\tau\,d\tau = \sin t \qquad\Longrightarrow\qquad \sin t\,u(t)$$`,
              T`(b) Önce sadeleştir:
$$\cos\tau\,\delta(\tau) = \cos 0\,\delta(\tau) = \delta(\tau)$$
$$\int_{-\infty}^{t}\delta(\tau)\,d\tau = u(t)$$
Yani $t > 0$ için 1, $t < 0$ için 0 ($t = 0$’da tanımsız).`,
              T`(c) İmpuls $t = 0$’ı seçer:
$$\cos 0\cdot u(0 - 1) = 1\cdot u(-1) = 0$$`,
              T`(d) $\delta(\pi - t) = \delta(t - \pi)$ ve $\pi \in [0, 2\pi]$:
$$t\sin\frac{t}{2}\,\Big|_{t=\pi} = \pi\sin\frac{\pi}{2} = \pi$$`],
            ans: T`(a) $\sin t\,u(t)$<br>(b) $u(t)$<br>(c) $0$<br>(d) $\pi$` }] },
        { no: 3, title: 'Sistem özellikleri: kavram', pts: 33, items: [
          { no: '3.1', pts: 11, ref: '1.57', lesson: '1.10',
            q: T`Aşağıdaki ideal örnekleyici sistem (a) lineer, (b) zamanla değişmez midir?
$$y(t) = \sum_{k=-\infty}^{\infty}x(t)\,\delta(t - kT_s)$$`,
            steps: [T`Önce sadeleştir. Girişin $kT_s$ anlarındaki değerleri, impuls dizisinin ağırlıkları olur:
$$x(t)\,\delta(t - kT_s) = x(kT_s)\,\delta(t - kT_s) \qquad\Longrightarrow\qquad y(t) = \sum_k x(kT_s)\,\delta(t - kT_s)$$`,
              T`(a) $x$, girişten bağımsız $p(t) = \sum_k\delta(t - kT_s)$ fonksiyonuyla çarpılıyor:
$$(a_1 x_1 + a_2 x_2)\,p = a_1 y_1 + a_2 y_2$$
<strong>Lineer</strong>.`,
              T`(b) Girişi $t_0$ kadar kaydır (örneğin $t_0 = T_s/2$) ve çıkışı kaydır:
$$y_1(t) = \sum_k x(kT_s - t_0)\,\delta(t - kT_s)$$
$$y(t - t_0) = \sum_k x(kT_s)\,\delta(t - t_0 - kT_s)$$
İmpulsların yerleri farklı ($kT_s$ ile $kT_s + t_0$): <strong>zamanla değişen</strong>.`],
            ans: T`Lineer, zamanla değişen. (Örnekleme anları sabittir: girişi kaydırsan da ızgara kaymaz.)` },
          { no: '3.2', pts: 11, ref: '1.42, 1.59', lesson: '1.8',
            q: T`Lineerliğin iki koşulunun birbirinden bağımsız olduğunu örneklerle gösteriniz.<br>(a) Aşağıdaki sistemin toplamsal ama homojen olmadığını gösteriniz ($^*$: karmaşık eşlenik).
$$y[n] = x^*[n]$$
(b) Homojen ama toplamsal olmayan bir sistem bulunuz.`,
            steps: [T`(a) Toplamsallık:
$$(x_1 + x_2)^* = x_1^* + x_2^* \;\;✓$$
Homojenlik, karmaşık bir $a$ için:
$$T\{ax\} = (ax)^* = a^* x^* = a^* y \ne a\,y \;\;✗$$
Örneğin $a = j$ için $-jy \ne jy$.`,
              T`(b) Örnek (paydanın sıfır olmadığı girişler için):
$$y(t) = \frac{x^2(t)}{x(t-1)}$$
Homojenlik, her $k \ne 0$ için:
$$\frac{k^2 x^2(t)}{k\,x(t-1)} = k\,y(t) \;\;✓$$`,
              T`Toplamsallık için karşı örnek: $x_1(t) = 1$ ve $x_2(t) = t$, $t = 2$ anında.
$$\text{Toplam giriş:}\;\; \frac{(1 + 2)^2}{1 + 1} = \frac{9}{2}, \qquad \text{Ayrı çıkışların toplamı:}\;\; \frac{1^2}{1} + \frac{2^2}{1} = 5$$
$\frac{9}{2} \ne 5$ ✗. (Uyarı: iki <em>sabit</em> giriş seçersen tesadüfen eşit çıkabilir; karşı örnekte en az bir girişin zamanla değişmesi gerekir.)`],
            ans: T`(a) Toplamsal, homojen değil<br>(b) $y = x^2(t)/x(t-1)$ homojen, toplamsal değil<br>Not: kitabın verdiği $y = \left[\int_a^b x^2(\tau)d\tau\right]^{1/2}$ örneği yalnızca $k \ge 0$ için homojendir ($k = -1$ için $y$ işaret değiştirmez); bu yüzden burada daha güvenli bir örnek seçildi.` },
          { no: '3.3', pts: 11, ref: '1.60', lesson: '1.10',
            q: T`Lineer ve zamanla değişen öyle bir sistem örneği veriniz ki periyodik bir girişe periyodik olmayan bir çıkış versin.`,
            steps: [T`Aday sistem, lineer (3. denemenin 3.1 sorusu) ve zamanla değişen:
$$y[n] = n\,x[n]$$`,
              T`Periyodik giriş ($N = 2$):
$$x[n] = \cos(\pi n) = (-1)^n$$`,
              T`Çıkış:
$$y[n] = n\,(-1)^n = \ldots,\, -1,\, 2,\, -3,\, 4,\, \ldots$$
Genliği büyüyor, hiçbir $N$ için $y[n+N] = y[n]$ olmaz.`],
            ans: T`$y[n] = n\,x[n]$ ve $x[n] = (-1)^n$. Bir LTI sistem periyodik girişi periyodik tutardı; periyodikliği bozan şey zamanla değişen $n$ çarpanıdır.` }] }
      ]
    },

    /* ================================================================== */
    {
      id: '5', title: 'Karma sorular: periyot ve sistem özellikleri tek soruda',
      source: 'Bu denemenin soruları sitenin kendi sorularıdır: Schaum 1.16 (periyot) ile 1.33–1.60 (sistem özellikleri) problemlerinin birleştirilmiş, sınav tipi hâli.',
      blurb: 'Hocanın en olası tarzı: bir giriş sinyali ve bir sistem verilir; temel periyot, lineerlik, ötelemeyle değişmezlik, nedensellik, kararlılık ve çıkışın periyodikliği aynı soruda sorulur. Her ana soru farklı bir “profil” taşır: biri her şeye evet, biri zamanla değişen ve nedensel olmayan, biri kararsız. Rastgele üretilen benzerleri için Antrenman sayfasındaki “Sınav tipi karma soru” modunu kullan.',
      questions: [
        { no: 1, title: 'Sürekli zaman: gecikmeli toplayıcı', pts: 33,
          h: T`Aşağıdaki $x(t)$ sinyali, verilen sisteme uygulanıyor.
$$x(t) = 2\cos(3t) + \sin\left(5t - \frac{\pi}{4}\right), \qquad y(t) = x(t-1) + 3x(t)$$`, items: [
          { no: '1.1', pts: 7, lesson: '1.2', q: T`$x(t)$ periyodik midir? Temel periyodu nedir?`,
            steps: [T`Periyotlar ve oranları:
$$T_1 = \frac{2\pi}{3}, \qquad T_2 = \frac{2\pi}{5}, \qquad \frac{T_1}{T_2} = \frac{5}{3}$$
Rasyonel: periyodik.`, T`$3T_1 = 5T_2$ olduğundan:
$$T_0 = 3\cdot\frac{2\pi}{3} = 2\pi$$
Kısa yol: $\text{EBOB}(3, 5) = 1$, $T_0 = 2\pi$. Faz $-\frac{\pi}{4}$ ve genlik 2 periyodu etkilemez.`],
            ans: T`$T_0 = 2\pi$` },
          { no: '1.2', pts: 5, lesson: '1.8', q: T`Sistem lineer midir?`,
            steps: [T`$x = a x_1 + b x_2$ girişini kurala koy:
$$y(t) = \big[a x_1 + b x_2\big](t-1) + 3\big[a x_1 + b x_2\big](t)$$
$$= a\big[x_1(t-1) + 3x_1(t)\big] + b\big[x_2(t-1) + 3x_2(t)\big] = a y_1 + b y_2$$`], ans: T`Lineer.` },
          { no: '1.3', pts: 5, lesson: '1.10', q: T`Sistem ötelemeyle (zamanla) değişmez midir?`,
            steps: [T`Girişi kaydır:
$$T\{x(t - t_0)\} = x(t - 1 - t_0) + 3x(t - t_0)$$`, T`Çıkışı kaydır:
$$y(t - t_0) = x(t - t_0 - 1) + 3x(t - t_0)$$
İkisi aynı.`], ans: T`Zamanla değişmez (kuralda $x$’in dışında açık $t$ yok, katsayılar sabit).` },
          { no: '1.4', pts: 5, lesson: '1.9', q: T`Sistem nedensel midir? Bellekli midir?`,
            steps: [T`Argümanlar $t-1$ ve $t$, ikisi de $\le t$: nedensel. $t-1$ geçmişe baktığı için bellekli.`], ans: T`Nedensel, bellekli.` },
          { no: '1.5', pts: 5, lesson: '1.11', q: T`Sistem kararlı mıdır?`,
            steps: [T`$$|x(t)| \le B \quad\Longrightarrow\quad |y(t)| \le |x(t-1)| + 3|x(t)| \le B + 3B = 4B$$`], ans: T`Kararlı.` },
          { no: '1.6', pts: 6, lesson: '1.10', q: T`Çıkış $y(t)$ periyodik midir? Periyodikse periyodu nedir?`,
            hint: T`Sistem zamanla değişmez. $x(t + T_0) = x(t)$ ise $y(t + T_0)$ nedir?`,
            steps: [T`$x$, $2\pi$ ile periyodik olduğundan:
$$y(t + 2\pi) = x(t + 2\pi - 1) + 3x(t + 2\pi) = x(t-1) + 3x(t) = y(t)$$
Yani $y$ de $2\pi$ ile periyodik.`,
              T`Daha küçük bir periyot olabilir mi? Çıkışta yine $3$ ve $5$ frekanslı bileşenler var (sistem onları silmiyor, yalnızca genlik ve fazlarını değiştiriyor), bu yüzden temel periyot yine $2\pi$.`,
              T`<strong>Genel kural:</strong> Zamanla değişmez <em>her</em> sistem (lineer olmasa bile) $T_0$ periyotlu bir girişe $T_0$ ile periyodik bir çıkış verir:
$$y(t + T_0) = T\{x(t + T_0)\} = T\{x(t)\} = y(t)$$`],
            ans: T`Periyodik, $T_0 = 2\pi$.` }] },
        { no: 2, title: 'Sürekli zaman: zaman sıkıştırıcı', pts: 33,
          h: T`Aşağıdaki $x(t)$ sinyali, verilen sisteme uygulanıyor.
$$x(t) = \cos\left(\frac{\pi}{2}t\right) + \cos\left(\frac{\pi}{3}t\right), \qquad y(t) = x(2t)$$`, items: [
          { no: '2.1', pts: 7, lesson: '1.2', q: T`$x(t)$’nin temel periyodu nedir?`,
            steps: [T`Periyotlar ve oranları:
$$T_1 = \frac{2\pi}{\pi/2} = 4, \qquad T_2 = \frac{2\pi}{\pi/3} = 6, \qquad \frac{T_1}{T_2} = \frac{2}{3}$$
Rasyonel.`, T`$3T_1 = 2T_2$ olduğundan:
$$T_0 = \text{EKOK}(4, 6) = 12$$`], ans: T`$T_0 = 12$` },
          { no: '2.2', pts: 5, lesson: '1.8', q: T`Sistem lineer midir?`,
            steps: [T`$$T\{a x_1 + b x_2\} = a x_1(2t) + b x_2(2t) = a y_1 + b y_2$$`], ans: T`Lineer.` },
          { no: '2.3', pts: 6, lesson: '1.10', q: T`Sistem ötelemeyle değişmez midir?`,
            steps: [T`Girişi kaydır:
$$x_1(t) = x(t - t_0) \;\Longrightarrow\; y_1(t) = x_1(2t) = x(2t - t_0)$$`, T`Çıkışı kaydır:
$$y(t - t_0) = x\big(2(t - t_0)\big) = x(2t - 2t_0)$$`, T`$t_0 \ne 2t_0$: farklı.`],
            ans: T`Zamanla değişen. (Kaydırma, sıkıştırma yüzünden yarıya iniyor.)` },
          { no: '2.4', pts: 5, lesson: '1.9', q: T`Sistem nedensel midir?`,
            steps: [T`$t = 1$ için $y(1) = x(2)$: gelecekteki giriş.`], ans: T`Nedensel değil. (Not: $t<0$ için $2t < t$, geçmişe bakıyor; ama tek bir $t$ bile gelecek kullanırsa nedensel değildir.)` },
          { no: '2.5', pts: 4, lesson: '1.11', q: T`Sistem kararlı mıdır?`, steps: [T`$|y(t)| = |x(2t)| \le B$.`], ans: T`Kararlı.` },
          { no: '2.6', pts: 6, lesson: '1.7', q: T`Çıkış periyodik midir? Periyodu nedir?`,
            hint: T`$y(t)$’yi açıkça yaz.`,
            steps: [T`Çıkışı açıkça yaz:
$$y(t) = x(2t) = \cos(\pi t) + \cos\left(\frac{2\pi}{3}t\right)$$`, T`Periyotlar:
$$T_1 = 2, \qquad T_2 = 3 \qquad\Longrightarrow\qquad T_0 = \text{EKOK}(2, 3) = 6$$`,
              T`Sistem zamanla değişen olduğu halde çıkış periyodik çıktı: zaman sıkıştırması periyodu yarıya indirir ($12 \to 6$). Zamanla değişen sistemlerde periyodiklik <em>garanti değildir</em>, ama bu örnekte korunuyor.`],
            ans: T`Periyodik, $T_0 = 6$ (girişin periyodunun yarısı).` }] },
        { no: 3, title: 'Ayrık zaman: zamanla büyüyen kazanç', pts: 34,
          h: T`Aşağıdaki $x[n]$ dizisi, verilen sisteme uygulanıyor.
$$x[n] = \cos\left(\frac{\pi}{4}n\right) + \sin\left(\frac{\pi}{6}n\right), \qquad y[n] = n\,x[n-1]$$`, items: [
          { no: '3.1', pts: 8, lesson: '1.2', q: T`$x[n]$ periyodik midir? Temel periyodu nedir?`,
            steps: [T`Her terim için $\frac{\Omega}{2\pi}$:
$$\frac{\pi/4}{2\pi} = \frac{1}{8} \;\Rightarrow\; N_1 = 8, \qquad \frac{\pi/6}{2\pi} = \frac{1}{12} \;\Rightarrow\; N_2 = 12$$`, T`$$N_0 = \text{EKOK}(8, 12) = 24$$`], ans: T`$N_0 = 24$` },
          { no: '3.2', pts: 5, lesson: '1.8', q: T`Sistem lineer midir?`,
            steps: [T`$n$ girişten bağımsız bir katsayıdır:
$$n\,\big[a x_1 + b x_2\big][n-1] = a\,n\,x_1[n-1] + b\,n\,x_2[n-1] = a y_1 + b y_2$$`], ans: T`Lineer.` },
          { no: '3.3', pts: 6, lesson: '1.10', q: T`Sistem ötelemeyle değişmez midir?`,
            steps: [T`Girişi kaydır:
$$T\{x[n - n_0]\} = n\,x[n - 1 - n_0]$$`, T`Çıkışı kaydır:
$$y[n - n_0] = (n - n_0)\,x[n - n_0 - 1]$$`, T`Katsayılar farklı: $n \ne n - n_0$.`], ans: T`Zamanla değişen (açık $n$ çarpanı).` },
          { no: '3.4', pts: 4, lesson: '1.9', q: T`Sistem nedensel midir?`, steps: [T`Tek argüman $n-1 < n$.`], ans: T`Nedensel (ve bellekli).` },
          { no: '3.5', pts: 5, lesson: '1.11', q: T`Sistem kararlı mıdır?`,
            steps: [T`Karşı örnek: $x[n] = 1$ (sınırlı) ⇒ $y[n] = n$, sınırsız büyür.`], ans: T`Kararsız.` },
          { no: '3.6', pts: 6, lesson: '1.10', q: T`Bu girişe karşılık çıkış periyodik midir?`,
            steps: [T`$x$, 24 ile periyodik olduğundan:
$$y[n + 24] = (n + 24)\,x[n + 23] = (n + 24)\,x[n-1]$$
$$y[n] = n\,x[n-1]$$
$x[n-1] \ne 0$ olan $n$’lerde ikisi farklı.`,
              T`Genlik $n$ ile büyüdüğü için hiçbir $N$ için $y[n+N] = y[n]$ olamaz.`],
            ans: T`Periyodik değil. Periyodikliği bozan, zamanla değişen $n$ çarpanı. (Zamanla değişmez bir sistem bunu yapamazdı.)` }] }
      ]
    }
  ];
})();
