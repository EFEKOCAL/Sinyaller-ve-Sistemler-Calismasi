/*
 * Hızlı tekrar: Bölüm 1’deki her soru tipi için "soruyu görünce ne yapılır" işlem basamakları.
 * Her tip: tanıma ipucu → numaralı adımlar → tek satırlık mini örnek. Ayrıntı ilgili derste.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const T = String.raw;
  const L = (id, t) => '<a href="#/ders/' + id + '">' + (t || 'Ders ' + id) + '</a>';

  // Bir soru tipi = başlık + "nasıl tanırım" + adımlar + mini örnek
  const type = (no, title, lesson, src, see, steps, ex) => [
    { t: 'h', h: no + '. ' + title, src },
    { t: 'p', h: T`<strong>Soruyu nasıl tanırım?</strong> ` + see + ' · ' + L(lesson, '→ Ders ' + lesson) },
    { t: 'recipe', title: 'İşlem basamakları', steps },
    { t: 'def', title: 'Mini örnek', h: ex }
  ];

  SS.quickReview = {
    lead: T`Bölüm 1’deki bütün soru tipleri, sınavda uygulayacağın sırayla. Her başlıkta önce soruyu nasıl tanıyacağın, sonra adım adım ne yapacağın, en sonda tek satırlık bir örnek var. Bir adımı anlamadıysan başlığın altındaki bağlantıdan derse dön.`,
    blocks: [
      { t: 'table', head: ['#', 'Soru tipi', 'İlk hamle'], rows: [
        ['1', 'Periyodik mi? Temel periyot? (sürekli)', T`Her terim için $T_i = 2\pi/\omega_i$`],
        ['2', 'Ayrık dizi periyodik mi?', T`$\Omega/2\pi$’yi sadeleştir`],
        ['3', 'Enerji mi, güç mü?', T`Sönüyor mu, periyodik mi? Ona göre $E$ ya da $P$`],
        ['4', 'Çift ve tek bileşen', T`Önce $x(-t)$’yi yaz/çiz`],
        ['5', 'δ’lı integral / çarpım', T`δ’nın sıfır olduğu noktayı bul`],
        ['6', 'Π ve Λ çizimi', T`İçeriyi eşitsizliğe koy`],
        ['7', 'Şekli basamak/rampa ile yaz, türev al', T`Sıçramaları ve eğim değişimlerini listele`],
        ['8', 'Ayrık diziyi δ ile yaz', T`Sıfır olmayan her noktayı bir δ yap`],
        ['9', T`$x(at+b)$, $Ax(\cdot)+B$ çizimi`, T`Kritik noktaları $t \to (t_k-b)/a$ taşı`],
        ['10', 'Lineer mi?', T`$x=0$ → $y=0$ mı?`],
        ['11', 'Nedensel mi? Bellekli mi?', T`$x$’in argümanlarını $t$ ile kıyasla`],
        ['12', 'Zamanla değişmez mi?', T`Açıkta $t$ var mı, argümanda $2t$ / $-t$ var mı?`],
        ['13', 'Kararlı mı?', T`Büyüyen çarpan / integral / bölme var mı?`],
        ['14', 'Dört özellik analizi (karma)', T`10–13’ü sırayla, her birine tek satır gerekçe`]] },

      ...type(1, 'Periyodik mi? Temel periyot? (sürekli)', '1.2', 's. 6–15',
        T`“periyodik midir”, “temel periyodunu bulunuz”, birden fazla $\cos$/$\sin$ toplamı.`,
        [T`Genlik ve fazları unut, sadece her terimin $\omega$’sını oku.`,
         T`Her terim için $T_i = \dfrac{2\pi}{\omega_i}$ yaz.`,
         T`$T_1/T_i$ oranlarını hesapla. Hepsinde $\pi$ sadeleşiyorsa (rasyonel) <strong>periyodik</strong>; birinde bile kalıyorsa <strong>periyodik değil</strong>, dur.`,
         T`Oranları en sade kesir yap ($p/q$). Paydaların EKOK’u $n$ ise $T_0 = n\,T_1$.`,
         T`Kontrol / kısa yol: $\omega_0 = \text{EBOB}(\omega_i)$, $\;T_0 = 2\pi/\omega_0$.`,
         T`Çarpım varsa ($\cos a\cdot\cos b$) önce toplama çevir: $\cos a\cos b = \tfrac12[\cos(a-b)+\cos(a+b)]$.`],
        T`$x(t) = \cos 4t + \sin 6t$: $\;T_1 = \pi/2$, $T_2 = \pi/3$, oran $3/2$ → periyodik, $T_0 = 2T_1 = \pi$. (EBOB(4,6) = 2 → $2\pi/2 = \pi$ ✓)<br>$\cos t + \cos \pi t$: oran $\pi$ → periyodik değil.`),

      ...type(2, 'Ayrık dizi periyodik mi?', '1.2', 's. 12–15',
        T`$x[n] = \cos(\Omega n)$, $e^{j\Omega n}$ gibi köşeli parantezli sinüs.`,
        [T`Her terim için $\dfrac{\Omega}{2\pi}$’yi yaz.`,
         T`Sonuç kesir (rasyonel) mi? İçinde $\pi$ kalıyorsa veya $\Omega$’da $\pi$ yoksa (ör. $\cos 2n$) <strong>periyodik değil</strong>.`,
         T`Kesri sadeleştir: $\frac{m}{N}$. <strong>Payda $N$ = periyot</strong> (tam sayı olmak zorunda).`,
         T`Birden fazla terim varsa her birinin $N_i$’sini bul, $N_0 = \text{EKOK}(N_i)$.`],
        T`$\cos\!\left(\frac{3\pi}{4}n\right)$: $\;\frac{3\pi/4}{2\pi} = \frac38$ → $N = 8$ (8/3 değil!).<br>$\cos(2n)$: $\frac{2}{2\pi} = \frac1\pi$ → periyodik değil.`),

      ...type(3, 'Enerji mi, güç mü?', '1.3', 's. 16–21',
        T`“enerji ve güç sinyali olup olmadığını belirleyiniz”, “$E$ ve $P$’yi hesaplayınız”.`,
        [T`Sinyale bak: <strong>sönüyor / sınırlı aralıkta</strong> mı → $E$ hesapla. <strong>Periyodik / sabite gidiyor</strong> mu → $P$ hesapla.`,
         T`$|x|^2$’yi yaz. Karmaşıksa $|e^{j\theta}| = 1$.`,
         T`Sürekli: $E = \int|x|^2dt$. Ayrık: $E = \sum|x[n]|^2$; çoğunlukla geometrik seri → “ilk terim / (1 − oran)”.`,
         T`Periyodikte $P = \frac1T\int_0^T|x|^2dt$ (ayrıkta $\frac1N\sum_{0}^{N-1}$). Sinüs için kısa yol $P = A^2/2$.`,
         T`Karar: $0<E<\infty$ → enerji ($P=0$). $0<P<\infty$ → güç ($E=\infty$). İkisi de $\infty$ → hiçbiri.`],
        T`$x(t) = 3e^{-t}u(t)$: $\;E = \int_0^\infty 9e^{-2t}dt = \frac92$ → enerji sinyali.<br>$x(t) = 3\cos\frac{\pi}{8}t$: $\;P = \frac{9}{2}$ → güç sinyali.`),

      ...type(4, 'Çift ve tek bileşen', '1.4', 's. 22–27',
        T`“çift ve tek bileşenlerini bulunuz / çiziniz”, “$x_e$, $x_o$”.`,
        [T`$x(-t)$’yi bul: formülde $t$ yerine $-t$ yaz, ya da grafiği dikey eksene göre aynala.`,
         T`$x_e(t) = \dfrac{x(t)+x(-t)}{2}$ → ortalama.`,
         T`$x_o(t) = \dfrac{x(t)-x(-t)}{2}$ → yarı fark.`,
         T`Grafik sorusunda: $x(t)$ ve $x(-t)$’yi alt alta çiz, her aralıkta topla/çıkar, 2’ye böl.`,
         T`Kontrol: $x_e + x_o = x$, $\;x_e$ simetrik, $x_o$ ters simetrik ve $x_o(0) = 0$.`],
        T`$x(t) = u(t)$: $\;x(-t) = u(-t)$ → $x_e = \frac12$ (her yerde), $\;x_o = \frac12\,\text{sgn}(t)$.<br>Polinomda: çift kuvvetler + sabit → $x_e$, tek kuvvetler → $x_o$.`),

      ...type(5, 'δ’lı integral ve çarpım', '1.5', 's. 28–33',
        T`İntegralin içinde $\delta(\cdot)$ var; ya da $x(t)\,\delta(t-a)$ sadeleştirilecek.`,
        [T`δ’nın içini sıfıra eşitle → impuls noktası $t = a$.`,
         T`İçeride katsayı varsa önce çek: $\delta(ct - d) = \dfrac{1}{|c|}\,\delta\!\left(t - \frac dc\right)$.`,
         T`$a$ integral sınırlarının <strong>içinde</strong> mi? Dışındaysa sonuç <strong>0</strong>.`,
         T`İçindeyse: $\int\phi(t)\,\delta(t-a)\,dt = \phi(a)$ → kalan fonksiyonda $t = a$ koy.`,
         T`Çarpımda (integral yok): $x(t)\delta(t-a) = x(a)\,\delta(t-a)$ → sonuç yine bir impuls.`],
        T`$\int_{-1}^{3} t^2\,\delta(t-2)\,dt = 4$. $\quad\int_{-1}^{1} t^2\,\delta(t-2)\,dt = 0$ (2 aralık dışında).<br>$\int e^{t}\delta(2t-4)\,dt = \frac12 e^{2}$.`),

      ...type(6, 'Π ve Λ çizimi', '1.5', 's. 30–33',
        T`$A\,\Pi\!\left(\frac{t-c}{\tau}\right)$, $A\,\Lambda\!\left(\frac{t-c}{\tau}\right)$ çiziniz.`,
        [T`Π için: $-\frac12 < \frac{t-c}{\tau} < \frac12$ eşitsizliğini $t$ için çöz → $c-\frac\tau2 < t < c+\frac\tau2$.`,
         T`Λ için: $-1 < \frac{t-c}{\tau} < 1$ → $c-\tau < t < c+\tau$, tepe $t = c$’de.`,
         T`Öndeki $A$ = yükseklik. Aralık dışında 0.`],
        T`$3\,\Pi\!\left(\frac{t-4}{2}\right)$: $3<t<5$ aralığında 3.<br>$2\,\Lambda\!\left(\frac{t-3}{2}\right)$: tabanı $1<t<5$, tepe $t=3$’te 2.`),

      ...type(7, 'Şekli basamak / rampa ile yaz, türev al', '1.5', 's. 34–40',
        T`“şekildeki sinyali birim basamak (veya rampa) fonksiyonları ile yazınız”, “türevini bulup çiziniz”.`,
        [T`Soldan sağa yürü. Her <strong>sıçramada</strong> (dikey zıplama) $\;(\text{sıçrama miktarı})\cdot u(t-t_0)$ yaz. Yukarı +, aşağı −.`,
         T`Eğik parça varsa her <strong>eğim değiştiği</strong> noktada $\;(\text{yeni eğim} - \text{eski eğim})\cdot r(t-t_0)$ yaz.`,
         T`Hepsini topla. Kontrol: birkaç $t$ değeri koy, şekille aynı mı?`,
         T`Türev: $r \to u$, $\;u \to \delta$ (katsayılar aynen kalır). $\;\frac{d}{dt}\big[A\,u(t-t_0)\big] = A\,\delta(t-t_0)$.`,
         T`Türevi çizerken: rampadan gelen basamaklar yatay çizgi, basamaktan gelen δ’lar ok (yanına katsayısını yaz).`],
        T`$0<t<2$’de 10, sonra 0: $\;x = 10u(t) - 10u(t-2)$, $\;x' = 10\delta(t) - 10\delta(t-2)$.<br>Üçgen ($0\to1\to2$, tepe 1): $\;r(t) - 2r(t-1) + r(t-2)$, $\;x' = u(t) - 2u(t-1) + u(t-2)$.`),

      ...type(8, 'Ayrık diziyi δ ile yaz', '1.6', 's. 41–46',
        T`Çubuk grafikli dizi; “ifadesini birim impuls / birim basamak ile yazınız”.`,
        [T`Sıfır olmayan her çubuğu oku: konum $k$, yükseklik $a$.`,
         T`Her biri için $a\,\delta[n-k]$ yaz ve topla.`,
         T`İstenirse basamakla: ardışık eşit değerler bloğu $a\big(u[n-k_1] - u[n-k_2-1]\big)$.`,
         T`Kontrol: $n = k$ koy, sadece o terim kalmalı.`],
        T`$x[0]=1,\;x[1]=2,\;x[3]=-1$: $\;x[n] = \delta[n] + 2\delta[n-1] - \delta[n-3]$.<br>$n = 0..3$’te 1: $\;u[n] - u[n-4]$.`),

      ...type(9, T`$x(at+b)$ ve $A\,x(\cdot)+B$ çizimi`, '1.7', 's. 47–53',
        T`Bir $x(t)$ grafiği verilip $x(2t-6)$, $x(-t+1)$, $3x(t/2)-1$ gibi ifadeler isteniyor.`,
        [T`$x(t)$’nin kritik noktalarını listele ($t_k$: başladığı, kırıldığı, bittiği yerler) ve oradaki değerleri yaz.`,
         T`Her $t_k$’yı yeni eksene taşı: $\;t_{\text{yeni}} = \dfrac{t_k - b}{a}$.`,
         T`Değerleri aynen taşı. $a<0$ ise sıra ters döner (ayna).`,
         T`En son genlik: her değeri $A\cdot(\text{değer}) + B$ yap. $B$ varsa sinyalin 0 olduğu yerler de $B$ olur!`,
         T`Elle yaparsan sıra: önce öteleme ($b$), sonra ölçekleme ($a$). $x(2t-6) = x(2(t-3))$ → <strong>3</strong> sağa, 6 değil.`],
        T`$x$: $t_k = 0, 1, 2$. $\;x(2t-6)$: $t = \frac{t_k+6}{2} = 3,\;3.5,\;4$.<br>$x(-t+1)$: $t = \frac{t_k - 1}{-1} = 1,\;0,\;-1$ (ters sırada).`),

      ...type(10, 'Lineer mi?', '1.8', 's. 54–57',
        T`“sistem lineer midir”, $y(t) = \ldots x(t)\ldots$ kuralı verilmiş.`,
        [T`<strong>Sıfır testi:</strong> $x = 0$ koy. $y \ne 0$ çıkıyorsa (ör. $+3$ sabiti) → <strong>lineer değil</strong>, bitti.`,
         T`Göz testi: $x^2$, $|x|$, $\sin x$, $e^{x}$, $x\cdot x(t-1)$, $1/x$ varsa lineer değil. $t\cdot x$, $\cos t\cdot x$, $x(2t)$, $\int x$ lineerliği bozmaz.`,
         T`İspat: $x_1 \to y_1$, $x_2 \to y_2$ yaz. $x_3 = a x_1 + b x_2$’yi kurala koyup $y_3$’ü hesapla.`,
         T`$y_3 = a y_1 + b y_2$ ise <strong>lineer</strong>, değilse değil.`,
         T`Çürütmek için sayısal karşı örnek yeter: $1 \to y_1$, $2 \to y_2$, $3 \to y_3 \ne y_1 + y_2$.`],
        T`$y = x^2$: $(ax_1 + bx_2)^2 = a^2x_1^2 + b^2x_2^2 + 2ab\,x_1x_2 \ne ay_1 + by_2$ → lineer değil.<br>$y = t\,x(t)$: $t(ax_1+bx_2) = ay_1 + by_2$ → lineer.`),

      ...type(11, 'Nedensel mi? Bellekli mi?', '1.9', 's. 58–61',
        T`“nedensel midir”, “belleksiz midir”.`,
        [T`Kuraldaki <strong>bütün</strong> $x(\cdot)$ argümanlarını listele.`,
         T`Her argümanı $t$ ile kıyasla. Bir $t$ için bile argüman $> t$ olabiliyorsa → <strong>nedensel değil</strong>.`,
         T`$x(2t)$, $x(t/2)$, $x(-t)$, $x[-n]$ gördüysen hem pozitif hem negatif $t$ dene (ör. $t = 1$ ve $t = -1$).`,
         T`$x$’in dışındaki $t$’ler ($t\,x(t)$, $\cos(t+1)$) nedenselliği etkilemez.`,
         T`Bellek: bütün argümanlar tam olarak $t$ ise <strong>belleksiz</strong>; $t-1$, $\int$, $\sum$ varsa bellekli.`,
         T`Kâğıda yaz: “$y(-1) = x(1)$, gelecekteki girişe bağlı ⇒ nedensel değil.”`],
        T`$y = x(t+1)$: $y(0) = x(1)$ → nedensel değil.<br>$y[n] = x[-n]$: $n = -2$ → $y[-2] = x[2]$ → nedensel değil.<br>$y = 3x(t-2)$: nedensel, bellekli.`),

      ...type(12, 'Zamanla (ötelemeyle) değişmez mi?', '1.10', 's. 62–64',
        T`“zamanla değişmez midir”, “ötelemeyle değişmez midir”.`,
        [T`<strong>Kısa yol:</strong> $x$’in dışında açık $t$/$n$ var mı ($t\,x$, $\cos t\cdot x$, $n\,x[n]$)? Argümanda $t$’nin katsayısı $\pm1$ değil mi ya da $-t$ mi ($x(2t)$, $x(-t)$)? Varsa → <strong>değişen</strong>.`,
         T`İspat 1. satır — <strong>girişi kaydır:</strong> sadece $x$’in içindeki $t$’leri $t - t_0$ yap, açıktaki $t$’ye dokunma → $y_1(t)$.`,
         T`İspat 2. satır — <strong>çıkışı kaydır:</strong> $y(t)$’deki <strong>bütün</strong> $t$’leri $t - t_0$ yap → $y(t-t_0)$.`,
         T`$y_1(t) = y(t-t_0)$ ise <strong>zamanla değişmez</strong>, değilse değişen.`],
        T`$y = t\,x(t)$: $\;y_1 = t\,x(t-t_0)$, $\;y(t-t_0) = (t-t_0)\,x(t-t_0)$ → farklı → değişen.<br>$y[n] = 3x[n-1]$: ikisi de $3x[n-k-1]$ → değişmez.`),

      ...type(13, 'Kararlı (BIBO) mı?', '1.11', 's. 65–68',
        T`“kararlı mıdır”, “BIBO kararlılığını inceleyiniz”.`,
        [T`Şüpheli işaret ara: $t$ / $n$ ile çarpma, $\int_{-\infty}^{t}$ veya $\sum_{-\infty}^{n}$, girişe bölme, $e^{t}$ gibi büyüyen çarpan.`,
         T`Şüpheli varsa → <strong>karşı örnek</strong>: sınırlı giriş seç ($x = 1$ veya $u(t)$), çıkışın $\infty$’a gittiğini göster → <strong>kararsız</strong>.`,
         T`Yoksa → <strong>sınırla</strong>: $|x| \le B$ varsay, $|y|$’yi sadece $B$’ye bağlı bir sayıyla sınırla ($|\sin| \le 1$, $e^{-B} \le e^{x} \le e^{B}$) → <strong>kararlı</strong>.`],
        T`$y = \int_{-\infty}^{t}x\,d\tau$: $x = u(t)$ → $y = t \to \infty$ → kararsız.<br>$y = \sin[x(t)]$: $|y| \le 1$ → kararlı. $\;y[n] = n\,x[n]$: $x = 1$ → $y = n \to \infty$ → kararsız.`),

      ...type(14, 'Dört özellik analizi (karma soru)', '1.11', 's. 67–68',
        T`“zamanla değişmezlik, lineerlik, nedensellik ve kararlılık analizi yapınız” (yanında periyot da sorulabilir).`,
        [T`Varsa önce periyodu çöz (1 / 2. tip) — sistemden bağımsızdır, hızlı puan.`,
         T`<strong>Zamanla değişmezlik</strong> (12. tip): iki satırı da yaz ($y_1$ ve $y(t-t_0)$), karşılaştır.`,
         T`<strong>Lineerlik</strong> (10. tip): sıfır testi → $ax_1+bx_2$ ya da kısa karşı örnek.`,
         T`<strong>Nedensellik</strong> (11. tip): somut bir $t$ değeri seçip göster.`,
         T`<strong>Kararlılık</strong> (13. tip): sınır ya da karşı örnek.`,
         T`Her özelliğe <strong>tek satır gerekçe</strong> yaz; sadece “evet/hayır” tam puan getirmez. Birinde takılırsan diğerine geç.`],
        T`$y(t) = \frac{x(t)}{1+x(t-1)}$: değişmez (açık $t$ yok) · lineer değil ($2x$ verince $2y$ çıkmaz) · nedensel (argümanlar $t$, $t-1$) · kararsız ($x = -1$ sınırlı ama payda 0).`)
    ]
  };
})();
