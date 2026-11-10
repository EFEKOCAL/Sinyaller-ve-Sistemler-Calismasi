/*
 * Bölüm 2 · LTI sistemler (1): 2.1 İmpuls cevabı ve konvolüsyon integrali · 2.2 Grafik konvolüsyon
 *                              2.3 Blok diyagramlar · 2.4 h'den bellek, nedensellik, kararlılık
 * Kaynak: Ömer Akgün, Sinyaller ve Sistemler ders notları, s. 69–89 ve 99–100
 */
(function () {
  'use strict';
  const SS = window.SS;
  SS.lessons = SS.lessons || [];
  const T = String.raw;
  const fn = (f, color, o) => Object.assign({ kind: 'fn', f, color: color || 'x', fill: true, alpha: 0.12, n: 2000 }, o || {});
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 170, xLabel: 't', layers }, o || {});
  const u = (t) => (t >= 0 ? 1 : 0);
  const h75 = (t) => (t >= -2 && t < 0 ? 2 + t : t >= 0 && t < 2 ? 2 : 0);
  const y75 = (t) => (t < -2 ? 0 : t < 0 ? 0.5 * t * t + 2 * t + 2 : t < 2 ? 2 * (t + 1) : 6);
  // τ ekseninde: sabit h(τ), kayan x(t−τ) = u(t−τ)
  const snap75 = (t) => spec([-4, 4], [-0.3, 2.6], [
    { kind: 'area', f: (s) => h75(s) * u(t - s), color: 'y', alpha: 0.35, n: 2000 },
    fn(h75, 'h', { fill: false }), fn((s) => u(t - s), 'x', { fill: false, w: 2.6 }), { kind: 'vline', x: t, color: 'accent', label: 't' }], { xLabel: 'τ', xStep: 1, title: 'h(τ) ve x(t − τ), t = ' + t });

  const derivTable = T`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Giriş</th><th></th><th>Çıkış</th><th>Neden?</th></tr></thead><tbody>
<tr><td>$\delta(t)$</td><td>→</td><td>$h(t)$</td><td>impuls cevabının tanımı</td></tr>
<tr><td>$\delta(t-\tau)$</td><td>→</td><td>$h(t-\tau)$</td><td>zamanla değişmezlik</td></tr>
<tr><td>$x(\tau)\,\delta(t-\tau)$</td><td>→</td><td>$x(\tau)\,h(t-\tau)$</td><td>homojenlik ($x(\tau)$ bir sayı)</td></tr>
<tr><td>$\int x(\tau)\,\delta(t-\tau)\,d\tau$</td><td>→</td><td>$\int x(\tau)\,h(t-\tau)\,d\tau$</td><td>toplamsallık (integral = sonsuz toplam)</td></tr>
<tr><td>$= x(t)$ (elek özelliği)</td><td>→</td><td>$= y(t)$</td><td></td></tr></tbody></table></div>`;

  /* ====================================================================== */
  SS.lessons.push({
    id: '2.1', chap: 'lti', title: 'İmpuls cevabı ve konvolüsyon integrali', pages: 's. 69–74',
    sub: 'h(t) = T{δ(t)}, y = x ∗ h, konvolüsyon özellikleri',
    lead: 'Bir sistem hem lineer hem zamanla değişmez ise (LTI), onun hakkında bilinmesi gereken her şey tek bir sinyalde saklıdır: impuls cevabı $h(t)$. Herhangi bir girişin çıkışı, $x$ ile $h$’nin <strong>konvolüsyonudur</strong>.',
    goals: ['$h(t)$’nin neden her şeyi anlattığını görmek', 'Konvolüsyon integralini türetmek', 'Özellikleri kullanmak ($\\delta$, kaydırma, $u$)', 'Analitik konvolüsyon hesabı'],
    blocks: [
      { t: 'idea', h: T`Bir odanın akustiğini öğrenmek için içinde bir kez el çırparsın (bir impuls) ve yankıyı kaydedersin: $h(t)$. Artık o odada çalınan <em>herhangi</em> bir müziğin nasıl duyulacağını hesaplayabilirsin. Müziği çok kısa “el çırpmalarının” toplamı gibi düşün. Her çırpma, yüksekliğiyle ölçeklenmiş ve zamanında başlayan bir yankı üretir. Bütün yankıları topladığında çıkışı bulursun. Bu toplama işleminin adı <strong>konvolüsyon</strong>dur.` },
      { t: 'h', h: 'Konvolüsyon integrali nereden çıkıyor?', src: 's. 69' },
      { t: 'p', h: T`Elek özelliğinden başla: her sinyal, kaydırılmış impulsların “toplamıdır”: $x(t) = \int x(\tau)\,\delta(t-\tau)\,d\tau$. Sonra LTI özelliklerini sırayla uygula:` },
      { t: 'html', h: derivTable },
      { t: 'def', title: 'Konvolüsyon integrali (s. 69)', h: T`$$h(t) = T\{\delta(t)\} \qquad\qquad \boxed{y(t) = x(t) * h(t) = \int_{-\infty}^{\infty} x(\tau)\,h(t-\tau)\,d\tau}$$` },
      { t: 'lab', id: 'decomp' },
      { t: 'def', title: 'Konvolüsyonun özellikleri (s. 70–71)', h: T`1. Değişme: $x * h = h * x$ &nbsp;&nbsp; 2. Dağılma: $f * (x + y) = f*x + f*y$ &nbsp;&nbsp; 3. Birleşme: $f*(x*y) = (f*x)*y$<br>
4. $f(t) * \delta(t) = f(t)$ &nbsp;&nbsp; 5. $f(t) * \delta(t-t_0) = f(t-t_0)$ &nbsp;&nbsp; 6. $f(t) * \delta'(t) = f'(t)$<br>
7. $f(t) * u(t) = \int_{-\infty}^{t} f(\tau)\,d\tau$ &nbsp;&nbsp; 8. $u(t) * \delta'(t) = \delta(t)$<br>
9. $x_1 * x_2 = y$ ise $x_1(t-t_1) * x_2(t-t_2) = y(t - t_1 - t_2)$ &nbsp;&nbsp; 10. $x_1(at) * x_2(at) = \frac{1}{|a|}y(at)$ &nbsp;&nbsp; 11. $x_1(-t)*x_2(-t) = y(-t)$` },
      { t: 'idea', title: 'Notta 10. özelliğin yazılışı', h: T`Notta 10. özellik “$y(at) = a\,x_1(at) * x_2(at)$, $a>0$” şeklinde yazılmış. Bu, yukarıdaki $x_1(at)*x_2(at) = \frac{1}{a}y(at)$ ile aynı şeydir. Yalnızca tarafların yeri farklı, ikisi de doğru.` },
      { t: 'idea', title: 'Özellikleri nasıl kullanırsın?', h: T`$\delta$, konvolüsyonun “1”idir: hiçbir şey değiştirmez. $\delta(t-t_0)$ ile konvolüsyon, sinyali $t_0$ kadar geciktirir. $u(t)$ ile konvolüsyon, integral alır (birikimli alan). 9. özellik ise şunu söyler: sinyalleri kaydırırsan sonuç, kaymaların <em>toplamı</em> kadar kayar. Bu yüzden önce kaymaları atıp merkezde hesap yap, sonra sonucu kaydır.` },
      { t: 'example', src: 's. 72', q: T`$x(t) = e^{-t^2}$ ve $y(t) = 2t^2$ sinyallerinin konvolüsyonunu bul.`,
        steps: [T`$z(t) = \int x(\tau)\,y(t-\tau)\,d\tau = \int e^{-\tau^2}\,2(t-\tau)^2\,d\tau = \int e^{-\tau^2}[2t^2 - 4t\tau + 2\tau^2]\,d\tau$`,
          T`Üç integrale ayır: $z = 2t^2\int e^{-\tau^2}d\tau - 4t\int \tau e^{-\tau^2}d\tau + 2\int \tau^2 e^{-\tau^2}d\tau$`,
          T`Bilinen integraller: $\int_{-\infty}^{\infty} e^{-\tau^2}d\tau = \sqrt{\pi}$. Ortadaki integrand <strong>tek</strong> fonksiyon, sonucu 0. $\int \tau^2 e^{-\tau^2}d\tau = \frac{\sqrt{\pi}}{2}$.`,
          T`$z(t) = 2t^2\sqrt{\pi} - 0 + 2\cdot\frac{\sqrt\pi}{2}$`],
        ans: T`$z(t) = 2\sqrt{\pi}\,t^2 + \sqrt{\pi} \approx 3.545t^2 + 1.772$` },
      { t: 'hw', src: 's. 72', q: T`$f(t) = e^{-2t^2}$ ve $g(t) = t$ sinyallerinin konvolüsyonunu bul.`, hint: T`$\int e^{-a\tau^2}d\tau = \sqrt{\pi/a}$. Tek fonksiyonun simetrik integrali 0’dır.`,
        steps: [T`$z(t) = \int e^{-2\tau^2}(t - \tau)\,d\tau = t\int e^{-2\tau^2}d\tau - \int \tau e^{-2\tau^2}d\tau$`, T`İkinci integral tek fonksiyonun integrali: 0. Birincisi $\sqrt{\pi/2}$.`],
        ans: T`$z(t) = \sqrt{\pi/2}\;t \approx 1.253\,t$` },
      { t: 'example', src: 's. 73', title: 'Basamak girişine cevap', q: T`İmpuls cevabı $h(t) = e^{-3t}u(t)$ olan LTI sistemin girişi $x(t) = u(t)$. Çıkışı bul.`,
        steps: [T`$y(t) = \int x(\tau)h(t-\tau)d\tau = \int u(\tau)\,e^{-3(t-\tau)}\,u(t-\tau)\,d\tau$`,
          T`$u(\tau) = 1$ için $\tau > 0$, $\;u(t-\tau) = 1$ için $\tau < t$. Çarpımları: $u(\tau)u(t-\tau) = 1$ yalnızca $\hl{0 < \tau < t}$ aralığında (ve bu aralık yalnızca $t>0$ ise var).`,
          T`$y(t) = e^{-3t}\int_0^t e^{3\tau}\,d\tau = e^{-3t}\cdot\frac{e^{3t} - 1}{3} = \frac13(1 - e^{-3t})$, $\;t>0$`],
        ans: T`$y(t) = \frac{1}{3}\left(1 - e^{-3t}\right)u(t)$. Bu aslında sistemin <strong>basamak cevabıdır</strong> (Ders 2.6).` },
      { t: 'erratum', src: 's. 73 ve 86', h: T`Notta $u(\tau)u(t-\tau) = 1$ için aralık “$0 < t < \tau$” yazılmış. Doğrusu <strong>$0 < \tau < t$</strong>’dir: integral değişkeni $\tau$, $0$ ile $t$ arasında olmalı. Sonraki satırdaki $\int_0^t$ zaten doğru sınırları kullanıyor.` },
      { t: 'hw', src: 's. 74', q: T`$x(t) = r(t) = t\,u(t)$ ve $h(t) = u(t)$ ise $y(t)$’yi bul.`, hint: T`7. özellik: $f * u = \int_{-\infty}^{t} f$.`,
        steps: [T`$y(t) = r(t) * u(t) = \int_{-\infty}^{t} r(\tau)\,d\tau$`, T`$t<0$: 0. $\;t>0$: $\int_0^t \tau\,d\tau = \frac{t^2}{2}$`], ans: T`$y(t) = \frac{t^2}{2}u(t)$. Grafik konvolüsyon laboratuvarında “ödev s. 74” seçeneğiyle izle.` },
      { t: 'quiz', items: [
        { q: T`$x(t) * \delta(t-3)$ nedir?`, opts: ['$x(3)$', '$x(t-3)$', '$x(t)\\delta(t-3)$'], a: 1, why: T`İmpulsla konvolüsyon, sinyali impulsun yerine taşır (5. özellik).` },
        { q: T`$x_1 * x_2 = y$ ise $x_1(t-1) * x_2(t+4)$ nedir?`, opts: ['$y(t+3)$', '$y(t-5)$', '$y(t+5)$'], a: 0, why: T`Kaymalar toplanır: $-1 + 4 = +3$, yani $y(t - 1 + 4) = y(t+3)$.` },
        { q: 'LTI bir sistemi tam olarak tanımlamak için ne yeterlidir?', opts: ['Basamak girişine cevabı ya da impuls cevabı', 'Yalnızca kararlı olduğunu bilmek', 'Sinüs girişine tek bir cevap'], a: 0, why: T`$h(t)$ her şeyi belirler. Basamak cevabı da yeterlidir, çünkü $h = ds/dt$.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '2.2', chap: 'lti', title: 'Grafik konvolüsyon', pages: 's. 74–84',
    sub: 'Çevir, kaydır, çarp, integral al; aralıkları bulmak',
    lead: 'Parçalı tanımlı sinyallerin konvolüsyonu, sınavın en uzun ve en çok puan getiren sorusudur. Yöntem mekaniktir: bir sinyali çevirip kaydırırsın ve her “örtüşme durumu” için ayrı bir integral yazarsın.',
    goals: ['Dört adımı uygulamak', 'Aralık sınırlarını kenarlardan bulmak', 'Hangi sinyali çevireceğine karar vermek', 'Sonucun süresini önceden bilmek'],
    blocks: [
      { t: 'recipe', title: 'Grafik yöntem (s. 74)', steps: [
        T`<strong>Katlama:</strong> $h(\tau)$’nun dikey eksene göre aynasını al: $h(-\tau)$.`,
        T`<strong>Öteleme:</strong> $h(-\tau)$’yu $t$ kadar kaydır: $h(t-\tau)$. $t$ arttıkça sağa kayar.`,
        T`<strong>Çarpma:</strong> $x(\tau)$ ile $h(t-\tau)$’yu çarp.`,
        T`<strong>İntegral:</strong> çarpımın integralini <em>örtüşme aralığı</em> üzerinden al. Her $t$ aralığı için ayrı bir ifade çıkar.`] },
      { t: 'idea', title: 'Aralıklar nerede değişir?', h: T`Kayan sinyalin bir <strong>kenarı</strong>, sabit sinyalin bir kenarını geçtiği anda integralin sınırları değişir. Kayan sinyal $[t-b,\; t-a]$ aralığında, sabit sinyal $[c, d]$ aralığındaysa kritik anlar $t - a = c$, $t - b = c$, $t - a = d$, $t - b = d$ eşitliklerinden gelir. Ayrıca sonuç her zaman $[a + c,\; b + d]$ aralığında sıfırdan farklıdır. Süreler toplanır. Bunu cevabını kontrol etmek için kullan.` },
      { t: 'trap', h: T`Değişme özelliği sayesinde hangisini çevireceğini sen seçersin: <strong>daha basit olanı çevir</strong> (genelde basamak veya dikdörtgen). Notun s. 75 örneğinde bu yüzden $x = u(t)$ çevrilmiştir: $y = \int x(t-\tau)h(\tau)d\tau$. Bir de sınırları karıştırma: integralin sınırları, iki sinyalin de sıfırdan farklı olduğu aralığın <em>kesişimidir</em>.` },
      { t: 'example', src: 's. 75–78', title: 'Nottaki ana örnek', q: T`$x(t) = u(t)$ ve $h(t) = 2 + t$ ($-2<t<0$), $2$ ($0<t<2$). Konvolüsyonu bul.`,
        fig: [spec([-3, 4], [-0.3, 1.5], [fn(u, 'x')], { title: 'x(t) = u(t)', xStep: 1 }), spec([-3, 4], [-0.3, 2.6], [fn(h75, 'h')], { title: 'h(t)', xStep: 1 })],
        steps: [
          T`Basit olanı ($x = u$) çevir: $y(t) = \int x(t-\tau)\,h(\tau)\,d\tau$. $x(t-\tau) = u(t-\tau)$, $\tau < t$ için 1’dir: kenarı $\tau = t$’de olan, <strong>sola doğru uzanan</strong> bir basamak.`,
          { h: T`<strong>$t < -2$:</strong> basamağın kenarı $h$’nin başladığı $-2$’ye ulaşmadı. Örtüşme yok: $y(t) = 0$.`, fig: snap75(-2.6) },
          { h: T`<strong>$-2 < t < 0$:</strong> örtüşme $-2 < \tau < t$, yalnızca rampa kısmı. $\;y = \int_{-2}^{t}(2+\tau)\,d\tau = \left[2\tau + \frac{\tau^2}{2}\right]_{-2}^{t} = 0.5t^2 + 2t + 2$`, fig: snap75(-0.8) },
          { h: T`<strong>$0 < t < 2$:</strong> rampanın tamamı ve düz kısmın $0$’dan $t$’ye kadarı. $\;y = \int_{-2}^{0}(2+\tau)d\tau + \int_0^t 2\,d\tau = 2 + 2t = 2(t+1)$`, fig: snap75(1.2) },
          { h: T`<strong>$t > 2$:</strong> $h$’nin tamamı örtüşüyor. $\;y = 2 + \int_0^2 2\,d\tau = 2 + 4 = 6$`, fig: snap75(3) }],
        ans: T`$y(t) = \begin{cases} 0 & t < -2 \\ 0.5t^2 + 2t + 2 & -2 \le t \le 0 \\ 2(t+1) & 0 \le t \le 2 \\ 6 & t > 2\end{cases}$ &nbsp; Kontrol: sınırlarda süreklilik var ($y(-2) = 0$, $y(0) = 2$, $y(2) = 6$).` },
      { t: 'fig', fig: spec([-3, 4], [-0.4, 7], [fn(y75, 'y')], { xStep: 1, yStep: 2 }), cap: 'Sonuç $y(t)$ (not s. 78): parabol, sonra doğru, sonra sabit.' },
      { t: 'erratum', src: 's. 75', h: T`Notta $h(t)$’nin formülünde $0<t<2$ için değer “1” yazılmış. Şekil ve sonraki hesaplar (s. 77: $\int_0^t (2)(1)d\tau$) değerin <strong>2</strong> olduğunu gösteriyor. Doğrusu: $h(t) = 2$, $0<t<2$.` },
      { t: 'lab', id: 'conv' },
      { t: 'example', src: 's. 79–80', q: T`$x(t) = e^{-at}u(t)$ ($a>0$) ve $h(t) = u(t)$. Konvolüsyonu bul.`,
        steps: [T`Bu kez $h$ çevriliyor: $h(t-\tau) = u(t-\tau)$, $\tau < t$ için 1.`, T`$t < 0$: $x(\tau)$ yalnızca $\tau>0$’da var, kayan basamak ise $\tau < t < 0$’da. Çarpım 0.`,
          T`$t > 0$: örtüşme $0 < \tau < t$. $\;y = \int_0^t e^{-a\tau}d\tau = -\frac{1}{a}e^{-a\tau}\Big|_0^t = \frac{1}{a}(1 - e^{-at})$`],
        ans: T`$y(t) = \frac{1}{a}\left(1 - e^{-at}\right)u(t)$. $t \to \infty$ iken $1/a$’ya yaklaşır.` },
      { t: 'example', src: 's. 81–83', q: T`$x_1(t) = t^2$ ($0<t<1$) ve $x_2(t) = 1$ ($-1<t<1$). Konvolüsyonu bul.`,
        steps: [T`$x_1$ çevrilip kaydırılıyor: $x_1(t-\tau) = (t-\tau)^2$, $\;0 < t - \tau < 1$, yani $t - 1 < \tau < t$.`,
          T`$t < -1$: kayan parçanın sağ ucu ($t$) sabit dikdörtgenin sol ucunu ($-1$) geçmedi. $y = 0$.`,
          T`$-1 < t < 0$: örtüşme $-1 < \tau < t$. $\;y = \int_{-1}^{t}(t-\tau)^2 d\tau = \left.\frac{(t-\tau)^3}{-3}\right|_{-1}^{t} = \frac{(t+1)^3}{3}$`,
          T`$0 < t < 1$: kayan parça tamamen içeride ($t-1 < \tau < t$). $\;y = \int_{t-1}^{t}(t-\tau)^2d\tau = \frac13$`,
          T`$1 < t < 2$: örtüşme $t - 1 < \tau < 1$. $\;y = \left.\frac{(t-\tau)^3}{-3}\right|_{t-1}^{1} = \frac13 - \frac{(t-1)^3}{3}$`, T`$t > 2$: $y = 0$.`],
        ans: T`$y(t) = \frac13(t+1)^3$ ($-1<t<0$), $\;\frac13$ ($0<t<1$), $\;\frac13 - \frac13(t-1)^3$ ($1<t<2$), $\;0$ (diğer). Süre kontrolü: $[0,1] + [-1,1] \Rightarrow [-1, 2]$ ✓` },
      { t: 'hw', src: 's. 78', q: T`$x(t) = 1$ ($0<t<1$) ve $y(t) = t$ ($0<t<2$) sinyallerinin konvolüsyonunu bul.`, hint: T`Dikdörtgeni çevir. Sonuç $[0, 3]$ aralığında sıfırdan farklı olacak. Kritik anlar: $t = 0, 1, 2, 3$.`,
        steps: [T`$z(t) = \int y(\tau)\,x(t-\tau)\,d\tau$. $x(t-\tau) = 1$ için $t - 1 < \tau < t$.`,
          T`$0<t<1$: örtüşme $0<\tau<t$. $\;z = \int_0^t \tau\,d\tau = \frac{t^2}{2}$`,
          T`$1<t<2$: örtüşme $t-1<\tau<t$. $\;z = \frac{t^2 - (t-1)^2}{2} = t - \frac12$`,
          T`$2<t<3$: örtüşme $t-1<\tau<2$. $\;z = \frac{4 - (t-1)^2}{2}$`, T`Diğer yerlerde 0.`],
        ans: T`$z(t) = \frac{t^2}{2}$ ($0<t<1$), $\;t - \frac12$ ($1<t<2$), $\;\frac{4-(t-1)^2}{2}$ ($2<t<3$). Laboratuvarda “ödev s. 78” ile kontrol et.` },
      { t: 'hw', src: 's. 84', q: T`$x(t) = \sin\pi t$ ($0<t<1$) ve $y(t) = 1$ ($0<t<1$) sinyallerinin konvolüsyonunu grafik olarak bul.`,
        steps: [T`Dikdörtgeni çevir: $t - 1 < \tau < t$ aralığında 1.`, T`$0<t<1$: $\int_0^t \sin\pi\tau\,d\tau = \frac{1 - \cos\pi t}{\pi}$`,
          T`$1<t<2$: $\int_{t-1}^{1}\sin\pi\tau\,d\tau = \frac{-\cos\pi + \cos\pi(t-1)}{\pi} = \frac{1 - \cos\pi t}{\pi}$. ($\cos(\pi t - \pi) = -\cos\pi t$ olduğu için aynı ifade çıkıyor.)`],
        ans: T`$z(t) = \frac{1 - \cos\pi t}{\pi}$, $\;0<t<2$. Tepe değeri $t=1$’de $\frac{2}{\pi}$, yani yarım sinüsün alanı.` },
      { t: 'quiz', items: [
        { q: T`$[0, 3]$ aralığındaki bir sinyal ile $[-1, 2]$ aralığındaki bir sinyalin konvolüsyonu hangi aralıkta sıfırdan farklıdır?`, opts: ['$[-1, 5]$', '$[0, 2]$', '$[-1, 3]$'], a: 0, why: T`Başlangıçlar ve bitişler toplanır: $0 + (-1) = -1$, $3 + 2 = 5$.` },
        { q: T`İki eş dikdörtgenin konvolüsyonunun şekli nedir?`, opts: ['Dikdörtgen', 'Üçgen', 'Parabol'], a: 1, why: 'Örtüşme alanı önce doğrusal artar, sonra doğrusal azalır. Laboratuvarda “İki dikdörtgen” örneğini dene.' },
        { q: T`$y(t) = \int x(\tau)h(t-\tau)d\tau$ yazımında hangi sinyal kayar?`, opts: ['$x$', '$h$', 'İkisi de'], a: 1, why: T`$t$ hangi sinyalin içindeyse o kayar. Burada $h(t-\tau)$.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '2.3', chap: 'lti', title: 'Blok diyagramlar', pages: 's. 84–87',
    sub: 'Seri bağlama = konvolüsyon, paralel = toplam',
    lead: 'Büyük sistemler küçük LTI bloklardan kurulur. İki kural yeterli: seri bloklar konvolüsyonla, paralel bloklar toplamla birleşir.',
    goals: ['Seri bağlamanın eşdeğeri', 'Paralel bağlamanın eşdeğeri', 'Karışık diyagramı adım adım sadeleştirmek'],
    blocks: [
      { t: 'def', title: 'Kurallar (s. 84–85)', h: T`<strong>Seri:</strong> $x \to h_1 \to h_2 \to y \;\equiv\; x \to h_1 * h_2 \to y$. Sıra önemli değil (değişme özelliği): $h_1 * h_2 = h_2 * h_1$.<br><strong>Paralel:</strong> iki kol aynı girişi alır, çıkışlar toplanır: $\;h = h_1 + h_2$.<br><strong>Rol değişimi:</strong> $x \to [h] \to y \;\equiv\; h \to [x] \to y$. Giriş ile sistem yer değiştirebilir.` },
      { t: 'lab', id: 'blocks' },
      { t: 'example', src: 's. 85–86', q: T`Şekildeki sistemin impuls cevabını bul. Üst kol $h_3 \to h_4$, alt kol $h_1 \to h_2$, kollar toplanıyor. $h_1 = 3\delta(t)$, $h_2 = 2e^{-t}u(t)$, $h_3 = 4e^{-2t}u(t)$, $h_4 = e^{-3t}u(t)$.`,
        steps: [T`Yapı: $h(t) = h_1 * h_2 + h_3 * h_4$ (her kol seri, kollar paralel).`,
          T`Alt kol: $h_1 * h_2 = 3\delta(t) * 2e^{-t}u(t) = 6e^{-t}u(t)$, çünkü $x * \delta = x$.`,
          T`Üst kol: $h_3 * h_4 = \int 4e^{-2\tau}u(\tau)\,e^{-3(t-\tau)}u(t-\tau)\,d\tau$. Örtüşme $0<\tau<t$.`,
          T`$= 4e^{-3t}\int_0^t e^{(3-2)\tau}d\tau = 4e^{-3t}(e^{t} - 1) = 4(e^{-2t} - e^{-3t})$, $\;t > 0$`],
        ans: T`$h(t) = 6e^{-t}u(t) + 4\left(e^{-2t} - e^{-3t}\right)u(t)$. Laboratuvarın üçüncü sekmesinde çizimi var.` },
      { t: 'hw', src: 's. 87', q: T`$h_1(t) = 2e^{-t}u(t)$ ve $h_2(t) = 4e^{-2t}u(t)$ seri bağlı. Eşdeğer impuls cevabını bul.`, hint: T`Bir önceki örneğin üst koluyla aynı adımlar: örtüşme $0<\tau<t$, üsleri birleştir.`,
        steps: [T`$h = h_1 * h_2 = \int_0^t 2e^{-\tau}\cdot 4e^{-2(t-\tau)}d\tau = 8e^{-2t}\int_0^t e^{\tau}d\tau$`, T`$= 8e^{-2t}(e^{t} - 1) = 8(e^{-t} - e^{-2t})$, $\;t>0$`],
        ans: T`$h(t) = 8\left(e^{-t} - e^{-2t}\right)u(t)$` },
      { t: 'quiz', items: [
        { q: T`$h_1 = \delta(t-2)$ ile $h_2 = \delta(t-3)$ seri bağlanırsa eşdeğer sistem nedir?`, opts: ['$\\delta(t-5)$', '$\\delta(t-6)$', '$\\delta(t-2)+\\delta(t-3)$'], a: 0, why: T`Seri: konvolüsyon. Gecikmeler toplanır: toplam 5 saniye gecikme.` },
        { q: T`Aynı iki sistem paralel bağlanırsa?`, opts: ['$\\delta(t-5)$', '$\\delta(t-2)+\\delta(t-3)$'], a: 1, why: 'Paralel: toplam. Çıkış, girişin 2 ve 3 saniye gecikmiş kopyalarının toplamıdır (yankı gibi).' }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '2.4', chap: 'lti', title: 'h’den bellek, nedensellik, kararlılık', pages: 's. 87–89, 99–100',
    sub: 'LTI sistemin özelliklerini impuls cevabından okumak',
    lead: '1.8–1.11’de her özellik için ayrı bir test yapmıştık. LTI sistemlerde buna gerek yok: üç özellik de yalnızca $h(t)$’ye bakılarak okunur.',
    goals: ['Belleksiz ⇔ $h = K\\delta$', 'Nedensel ⇔ $t<0$ için $h = 0$', 'Kararlı ⇔ $\\int|h| < \\infty$', 'Sürekli ve ayrık zamanda uygulamak'],
    blocks: [
      { t: 'def', title: 'Üç test (s. 87, 99)', h: T`<strong>Belleksiz:</strong> $y(t) = Kx(t)$ ⇔ $h(t) = K\delta(t)$. Yani $t_0 \ne 0$ için $h(t_0) = 0$. Değilse bellekli.<br>
<strong>Nedensel:</strong> $h(t) = 0$, $\;t < 0$ &nbsp;&nbsp;&nbsp; (ayrık: $h[n] = 0$, $n<0$)<br>
<strong>Kararlı:</strong> $\displaystyle\int_{-\infty}^{\infty}|h(\tau)|\,d\tau < \infty$ &nbsp;&nbsp;&nbsp; (ayrık: $\sum_k |h[k]| < \infty$)` },
      { t: 'idea', title: 'Neden böyle?', h: T`Konvolüsyonu $y(t) = \int h(\tau)\,x(t-\tau)\,d\tau$ şeklinde yaz. <strong>Nedensellik:</strong> $\tau<0$ için $x(t-\tau)$ <em>gelecekteki</em> girişlerdir. Onlara sıfır ağırlık verilmesi için $\tau<0$’da $h(\tau) = 0$ olmalı. <strong>Kararlılık:</strong> $|x| \le B$ ise $|y| \le \int|h(\tau)|\,|x(t-\tau)|\,d\tau \le B\int|h|$. İntegral sonluysa çıkış sınırlıdır. <strong>Bellek:</strong> $h$ yalnızca $\tau=0$’da bir impulsa sahipse integral sadece $x(t)$’yi kullanır.` },
      { t: 'example', src: 's. 88', q: T`$h(t) = e^{-t}u(t)$ olan sistem bellekli mi, nedensel mi, kararlı mı?`,
        steps: [T`$t>0$ için $h(t) \ne 0$: bellekli (geçmiş girişleri “hatırlıyor”).`, T`$t<0$ için $h(t) = 0$: nedensel.`, T`$\int_{-\infty}^{\infty}|h|\,dt = \int_0^\infty e^{-t}dt = \left.-e^{-t}\right|_0^\infty = 1 < \infty$: kararlı.`],
        ans: T`Bellekli, nedensel, kararlı.` },
      { t: 'example', src: 's. 88–89', q: T`$h(t) = 4\delta(t)$ olan sistem bellekli mi, nedensel mi, kararlı mı?`,
        steps: [T`$t \ne 0$ için $h(t) = 0$: belleksiz. Gerçekten $y(t) = 4x(t)$.`, T`$t<0$ için $h = 0$: nedensel.`, T`$\int 4\delta(t)\,dt = 4 < \infty$: kararlı.`],
        ans: T`Belleksiz, nedensel, kararlı.` },
      { t: 'lab', id: 'ltiprops' },
      { t: 'hw', src: 's. 89', q: T`$h(t) = \cos(\pi t)\,u(t+1)$ olan sistem bellekli mi, nedensel mi, kararlı mı?`, hint: T`$u(t+1)$, $t = -1$’de açılır.`,
        steps: [T`Pek çok $t$ için $h \ne 0$: bellekli.`, T`$-1 \le t < 0$ aralığında $h(t) = \cos\pi t \ne 0$: nedensel <strong>değil</strong>.`, T`$\int_{-1}^{\infty}|\cos\pi t|\,dt$: her yarım periyot $\frac{2}{\pi}$ katkı yapar ve sonsuz tane yarım periyot var, toplam $\infty$. Kararsız.`],
        ans: T`Bellekli, nedensel değil, kararsız.` },
      { t: 'h', h: 'Aynı testler ayrık zamanda', src: 's. 99–100' },
      { t: 'example', src: 's. 100', q: T`$h[n] = n\,u[n]$ olan sistem bellekli mi, nedensel mi, kararlı mı?`,
        steps: [T`$h[1] = 1$, $h[2] = 2, \ldots$ sıfırdan farklı: <strong>bellekli</strong>.`, T`$n<0$ için $h[n] = 0$: nedensel.`, T`$\sum_{k=0}^{\infty}|k\,u[k]| = \sum k \to \infty$: kararsız.`],
        ans: T`Bellekli, nedensel, kararsız.` },
      { t: 'erratum', src: 's. 100', h: T`Notta bu örnek için “$h[n] = 0$, $n \ne 0$ olduğundan belleksiz” yazıyor. Bu yanlış: $h[n] = n\,u[n]$ dizisi $n = 1, 2, 3, \ldots$ için sıfırdan farklıdır, yani sistem <strong>belleklidir</strong>. Belleksiz olması için $h[n] = K\delta[n]$ olmalıydı. (Satır muhtemelen bir önceki $4\delta(t)$ örneğinden kopyalanmış.)` },
      { t: 'hw', src: 's. 100', q: T`$h[n] = \alpha^{n-1}u[n-2]$, $|\alpha| < 1$. Bellekli mi, nedensel mi, kararlı mı?`,
        steps: [T`$n \ge 2$ için $h[n] \ne 0$: bellekli.`, T`$n < 2$ için $h = 0$, dolayısıyla $n<0$ için de 0: nedensel.`, T`$\sum_{n=2}^{\infty}|\alpha|^{n-1} = |\alpha| + |\alpha|^2 + \cdots = \frac{|\alpha|}{1 - |\alpha|} < \infty$: kararlı.`],
        ans: T`Bellekli, nedensel, kararlı.` },
      { t: 'quiz', items: [
        { q: T`$h(t) = e^{2t}u(-t)$ için hangisi doğru?`, opts: ['Nedensel ve kararlı', 'Nedensel değil ama kararlı', 'Nedensel ve kararsız'], a: 1, why: T`$t<0$’da sıfırdan farklı: nedensel değil. $\int_{-\infty}^{0}e^{2t}dt = \frac12$: kararlı.` },
        { q: T`$h[n] = \delta[n] - \delta[n-1]$ olan sistem…`, opts: ['belleksiz', 'bellekli, nedensel, kararlı', 'kararsız'], a: 1, why: T`$h[1] = -1 \ne 0$ → bellekli. $n<0$’da 0 → nedensel. $\sum|h| = 2$ → kararlı.` },
        { q: T`$h(t) = u(t) - u(t-5)$ kararlı mı?`, opts: ['Evet', 'Hayır'], a: 0, why: T`$\int|h| = 5$. Sonlu süreli ve sınırlı her $h$ kararlıdır.` }] }
    ]
  });
})();
