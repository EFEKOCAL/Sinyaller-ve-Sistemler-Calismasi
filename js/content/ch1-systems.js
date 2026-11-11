/*
 * Bölüm 1 · Sistemler: 1.8 Lineerlik · 1.9 Nedensellik ve bellek · 1.10 Zamanla değişmezlik · 1.11 Kararlılık
 * Kaynak: Ömer Akgün, Sinyaller ve Sistemler ders notları, s. 54–68
 */
(function () {
  'use strict';
  const SS = window.SS;
  SS.lessons = SS.lessons || [];
  const T = String.raw;
  const fn = (f, color, o) => Object.assign({ kind: 'fn', f, color: color || 'x', fill: true, alpha: 0.12, n: 2000 }, o || {});
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 160, xLabel: 't', layers }, o || {});
  const box = (a, b) => (t) => (t > a && t < b ? 1 : 0);

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.8', chap: 'sys', title: 'Lineer sistemler', pages: 's. 54–58',
    sub: 'Homojenlik, toplamsallık, süperpozisyon',
    lead: 'Sistemlerin dört temel özelliğinin ilki. Lineerlik, karmaşık bir girişi parçalara ayırıp her parçanın cevabını <em>ayrı ayrı</em> bulmamıza izin verir. Bölüm 2’nin tamamı bu özellik üzerine kuruludur.',
    goals: ['Homojenlik ve toplamsallık', 'Lineerliği cebirsel olarak ispatlamak', 'Karşı örnekle lineer olmadığını göstermek', '“Sıfır giriş, sıfır çıkış” testi'],
    blocks: [
      { t: 'idea', h: T`Bir müzik setinin sesini iki katına çıkardığında hoparlörden gelen ses de iki kat olur (homojenlik). İki enstrümanı aynı anda çaldığında duyduğun, ikisini ayrı ayrı çaldığında duyduklarının toplamıdır (toplamsallık). İki koşulu da sağlayan sisteme <strong>lineer</strong> denir. Bu ikisinin birleşimine <strong>süperpozisyon ilkesi</strong> denir.` },
      { t: 'def', title: 'Tanım (s. 54)', h: T`Homojenlik: $\;T\{kx\} = k\,y$ &nbsp;&nbsp;&nbsp; Toplamsallık: $\;T\{x_1 + x_2\} = y_1 + y_2$
$$\text{Birlikte:}\qquad T\{k_1x_1 + k_2x_2\} = k_1y_1 + k_2y_2$$` },
      { t: 'table', head: ['Formül', 'Sözle ne diyor?', 'Sınavda ne yapıyorsun?'], rows: [
        [T`$T\{\cdot\}$, $\;x \to y$`, T`$T$ sistemin kuralı. $T\{x\}$ “$x$’i sisteme ver, çıkanı yaz” demek. $x_1 \to y_1$ ise “$x_1$ girişi $y_1$ çıkışını üretir”.`, T`Kuralda $x$ gördüğün her yere yeni girişi yazarsın.`],
        [T`$T\{kx\} = k\,y$`, T`<strong>Homojenlik:</strong> “Girişi $k$ katına çıkarırsan çıkış da tam $k$ katına çıkar.”`, T`$k\,x$’i kurala koy. Sonuçtan $k$’yı dışarı çıkarabiliyor ve geriye tam $y$ kalıyorsa sağlanır.`],
        [T`$T\{x_1 + x_2\} = y_1 + y_2$`, T`<strong>Toplamsallık:</strong> “İki girişi birlikte verirsen, çıkış ikisinin ayrı ayrı çıkışlarının toplamı olur.”`, T`$x_1 + x_2$’yi kurala koy, sonucu $y_1 + y_2$ biçiminde yazabiliyor musun bak. $x^2$ gibi işlemlerde fazladan bir çapraz terim çıkar.`],
        [T`$T\{k_1x_1 + k_2x_2\} = k_1y_1 + k_2y_2$`, T`<strong>Süperpozisyon:</strong> ikisi bir arada. “Girişleri ölçekleyip topla, sonra sisteme ver” ile “her birini sisteme ver, sonra çıkışları ölçekleyip topla” aynı sonucu verir.`, T`İspatı tek seferde bu satırla yaparsın (aşağıdaki reçete).`]] },
      { t: 'p', h: T`<strong>Neden önemli?</strong> Lineer bir sistemde karmaşık bir girişi basit parçalara ayırıp (ör. birkaç basamak ya da sinüs), her parçanın çıkışını ayrı ayrı bulup toplayabilirsin. Lineer olmayan sistemlerde bu yapılamaz, her girişi baştan hesaplamak gerekir.` },
      { t: 'recipe', title: 'Lineerlik ispatı / çürütmesi', steps: [
        T`<strong>Hızlı test:</strong> $x = 0$ verince $y = 0$ çıkıyor mu? Çıkmıyorsa kesinlikle lineer <strong>değildir</strong> (ör. $2x + 3$, $e^{x}$).`,
        T`$x_1 \to y_1$ ve $x_2 \to y_2$ yaz.`,
        T`$x_3 = ax_1 + bx_2$ girişi için $y_3$’ü <em>sistemin kuralından</em> hesapla.`,
        T`$y_3 = ay_1 + by_2$ ise lineer. Değilse lineer değil.`,
        T`<strong>Sayısal kısayol (s. 55):</strong> iki sabit giriş seç, örneğin $1 \to y_1$, $2 \to y_2$. Sonra $3 \to y_3$ hesapla. $y_3 \ne y_1 + y_2$ ise bu bir karşı örnektir. Bu yöntem lineer <em>olmadığını</em> göstermek içindir; lineer olduğunu ispatlamaz.`] },
      { t: 'example', src: 's. 55', q: T`$y(t) = x^2(t)$ lineer midir?`,
        steps: [T`$ax_1 \to [ax_1]^2 = a^2x_1^2$, $\quad bx_2 \to b^2x_2^2$. Toplamları: $a^2x_1^2 + b^2x_2^2$.`,
          T`Toplam girişin çıkışı: $[ax_1 + bx_2]^2 = a^2x_1^2 + b^2x_2^2 + \hl{2ab\,x_1x_2}$`,
          T`Fazladan bir çapraz terim var. Eşit değiller.`, T`Sayısal test: $1 \to 1$, $2 \to 4$, ama $(1+2) = 3 \to 9 \ne 1 + 4 = 5$.`],
        ans: T`Lineer değil. Aynı mantıkla $y = \sin x$ ve $y = x^3$ de lineer değildir.` },
      { t: 'example', src: 's. 56', q: T`$y[n] = x[n-2]$ lineer midir?`,
        steps: [T`$ax_1[n] \to ax_1[n-2]$, $\;bx_2[n] \to bx_2[n-2]$. Toplam: $ax_1[n-2] + bx_2[n-2]$.`, T`Toplam girişin çıkışı: $[ax_1 + bx_2][n-2] = ax_1[n-2] + bx_2[n-2]$. Eşit.`],
        ans: T`Lineer. Kısaca: $T\{ax_1[n] + bx_2[n]\} = ax_1[n-2] + bx_2[n-2] = ay_1[n] + by_2[n]$.` },
      { t: 'example', src: 's. 57', q: T`$\dfrac{dy}{dt} + 3y(t) = x(t)$ denklemiyle tanımlanan sistem lineer midir?`,
        steps: [T`$\frac{dy_1}{dt} + 3y_1 = x_1$ ve $\frac{dy_2}{dt} + 3y_2 = x_2$ yaz.`, T`Birinciyi $k_1$, ikinciyi $k_2$ ile çarpıp topla: $\frac{d}{dt}[k_1y_1 + k_2y_2] + 3[k_1y_1 + k_2y_2] = k_1x_1 + k_2x_2$`,
          T`Yani $x = k_1x_1 + k_2x_2$ girişi $y = k_1y_1 + k_2y_2$ çıkışını üretiyor.`],
        ans: T`Lineer (başlangıç koşulu sıfır kabul edilir). Sabit katsayılı lineer diferansiyel ve fark denklemleri hep lineer sistem tanımlar.` },
      { t: 'example', src: 's. 58', q: T`$y[n] = 2x[n] + 3$ lineer midir?`,
        steps: [T`Hızlı test: $x[n] = 0$ ⇒ $y[n] = 3 \ne 0$. Lineer olamaz.`, T`Toplamsallık: $x_1 = 2 \to 7$, $x_2 = 3 \to 9$. Ama $x_1 + x_2 = 5 \to 13 \ne 7 + 9 = 16$.`],
        ans: T`Lineer değil. Grafiği düz bir çizgi olsa da sabit terim süperpozisyonu bozar. (Bu tür sistemlere “artımsal lineer” denir.)` },
      { t: 'trap', h: T`Lineerlik ile zamanla değişmezliği karıştırma! $y(t) = t\,x(t)$ <strong>lineerdir</strong>: $t$ çarpanı girişten bağımsız bir “katsayı”dır, $t(ax_1 + bx_2) = a\,tx_1 + b\,tx_2$. Lineerliği bozan şey <em>girişe</em> uygulanan doğrusal olmayan işlemlerdir: kare, sinüs, mutlak değer, sabit ekleme, $x$’e bölme.` },
      { t: 'lab', id: 'systems', opts: { prop: 'L' } },
      { t: 'hw', src: 's. 56', q: T`(a) $y(t) = t\,x(t)$ &nbsp; (b) $y[n] = x[n]\,u[n-1]$ lineer midir?`,
        steps: [T`(a) $T\{ax_1 + bx_2\} = t(ax_1 + bx_2) = a\,tx_1 + b\,tx_2 = ay_1 + by_2$ ✓`, T`(b) $u[n-1]$ girişten bağımsız bir çarpandır (0 veya 1): $(ax_1 + bx_2)u[n-1] = ay_1 + by_2$ ✓`],
        ans: T`İkisi de lineer. (İkisi de zamanla değişendir; bunu 1.10’da göreceğiz.)` },
      { t: 'quiz', items: [
        { q: T`$y(t) = x(t) + x(t-1)$ lineer mi?`, opts: ['Evet', 'Hayır'], a: 0, why: 'Kaydırılmış girişlerin toplamı: her terim lineer, toplamları da lineer.' },
        { q: T`$y(t) = |x(t)|$ lineer mi?`, opts: ['Evet', 'Hayır'], a: 1, why: T`Homojenlik bozulur: $x = -1$ için $y = 1$, ama $-1\cdot T\{1\} = -1$.` },
        { q: T`$y[n] = x[n] + 1$ için en hızlı çürütme hangisidir?`, opts: ['Sıfır giriş testi', 'Uzun cebir', 'Fourier dönüşümü'], a: 0, why: T`$x = 0 \to y = 1$. Lineer bir sistem sıfıra sıfırla cevap vermek zorundadır.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.9', chap: 'sys', title: 'Nedensellik ve bellek', pages: 's. 59–60',
    sub: 'Geleceğe bakan sistemler, belleksiz sistemler',
    lead: 'Gerçek zamanda çalışan bir sistem, henüz gelmemiş bir girişi kullanamaz. Nedensellik bu sağduyunun matematiksel hâlidir.',
    goals: ['Nedensel sistem tanımı', 'Argümanlara bakarak hızlı karar', 'Negatif zamandaki tuzaklar', 'Bellekli / belleksiz ayrımı'],
    blocks: [
      { t: 'idea', h: T`Canlı yayındaki bir ses efekti, şu anki ve geçmişteki sesleri kullanabilir. Bir saniye <em>sonraki</em> sesi kullanamaz, çünkü o ses henüz yok. Bu sistem <strong>nedenseldir</strong>. Ama kayıtlı bir ses dosyasını işleyen bir program “geleceğe” bakabilir, çünkü bütün kayıt elindedir. Böyle sistemler <strong>nedensel olmayan</strong> (öngörülü) sistemlerdir ve gerçekleştirilebilirler, yalnızca gerçek zamanlı çalışamazlar.` },
      { t: 'def', title: 'Tanım (s. 59)', h: T`<strong>Nedensel:</strong> Çıkış, girişin yalnızca <em>şu anki ve geçmiş</em> değerlerine bağlıdır: $y(t)$ yalnızca $x(\tau)$, $\tau \le t$ ile hesaplanır.<br>Nedensel: $y(t) = x(t-1)$ &nbsp;&nbsp; Nedensel değil: $y(t) = x(t+2)$, $\;y[n] = x[1-n]$<br><strong>Belleksiz:</strong> Çıkış yalnızca girişin <em>o anki</em> değerine bağlıdır: $y(t) = f(x(t))$. Aksi hâlde sistem <strong>bellekli</strong>dir.` },
      { t: 'idea', title: 'Sözle: argüman ne söyler?', h: T`$x$’in parantezinin içindeki ifade, sistemin girişin <em>hangi anına</em> baktığını söyler. $t$ şu anki saattir:<br>• $x(t)$: şu an → belleksiz, nedensel.<br>• $x(t-1)$: 1 saniye <strong>önce</strong> (geçmiş) → nedensel ama bellekli (geçmişi hatırlaması gerekiyor).<br>• $x(t+2)$: 2 saniye <strong>sonra</strong> (gelecek) → nedensel değil.<br><strong>Neden var?</strong> Nedensellik “bu sistem gerçek zamanlı kurulabilir mi?” sorusunun cevabıdır. Bellek ise “sistemin bir hafızaya (kondansatör, kayıt, değişken) ihtiyacı var mı?” sorusunun.` },
      { t: 'recipe', title: 'Hızlı karar', steps: [
        T`Kuraldaki $x(\cdot)$’lerin <strong>bütün argümanlarını</strong> listele.`,
        T`Her argümanı $t$ ile karşılaştır. Herhangi bir $t$ için argüman $> t$ olabiliyorsa sistem nedensel değildir.`,
        T`Negatif zamanları unutma: $x(2t)$ veya $x[-n]$, $t>0$ veya $n<0$ için geleceğe bakar.`,
        T`$x$’in <em>dışında</em> kalan $t$’ler ($\cos(t+1)$, $t\,x(t)$) nedenselliği etkilemez.`,
        T`Bellek: bütün argümanlar tam olarak $t$ ise sistem belleksizdir.`] },
      { t: 'example', src: 's. 59', q: T`$y[n] = x[-n]$ nedensel midir?`,
        steps: [T`İlk bakışta $n>0$ için $-n < n$, yani geçmişe bakıyor gibi görünür. Örneğin $y[3] = x[-3]$.`, T`Ama $n<0$ için durum tersine döner: $y[-4] = x[4]$. Çıkış, girişin gelecekteki değerine bağlı.`],
        ans: T`Nedensel değil. Bir tek $n$ bile geleceğe bakıyorsa sistem nedensel değildir.` },
      { t: 'erratum', src: 's. 59', h: T`Notta $y[n] = x[n/2]$ nedensel örnekler arasında yer alıyor. Bu ifade, aynı sayfadaki $x[-n]$ mantığıyla nedensel <strong>değildir</strong>: $n=-2$ için $y[-2] = x[-1]$ olur ve $-1 > -2$, yani gelecek. Büyük olasılıkla $x[n-2]$ kastedilmiş. ($n \ge 0$ ile sınırlı girişlerde $x[n/2]$ sorun çıkarmaz, ama genel tanım her $n$ için geçerli olmalıdır.)` },
      { t: 'example', src: 's. 60', q: T`$y(t) = x(t+1) + 2x(t) - 3x(t-1)$ nedensel midir?`,
        steps: [T`Argümanlar: $t+1$, $t$, $t-1$.`, T`$t + 1 > t$: gelecek.`], ans: T`Nedensel değil, çünkü $y(t)$ gelecek giriş $x(t+1)$’e bağlı.` },
      { t: 'example', src: 's. 60', q: T`$y(t) = x(t)\cos(t+1)$ nedensel midir?`,
        steps: [T`$x$’in tek argümanı $t$. Şu an.`, T`$\cos(t+1)$ bir $g(t)$ fonksiyonudur, girişle ilgisi yok. İçindeki “$+1$” geleceğe bakmak anlamına gelmez.`],
        ans: T`Nedensel. Ayrıca belleksiz: $y(t)$ yalnızca $x(t)$’ye bağlı.` },
      { t: 'lab', id: 'systems', opts: { prop: 'C' } },
      { t: 'hw', src: 's. 60', q: T`(a) $y(t) = 2x(t) - x(t-1) + 3x(t-2)$ &nbsp; (b) $y[n] = 3x[n-1]$ &nbsp; (c) $y[n] = 2x^2[n+1]$. Nedensel mi? Bellekli mi?`,
        steps: [T`(a) Argümanlar $t, t-1, t-2 \le t$: nedensel. $t-1$, $t-2$ olduğu için bellekli.`, T`(b) $n-1 < n$: nedensel, bellekli.`, T`(c) $n+1 > n$: nedensel değil, bellekli.`],
        ans: T`(a) Nedensel, bellekli · (b) Nedensel, bellekli · (c) Nedensel değil, bellekli` },
      { t: 'quiz', items: [
        { q: T`$y(t) = x(t/2)$ nedensel mi?`, opts: ['Evet', 'Hayır'], a: 1, why: T`$t = -2$ için $y(-2) = x(-1)$ olur ve $-1 > -2$. Negatif zamanda geleceğe bakıyor.` },
        { q: T`$y(t) = \int_{-\infty}^{t} x(\tau)d\tau$ bellekli mi?`, opts: ['Bellekli', 'Belleksiz'], a: 0, why: 'Bütün geçmişi biriktiriyor.' },
        { q: T`$y[n] = n^2 x[n]$ için hangisi doğru?`, opts: ['Nedensel ve belleksiz', 'Nedensel değil', 'Bellekli'], a: 0, why: T`Tek argüman $n$. Dışarıdaki $n^2$ yalnızca bir katsayı.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.10', chap: 'sys', title: 'Zamanla değişmezlik', pages: 's. 61–65',
    sub: 'Ötelemeyle değişen ve değişmeyen sistemler',
    lead: 'Aynı deneyi bugün yapsan da yarın yapsan da aynı sonucu (yalnızca kaymış olarak) alıyorsan, sistem zamanla değişmezdir. Notta “ötelemeyle değişmeyen” diye geçer.',
    goals: ['$T\\{x(t-\\tau)\\} = y(t-\\tau)$ testi', 'Açık $t$ ve ölçeklenmiş argüman tuzakları', 'Grafikle karşı örnek', 'Lineerlikten ayırt etmek'],
    blocks: [
      { t: 'idea', h: T`Girişi $\tau$ kadar geciktirirsen, çıkış da <em>aynen</em> $\tau$ kadar gecikmeli, başka hiçbir şey değişmemeli. Sistemin içinde zamana bağlı bir “saat” varsa (ör. $t$ ile çarpma, $\cos t$ ile modülasyon, $n=1$’de açılan bir anahtar) bu bozulur.` },
      { t: 'def', title: 'Tanım (s. 61)', h: T`$$T\{x(t-\tau)\} = y(t-\tau) \quad \text{her } x \text{ ve her } \tau \text{ için}$$` },
      { t: 'idea', title: 'Sözle: iki taraf ne demek?', h: T`<strong>Sol taraf, $T\{x(t-\tau)\}$:</strong> “Önce girişi $\tau$ kadar geciktir, <em>sonra</em> sisteme ver.”<br><strong>Sağ taraf, $y(t-\tau)$:</strong> “Önce girişi olduğu gibi sisteme ver, <em>sonra</em> çıkışı $\tau$ kadar geciktir.”<br>Formül “bu iki yol aynı sonucu vermeli” der. Yani gecikmeyi sistemden önce ya da sonra uygulamak fark etmemeli.<br><strong>Neden iki tarafı farklı hesaplıyoruz?</strong> Sol tarafta sistem kaydırılmış girişi alır. Kuraldaki açık $t$’ler (ör. $t\,x(t)$’deki $t$) sistemin kendi saatidir ve kaymaz. Sağ tarafta ise bütün çıkış kaydırılır, açık $t$’ler de dahil. Kuralda açık $t$ varsa iki taraf farklı çıkar.<br><strong>Neden önemli?</strong> Zamanla değişmeyen bir sistem bugün de yarın da aynı davranır. Bölüm 2’nin konusu olan LTI sistemlerin “TI” kısmı budur.` },
      { t: 'fig', fig: [spec([-1, 8], [-0.2, 1.3], [fn((t) => Math.max(0, 1 - Math.abs(t - 1.5) / 0.8), 'x'), fn((t) => Math.max(0, 1 - Math.abs(t - 4.5) / 0.8), 'x', { alpha: 0.05, dash: [5, 4] })], { title: 'giriş x(t) ve x(t − 3)', xStep: 1 }), spec([-1, 8], [-0.2, 1.3], [fn(box(1, 3), 'y'), fn(box(4, 6), 'y', { alpha: 0.05, dash: [5, 4] })], { title: 'çıkış y(t) ve y(t − 3)', xStep: 1 })], cap: 'Not s. 61: zamanla değişmeyen bir sistemde kaydırılmış giriş, aynı miktarda kaydırılmış çıkış üretir.' },
      { t: 'recipe', title: 'Test adımları', steps: [
        T`<strong>Girişi kaydır:</strong> kuraldaki her $x(\cdot)$ argümanını $(\cdot) - t_0$ yap. Açıkta duran $t$’lere <strong>dokunma</strong>. Sonuç: $y_1(t) = T\{x(t-t_0)\}$.`,
        T`<strong>Çıkışı kaydır:</strong> $y(t)$ ifadesindeki <strong>bütün</strong> $t$’leri $t - t_0$ yap. Sonuç: $y(t-t_0)$.`,
        T`İkisi eşitse zamanla değişmez, değilse değişen.`,
        T`<strong>Kısa yol:</strong> kuralda $x$’in dışında açık bir $t$ veya $n$ varsa ($t\,x(t)$, $\cos(t)x(t)$, $2n\,x[n]$) ya da argümanda $t$’nin katsayısı $\pm1$ değilse ($x(2t)$, $x(-t)$, $x[1-n]$) sistem zamanla <strong>değişen</strong>dir.`] },
      { t: 'example', src: 's. 63', q: T`$y[n] = 3x[n-1]$ zamanla değişmez mi?`,
        steps: [T`Girişi kaydır: $T\{x[n-k]\} = 3x[n-k-1]$.`, T`Çıkışı kaydır: $y[n-k] = 3x[n-k-1]$.`, T`İkisi aynı.`], ans: T`Zamanla değişmez.` },
      { t: 'example', src: 's. 63', q: T`$y[n] = 2n\,x[n]$ zamanla değişmez mi?`,
        steps: [T`Girişi kaydır: $T\{x[n-k]\} = 2n\,x[n-k]$ ($n$’ye dokunmadık).`, T`Çıkışı kaydır: $y[n-k] = 2(n-k)\,x[n-k]$.`, T`$2n \ne 2(n-k)$.`], ans: T`Zamanla değişen. (Ama lineer!)` },
      { t: 'example', src: 's. 62', q: T`(a) $\dfrac{dy}{dt} + y(t) = x(t)$ &nbsp; (b) $y(t) = \int_{-\infty}^{t} x(\tau)\,d\tau$ zamanla değişmez mi?`,
        steps: [T`(a) $x_1(t) = x(t-t_0)$ için $\frac{dy_1}{dt} + y_1 = x(t-t_0)$. Bu denklemi $y_1(t) = y(t-t_0)$ sağlar, çünkü katsayılar sabit.`,
          T`(b) $T\{x(t-t_0)\} = \int_{-\infty}^{t} x(\tau - t_0)d\tau$. $s = \tau - t_0$ koy: $= \int_{-\infty}^{t-t_0} x(s)\,ds = y(t-t_0)$.`],
        ans: T`İkisi de zamanla değişmez.` },
      { t: 'example', src: 's. 63', q: T`$y(t) = x(t)\cos\omega_c t$ sisteminin nedensel ve zamanla değişen bir sistem olduğunu göster.`,
        steps: [T`Nedensel: çıkış girişin gelecek değerlerine bağlı değil.`, T`Girişi kaydır: $y_o(t) = x(t-t_0)\cos\omega_c t$`, T`Çıkışı kaydır: $y(t-t_0) = x(t-t_0)\cos\omega_c(t-t_0) \ne y_o(t)$`],
        ans: T`Nedensel ve zamanla değişen.` },
      { t: 'example', src: 's. 64–65', title: 'Grafikle karşı örnek', q: T`$y(t) = x(2t)$ zamanla değişmez mi? $x_1(t) = 1$ ($-2<t<2$) girişiyle grafikle göster.`,
        steps: [T`$y_1(t) = x_1(2t)$: $-2 < 2t < 2$ → $-1 < t < 1$.`,
          T`Girişi 2 kaydır: $x_2(t) = x_1(t-2)$, $0<t<4$ aralığında 1. Çıkışı: $y_2(t) = x_2(2t)$ → $0 < 2t < 4$ → $0<t<2$.`,
          { h: T`Çıkışı 2 kaydır: $y_1(t-2)$, $1<t<3$ aralığında 1. Bu $y_2$ ile aynı değil!`, fig: [spec([-3, 5], [-0.2, 1.3], [fn(box(0, 2), 'y')], { title: 'y₂(t) = T{x₁(t − 2)}', xStep: 1 }), spec([-3, 5], [-0.2, 1.3], [fn(box(1, 3), 'h')], { title: 'y₁(t − 2)', xStep: 1 })] }],
        ans: T`Zamanla değişen. Aslında $y_2(t) = y_1(t-1)$: zaman sıkıştırması yüzünden kayma yarıya iniyor.` },
      { t: 'lab', id: 'systems', opts: { prop: 'TI' } },
      { t: 'hw', src: 's. 63', q: T`$y(t) = x(t-3)$ nedensel midir, zamanla değişen midir?`,
        steps: [T`Argüman $t - 3 < t$: nedensel.`, T`$T\{x(t-t_0)\} = x(t - 3 - t_0) = y(t-t_0)$: zamanla değişmez.`], ans: T`Nedensel ve zamanla değişmez. (Saf gecikme, LTI sistemlerin en basitidir.)` },
      { t: 'quiz', items: [
        { q: T`$y[n] = x[n]\,u[n-1]$ zamanla değişmez mi?`, opts: ['Evet', 'Hayır'], a: 1, why: T`$u[n-1]$, $n=1$’de açılan sabit bir anahtar. Girişi kaydırırsan anahtar kaymaz.` },
        { q: T`$y(t) = x(t) + 5$ zamanla değişmez mi?`, opts: ['Evet (ama lineer değil)', 'Hayır'], a: 0, why: T`Kuralda açık bir $t$ yok. $x(t-t_0) + 5 = y(t-t_0)$.` },
        { q: T`$y(t) = x(-t)$ için hangisi doğru?`, opts: ['Zamanla değişmez', 'Zamanla değişen'], a: 1, why: T`$T\{x(t-t_0)\} = x(-t-t_0)$ ama $y(t-t_0) = x(-t+t_0)$.` }] }
    ]
  });

  /* ====================================================================== */
  const SYS = SS.SYSTEMS || [];
  const yn = (b) => (b ? '✓' : '✗');
  SS.lessons.push({
    id: '1.11', chap: 'sys', title: 'Kararlılık ve dört özellik analizi', pages: 's. 66–68',
    sub: 'BIBO kararlılık, karşı örnek, özet tablo',
    lead: 'Son özellik: sınırlı bir giriş sınırsız bir çıkışa yol açabiliyor mu? Ardından sınavın klasik sorusu: “Sistemin zamanla değişmezlik, lineerlik, nedensellik ve kararlılık analizini yapınız.”',
    goals: ['BIBO tanımı', 'Kararlılığı ispat: çıkışı sınırla', 'Kararsızlığı ispat: tek karşı örnek', 'Dört özelliği tek seferde analiz etmek'],
    blocks: [
      { t: 'idea', h: T`Bir hoparlöre normal seviyede bir şarkı veriyorsun. Kararlı bir sistem sesi bozabilir, ama sonsuza kadar büyütemez. Mikrofonu hoparlörün önüne tutup “çınlama” sesini duyduğunda ise sınırlı bir giriş, giderek büyüyen bir çıkışa dönüşür: bu sistem kararsızdır.` },
      { t: 'def', title: 'BIBO kararlılık (s. 66)', h: T`Sınırlı her girişe sınırlı bir çıkış veren sistem kararlıdır:
$$|x(t)| \le k_1 \;\;\Longrightarrow\;\; |y(t)| \le k_2$$` },
      { t: 'idea', title: 'Sözle: formül ne diyor?', h: T`<strong>BIBO</strong>, İngilizce “Bounded Input, Bounded Output”un kısaltmasıdır: sınırlı giriş, sınırlı çıkış.<br><strong>$|x(t)| \le k_1$:</strong> “Giriş hiçbir zaman $k_1$’den büyük olmuyor”, yani sonsuza gitmiyor. Örnekler: $\sin t$ ($k_1 = 1$), $u(t)$, sabit 5. $t$ ya da $e^{t}$ ise sınırlı değildir.<br><strong>$\Longrightarrow$:</strong> “ise”.<br><strong>$|y(t)| \le k_2$:</strong> “Çıkış da bir $k_2$ sayısını hiç geçmiyor.” $k_2$, $k_1$’den farklı olabilir. Önemli olan sonlu bir sayı olması.<br>Hepsi birlikte: “Sisteme sonsuza gitmeyen <strong>her</strong> girişi verdiğinde çıkış da sonsuza gitmiyorsa sistem kararlıdır.”<br><strong>Neden önemli?</strong> Kararsız bir sistem gerçek hayatta tehlikelidir: hoparlör cızırtısı, aşırı ısınan devre, sallanarak yıkılan köprü. Kontrol mühendisliğinin ilk sorusu her zaman “kararlı mı?”dır.` },
      { t: 'recipe', steps: [
        T`<strong>Kararlı olduğunu göstermek için:</strong> $|x| \le B$ varsay ve $|y|$’yi yalnızca $B$’ye bağlı bir sayıyla sınırla. Örnek: $|\sin(\cdot)| \le 1$, $\;|x[1-n]| \le B$, $\;e^{-B} < e^{x} < e^{B}$.`,
        T`<strong>Kararsız olduğunu göstermek için:</strong> tek bir sınırlı giriş bul, çıkışı sınırsız olsun. Önce sabit $x = 1$ veya $u(t)$ dene (s. 68).`,
        T`Şüpheli işaretler: kuralda $t$ veya $n$ ile çarpma, integral veya birikimli toplam, girişe bölme.`] },
      { t: 'example', src: 's. 66', q: T`(a) $y = \sin[x(t)]$ &nbsp; (b) $y = \int_{-\infty}^{t}x(\tau)d\tau$ &nbsp; (c) $y[n] = x[1-n]$ &nbsp; (d) $y[n] = 2n\,x[n]$. Kararlı mı?`,
        steps: [T`(a) $|\sin(\cdot)| \le 1$, giriş ne olursa olsun: <strong>kararlı</strong>.`, T`(b) $x = u(t)$ sınırlı, ama $y = \int_0^t 1\,d\tau = t$ sınırsız: <strong>kararsız</strong>.`,
          T`(c) $|x[n]| < B$ ⇒ $|y[n]| = |x[1-n]| < B$: <strong>kararlı</strong>.`, T`(d) $x = 1$ için $y = 2n$, sınırsız: <strong>kararsız</strong>.`],
        ans: T`(a) kararlı · (b) kararsız · (c) kararlı · (d) kararsız` },
      { t: 'example', src: 's. 68', q: T`$S_1: y(t) = t\,x(t)$ ve $S_2: y(t) = e^{x(t)}$ kararlı mı?`,
        steps: [T`$S_1$: $x(t) = 1$ sınırlı, $y(t) = t$ sınırsız. Kararsız.`, T`$S_2$: $-B < x < B$ ⇒ $e^{-B} < y < e^{B}$. Her sınırlı giriş sınırlı çıkış verir. Kararlı.`],
        ans: T`$S_1$ kararsız, $S_2$ kararlı.` },
      { t: 'lab', id: 'systems', opts: { prop: 'St' } },
      { t: 'h', h: 'Dört özelliği birlikte analiz etmek', src: 's. 67' },
      { t: 'example', src: 's. 67', q: T`$y[n] = x[1-n]$ sistemine zamanla değişmezlik, lineerlik, nedensellik ve kararlılık analizi yap.`,
        steps: [T`<strong>Zamanla değişmezlik:</strong> $T\{x[n-N]\} = x[1-n-N]$, ama $y[n-N] = x[1-(n-N)] = x[1-n+N]$. Farklı: <strong>zamanla değişen</strong>.`,
          T`<strong>Lineerlik:</strong> $x = \alpha x_1 + \beta x_2$ ⇒ $y[n] = \alpha x_1[1-n] + \beta x_2[1-n] = \alpha y_1 + \beta y_2$: <strong>lineer</strong>.`,
          T`<strong>Nedensellik:</strong> $y[0] = x[1]$, giriş değeri geleceğe bağlı: <strong>nedensel değil</strong>.`,
          T`<strong>Kararlılık:</strong> $|x[n]| < B$ ⇒ $|y[n]| = |x[1-n]| < B$: <strong>kararlı</strong>.`],
        ans: T`Zamanla değişen · lineer · nedensel değil · kararlı` },
      { t: 'recipe', title: 'Sınav kâğıdına nasıl yazılır? (dört özellik şablonu)', steps: [
        T`<strong>Zamanla değişmezlik:</strong> “$y_1(t) = T\{x(t-t_0)\} = \ldots$ ve $y(t-t_0) = \ldots$. İkisi eşit/farklı, o hâlde zamanla değişmez/değişen.” İki satırı da mutlaka yaz.`,
        T`<strong>Lineerlik:</strong> “$x = \alpha x_1 + \beta x_2$ için $y = \ldots = \alpha y_1 + \beta y_2$ ⇒ lineer.” Lineer değilse en kısa karşı örneği yaz: “$x = 0 \Rightarrow y = 3 \ne 0$” veya “$1 \to 1$, $2 \to 4$, $3 \to 9 \ne 5$”.`,
        T`<strong>Nedensellik:</strong> bir $t$ değeri seç ve göster: “$y(0) = x(1)$, gelecekteki girişe bağlı ⇒ nedensel değil.” Nedenselse: “bütün argümanlar $\le t$ ⇒ nedensel.”`,
        T`<strong>Kararlılık:</strong> kararlıysa “$|x| < B \Rightarrow |y| \le \ldots < \infty$”. Kararsızsa “$x(t) = 1$ sınırlı ama $y(t) = t \to \infty$”.`,
        T`Her özellik için <em>tek satırlık gerekçe</em> yeter. Sadece “evet/hayır” yazmak tam puan getirmez.`] },
      { t: 'hw', src: 's. 67', q: T`$y(t) = \dfrac{x(t)}{1 + x(t-1)}$ sistemine dört özellik analizi yap.`, hint: T`Kararlılık için paydayı sıfır yapan sınırlı bir giriş ara.`,
        steps: [T`<strong>Zamanla değişmezlik:</strong> $T\{x(t-t_0)\} = \frac{x(t-t_0)}{1 + x(t-1-t_0)} = y(t-t_0)$: değişmez (kuralda açık $t$ yok).`,
          T`<strong>Lineerlik:</strong> $T\{2x\} = \frac{2x(t)}{1 + 2x(t-1)} \ne \frac{2x(t)}{1 + x(t-1)}$: lineer değil.`,
          T`<strong>Nedensellik:</strong> argümanlar $t$ ve $t-1$: nedensel (ve bellekli).`,
          T`<strong>Kararlılık:</strong> $x(t) = -1$ sınırlı, ama payda $1 + (-1) = 0$: çıkış sınırsız. Kararsız.`],
        ans: T`Zamanla değişmez · lineer değil · nedensel · kararsız. Tezgâhta “Kararlılık” sekmesinde $x = -1$ ile dene.` },
      { t: 'idea', title: 'Sınavda birleşik gelebilir', h: T`Vizede bir giriş sinyali ve bir sistem verilip <strong>temel periyot + lineerlik + ötelemeyle değişmezlik + nedensellik + kararlılık</strong> tek soruda sorulabilir. Bir ek soru da sık gelir: “çıkış periyodik mi?”. Kural: <strong>zamanla değişmez</strong> her sistem periyodik girişe aynı periyotla periyodik çıkış verir, çünkü $y(t+T_0) = T\{x(t+T_0)\} = T\{x(t)\} = y(t)$. Çözümlü örnekler <a href="#/deneme/5">Deneme 5</a>’te, rastgele üretilenleri <a href="#/antrenman">Antrenman</a>’da.` },
      { t: 'h3', h: 'Özet tablo: nottaki bütün sistemler' },
      { t: 'p', h: T`L: lineer, ZD: zamanla değişmez, N: nedensel, K: kararlı, B: bellekli. Tabloya bakmadan önce kendin karar ver, sonra kontrol et. Gerekçeler test tezgâhındaki “Notun cevabını göster” düğmesinde.` },
      { t: 'table', head: ['Sistem', 'Not', 'L', 'ZD', 'N', 'K', 'B'], rows: SYS.map((s) => ['$' + s.tex + '$', s.src, yn(s.L[0]), yn(s.TI[0]), yn(s.C[0]), yn(s.St[0]), yn(s.M[0])]) },
      { t: 'quiz', items: [
        { q: T`$y[n] = \sum_{k=-\infty}^{n} x[k]$ (birikimli toplam) kararlı mı?`, opts: ['Evet', 'Hayır'], a: 1, why: T`$x = u[n]$ için $y[n] = (n+1)u[n]$, sınırsız büyür.` },
        { q: T`$y(t) = x(t)\,e^{-|t|}$ kararlı mı?`, opts: ['Evet', 'Hayır'], a: 0, why: T`$|y| \le B\cdot e^{-|t|} \le B$.` },
        { q: 'Bir sistemin kararsız olduğunu göstermek için ne gerekir?', opts: ['Bütün sınırlı girişleri denemek', 'Tek bir sınırlı girişin sınırsız çıkış verdiğini göstermek', 'Sistemin lineer olması'], a: 1, why: 'Tek bir karşı örnek yeter. Kararlılık ise her giriş için ispatlanmalıdır.' }] }
    ]
  });
})();
