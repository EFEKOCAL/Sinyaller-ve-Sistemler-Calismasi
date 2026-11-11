/*
 * Bölüm 1 · Sinyaller (2): 1.5 Temel sürekli sinyaller · 1.6 Temel ayrık sinyaller · 1.7 Sinyal işlemleri
 * Kaynak: Ömer Akgün, Sinyaller ve Sistemler ders notları, s. 28–53
 */
(function () {
  'use strict';
  const SS = window.SS;
  SS.lessons = SS.lessons || [];
  const T = String.raw;
  const fn = (f, color, o) => Object.assign({ kind: 'fn', f, color: color || 'x', fill: true, alpha: 0.12, n: 2000 }, o || {});
  const stems = (f, a, b, color, o) => () => { const n = [], v = []; for (let k = a; k <= b; k++) { n.push(k); v.push(f(k)); } return Object.assign({ kind: 'stem', n, v, color: color || 'x', labels: true }, o || {}); };
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 170, xLabel: 't', layers: layers.map((l) => (typeof l === 'function' ? l() : l)) }, o || {});
  const u = (t) => (t >= 0 ? 1 : 0);
  const tri = (t) => (Math.abs(t) < 1 ? 1 - Math.abs(t) : 0);
  const xs50 = (t) => (t > 0 && t < 1 ? 3 * t : t >= 1 && t < 2 ? 3 : 0);
  const xs47 = (t) => (t > -1 && t < 0 ? -1 : t >= 0 && t < 2 ? 1 - t : 0);

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.5', chap: 's', title: 'Temel sürekli sinyaller', pages: 's. 28–40',
    sub: 'u(t), δ(t), r(t), Π, Λ, üstel ve sinüs',
    lead: 'Karmaşık sinyaller birkaç temel parçadan kurulur. Bu dersteki parçalar dersin geri kalanında her yerde karşına çıkacak, özellikle $\\delta(t)$.',
    goals: ['$u$, $\\delta$, $r$ arasındaki türev zinciri', 'Elek (sifting) özelliğiyle integral almak', '$\\Pi$ ve $\\Lambda$’yı kaydırıp ölçeklemek', 'Darbeyi basamaklarla, üçgeni rampalarla yazmak'],
    blocks: [
      { t: 'h', h: 'Birim basamak u(t)', src: 's. 28' },
      { t: 'def', h: T`$$u(t) = \begin{cases} 1 & t > 0 \\ 0 & t < 0 \end{cases}$$
<strong>$u(t)$ ile çarpmak = $t=0$’da açılan bir anahtar.</strong> Bir $x(t)$ sinyalini $u(t)$ ile çarptığında sinyalin sağ tarafı ($t>0$) aynen kalır, sol tarafı ($t<0$) silinip 0 olur:
$$x(t)\,u(t) = \begin{cases} x(t) & t > 0 \\ 0 & t < 0 \end{cases}$$
<strong>Neden?</strong> Her $t$ anında iki sayıyı çarpıyorsun:<br>
• $t > 0$ iken $u(t) = 1$ olduğu için $x(t)\cdot 1 = x(t)$, yani sinyal olduğu gibi geçer (anahtar <em>açık</em>).<br>
• $t < 0$ iken $u(t) = 0$ olduğu için $x(t)\cdot 0 = 0$, yani sinyal kesilir (anahtar <em>kapalı</em>).<br>
<strong>Örnek:</strong> $\cos t$ her yerde salınır. $\cos t\cdot u(t)$ ise $t<0$’da 0, $t>0$’da $\cos t$ olur, yani salınım $t=0$’da başlar. Aşağıdaki şekilde kesikli çizgi $x(t)$, dolu çizgi $x(t)u(t)$.<br>
<strong>Kaydırılmış hâli:</strong> $x(t)\,u(t-a)$ sinyali, anahtarı $t = a$’da açar. $t<a$ kısmı 0 olur, $t>a$ kısmı aynen kalır.` },
      { t: 'fig', fig: [spec([-3, 4], [-0.3, 1.4], [fn(u, 'x')], { title: 'u(t)' }), spec([-3, 4], [-1.2, 1.6], [fn((t) => Math.sin(1.6 * t) * 0.6 + 0.5 + 0.2 * Math.cos(3 * t), 'muted', { fill: false, dash: [5, 4], w: 1.4 }), fn((t) => (t >= 0 ? Math.sin(1.6 * t) * 0.6 + 0.5 + 0.2 * Math.cos(3 * t) : 0), 'x')], { title: 'x(t)·u(t): t<0 kısmı silinir' })] },

      { t: 'h', h: 'Birim impuls δ(t)', src: 's. 29–30' },
      { t: 'idea', h: T`$\delta(t)$ “sonsuz ince, sonsuz yüksek, alanı 1 olan darbe”dir. Tek başına bir fonksiyon gibi değil, <strong>integralin içinde</strong> ne yaptığıyla tanımlanır: başka bir fonksiyonla çarpılıp integrali alındığında yalnızca $t=0$ noktasındaki değeri “süzer”. Aşağıdaki laboratuvarın ilk sekmesinde darbenin limit olarak nasıl $\delta$’ya dönüştüğünü görebilirsin.` },
      { t: 'def', title: 'Tanım ve özellikler', h: T`$$\delta(t) = 0 \;(t\ne0), \qquad \int_{-\infty}^{\infty}\delta(t)\,dt = 1$$
$$\text{Elek özelliği:}\quad \int_{-\infty}^{\infty}\phi(t)\,\delta(t-a)\,dt = \phi(a)$$
$$\delta(at) = \frac{1}{|a|}\delta(t), \qquad \delta(-t) = \delta(t), \qquad x(t)\delta(t) = x(0)\delta(t), \qquad x(t)\delta(t-\tau) = x(\tau)\delta(t-\tau)$$` },
      { t: 'p', h: T`<strong>Neden böyle bir “fonksiyon” var?</strong> Gerçek hayatta çok kısa sürede olup biten olaylar var: bir çekiç darbesi, bir anlık şimşek, devreye bir anda yüklenen yük. Bunların süresi o kadar kısadır ki önemli olan şekilleri değil, <em>toplam etkileri</em> (alanları) olur. $\delta(t)$ bu “anlık ama etkisi belli” olayın matematiksel modelidir. Bölüm 2’de bir sistemi tanımanın yolu da ona bir $\delta$ verip cevabına bakmak olacak.` },
      { t: 'table', head: ['Formül', 'Sözle ne diyor?', 'Neden doğru / ne zaman kullanırsın?'], rows: [
        [T`$\delta(t) = 0\;(t \ne 0)$`, T`“İmpuls, $t = 0$ dışında her yerde sıfırdır.”`, T`Olay yalnızca tek bir anda oluyor. Grafikte $t=0$’da yukarı doğru bir ok olarak çizilir.`],
        [T`$\int_{-\infty}^{\infty}\delta(t)\,dt = 1$`, T`“İmpulsun altındaki alan 1’dir.”`, T`$\delta$’nın büyüklüğü yüksekliğiyle değil <strong>alanıyla</strong> ölçülür. $3\delta(t)$ demek “alanı 3 olan impuls” demektir. Okun yanına yazılan sayı bu alandır.`],
        [T`$\int\phi(t)\,\delta(t-a)\,dt = \phi(a)$`, T`<strong>Elek özelliği:</strong> “İntegralin içinde $\delta(t-a)$ varsa, integral fonksiyonun yalnızca $t=a$’daki değerini seçer.”`, T`$\delta(t-a)$ yalnızca $t=a$’da sıfırdan farklı, o yüzden çarpımda $\phi$’nin sadece $\phi(a)$ değeri kalır. $\phi(a)$ sabit olduğu için integralden çıkar, geriye $\int\delta = 1$ kalır. <strong>Kullanım:</strong> içinde $\delta$ geçen her integral sorusu (s. 36). Sadece $\delta$’nın içini sıfır yapan $t$’yi bul, fonksiyonda yerine koy.`],
        [T`$\delta(at) = \frac{1}{|a|}\delta(t)$`, T`“Zamanı $a$ kat sıkıştırınca impulsun alanı $|a|$’ya bölünür.”`, T`İmpulsu çok ince bir dikdörtgen gibi düşün. $\delta(2t)$’de genişlik yarıya iner, yükseklik aynı kalır, alan da yarıya iner. <strong>Kullanım:</strong> $\delta$’nın içinde $t$’nin katsayısı 1 değilse. Örnek: $\delta(2t-4) = \delta(2(t-2)) = \frac12\delta(t-2)$, yani $\int\phi(t)\delta(2t-4)dt = \frac12\phi(2)$.`],
        [T`$\delta(-t) = \delta(t)$`, T`“İmpuls çift bir sinyaldir: aynalayınca değişmez.”`, T`Tam orijindeki ince bir darbenin sağı ve solu aynıdır. <strong>Kullanım:</strong> $\delta(2 - t) = \delta(-(t-2)) = \delta(t-2)$ diye sadeleştirmek. Bu, $\delta(at)$ formülündeki mutlak değerin de sebebidir.`],
        [T`$x(t)\,\delta(t) = x(0)\,\delta(t)$`, T`“Bir sinyali $\delta(t)$ ile çarpınca sinyalin sadece $t=0$’daki değeri kalır. Sonuç hâlâ bir impulstur.”`, T`$\delta(t)$, $t=0$ dışında 0 olduğu için $x$’in başka değerlerinin önemi kalmaz. <strong>Dikkat:</strong> burada integral yok, sonuç bir sayı değil, <strong>bir sinyaldir</strong>. Örnek: $e^{-t}\delta(t) = e^0\delta(t) = \delta(t)$, $\;\cos t\,\delta(t) = \delta(t)$.`],
        [T`$x(t)\,\delta(t-\tau) = x(\tau)\,\delta(t-\tau)$`, T`Aynı kural, impuls $t=\tau$’daysa: “Sinyalin sadece $\tau$’daki değeri kalır.”`, T`Örnek: $t^2\,\delta(t-3) = 9\,\delta(t-3)$, yani $t=3$’te alanı 9 olan bir impuls. Konvolüsyonda çok kullanılır.`]] },
      { t: 'trap', h: T`İki şeyi karıştırma: $x(t)\,\delta(t-\tau) = x(\tau)\,\delta(t-\tau)$ bir <strong>sinyaldir</strong> (yüksekliği $x(\tau)$ olan bir impuls). $\int x(t)\,\delta(t-\tau)\,dt = x(\tau)$ ise bir <strong>sayıdır</strong>. Bir de integral sınırları: impuls aralığın dışındaysa sonuç 0’dır.` },

      { t: 'h', h: 'Birim rampa r(t)', src: 's. 30' },
      { t: 'def', title: 'Tanım (s. 30)', h: T`$$r(t) = \begin{cases} 0 & t < 0 \\ t & t \ge 0\end{cases} = t\,u(t)$$
Rampa $t<0$’da 0’dır, $t=0$’dan sonra <strong>eğimi 1</strong> olan bir doğru gibi yükselir ($r(1) = 1$, $r(2) = 2$, …). $t\,u(t)$ yazımı da bunu söyler: $t$ doğrusunun sadece sağ tarafı kalır.
<strong>Türev ilişkileri:</strong>
$$\delta(t) = \frac{du(t)}{dt}, \qquad u(t) = \frac{dr(t)}{dt}$$
Zincir: $r$ —türev→ $u$ —türev→ $\delta$, ve tersine $\delta$ —integral→ $u$ —integral→ $r$.` },
      { t: 'fig', fig: [spec([-2, 3], [-0.3, 2.4], [fn((t) => (t > 0 ? t : 0), 'x')], { title: 'r(t)' }), spec([-2, 3], [-0.3, 1.4], [fn(u, 'h')], { title: 'u(t) = dr/dt' }), spec([-2, 3], [-0.3, 1.4], [{ kind: 'impulse', at: 0, amp: 1, color: 'y', label: '1' }], { title: 'δ(t) = du/dt' })] },
      { t: 'lab', id: 'basics' },

      { t: 'h', h: 'Dikdörtgen Π ve üçgen Λ darbeleri', src: 's. 31–33' },
      { t: 'def', h: T`$$\Pi\!\left(\frac{t}{\tau}\right) = \begin{cases} 1 & |t| < \tau/2 \\ 0 & \text{diğer}\end{cases} = u\!\left(t + \frac{\tau}{2}\right) - u\!\left(t - \frac{\tau}{2}\right) \qquad \Lambda\!\left(\frac{t}{\tau}\right) = \begin{cases} 1 - \frac{|t|}{\tau} & |t| < \tau \\ 0 & \text{diğer}\end{cases}$$
$\Pi(t/\tau)$’nun genişliği $\tau$’dur. $\Lambda(t/\tau)$’nun tabanı ise $2\tau$’dur (iki katı!).` },
      { t: 'idea', title: 'Sözle: bu tanımlar ne diyor?', h: T`<strong>$\Pi(t/\tau)$, dikdörtgen darbe:</strong> “Orijinin etrafında $\tau$ genişliğinde bir aralıkta 1, dışarıda 0.” Koşul $|t| < \tau/2$, yani $-\tau/2 < t < \tau/2$: merkezden sağa $\tau/2$, sola $\tau/2$, toplam genişlik $\tau$.<br>Basamaklarla yazılışı $u(t + \frac{\tau}{2}) - u(t - \frac{\tau}{2})$’dir: “$-\tau/2$’de açılan bir anahtardan $+\tau/2$’de açılan bir anahtarı çıkar”. İki basamak arasında $1 - 0 = 1$, sonra $1 - 1 = 0$ kalır.<br><strong>$\Lambda(t/\tau)$, üçgen darbe:</strong> “Tepesi $t=0$’da 1, $t = \pm\tau$’da 0’a inen bir üçgen.” $1 - \frac{|t|}{\tau}$ ifadesi tam bunu söyler: $t = 0$’da $1 - 0 = 1$, $t = \tau$’da $1 - 1 = 0$. $|t|$ olduğu için sağ ve sol taraf aynıdır.<br><strong>Neden var?</strong> Π, “bir süre açık kalan” her şeyin modelidir: bir düğmeye 2 saniye basmak, bir pencereden bakmak. Λ, iki Π’nin konvolüsyonundan çıkar (Bölüm 2’de göreceksin). Bu iki sinyali bilmek, karmaşık şekilleri parçalara ayırmanı sağlar.` },
      { t: 'fig', fig: [spec([-2, 2], [-0.3, 1.4], [fn((t) => (Math.abs(t) < 0.75 ? 1 : 0), 'x'), { kind: 'text', x: 0.8, y: 0.5, text: 'τ = 1.5', color: 'x' }], { title: 'Π(t/τ)', xStep: 0.5 }), spec([-2, 2], [-0.3, 1.4], [fn((t) => tri(t / 1.5), 'h'), { kind: 'text', x: 0.9, y: 0.75, text: 'taban 2τ = 3', color: 'h' }], { title: 'Λ(t/τ)', xStep: 0.5 })] },
      { t: 'recipe', title: 'Kaydırılmış Π ve Λ nasıl çizilir?', steps: [
        T`İçerideki ifadeyi eşitsizliğe koy: Π için $-\frac12 < \frac{t-c}{\tau} < \frac12$, Λ için $-1 < \frac{t-c}{\tau} < 1$.`,
        T`$t$ için çöz: Π → $c - \frac{\tau}{2} < t < c + \frac{\tau}{2}$; Λ → $c - \tau < t < c + \tau$, tepe $t = c$’de.`,
        T`Öndeki katsayı yüksekliktir.`] },

      { t: 'h', h: 'Üstel ve sinüzoidal sinyaller', src: 's. 34–35' },
      { t: 'def', h: T`$x(t) = Ae^{at}$: $a>0$ büyür, $a<0$ söner, $x(0) = A$.<br>$x(t) = \sin\omega t,\; \cos\omega t$ ve karmaşık üstel $\;x(t) = e^{j\omega t} = \cos\omega t + j\sin\omega t$ (Euler).` },
      { t: 'table', head: ['Formül', 'Sözle ne diyor?', 'Neden var?'], rows: [
        [T`$Ae^{at}$`, T`$A$ başlangıç değeri ($t=0$’da $e^0 = 1$ olduğu için $x(0) = A$). $a$ büyüme ya da sönme hızı: $a<0$ ise sinyal zamanla 0’a iner, $a>0$ ise patlar.`, T`Doğada her şey üstel söner: ısınan bir çayın soğuması, kondansatörün boşalması, bir telin titreşiminin durması. Diferansiyel denklemlerin çözümleri hep bu biçimdedir.`],
        [T`$\sin\omega t$, $\cos\omega t$`, T`Salınım. $\omega$ ne kadar hızlı salındığını söyler (periyot $2\pi/\omega$).`, T`Her periyodik sinyal sinüslerin toplamı olarak yazılabilir (Fourier). Bu yüzden sinüs, sinyallerin “alfabesi” gibidir.`],
        [T`$e^{j\omega t} = \cos\omega t + j\sin\omega t$`, T`<strong>Euler formülü:</strong> “Karmaşık üstel, gerçel kısmı kosinüs, sanal kısmı sinüs olan bir sayıdır.”`, T`Kosinüs ve sinüsü tek bir ifadede taşır. Türevi, çarpımı ve kaydırması $\cos$/$\sin$’e göre çok daha kolaydır, çünkü üslü sayılarda üsler toplanır. Ters yönde de kullanılır: $\cos\omega t = \frac{e^{j\omega t} + e^{-j\omega t}}{2}$, $\;\sin\omega t = \frac{e^{j\omega t} - e^{-j\omega t}}{2j}$.`]] },
      { t: 'p', h: T`$e^{j\omega t}$ karmaşık düzlemde birim çember üzerinde dönen bir noktadır. Gerçel kısmı kosinüs, sanal kısmı sinüs çizer. Laboratuvarın son sekmesinde dönüşü izleyebilirsin.` },

      { t: 'h', h: 'İmpulslu integraller (elek özelliği)', src: 's. 36' },
      { t: 'example', src: 's. 36', q: T`Aşağıdaki ifadeleri hesaplayınız:<br>(a) $\displaystyle\int_{-\infty}^{\infty}\sin 3t\;\delta\!\left(t-\frac{\pi}{2}\right)dt$ &nbsp;&nbsp; (b) $\displaystyle\int_{-\infty}^{\infty}t^4\,\delta(t-2)\,dt$`,
        steps: [T`Elek özelliği: $\delta(t-a)$ integrali $t = a$’daki değeri seçer.`, T`(a) $a = \frac{\pi}{2}$: $\;\sin\left(3\cdot\frac{\pi}{2}\right) = \sin\frac{3\pi}{2} = -1$`, T`(b) $a = 2$: $\;2^4 = 16$`],
        ans: T`(a) $-1$ &nbsp; (b) $16$` },
      { t: 'hw', src: 's. 36', q: T`Aşağıdaki ifadeleri hesaplayınız:<br>(a) $\displaystyle\int_{-\infty}^{\infty}\sin\!\left(t^3 + \frac{\pi}{2}\right)\delta(t)\,dt$ &nbsp;&nbsp; (b) $\displaystyle\int_{0}^{10}(t^2 + 4t - 2)\,\delta(t-1)\,dt$`, hint: T`(b)’de önce impulsun ($t=1$) integral aralığının ($0$ ile $10$) içinde olup olmadığını kontrol et.`,
        steps: [T`(a) $t = 0$: $\sin(0 + \frac{\pi}{2}) = 1$`, T`(b) $t=1$, $[0, 10]$ aralığının içinde. $1 + 4 - 2 = 3$`], ans: T`(a) $1$ &nbsp; (b) $3$. Laboratuvarın “Elek özelliği” sekmesinde ikisini de deneyebilirsin.` },

      { t: 'h', h: 'Sinyali basamaklarla yazmak', src: 's. 37–38' },
      { t: 'p', h: T`Parçalı sabit bir sinyal, her sıçrama noktasında <em>sıçrama miktarı kadar</em> bir basamak eklenerek yazılır. Türev alınca her basamak bir impulsa dönüşür. Bu yüzden türev, sıçrama noktalarındaki impulslardan oluşur.` },
      { t: 'example', src: 's. 37–38', q: T`Şekildeki $v(t)$ darbesini ($2<t<5$ aralığında 10, diğer yerlerde 0) birim basamak fonksiyonları ile yazıp türevini alarak şeklini çiziniz.`,
        fig: spec([0, 6.5], [-1, 12], [fn((t) => (t > 2 && t < 5 ? 10 : 0), 'x')], { title: 'v(t)', xStep: 1, yStep: 5 }),
        steps: [T`$t=2$’de $+10$ sıçrama: $10u(t-2)$. $t=5$’te $-10$ sıçrama: $-10u(t-5)$.`, T`$v(t) = 10u(t-2) - 10u(t-5) = 10[u(t-2) - u(t-5)]$`,
          { h: T`$\frac{dv}{dt} = 10[\delta(t-2) - \delta(t-5)]$`, fig: spec([0, 6.5], [-12, 12], [{ kind: 'impulse', at: 2, amp: 10, color: 'h', label: '10δ(t−2)' }, { kind: 'impulse', at: 5, amp: -10, color: 'h', label: '−10δ(t−5)' }], { xStep: 1, yStep: 5 }) }],
        ans: T`$v(t) = 10[u(t-2) - u(t-5)]$, $\;v'(t) = 10\delta(t-2) - 10\delta(t-5)$` },
      { t: 'hw', src: 's. 38', q: T`Şekildeki $i(t)$ fonksiyonunu ($0<t<2$ aralığında 10, $2<t<4$ aralığında $-10$, diğer yerlerde 0) birim basamak fonksiyonları ile yazıp integralini alarak şeklini çiziniz.`,
        fig: spec([-1, 5.5], [-12, 12], [fn((t) => (t > 0 && t < 2 ? 10 : t > 2 && t < 4 ? -10 : 0), 'x')], { title: 'i(t)', xStep: 1, yStep: 5 }), hint: T`Sıçramalar: $t=0$’da $+10$, $t=2$’de $-20$ (10’dan $-10$’a), $t=4$’te $+10$.`,
        steps: [T`$i(t) = 10u(t) - 20u(t-2) + 10u(t-4)$`, T`$\int u = r$ olduğundan: $q(t) = \int_{-\infty}^{t} i\,d\tau = 10r(t) - 20r(t-2) + 10r(t-4)$`,
          { h: T`Sonuç bir üçgen: $0$’dan $t=2$’de $20$’ye çıkar, $t=4$’te $0$’a iner.`, fig: spec([-1, 6], [-2, 23], [fn((t) => 10 * Math.max(0, t) - 20 * Math.max(0, t - 2) + 10 * Math.max(0, t - 4), 'y')], { xStep: 1, yStep: 5 }) }],
        ans: T`$i = 10u(t) - 20u(t-2) + 10u(t-4)$, integrali $20\,\Lambda\!\left(\frac{t-2}{2}\right)$. Laboratuvarın “Basamaklarla inşa” sekmesinde hazır olarak var.` },

      { t: 'h', h: 'Π ve Λ sinyallerini çizmek', src: 's. 39–40' },
      { t: 'example', src: 's. 39–40', q: T`Aşağıdaki işaretleri çiziniz:<br>(a) $x(t) = 3\,\Pi\!\left(\frac{t-4}{2}\right)$ &nbsp; (b) $y(t) = 2\,\Lambda\!\left(\frac{t-3}{2}\right)$`,
        steps: [T`(a) $-1 < t - 4 < 1$ → $3 < t < 5$. Yükseklik 3.`,
          { h: T`(b) $-2 < t - 3 < 2$ → $1 < t < 5$, tepe $t=3$’te, yükseklik 2. Parçalı yazım: $y = 2\left(1 + \frac{t-3}{2}\right) = t - 1$ ($1<t<3$), $\;y = 2\left(1 - \frac{t-3}{2}\right) = 5 - t$ ($3<t<5$).`,
            fig: [spec([0, 6.5], [-0.4, 3.6], [fn((t) => (t > 3 && t < 5 ? 3 : 0), 'x')], { title: '3Π((t−4)/2)', xStep: 1 }), spec([0, 6.5], [-0.4, 2.6], [fn((t) => 2 * tri((t - 3) / 2), 'h')], { title: '2Λ((t−3)/2)', xStep: 1 })] }],
        ans: T`$x$: $3<t<5$ aralığında 3. $\;y$: $t-1$ ($1<t<3$), $5-t$ ($3<t<5$).` },
      { t: 'hw', src: 's. 40', q: T`Aşağıdaki işaretleri çiziniz (ve parçalı olarak yazınız):<br>(a) $x(t) = 5\,\Pi\!\left(\frac{t-2}{4}\right)$ &nbsp; (b) $y(t) = 3\,\Lambda\!\left(\frac{t-2}{3}\right)$`,
        steps: [T`(a) $-2 < t - 2 < 2$ → $0 < t < 4$, yükseklik 5.`, T`(b) $-3 < t - 2 < 3$ → $-1 < t < 5$, tepe $t=2$’de 3. $\;3\left(1 + \frac{t-2}{3}\right) = t + 1$ ($-1<t<2$), $\;3\left(1 - \frac{t-2}{3}\right) = 5 - t$ ($2<t<5$).`],
        ans: T`$x = 5$ ($0<t<4$). $\;y = t+1$ ($-1<t<2$), $5-t$ ($2<t<5$). Laboratuvarın “Π ve Λ” sekmesinden kontrol et.` },

      { t: 'h', h: 'Üçgen darbe ve δ, u, r, Π, Λ ilişkileri' },
      { t: 'p', h: T`Basamak kuralının bir üst katı: <strong>eğimli</strong> kenarları olan bir sinyal (üçgen, yamuk) rampalarla yazılır. Basamakta “sıçrama miktarı kadar basamak” ekliyorduk. Burada <strong>eğimin değiştiği her noktaya, eğim değişimi kadar rampa</strong> eklenir. Türev alınca rampalar basamağa, bir türev daha alınca impulslara dönüşür.` },
      { t: 'def', title: 'Üçgeni rampalarla yazmak', h: T`$$\Lambda\!\left(\frac{t}{\tau}\right) = \frac{1}{\tau}\Big[r(t+\tau) - 2r(t) + r(t-\tau)\Big]$$
Eğim $t=-\tau$’da $0 \to +\frac1\tau$ (değişim $+\frac1\tau$), tepede $+\frac1\tau \to -\frac1\tau$ (değişim $-\frac2\tau$), $t=\tau$’da $-\frac1\tau \to 0$ (değişim $+\frac1\tau$). Katsayılar <strong>$1, -2, 1$</strong> ve toplamları 0’dır, çünkü sinyal sonunda düz (eğim 0) kalır.
$$\frac{d}{dt}\Lambda\!\left(\frac{t}{\tau}\right) = \frac{1}{\tau}\Big[u(t+\tau) - 2u(t) + u(t-\tau)\Big]$$
$$\frac{d^2}{dt^2}\Lambda\!\left(\frac{t}{\tau}\right) = \frac{1}{\tau}\Big[\delta(t+\tau) - 2\delta(t) + \delta(t-\tau)\Big]$$
Yani üçgenin türevi <strong>iki dikdörtgendir</strong> (biri $+\frac1\tau$, biri $-\frac1\tau$ yüksekliğinde), dikdörtgenlerin türevi de impulslardır.` },
      { t: 'fig', fig: [spec([-2.5, 2.5], [-0.3, 1.3], [fn((t) => tri(t), 'x')], { title: 'Λ(t) = r(t+1) − 2r(t) + r(t−1)', xStep: 1 }),
        spec([-2.5, 2.5], [-1.4, 1.4], [fn((t) => (t > -1 && t < 0 ? 1 : t > 0 && t < 1 ? -1 : 0), 'h')], { title: 'Λ′(t) = u(t+1) − 2u(t) + u(t−1)', xStep: 1 }),
        spec([-2.5, 2.5], [-2.6, 1.6], [{ kind: 'impulse', at: -1, amp: 1, color: 'y', label: '1' }, { kind: 'impulse', at: 0, amp: -2, color: 'y', label: '−2' }, { kind: 'impulse', at: 1, amp: 1, color: 'y', label: '1' }], { title: 'Λ″(t)', xStep: 1 })],
        cap: 'Soldan sağa her adım bir türev: rampalar basamağa, basamaklar impulsa dönüşür. Ters yönde her adım bir integraldir.' },
      { t: 'trap', h: T`$A\,\Lambda\!\left(\frac{t-c}{\tau}\right)$’yı rampalarla yazarken öndeki katsayı <strong>yükseklik $A$ değil, eğim $\frac{A}{\tau}$</strong>’dur: $\;\frac{A}{\tau}\big[r(t-c+\tau) - 2r(t-c) + r(t-c-\tau)\big]$. Ortadaki rampanın katsayısı da $-1$ değil, $-2$’dir: tepede eğim $+\frac A\tau$’dan $-\frac A\tau$’ya, yani $2\frac A\tau$ kadar düşer.` },
      { t: 'table', head: ['İlişki', 'Formül', 'Ne demek?'], rows: [
        ['δ → u', T`$u(t) = \int_{-\infty}^{t}\delta(\tau)\,d\tau$`, 'İmpulsun integrali basamaktır: $t=0$’ı geçince alan 1 olur ve öyle kalır.'],
        ['u → r', T`$r(t) = \int_{-\infty}^{t}u(\tau)\,d\tau = t\,u(t)$`, 'Basamağın integrali rampadır: 1 yüksekliğinde biriken alan.'],
        ['r → u → δ', T`$\frac{dr}{dt} = u, \quad \frac{du}{dt} = \delta$`, 'Rampanın eğimi 1 → basamak. Basamağın $t=0$’daki 1’lik sıçraması → impuls.'],
        ['Π ↔ u', T`$\Pi\!\left(\frac t\tau\right) = u\!\left(t+\frac\tau2\right) - u\!\left(t-\frac\tau2\right)$`, 'Dikdörtgen = açan basamak − kapatan basamak.'],
        ['Π′ ↔ δ', T`$\frac{d}{dt}\Pi\!\left(\frac t\tau\right) = \delta\!\left(t+\frac\tau2\right) - \delta\!\left(t-\frac\tau2\right)$`, T`Yukarı sıçrama $+\delta$, aşağı sıçrama $-\delta$.`],
        ['Λ ↔ r', T`$\Lambda\!\left(\frac t\tau\right) = \frac1\tau\big[r(t+\tau) - 2r(t) + r(t-\tau)\big]$`, 'Üçgen = üç rampa, katsayılar $1, -2, 1$ (eğim çarpanıyla).'],
        ['Λ′ ↔ Π', T`$\frac{d}{dt}\Lambda\!\left(\frac t\tau\right) = \frac1\tau\left[\Pi\!\left(\frac{t+\tau/2}{\tau}\right) - \Pi\!\left(\frac{t-\tau/2}{\tau}\right)\right]$`, 'Üçgenin türevi iki zıt işaretli dikdörtgen.'],
        ['Simetri', T`$\delta(-t) = \delta(t), \;\; \Pi(-t) = \Pi(t), \;\; \Lambda(-t) = \Lambda(t)$`, '$\\delta$, $\\Pi$, $\\Lambda$ <strong>çift</strong>tir. $u$ ve $r$ ne çift ne tektir.']] },
      { t: 'example', src: 's. 39–40', title: 'Üçgeni rampalarla yaz, iki kez türev al', q: T`$y(t) = 2\,\Lambda\!\left(\frac{t-3}{2}\right)$ sinyalini birim rampalarla yaz. $y'(t)$ ve $y''(t)$’yi bul ve çiz.`,
        steps: [T`Önceki örnekten: $1<t<5$ aralığında, tepe $t=3$’te 2. Eğim: $\frac{A}{\tau} = \frac22 = 1$.`,
          T`Eğim değişimleri: $t=1$’de $0 \to 1$ ($+1$), $t=3$’te $1 \to -1$ ($-2$), $t=5$’te $-1 \to 0$ ($+1$).`,
          T`$y(t) = r(t-1) - 2r(t-3) + r(t-5)$. Kontrol: $t=3$’te $r(2) = 2$ ✓, $t=6$’da $5 - 6 + 1 = 0$ ✓.`,
          { h: T`Türevler: $y' = u(t-1) - 2u(t-3) + u(t-5)$ (önce $+1$, sonra $-1$ yüksekliğinde iki dikdörtgen). $\;y'' = \delta(t-1) - 2\delta(t-3) + \delta(t-5)$.`,
            fig: [spec([0, 6.5], [-1.4, 1.4], [fn((t) => (t > 1 && t < 3 ? 1 : t > 3 && t < 5 ? -1 : 0), 'h')], { title: "y′(t)", xStep: 1 }),
              spec([0, 6.5], [-2.6, 1.6], [{ kind: 'impulse', at: 1, amp: 1, color: 'y', label: '1' }, { kind: 'impulse', at: 3, amp: -2, color: 'y', label: '−2' }, { kind: 'impulse', at: 5, amp: 1, color: 'y', label: '1' }], { title: "y″(t)", xStep: 1 })] }],
        ans: T`$y = r(t-1) - 2r(t-3) + r(t-5)$, $\;y' = u(t-1) - 2u(t-3) + u(t-5) = \Pi\!\left(\frac{t-2}{2}\right) - \Pi\!\left(\frac{t-4}{2}\right)$, $\;y'' = \delta(t-1) - 2\delta(t-3) + \delta(t-5)$` },
      { t: 'hw', title: 'Yamuk (trapez)', q: T`$x(t)$: $t<0$’da 0; $0<t<1$’de 0’dan 2’ye doğrusal çıkıyor; $1<t<3$’te 2; $3<t<4$’te 2’den 0’a doğrusal iniyor; $t>4$’te 0. $x(t)$’yi birim rampalarla yaz ve türevini birim basamaklarla ifade et.`, hint: T`Eğimler sırasıyla $0, 2, 0, -2, 0$. Her değişim noktasına değişim kadar rampa koy.`,
        steps: [T`Eğim değişimleri: $t=0$’da $+2$, $t=1$’de $-2$, $t=3$’te $-2$, $t=4$’te $+2$.`, T`$x(t) = 2r(t) - 2r(t-1) - 2r(t-3) + 2r(t-4)$`,
          { h: T`$x'(t) = 2u(t) - 2u(t-1) - 2u(t-3) + 2u(t-4) = 2\big[u(t) - u(t-1)\big] - 2\big[u(t-3) - u(t-4)\big]$`, fig: [spec([-1, 5], [-0.4, 2.6], [fn((t) => 2 * Math.max(0, t) - 2 * Math.max(0, t - 1) - 2 * Math.max(0, t - 3) + 2 * Math.max(0, t - 4), 'x')], { title: 'x(t)', xStep: 1 }), spec([-1, 5], [-2.6, 2.6], [fn((t) => (t > 0 && t < 1 ? 2 : t > 3 && t < 4 ? -2 : 0), 'h')], { title: "x′(t)", xStep: 1 })] }],
        ans: T`$x = 2r(t) - 2r(t-1) - 2r(t-3) + 2r(t-4)$, $\;x' = 2[u(t) - u(t-1)] - 2[u(t-3) - u(t-4)]$. Kontrol: rampa katsayılarının toplamı $0$ (sinyal sonunda düz) ✓.` },
      { t: 'quiz', items: [
        { q: T`$\frac{d}{dt}\,r(t-2)$ nedir?`, opts: ['$\\delta(t-2)$', '$u(t-2)$', '$(t-2)\\,u(t-2)$'], a: 1, why: T`Rampanın türevi basamaktır, öteleme aynen korunur.` },
        { q: T`$r(t) - 2r(t-1) + r(t-2)$ hangi sinyaldir?`, opts: ['$\\Lambda(t-1)$', '$\\Pi(t-1)$', '$2\\Lambda(t-1)$'], a: 0, why: T`Eğim 1 ile çıkar, $t=1$’de $-1$’e döner, $t=2$’de düzleşir: tabanı $0<t<2$, tepesi $t=1$’de 1 olan üçgen, yani $\Lambda(t-1)$.` },
        { q: T`$3\,\Lambda\!\left(\frac{t}{3}\right)$’nın rampa ifadesindeki ilk katsayı kaçtır?`, opts: ['3', '1', '$\\frac13$'], a: 1, why: T`Katsayı eğimdir: $\frac{A}{\tau} = \frac33 = 1$. Sonuç: $r(t+3) - 2r(t) + r(t-3)$.` },
        { q: T`$\int_{-\infty}^{t}\big[\delta(\tau+1) - \delta(\tau-1)\big]d\tau$ nedir?`, opts: ['$\\Pi(t/2)$', '$\\Lambda(t)$', '$r(t+1) - r(t-1)$'], a: 0, why: T`$\int\delta(\tau+1) = u(t+1)$, $\int\delta(\tau-1) = u(t-1)$. Fark $u(t+1) - u(t-1) = \Pi(t/2)$: genişlik 2, merkez 0.` }] },

      { t: 'quiz', items: [
        { q: T`$\int_{-\infty}^{\infty} e^{-t}\,\delta(t+1)\,dt$ kaçtır?`, opts: ['$e^{-1}$', '$e$', '0'], a: 1, why: T`$\delta(t+1)$, $t=-1$’de yer alır: $e^{-(-1)} = e$.` },
        { q: T`$\delta(2t)$ neye eşittir?`, opts: ['$2\\delta(t)$', '$\\frac12\\delta(t)$', '$\\delta(t)$'], a: 1, why: T`$\delta(at) = \frac{1}{|a|}\delta(t)$. Darbe yarı genişliğe sıkışır, yüksekliği aynı kalırsa alanı da yarıya iner.` },
        { q: T`$4\,\Pi\!\left(\frac{t+1}{6}\right)$ hangi aralıkta sıfırdan farklıdır?`, opts: ['$-4 < t < 2$', '$-7 < t < 5$', '$-1 < t < 5$'], a: 0, why: T`$-3 < t + 1 < 3$ → $-4 < t < 2$. Genişlik 6, merkez $-1$.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.6', chap: 's', title: 'Temel ayrık sinyaller', pages: 's. 41–46',
    sub: 'u[n], δ[n], r[n], αⁿ, ayrık sinüs',
    lead: 'Ayrık zamandaki karşılıklar daha da basit: impuls gerçekten 1 yüksekliğinde bir çubuktur. Her dizi bu çubukların toplamı olarak yazılabilir.',
    goals: ['$u[n]$, $\\delta[n]$, $r[n]$ tanımları', 'Diziyi $\\delta[n-k]$ toplamı olarak yazmak', '$\\alpha^n$ dizisinin davranışı', 'Ayrık sinyale işlem uygulamak'],
    blocks: [
      { t: 'def', title: 'Tanımlar (s. 41–44)', h: T`$$u[n] = \begin{cases} 1 & n \ge 0 \\ 0 & n < 0\end{cases} \qquad \delta[n] = \begin{cases} 1 & n = 0 \\ 0 & n \ne 0\end{cases} \qquad r[n] = \begin{cases} n & n \ge 0 \\ 0 & n < 0\end{cases}$$
$$x[n] = A\cos\!\left(\frac{2\pi n}{N} + \theta\right) \qquad\qquad x[n] = A\alpha^n, \quad \alpha = e^{-aT}$$` },
      { t: 'table', head: ['Dizi', 'Sözle ne diyor?', 'Sürekli ikizinden farkı'], rows: [
        [T`$u[n]$`, T`“$n = 0, 1, 2, \ldots$ için 1, negatif $n$’ler için 0.” $n=0$’da açılan anahtar.`, T`$u[0] = 1$ kesin olarak tanımlı. Süreklide $u(0)$ belirsizdi.`],
        [T`$\delta[n]$`, T`“Sadece $n = 0$’da 1, başka her yerde 0.” Tek bir çubuk.`, T`Süreklide $\delta(t)$ sonsuz yüksek bir semboldü. Burada gerçekten <strong>1 yüksekliğinde</strong> sıradan bir çubuk.`],
        [T`$r[n]$`, T`“$n \ge 0$ için değeri $n$’nin kendisi: $0, 1, 2, 3, \ldots$”`, T`Süreklideki $r(t) = t\,u(t)$’nin örneklenmiş hâli: $r[n] = n\,u[n]$.`],
        [T`$A\cos\!\left(\frac{2\pi n}{N} + \theta\right)$`, T`Periyodu $N$ örnek olan ayrık kosinüs. $A$ genlik, $\theta$ faz.`, T`$\frac{2\pi}{N}$ yazılışı periyodu doğrudan gösterir: $N$ adımda açı tam $2\pi$ artar.`],
        [T`$A\alpha^n$, $\;\alpha = e^{-aT}$`, T`Her adımda bir öncekinin $\alpha$ katı. $|\alpha| < 1$ ise söner, $|\alpha| > 1$ ise büyür, $\alpha < 0$ ise işaret değiştirerek gider.`, T`$\alpha = e^{-aT}$, sürekli $e^{-at}$’nin $T$ aralıklarla örneklenmesinden gelir: $e^{-a(nT)} = (e^{-aT})^n = \alpha^n$.`]] },
      { t: 'fig', fig: [spec([-3.6, 5.6], [-0.3, 1.5], [stems((n) => (n >= 0 ? 1 : 0), -3, 5, 'x', { labels: false })], { title: 'u[n]', xLabel: 'n', xStep: 1 }), spec([-3.6, 5.6], [-0.3, 1.5], [stems((n) => (n === 0 ? 1 : 0), -3, 5, 'h', { labels: false })], { title: 'δ[n]', xLabel: 'n', xStep: 1 }), spec([-3.6, 5.6], [-0.4, 5.8], [stems((n) => Math.max(0, n), -3, 5, 'y', { labels: false })], { title: 'r[n]', xLabel: 'n', xStep: 1 })] },
      { t: 'def', title: 'Özellikler (s. 42)', h: T`1. $x[n]\delta[n] = x[0]\delta[n]$ &nbsp;&nbsp; 2. $x[n]\delta[n-k] = x[k]\delta[n-k]$ &nbsp;&nbsp; 3. $\delta[n] = u[n] - u[n-1]$<br>4. $u[n] = \sum_{k=-\infty}^{n}\delta[k]$ &nbsp;&nbsp; 5. $\boxed{x[n] = \sum_{k=-\infty}^{\infty} x[k]\,\delta[n-k]}$` },
      { t: 'list', items: [
        T`<strong>1. $x[n]\delta[n] = x[0]\delta[n]$:</strong> “Diziyi $\delta[n]$ ile çarpınca yalnızca $n=0$’daki değer kalır.” Çünkü $\delta[n]$ başka her yerde 0, çarpımda da 0 çıkar.`,
        T`<strong>2. $x[n]\delta[n-k] = x[k]\delta[n-k]$:</strong> Aynı şey, çubuk $n=k$’daysa: yalnızca $x[k]$ kalır. Örnek: $n^2\delta[n-3] = 9\delta[n-3]$.`,
        T`<strong>3. $\delta[n] = u[n] - u[n-1]$:</strong> “Bir basamaktan, bir adım sonra başlayan basamağı çıkarınca geriye tek bir çubuk kalır.” $n=0$’da $1 - 0 = 1$, $n \ge 1$’de $1 - 1 = 0$. Süreklideki “basamağın türevi impulstur” kuralının ayrık hâli (türev yerine fark).`,
        T`<strong>4. $u[n] = \sum_{k=-\infty}^{n}\delta[k]$:</strong> “Basamak, $n$’ye kadarki bütün çubukların toplamıdır.” $n<0$ ise henüz hiçbir çubuk sayılmadı (0), $n \ge 0$ ise $k=0$’daki çubuk sayıldı (1). Süreklideki “impulsun integrali basamaktır” kuralının ayrık hâli (integral yerine toplam).`,
        T`<strong>5. $x[n] = \sum x[k]\delta[n-k]$:</strong> “Her dizi, her konumdaki değeri kadar yükseklikte çubukların toplamıdır.” Aşağıda ayrıntılı.`] },
      { t: 'idea', title: 'En önemli satır: 5. özellik', h: T`Bu satır, “her dizi, kaydırılmış ve ağırlıklandırılmış impulsların toplamıdır” der. Bölüm 2’de LTI sistemlerde konvolüsyon toplamını tam olarak bu fikirden türeteceğiz: impulsa verilen cevabı ($h[n]$) bilirsek, bu toplam sayesinde her girişe verilen cevabı da biliriz.` },
      { t: 'trap', h: T`Sürekli $\delta(t)$ sonsuz yüksek bir sembolken, ayrık $\delta[n]$’nin $n=0$’daki değeri <strong>tam olarak 1</strong>’dir. Ayrıca $u[0] = 1$ kesin olarak tanımlıdır. Sürekli $u(0)$ gibi belirsizlik yoktur.` },
      { t: 'example', src: 's. 45', q: T`Şekildeki dizilerin ifadelerini yaz: $x[0]=1$, $x[3]=2$; ve $y[-2]=1$, $y[-1]=2$, $y[0]=3$, $y[2]=2$.`,
        fig: [spec([-3.6, 4.6], [-0.3, 3.6], [stems((n) => ({ 0: 1, 3: 2 }[n] || 0), -3, 4)], { xLabel: 'n', xStep: 1, title: 'x[n]' }), spec([-3.6, 4.6], [-0.3, 3.6], [stems((n) => ({ '-2': 1, '-1': 2, 0: 3, 2: 2 }[n] || 0), -3, 4, 'h')], { xLabel: 'n', xStep: 1, title: 'y[n]' })],
        steps: [T`Her çubuk bir terimdir: $n=k$’daki $a$ yüksekliği → $a\,\delta[n-k]$.`, T`$x[n] = \delta[n] + 2\delta[n-3]$`, T`$y[n] = \delta[n+2] + 2\delta[n+1] + 3\delta[n] + 2\delta[n-2]$`],
        ans: T`$x[n] = \delta[n] + 2\delta[n-3]$, $\;y[n] = \delta[n+2] + 2\delta[n+1] + 3\delta[n] + 2\delta[n-2]$` },
      { t: 'lab', id: 'dbasics' },
      { t: 'example', src: 's. 44', q: T`$r[n] = n\,u[n]$ ise $y[n] = 2r[1-n]$ dizisini bul.`,
        steps: [T`$r[\cdot]$’nin içine $1-n$ yaz: $r[1-n] = (1-n)\,u[1-n]$.`, T`$u[1-n] = 1 \iff 1 - n \ge 0 \iff n \le 1$.`, T`$y[n] = 2(1-n) = -2n + 2$ ($n \le 1$), $0$ ($n > 1$).`],
        ans: T`$y[n] = \begin{cases}-2n + 2 & n \le 1 \\ 0 & n > 1\end{cases}$. Laboratuvarın “Temel diziler” sekmesinde çizimi var: $n=1$’de 0, $n=0$’da 2, $n=-1$’de 4…` },
      { t: 'hw', src: 's. 45', q: T`Yukarıdaki $r[n]$ verildiğinde $z[n] = r[n+2]$ dizisini bul.`,
        steps: [T`$r[n+2] = (n+2)\,u[n+2]$`, T`$u[n+2] = 1 \iff n \ge -2$`], ans: T`$z[n] = n + 2$ ($n \ge -2$), $0$ ($n < -2$). Rampa 2 adım <strong>sola</strong> kaydı.` },
      { t: 'hw', src: 'benzeri s. 46', title: 'Ek alıştırma', q: T`Şekildeki dizinin ifadesini $\delta$’larla yaz. Ardından kapalı bir formül bul.`,
        fig: spec([-3.6, 3.6], [-0.3, 2.6], [stems((n) => (Math.abs(n) <= 2 ? Math.abs(n) : 0), -3, 3)], { xLabel: 'n', xStep: 1 }),
        steps: [T`$x[n] = 2\delta[n+2] + \delta[n+1] + \delta[n-1] + 2\delta[n-2]$`, T`Değerler $|n|$’ye eşit ve $|n| \le 2$ dışında 0: $x[n] = |n|\,(u[n+2] - u[n-3])$.`],
        ans: T`$x[n] = 2\delta[n+2] + \delta[n+1] + \delta[n-1] + 2\delta[n-2] = |n|\,(u[n+2]-u[n-3])$` },
      { t: 'quiz', items: [
        { q: T`$\sum_{n=-\infty}^{\infty} n^2\,\delta[n-3]$ kaçtır?`, opts: ['9', '3', '0'], a: 0, why: T`Ayrık elek özelliği: $\delta[n-3]$ yalnızca $n=3$’ü seçer, $3^2 = 9$.` },
        { q: T`$u[n] - u[n-1]$ neye eşittir?`, opts: ['$u[n+1]$', '$\\delta[n]$', '$r[n]$'], a: 1, why: T`İki basamak yalnızca $n=0$’da farklı.` },
        { q: T`$x[n] = (-0.9)^n u[n]$ nasıl davranır?`, opts: ['Sürekli büyür', 'İşaret değiştirerek söner', 'Sabit kalır'], a: 1, why: T`$|\alpha| = 0.9 < 1$ olduğu için söner. $\alpha<0$ olduğu için de her adımda işaret değiştirir.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.7', chap: 's', title: 'Sinyal işlemleri', pages: 's. 47–53',
    sub: 'Ters çevirme, ölçekleme, öteleme, genlik dönüşümü',
    lead: 'Zaman eksenini çevirmek, sıkıştırmak ve kaydırmak. Konvolüsyonun yarısı bu işlemlerden ibaret olduğu için bu ders Bölüm 2’nin temelidir.',
    goals: ['$x(-t)$, $x(at)$, $x(t-t_0)$ etkisi', '$x(at+b)$’yi doğru sırayla çizmek', 'Kritik nokta yöntemi', 'Ayrık zamanda seyreltme ve genişletme'],
    blocks: [
      { t: 'def', title: 'Üç temel işlem (s. 47–49)', h: T`<strong>Ters çevirme:</strong> $x(-t)$ dikey eksene göre aynadır.<br><strong>Ölçekleme:</strong> $x(at)$; $|a|>1$ ise <em>sıkıştırma</em>, $|a|<1$ ise <em>genişletme</em>.<br><strong>Öteleme:</strong> $x(t - t_0)$; $t_0>0$ ise <em>sağa</em>, $t_0<0$ ise <em>sola</em> kayar.` },
      { t: 'p', h: T`<strong>Neden bu işlemler var?</strong> Gerçek sistemler sinyallere hep bu üç şeyi yapar. Bir yankı, sesin <em>gecikmiş</em> (ötelenmiş) kopyasıdır. Bir kaydı 2 kat hızlı oynatmak <em>sıkıştırma</em>dır. Kaydı geriye sarmak <em>ters çevirme</em>dir. Bölüm 2’deki konvolüsyon da “ters çevir, kaydır, çarp, topla” adımlarından oluşur. Bu yüzden bu işlemleri hızlı ve doğru yapabilmek gerekir.<br><strong>Hepsinin ortak sırrı:</strong> parantezin içi “sinyalin hangi anını okuduğumuzu” söyler. $y(t) = x(\text{içerisi})$ ise, $y$’nin $t$ anındaki değeri $x$’in “içerisi” anındaki değeridir.` },
      { t: 'idea', title: 'Neden “eksi” sağa kaydırır?', h: T`$y(t) = x(t-2)$ olsun. $x$’in $t=0$’daki değeri $y$’de ne zaman görülür? $t - 2 = 0$ olduğunda, yani $t = 2$’de. Her olay 2 saniye <em>gecikmiş</em>, dolayısıyla grafik sağa kaymıştır. Aynı mantıkla $x(2t)$’de $x$’in $t=4$’teki değeri $y$’de $t=2$’de görülür: her şey iki kat erken olur, grafik sıkışır.` },
      { t: 'example', src: 's. 47', q: T`$x(t) = -1$ ($-1<t<0$), $1-t$ ($0<t<2$), $0$ (diğer). $x(-t)$’yi bul.`,
        steps: [T`Her $t$’yi $-t$ ile değiştir: $-1 < -t < 0$ → $0 < t < 1$; $\;0 < -t < 2$ → $-2 < t < 0$.`, T`$x(-t) = -1$ ($0<t<1$), $1 + t$ ($-2<t<0$).`,
          { fig: [spec([-3, 3], [-1.5, 1.5], [fn(xs47, 'x')], { title: 'x(t)', xStep: 1 }), spec([-3, 3], [-1.5, 1.5], [fn((t) => xs47(-t), 'y')], { title: 'x(−t)', xStep: 1 })] }],
        ans: T`$x(-t) = \begin{cases}-1 & 0<t<1 \\ 1+t & -2<t<0 \\ 0 & \text{diğer}\end{cases}$` },
      { t: 'fig', fig: [spec([-3, 5], [-1.5, 1.5], [fn((t) => xs47(t - 2), 'y'), fn(xs47, 'muted', { fill: false, dash: [5, 4], w: 1.3 })], { title: 'x(t − 2): 2 sağa', xStep: 1 }), spec([-3, 5], [-1.5, 1.5], [fn((t) => xs47(t + 1), 'y'), fn(xs47, 'muted', { fill: false, dash: [5, 4], w: 1.3 })], { title: 'x(t + 1): 1 sola', xStep: 1 })], cap: 'Not s. 49: aynı $x(t)$ ile öteleme. Kesikli çizgi orijinal sinyal.' },

      { t: 'h', h: 'Birleşik işlem x(at + b)', src: 's. 49–52' },
      { t: 'math', h: T`x(at + b) = x\!\left(a\left(t + \frac{b}{a}\right)\right)` },
      { t: 'idea', title: 'Bu eşitlik ne diyor?', h: T`Sağ taraf, içerideki ifadede $a$’yı <strong>paranteze almak</strong>tır: $at + b = a\left(t + \frac{b}{a}\right)$. Örnek: $2t - 6 = 2(t - 3)$.<br>Neden yapıyoruz? Çünkü öteleme miktarını <em>doğrudan</em> $t$’ye eklenen sayı belirler. $x(2t - 6)$’da $t$’ye eklenen sayı görünüşte $-6$ ama gerçekte $a$ paranteze alınınca $-3$ çıkıyor. Yani sinyal 3 birim sağa kayar, 6 değil. Bu eşitlik “gerçek kaydırma miktarı $b$ değil, $b/a$’dır” demektir.` },
      { t: 'p', h: T`Not iki adım öneriyor: (1) önce $a$ ile ölçekle, $a<0$ ise aynala; (2) sonra $b/a$ kadar ötele ($b/a$ negatifse sağa, pozitifse sola). Diğer güvenli sıra da şudur: <strong>önce $b$ kadar ötele, sonra $a$ ile ölçekle</strong>. İki sıra da aynı sonucu verir. Yanlış olan tek şey, sırayı karıştırıp “önce ölçekle, sonra $b$ kadar ötele” yapmaktır.` },
      { t: 'trap', h: T`$x(2t - 6)$ için “2 kat sıkıştır, sonra 6 sağa kaydır” <strong>yanlıştır</strong>. Doğrusu: $x(2(t-3))$ → 2 kat sıkıştır, sonra <strong>3</strong> sağa kaydır. Ya da önce 6 sağa kaydır ($x(t-6)$), sonra 2 kat sıkıştır.` },
      { t: 'recipe', title: 'En güvenli yöntem: kritik noktalar', steps: [
        T`$x(t)$’nin kırılma noktalarını listele ($t_k$: sinyalin başladığı, eğim değiştirdiği, bittiği yerler).`,
        T`Yeni sinyalde aynı olay, $at + b = t_k$ olduğunda olur: $\;t = \dfrac{t_k - b}{a}$.`,
        T`Bu noktalarda $x$’in değerlerini aynen taşı. $a<0$ ise sıra ters döner.`,
        T`Son olarak genliği uygula: $A\cdot(\text{değer}) + B$. $B$ eklenince sinyalin sıfır olduğu yerler de $B$ olur!`] },
      { t: 'example', src: 's. 50–51', q: T`$x(t) = 3t$ ($0<t<1$), $3$ ($1<t<2$), $0$ (diğer). (a) $x(2t-6)$ ve (b) $x\!\left(\frac{t}{2}+1\right)$ sinyallerini çiz.`,
        fig: spec([-1, 3], [-0.4, 3.6], [fn(xs50, 'x')], { xStep: 1, title: 'x(t)' }),
        steps: [T`Kritik noktalar: $t_k = 0, 1, 2$ (değerler $0 \nearrow 3$, sonra $3$, sonra düşüş).`,
          T`(a) $a=2$, $b=-6$: $\;t = \frac{t_k + 6}{2}$ → $3,\; 3.5,\; 4$. Yani $3<t<3.5$’ta rampa, $3.5<t<4$’te 3.`,
          T`Formülle kontrol: $0<2t-6<1$ → $3<t<3.5$, değer $3(2t-6) = 6t - 18$. $\;1<2t-6<2$ → $3.5<t<4$, değer 3.`,
          T`(b) $a=\frac12$, $b=1$: $\;t = \frac{t_k - 1}{1/2} = 2(t_k - 1)$ → $-2,\; 0,\; 2$. Rampa $-2<t<0$’da: $3(\frac{t}{2}+1) = 1.5t + 3$. $0<t<2$’de 3.`,
          { fig: [spec([-3, 5], [-0.4, 3.6], [fn((t) => xs50(2 * t - 6), 'y')], { xStep: 1, title: 'x(2t − 6)' }), spec([-3, 5], [-0.4, 3.6], [fn((t) => xs50(t / 2 + 1), 'y')], { xStep: 1, title: 'x(t/2 + 1)' })] }],
        ans: T`(a) $6t - 18$ ($3<t<3.5$), $3$ ($3.5<t<4$). (b) $1.5t + 3$ ($-2<t<0$), $3$ ($0<t<2$).` },
      { t: 'example', src: 's. 52c', q: T`Aynı $x(t)$ için $y(t) = -1 + 2x(t)$ sinyalini çiz.`,
        steps: [T`Zaman ekseni değişmez. Yalnızca genlik: önce 2 ile çarp, sonra 1 çıkar.`, T`$0<t<1$: $2\cdot 3t - 1 = 6t - 1$. $\;1<t<2$: $2\cdot3 - 1 = 5$.`, T`<strong>Diğer yerlerde</strong> $2\cdot 0 - 1 = -1$. Bunu unutma!`,
          { fig: spec([-1.5, 3], [-1.6, 6], [fn((t) => -1 + 2 * xs50(t), 'y', { fill: false })], { xStep: 1, yStep: 2 }) }],
        ans: T`$y(t) = 6t - 1$ ($0<t<1$), $5$ ($1<t<2$), $-1$ (diğer)` },
      { t: 'lab', id: 'transform' },
      { t: 'hw', src: 's. 52', q: T`Aynı $x(t)$ ile (a) $x(2t+4)$, (b) $-2x(t-1)$, (c) $2 + x(-t)$ sinyallerini çiz.`, hint: T`Kritik noktalar yöntemi: $t = (t_k - b)/a$, $t_k = 0, 1, 2$.`,
        steps: [T`(a) $a = 2$, $b = 4$: $t = \frac{t_k - 4}{2}$ → $-2, -1.5, -1$. Rampa $6t + 12$ ($-2<t<-1.5$), sonra 3 ($-1.5<t<-1$).`,
          T`(b) Önce $x(t-1)$: kritik noktalar $1, 2, 3$. Sonra $-2$ ile çarp: $-6(t-1)$ ($1<t<2$), $-6$ ($2<t<3$).`,
          T`(c) $x(-t)$: kritik noktalar $0, -1, -2$ (ayna). $-3t$ ($-1<t<0$), $3$ ($-2<t<-1$). Sonra $+2$: $2 - 3t$ ($-1<t<0$), $5$ ($-2<t<-1$), <strong>2 (diğer)</strong>.`],
        ans: T`Laboratuvarda “Hazır soru” listesinden üçünü de seçip kendi çizimini kontrol et.` },

      { t: 'h', h: 'Ayrık zamanda işlemler', src: 's. 53' },
      { t: 'p', h: T`Mantık aynı, tek fark: $n$ yalnızca tam sayıdır. $x[2n]$ <strong>seyreltme</strong>dir: tek indisli örnekler kaybolur. $x[n/2]$ <strong>genişletme</strong>dir: $n/2$ tam sayı olmayan yerlerde değer yoktur, 0 alınır. En güvenli yol tablo yöntemidir: her $n$ için içerideki indeksi hesapla, değeri oku.` },
      { t: 'example', src: 's. 53', q: T`$x[n] = \{\underbrace{3}_{\uparrow}, 3, 2, 1, 1\}$ ($n = 0\ldots4$). (a) $x[n-3]$, (b) $x[-n+3]$, (c) $x[2n]$ dizilerini bul.`,
        fig: spec([-4.6, 8.6], [-0.3, 3.8], [stems((n) => ({ 0: 3, 1: 3, 2: 2, 3: 1, 4: 1 }[n] || 0), -4, 8)], { xLabel: 'n', xStep: 1 }),
        steps: [T`(a) 3 sağa: $n = 3\ldots7$’de $3, 3, 2, 1, 1$.`, T`(b) $x[-(n-3)]$: önce ayna ($x[-n]$, $n=-4\ldots0$’da $1,1,2,3,3$), sonra 3 sağa: $n = -1\ldots3$’te $1, 1, 2, 3, 3$.`,
          T`(c) $y[n] = x[2n]$: $y[0] = x[0] = 3$, $y[1] = x[2] = 2$, $y[2] = x[4] = 1$. $x[1]$ ve $x[3]$ kayboldu.`],
        ans: T`(a) $\{0,0,0,\underbrace{3}_{n=3},3,2,1,1\}$ · (b) $n=-1\ldots3$: $\{1,1,2,3,3\}$ · (c) $\{\underbrace{3}_{\uparrow}, 2, 1\}$` },
      { t: 'hw', src: 's. 53', q: T`Aynı diziyle (a) $x[-n]$, (b) $x[n+2]$, (c) $x[n/2]$.`,
        steps: [T`(a) Ayna: $n=-4\ldots0$’da $1, 1, 2, 3, 3$.`, T`(b) 2 sola: $n=-2\ldots2$’de $3, 3, 2, 1, 1$.`, T`(c) $n$ çift olunca $x[n/2]$: $y[0]=3$, $y[2]=3$, $y[4]=2$, $y[6]=1$, $y[8]=1$. Tek $n$’lerde 0.`],
        ans: T`Laboratuvarın “Ayrık zaman” sekmesinde üçü de hazır.` },
      { t: 'quiz', items: [
        { q: T`$x(t)$, $0<t<4$ aralığında sıfırdan farklı. $x(-2t+2)$ hangi aralıkta sıfırdan farklıdır?`, opts: ['$-1 < t < 1$', '$1 < t < 3$', '$-3 < t < -1$'], a: 0, why: T`$0 < -2t + 2 < 4$ → $-2 < -2t < 2$ → $-1 < t < 1$. (Negatif sayıyla bölünce eşitsizlik yön değiştirir.)` },
        { q: T`$x(t-3)$ için doğru ifade hangisi?`, opts: ['3 birim sola kayar', '3 birim sağa kayar', '3 kat genişler'], a: 1, why: T`$t - 3 = 0$ → $t = 3$: olaylar 3 saniye gecikir.` },
        { q: T`$x[n] = \{1, 2, 3, 4\}$ ($n=0\ldots3$) ise $x[2n]$ nedir?`, opts: ['$\\{1, 3\\}$', '$\\{1, 0, 2, 0, 3, 0, 4\\}$', '$\\{2, 4\\}$'], a: 0, why: T`$y[0]=x[0]=1$, $y[1]=x[2]=3$. Çift indisliler kalır.` }] }
    ]
  });
})();
