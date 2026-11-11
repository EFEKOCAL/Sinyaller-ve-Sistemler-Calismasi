/*
 * Bölüm 1 · Sinyaller (1): 1.1 Sinyal ve sistem · 1.2 Periyodik sinyaller · 1.3 Enerji ve güç · 1.4 Çift ve tek
 * Kaynak: Ömer Akgün, Sinyaller ve Sistemler ders notları, s. 2–27
 */
(function () {
  'use strict';
  const SS = window.SS;
  SS.lessons = SS.lessons || [];
  const T = String.raw;
  const S = () => SS.sig;
  const fn = (f, color, o) => Object.assign({ kind: 'fn', f, color: color || 'x', fill: true, alpha: 0.12 }, o || {});
  const stems = (f, a, b, color, o) => () => { const n = [], v = []; for (let k = a; k <= b; k++) { n.push(k); v.push(f(k)); } return Object.assign({ kind: 'stem', n, v, color: color || 'x', labels: true }, o || {}); };
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 170, xLabel: 't', layers: layers.map((l) => (typeof l === 'function' ? l() : l)) }, o || {});

  const sysDiagram = T`<svg class="diagram" viewBox="0 0 560 110" role="img" aria-label="x(t) girişi sisteme girer, y(t) çıkışı çıkar">
    <defs><marker id="a0" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="arrowhead"/></marker></defs>
    <text x="40" y="50" text-anchor="middle" font-style="italic" style="fill:var(--c-x)">x(t)</text>
    <text x="40" y="74" text-anchor="middle" font-size="13">giriş</text>
    <path class="wire" d="M70 45 L200 45" marker-end="url(#a0)"/>
    <rect class="blk" x="200" y="15" width="160" height="60" rx="8"/><text x="280" y="50" text-anchor="middle">Sistem</text>
    <path class="wire" d="M360 45 L490 45" marker-end="url(#a0)"/>
    <text x="520" y="50" text-anchor="middle" font-style="italic" style="fill:var(--c-y)">y(t)</text>
    <text x="520" y="74" text-anchor="middle" font-size="13">çıkış</text></svg>`;

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.1', chap: 's', title: 'Sinyal ve sistem nedir?', pages: 's. 2–5',
    sub: 'Sürekli/ayrık zaman, analog/sayısal sinyal',
    lead: 'Bu dersin tamamı iki kavram üzerine kurulu: <strong>sinyal</strong> ve <strong>sistem</strong>. Önce ikisini tanıyalım, sonra sinyalleri zamanın ve genliğin türüne göre ayıralım.',
    goals: ['Sinyal ve sistemi tanımlamak', 'Sürekli ve ayrık zamanlıyı ayırt etmek', 'Analog, ayrık, sayısal farkı', 'Ayrık diziyi liste olarak okumak'],
    blocks: [
      { t: 'idea', h: T`Bir telefon görüşmesini düşün. Sesin, mikrofonda zamanla değişen bir gerilime dönüşür: bu bir <strong>sinyal</strong>. Telefonun içindeki devreler bu gerilimi alır, işler ve başka bir gerilim üretir: bu bir <strong>sistem</strong>. Ders boyunca hep aynı soruyu soracağız: “Bu sisteme şu sinyali verirsem ne çıkar?”` },
      { t: 'def', title: 'Tanımlar (s. 2)', h: T`<strong>Sinyal:</strong> Fiziksel bir büyüklüğün davranışı hakkında bilgi taşıyan, matematikte <em>fonksiyon</em> olarak yazılan ifade. Örnek: sıcaklık, nem, insan sesi, televizyon görüntüsü.<br><strong>Sistem:</strong> Bir giriş sinyaline karşılık bir çıkış sinyali üreten düzenek. Örnek: elektrik devreleri, bilgisayar programları, hava durumu, insan vücudu.` },
      { t: 'html', h: sysDiagram },
      { t: 'p', h: T`Sistemi bir “işlem” gibi düşünebilirsin: $y(t) = T\{x(t)\}$. Buradaki $T$ sistemin kuralıdır. Örneğin $T\{x\} = 2x$ girişi iki katına çıkarır, $T\{x\} = x(t-1)$ ise girişi 1 saniye geciktirir.` },

      { t: 'h', h: 'Sürekli ve ayrık zamanlı sinyaller', src: 's. 3–4' },
      { t: 'p', h: T`Fark, <strong>zaman değişkeninin</strong> türündedir. Gösterim de bunu belli eder: sürekli zamanda <strong>yuvarlak</strong> parantez $x(t)$, ayrık zamanda <strong>köşeli</strong> parantez $x[n]$ kullanılır. Not bazen ayrık sinyal için de $x(n)$ yazıyor; köşeli parantez yaygın ve daha açık gösterimdir.` },
      { t: 'table', head: ['', 'Sürekli zamanlı', 'Ayrık zamanlı'], rows: [
        ['Bağımsız değişken', '$t$, her gerçel değer', '$n$, yalnızca tam sayılar'],
        ['Gösterim', '$x(t)$', '$x[n]$ veya $x_n$'],
        ['Tanımlı olduğu yer', 'her an', 'yalnızca $n = \\ldots,-1,0,1,2,\\ldots$'],
        ['Çizim', 'kesintisiz eğri', 'çubuklar (stem)'],
        ['Sistemi tanımlayan', 'diferansiyel denklem', 'fark denklemi'],
        ['Örnek', 'mikrofon gerilimi', 'günlük kapanış fiyatı, örneklenmiş ses']] },
      { t: 'fig', fig: [spec([-4, 6], [-1.3, 1.6], [fn((t) => Math.sin(0.7 * t) * Math.exp(-0.05 * t * t) + 0.3, 'x', { fill: false })], { title: '(a) Sürekli: x(t)' }),
        spec([-5.6, 6.6], [-0.4, 2.6], [stems((n) => ({ '-3': 1, '-2': 2, '-1': 2, 0: 1, 2: 1, 4: 2 }[n] || 0), -5, 6)], { title: '(b) Ayrık: x[n]', xLabel: 'n', xStep: 1 })], cap: 'Notun s. 3’teki şekline benzer çizim: ayrık sinyal yalnızca tam sayı noktalarında değer taşır. Aradaki boşlukta “sıfır” yoktur, sinyal orada <em>tanımsızdır</em>.' },

      { t: 'h3', h: 'Ayrık bir diziyi yazmanın iki yolu' },
      { t: 'list', items: [
        T`<strong>Formülle:</strong> $x[n] = \begin{cases} \left(\frac{1}{2}\right)^n & n \ge 0 \\ 0 & n < 0 \end{cases}$`,
        T`<strong>Listeyle:</strong> $\{x_n\} = \{\ldots, 0, 0, 1, 2, 2, \underbrace{1}_{\uparrow}, 0, 1, 0, 2, 0, 0, \ldots\}$. Ok ($\uparrow$) $n=0$ örneğini gösterir.`] },
      { t: 'trap', h: T`Listede ok yoksa dizinin <strong>ilk elemanı $n=0$</strong> kabul edilir (not s. 4: $\{x_n\}=\{1,2,2,1,0,1,0,2\}$). Sınavda bir diziyi liste olarak yazarken oku <em>her zaman</em> işaretle. Ok bir yer kaydırılırsa bambaşka bir dizi elde edilir.` },
      { t: 'example', src: 's. 3', title: 'Formülden listeye', q: T`$x[n] = (1/2)^n$ ($n \ge 0$), $0$ ($n<0$) dizisini liste olarak yaz.`,
        steps: [T`$n<0$ için tüm değerler 0: listenin sol tarafı $\ldots, 0, 0$ olur.`, T`$n=0$: $(1/2)^0 = 1$. Ok buraya gelir.`, T`$n=1, 2, 3$: $\frac12, \frac14, \frac18, \ldots$`],
        ans: T`$\{x_n\} = \{\ldots, 0, 0, \underbrace{1}_{\uparrow}, \tfrac12, \tfrac14, \tfrac18, \ldots\}$` },

      { t: 'h', h: 'Analog, ayrık ve sayısal sinyaller', src: 's. 4–5' },
      { t: 'p', h: T`Bu kez yalnızca zamana değil, <strong>genliğe</strong> de bakıyoruz. Sürekli bir sinyali her $T$ saniyede bir ölçmeye <strong>örnekleme</strong> denir: $x[n] = x(nT)$. Ölçülen değeri sonlu sayıda seviyeden birine yuvarlamaya <strong>kuantalama</strong> denir.` },
      { t: 'idea', title: 'x[n] = x(nT) ne diyor?', h: T`Sözle: “Ayrık sinyalin $n$. örneği, sürekli sinyalin $n\cdot T$ anındaki değeridir.” $T$ iki ölçüm arasındaki süredir (örnekleme periyodu). Örneğin $T = 0.1$ s ise $x[0] = x(0)$, $x[1] = x(0.1)$, $x[2] = x(0.2)$, … Yani $n$ “kaçıncı ölçüm”, $nT$ ise “o ölçümün yapıldığı saniye”dir.<br><strong>Neden var?</strong> Bilgisayar sürekli bir eğriyi saklayamaz, yalnızca belirli anlarda alınmış sayıları saklayabilir. Bu formül, gerçek dünyadaki sinyal ile bilgisayardaki dizi arasındaki köprüdür.` },
      { t: 'table', head: ['Tür', 'Zaman', 'Genlik', 'Nerede görürsün?'], rows: [
        ['Analog', 'sürekli', 'sürekli', 'mikrofon çıkışı, osiloskop'],
        ['Ayrık zamanlı', 'ayrık', 'sürekli', 'örneklenmiş fakat yuvarlanmamış veri'],
        ['Sayısal (dijital)', 'ayrık', 'ayrık', 'bilgisayardaki ses dosyası, mikrodenetleyicinin ADC çıktısı']] },
      { t: 'lab', id: 'sampling' },
      { t: 'idea', title: 'Neden önemli?', h: T`Bilgisayar yalnızca sayısal sinyali saklayabilir. Dersin geri kalanında “ayrık zaman” dediğimizde genliği sürekli kabul edeceğiz. Kuantalama hatası ayrı bir konudur. Önemli olan, sürekli ve ayrık zamandaki her kavramın (enerji, periyot, konvolüsyon…) bir <em>ikizinin</em> olmasıdır: integral ↔ toplam, $t$ ↔ $n$.` },
      { t: 'quiz', items: [
        { q: 'Hangisi <em>sayısal</em> bir sinyaldir?', opts: ['Mikrofondan çıkan gerilim', 'Her saniye ölçülüp tam dereceye yuvarlanan oda sıcaklığı', 'Her saniye ölçülen, virgülden sonra sonsuz basamaklı basınç'], a: 1, why: 'Hem zamanda (her saniye) hem genlikte (tam dereceler) ayrık. Üçüncüsü ayrık zamanlı ama genliği sürekli.' },
        { q: T`$\{x_n\} = \{3, \underbrace{1}_{\uparrow}, 4, 1\}$ ise $x[1]$ kaçtır?`, opts: ['3', '1', '4'], a: 2, why: T`Ok $n=0$’ı gösteriyor: $x[0]=1$. Bir sağı $x[1] = 4$, solu $x[-1] = 3$.` },
        { q: 'Ayrık zamanlı bir sistemi tanımlayan matematiksel araç hangisidir?', opts: ['Diferansiyel denklem', 'Fark denklemi', 'Fourier serisi'], a: 1, why: 'Sürekli sistemler diferansiyel denklemlerle, ayrık sistemler fark denklemleriyle tanımlanır (s. 54). Bölüm 2’nin sonunda fark denklemlerini çözeceğiz.' }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.2', chap: 's', title: 'Periyodik sinyaller', pages: 's. 6–15',
    sub: 'Temel periyot, sinüs toplamları, ayrık sinüsler',
    lead: 'Kendini tekrar eden sinyaller. Sınavda neredeyse kesin çıkan soru tipi: “Periyodik midir? Periyodikse temel periyodu nedir?”',
    goals: ['Periyot ve temel periyot tanımı', 'Sinüs toplamının periyodunu bulmak', 'Rasyonel/irrasyonel oran testi', 'Ayrık sinüsün periyodu (tuzaklı!)'],
    blocks: [
      { t: 'idea', h: T`Bir sinyali $T$ kadar sağa kaydırdığında <strong>kendisiyle tam olarak üst üste geliyorsa</strong> sinyal periyodiktir. Bunu sağlayan en küçük pozitif $T$, temel periyot $T_0$’dır. $T_0$ işe yarıyorsa $2T_0$, $3T_0, \ldots$ de işe yarar; “temel” sözcüğü en küçüğü anlatır.` },
      { t: 'def', title: 'Tanım (s. 6–7)', h: T`Sürekli: $\quad x(t) = x(t + nT)$, her $t$ ve her tam sayı $n$ için ($T>0$ gerçel).<br>Ayrık: $\quad x[n] = x[n + N]$, her $n$ için ($N$ pozitif <strong>tam sayı</strong>).<br>Sinüs: $\quad x(t) = A\sin(\omega t + \theta)$ ⇒ $\omega = 2\pi f = \dfrac{2\pi}{T}$, yani $\boxed{T = \frac{2\pi}{\omega}}$. Burada $A$ genlik, $\omega$ açısal frekans (rad/s), $\theta$ fazdır.` },
      { t: 'table', head: ['Formül', 'Sözle ne diyor?', 'Neden böyle / ne zaman kullanırsın?'], rows: [
        [T`$x(t) = x(t + nT)$`, T`“Sinyalin şu anki değeri, $T$ saniye sonraki (ya da $2T$, $3T$, … sonraki) değeriyle aynı.”`, T`Periyodikliğin tanımı budur. $n$ her tam sayı olabildiği için ileri de geri de tekrar eder. “Periyodik olduğunu gösterin” sorusunda $x(t+T)$’yi yazıp $x(t)$’ye eşit çıktığını gösterirsin.`],
        [T`$x[n] = x[n + N]$`, T`“Dizi her $N$ örnekte bir aynı değerlere döner.”`, T`Ayrık zamanda örnekler yalnızca tam sayı indislerde var. Bu yüzden $N$ de tam sayı olmak <strong>zorunda</strong>: 2.5 örnek sonra diye bir şey yok.`],
        [T`$\omega = 2\pi f = \frac{2\pi}{T}$`, T`“Açısal frekans = saniyede dönülen açı.” $f$ saniyedeki tur sayısı, her tur $2\pi$ radyan.`, T`Sinüs, açısı $2\pi$ arttığında başa döner. Açı saniyede $\omega$ kadar arttığına göre $2\pi$’lik artış $T = 2\pi/\omega$ saniye sürer. Sinüslü her periyot sorusunda ilk adım budur.`],
        [T`$A$, $\theta$`, T`$A$ sinyalin ne kadar yükseğe çıktığı, $\theta$ başlangıçta ne kadar kaydırıldığı.`, T`İkisi de periyodu <strong>değiştirmez</strong>. Periyot sorusunda yalnızca $\omega$’ya bakılır.`]] },
      { t: 'fig', fig: spec([-1.2, 2.6], [-0.3, 1.4], [fn((t) => { const m = ((t % 1) + 1) % 1; return m < 0.45 ? 0 : (m - 0.45) / 0.55; }, 'x', { fill: false, n: 2000 }), { kind: 'vline', x: 1, color: 'accent', label: 'T' }, { kind: 'vline', x: 2, color: 'accent', label: '2T' }], { xStep: 0.5 }), cap: 'Not s. 6’daki testere dişi benzeri periyodik sinyal: her $T$ saniyede aynı şekil.' },
      { t: 'example', src: 's. 9', title: 'Sinüsün periyodu', q: T`$x(t) = A\sin(\omega t + \theta)$ sinyalinin periyodik olduğunu göster.`,
        steps: [T`Aday periyot: $T = \frac{1}{f} = \frac{2\pi}{\omega}$.`, T`$x(t+T) = A\sin[\omega(t+T)+\theta] = A\sin\left[\omega\left(t + \frac{2\pi}{\omega}\right) + \theta\right]$`, T`$= A\sin(\omega t + 2\pi + \theta) = A\sin(\omega t + \theta)$, çünkü sinüs $2\pi$’de bir tekrar eder.`],
        ans: T`$x(t+T) = x(t)$, dolayısıyla periyodik ve $T_0 = 2\pi/\omega$.` },
      { t: 'example', src: 's. 8', title: 'Bileşke ve çarpım', q: T`(a) $x(t) = e^{\sin t}$ ve (b) $x(t) = t\,e^{\sin t}$ periyodik midir?`,
        steps: [T`(a) $\sin(t+2\pi) = \sin t$ olduğundan $e^{\sin(t+2\pi)} = e^{\sin t}$. Periyodik, $T = 2\pi$. Periyodik bir fonksiyonun içine konan her şey periyodik kalır.`,
          T`(b) $x(t+2\pi) = (t + 2\pi)e^{\sin t} \ne t\,e^{\sin t}$. Öndeki $t$ çarpanı sürekli büyüyor ve hiçbir zaman tekrar etmiyor.`],
        ans: T`(a) Periyodik, $T_0 = 2\pi$. (b) Periyodik değil.` },
      { t: 'example', src: 's. 8', title: 'Temel periyodu oku', q: T`(a) $x(t) = j e^{j5t}$ (b) $x(t) = 2\cos\left(10\pi t + \frac{\pi}{6}\right)$`,
        steps: [T`(a) $e^{j\omega t}$’de $\omega = 5$. $T = 2\pi/\omega = 2\pi/5$. Öndeki $j$ yalnızca bir sabittir (faz kaydırır), periyodu değiştirmez.`, T`(b) $\omega = 10\pi$, $T = 2\pi/(10\pi) = 1/5$. Faz $\pi/6$ da periyodu değiştirmez.`],
        ans: T`(a) $T_0 = \frac{2\pi}{5}$, (b) $T_0 = \frac{1}{5}$` },
      { t: 'hw', src: 's. 9', q: T`$x(t) = e^{j\omega_0 t}$ sinyalinin periyodik olduğunu göster. Temel periyodu nedir?`, hint: T`$e^{j\omega_0(t+T)} = e^{j\omega_0 t}\cdot e^{j\omega_0 T}$. İkinci çarpan ne zaman 1 olur?`,
        steps: [T`$x(t+T) = e^{j\omega_0 t} e^{j\omega_0 T}$. Bunun $x(t)$’ye eşit olması için $e^{j\omega_0 T} = 1$ olmalı.`, T`$e^{j\theta} = 1 \iff \theta = 2\pi k$. Yani $\omega_0 T = 2\pi k$.`, T`En küçük pozitif çözüm $k=1$: $T = 2\pi/|\omega_0|$. ($\omega_0 = 0$ ise sinyal sabittir ve her $T$ bir periyottur.)`],
        ans: T`$T_0 = \dfrac{2\pi}{|\omega_0|}$` },

      { t: 'h', h: 'Periyodik sinyallerin toplamı', src: 's. 10–13' },
      { t: 'p', h: T`$x(t) = x_1(t) + x_2(t)$ olsun, periyotlar $T_1$ ve $T_2$. Toplamın tekrar etmesi için <strong>ikisinin de aynı anda başa dönmesi</strong> gerekir: bir $T$ için $T = mT_1 = kT_2$ ($m$, $k$ pozitif tam sayı).` },
      { t: 'math', h: T`mT_1 = kT_2 = T \quad\Longrightarrow\quad \frac{T_1}{T_2} = \frac{k}{m} \;\text{ rasyonel sayı olmalı}` },
      { t: 'idea', title: 'İki koşucu benzetmesi', h: T`Aynı başlangıç çizgisinden iki koşucu çıksın. Biri turunu 2 dakikada, diğeri 3 dakikada atıyor. İkisi başlangıç çizgisinde ilk kez <strong>6. dakikada</strong> buluşur: birincisi 3 tur, ikincisi 2 tur atmıştır. Bu, 2 ile 3’ün EKOK’udur. Sinüslerin toplamı da böyle çalışır: toplam sinyal, bütün bileşenler aynı anda “başlangıç çizgisine” döndüğünde tekrar eder.<br>Peki tur süreleri 2 dakika ve $\pi$ dakika olsaydı? $2m = \pi k$ eşitliğini sağlayan $m$, $k$ tam sayıları yoktur, çünkü $\pi$ hiçbir kesirle yazılamaz (<strong>irrasyonel</strong>). Koşucular bir daha asla aynı anda çizgiye gelmez. Pratik kural: oran hesaplanınca $\pi$ <em>sadeleşip gidiyorsa</em> rasyoneldir; <em>kalıyorsa</em> irrasyoneldir.` },
      { t: 'p', h: T`<strong>Kesirli periyotların EKOK’u:</strong> $T_1 = \frac{\pi}{5}$ ve $T_2 = \frac{\pi}{2}$ gibi kesirlerde doğrudan EKOK almak zordur. Ya oranı sadeleştir ($\frac{T_1}{T_2} = \frac25$, yani $5T_1 = 2T_2$), ya da ortak paydaya getir ($\frac{2\pi}{10}$ ve $\frac{5\pi}{10}$ → payların EKOK’u $10\pi$, bölü 10 → $\pi$). İkisi de aynı sonucu verir.` },
      { t: 'recipe', title: 'Çözüm reçetesi: “Periyodik midir? Temel periyot?”', steps: [
        T`Her bileşenin periyodunu bul: $T_i = 2\pi/\omega_i$. Genliklere ve fazlara bakma, sadece $\omega$ önemli.`,
        T`Birini referans al ($T_1$) ve $T_1/T_i$ oranlarını yaz.`,
        T`Oranların <strong>hepsi rasyonelse</strong> sinyal periyodiktir. Birinde bile $\pi$ “sadeleşmiyorsa” (irrasyonel) periyodik değildir.`,
        T`Oranları en sade kesre çevir: $T_1/T_i = p_i/q_i$. Paydaların EKOK’u $n$ ise $T_0 = n\cdot T_1$.`,
        T`<strong>Kısa yol:</strong> $\omega_0 = \text{EBOB}(\omega_1, \omega_2, \ldots)$ bul, sonra $T_0 = 2\pi/\omega_0$. Örnek: $\omega = 10, 4$ → EBOB 2 → $T_0 = \pi$.`] },
      { t: 'example', src: 's. 11', q: T`$x(t) = 2\cos(10t + 1) - 2\sin(4t - 1)$ periyodik mi? Temel periyodu nedir?`,
        steps: [T`$T_1 = \frac{2\pi}{10} = \frac{\pi}{5}$, $\quad T_2 = \frac{2\pi}{4} = \frac{\pi}{2}$`, T`$\dfrac{T_1}{T_2} = \dfrac{\pi/5}{\pi/2} = \dfrac{2}{5}$: rasyonel, periyodik.`, T`$5T_1 = 2T_2$: $\;5\cdot\frac{\pi}{5} = 2\cdot\frac{\pi}{2} = \pi$`],
        ans: T`Periyodik, $T_0 = \pi$. (Kısa yol: EBOB(10, 4) = 2, $T_0 = 2\pi/2 = \pi$.)` },
      { t: 'example', src: 's. 12', q: T`$x(t) = \cos 2t + \cos 3t + \cos 5t$ periyodik mi?`,
        steps: [T`$T_1 = \pi$, $T_2 = \frac{2\pi}{3}$, $T_3 = \frac{2\pi}{5}$. Ortak paydaya getir: $T_1 = \frac{15\pi}{15}$, $T_2 = \frac{10\pi}{15}$, $T_3 = \frac{6\pi}{15}$.`,
          T`$T_1$’i referans al: $\frac{T_1}{T_2} = \frac{3}{2}$, $\frac{T_1}{T_3} = \frac{5}{2}$. Her ikisi de rasyonel.`, T`Paydaların EKOK’u 2: $T_0 = 2T_1 = 2\pi$.`],
        ans: T`Periyodik, $T_0 = 2\pi$` },
      { t: 'example', src: 's. 13', q: T`$v(t) = \cos(3.5t) + \sin(2t) + 2\cos\left(\frac{7t}{6}\right)$ periyodik mi? Peki $w(t) = v(t) + 3\sin(5\pi t)$?`,
        steps: [T`$T_{01} = \frac{2\pi}{3.5}$, $T_{02} = \frac{2\pi}{2} = \pi$, $T_{03} = \frac{2\pi}{7/6}$`,
          T`$\frac{T_{01}}{T_{02}} = \frac{2}{3.5} = \frac{4}{7}$, $\quad\frac{T_{01}}{T_{03}} = \frac{7/6}{3.5} = \frac{7}{21} = \frac13$. İkisi de rasyonel.`,
          T`Paydalar 7 ve 3, EKOK = 21: $T_0 = 21\,T_{01} = 21\cdot\frac{2\pi}{3.5} = 12\pi$.`,
          T`$x_4 = 3\sin(5\pi t)$ için $T_{04} = \frac{2}{5}$. $\frac{T_{01}}{T_{04}} = \frac{2\pi/3.5}{2/5} = \frac{5\pi}{3.5}$: içinde $\pi$ var, irrasyonel.`],
        ans: T`$v(t)$ periyodik, $T_0 = 12\pi$. $w(t)$ periyodik <strong>değil</strong>.` },
      { t: 'lab', id: 'periodic' },
      { t: 'hw', src: 's. 14', q: T`$x(t) = \cos\frac{\pi}{3}t + \sin\frac{\pi}{4}t$ periyodik mi? Temel periyodu nedir?`, hint: T`İki $\omega$’da da $\pi$ var, bu yüzden periyotlarda $\pi$ sadeleşir.`,
        steps: [T`$T_1 = \frac{2\pi}{\pi/3} = 6$, $\quad T_2 = \frac{2\pi}{\pi/4} = 8$`, T`$\frac{T_1}{T_2} = \frac{6}{8} = \frac34$: rasyonel.`, T`Payda 4: $T_0 = 4T_1 = 24$ (veya EKOK(6, 8) = 24).`],
        ans: T`Periyodik, $T_0 = 24$` },

      { t: 'h', h: 'Ayrık zamanlı sinüsler: tuzaklı konu', src: 's. 7, 9–10, 14–15' },
      { t: 'p', h: T`Ayrık zamanda periyot $N$ bir <strong>tam sayı</strong> olmak zorundadır. Bu tek fark her şeyi değiştirir: $\cos(\Omega n)$ periyodik olsun diye $\Omega N = 2\pi m$ sağlanmalıdır, yani` },
      { t: 'math', h: T`\frac{\Omega}{2\pi} = \frac{m}{N} \quad \text{rasyonel olmalı.} \qquad N_0 = \text{bu kesrin en sade hâlindeki payda}` },
      { t: 'idea', title: 'Bu formül nereden çıkıyor? (sözle)', h: T`$\cos(\Omega n)$’de her örnekte açı $\Omega$ kadar artar. $N$ örnek sonra açı $\Omega N$ kadar artmış olur. Kosinüsün başa dönmesi için bu artışın <strong>tam tur</strong> olması gerekir: $\Omega N = 2\pi\cdot m$ ($m$ tane tam tur).<br>Her iki tarafı $2\pi N$’ye bölersen $\frac{\Omega}{2\pi} = \frac{m}{N}$ çıkar. Sözle: “$\Omega/2\pi$, örnek başına dönülen <em>tur</em> sayısıdır. Bu sayı bir kesirse, $N$ örnekte tam $m$ tur dönülür ve dizi başa döner.”<br>Kesir sadeleştirilince <strong>payda $N$ = periyot</strong> (kaç örnekte başa dönüldüğü), <strong>pay $m$</strong> = o sürede kaç tur atıldığı. Örnek: $\Omega = \frac{3\pi}{4}$ → $\frac{\Omega}{2\pi} = \frac38$: 8 örnekte 3 tur → $N = 8$.` },
      { t: 'trap', h: T`Sürekli $\cos(\omega t)$ <strong>her</strong> $\omega$ için periyodiktir. Ayrık $\cos(\Omega n)$ ise yalnızca $\Omega$, $\pi$’nin rasyonel katıysa periyodiktir. Örneğin $\cos(2n)$ ve $10e^{j2n}$ (s. 20) <strong>periyodik değildir</strong>. İkinci tuzak: $N$ her zaman $2\pi/\Omega$ değildir. $\Omega = \frac{3\pi}{4}$ için $2\pi/\Omega = 8/3$ tam sayı değil; doğru cevap $\frac{\Omega}{2\pi} = \frac38$ olduğundan $N = 8$.` },
      { t: 'example', src: 's. 9', title: 'Grafikten periyot', q: T`Notta $x[n]$ çift $n$’lerde 1, tek $n$’lerde $-1$ olan bir dizi var ($x[-4] = x[-2] = x[0] = x[2]$). Periyodu ve frekansı nedir?`,
        fig: spec([-5.6, 5.6], [-1.5, 1.5], [stems((n) => (n % 2 === 0 ? 1 : -1), -5, 5, 'x', { labels: false })], { xLabel: 'n', xStep: 1 }),
        steps: [T`Dizi her 2 adımda bir kendini tekrar ediyor: $x[n+2] = x[n]$, $N = 2$.`, T`$\Omega = \frac{2\pi}{N} = \frac{2\pi}{2} = \pi$ rad/örnek. Gerçekten de $x[n] = \cos(\pi n) = (-1)^n$.`],
        ans: T`$N = 2$, $\Omega = \pi$ rad/örnek` },
      { t: 'hw', src: 's. 10', q: T`$x[n] = \cos\gamma n$, $\gamma = \pi/8$. Periyodik olduğunu göster, temel periyodu nedir?`,
        steps: [T`$\frac{\Omega}{2\pi} = \frac{\pi/8}{2\pi} = \frac{1}{16}$: rasyonel.`, T`Payda 16: $N_0 = 16$. Kontrol: $\cos\left(\frac{\pi}{8}(n+16)\right) = \cos\left(\frac{\pi n}{8} + 2\pi\right)$ ✓.`], ans: T`$N_0 = 16$` },
      { t: 'example', src: 's. 14', q: T`$x[n] = \cos^2\left(\frac{\pi}{8}n\right)$ periyodik mi?`,
        steps: [T`Önce kareden kurtul: $\cos^2\theta = \frac12(1 + \cos 2\theta)$.`, T`$x[n] = \frac12 + \frac12\cos\left(\frac{\pi}{4}n\right) = x_1[n] + x_2[n]$`,
          T`$x_1[n] = \frac12 = \frac12(1)^n$: her $N$ için tekrar eder, $N_1 = 1$.`, T`$x_2[n]$: $\Omega_2 = \pi/4$, $\frac{\Omega_2}{2\pi} = \frac18$ → $N_2 = 8$.`, T`EKOK(1, 8) = 8.`],
        ans: T`Periyodik, $N_0 = 8$. (Dikkat: $\cos(\pi n/8)$’in periyodu 16, karesininki ise 8.)` },
      { t: 'lab', id: 'periodic', opts: { tab: 1 } },
      { t: 'hw', src: 's. 15', q: T`$x[n] = e^{j\left(\frac{2\pi}{3}\right)n} + e^{j\left(\frac{3\pi}{4}\right)n}$ periyodik mi? Periyodikse temel periyodu nedir?`, hint: T`Her terim için $\frac{\Omega}{2\pi}$’yi sadeleştir; paydalar $N_1$ ve $N_2$’dir.`,
        steps: [T`$\frac{2\pi/3}{2\pi} = \frac13 = \frac{m}{N}$ → $N_1 = 3$ (payda)`, T`$\frac{3\pi/4}{2\pi} = \frac38 = \frac{m}{N}$ → $N_2 = 8$. Dikkat: $\frac38$ periyot değildir, $\frac{m}{N}$ oranıdır. Periyot sadeleşmiş kesrin <strong>paydasıdır</strong> ($m = 3$, $N = 8$). Kontrol: $\frac{3\pi}{4}\cdot 8 = 6\pi = 3\cdot 2\pi$ ✓. Ayrık periyot her zaman tam sayıdır, $\frac38$ olamaz.`, T`İkisi de periyodik; toplamın periyodu EKOK(3, 8) = 24.`], ans: T`Periyodik, $N_0 = 24$` },
      { t: 'quiz', items: [
        { q: T`$x(t) = \sin(3t) + \cos(\pi t)$ periyodik midir?`, opts: ['Evet, $T_0 = 2\\pi$', 'Evet, $T_0 = 6$', 'Hayır'], a: 2, why: T`$T_1 = 2\pi/3$, $T_2 = 2$. Oran $\pi/3$ irrasyonel: periyodik değil.` },
        { q: T`$x[n] = \cos(0.4\pi n)$ dizisinin temel periyodu nedir?`, opts: ['5', '$5\\pi$', '2.5'], a: 0, why: T`$\frac{0.4\pi}{2\pi} = \frac{1}{5}$ → $N = 5$.` },
        { q: T`$x[n] = \sin(3n)$ için hangisi doğrudur?`, opts: ['$N = 2\\pi/3$', 'Periyodik değildir', '$N = 3$'], a: 1, why: T`$\frac{3}{2\pi}$ irrasyonel. Ayrıca $N$ tam sayı olmak zorunda, $2\pi/3$ olamaz.` },
        { q: T`$x(t) = 4\cos(6t) - \sin(9t + 2)$ sinyalinin temel periyodu nedir?`, opts: ['$\\frac{2\\pi}{3}$', '$\\frac{\\pi}{3}$', '$2\\pi$'], a: 0, why: T`EBOB(6, 9) = 3, yani $T_0 = 2\pi/3$. Kontrol: $T_1 = \pi/3$, $T_2 = 2\pi/9$, $T_1/T_2 = 3/2$ → $T_0 = 2T_1 = 2\pi/3$.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '1.3', chap: 's', title: 'Enerji ve güç sinyalleri', pages: 's. 16–21',
    sub: 'E ve P formülleri, sınıflandırma, toplam formülleri',
    lead: 'Bir sinyalin “ne kadar büyük” olduğunu ölçmenin iki yolu: toplam enerjisi ve ortalama gücü. Her sinyal bu ikisinden en fazla birini sonlu taşıyabilir.',
    goals: ['Dört formülü (E, P; sürekli, ayrık) yazmak', 'Enerji / güç / hiçbiri ayrımı', 'Periyodik sinyalin gücünü bir periyottan bulmak', 'Geometrik seri formüllerini kullanmak'],
    blocks: [
      { t: 'idea', h: T`$x(t)$ bir gerilim olsun ve $1\,\Omega$’luk bir dirence uygulansın. Anlık güç $x^2(t)$ olur. Tüm zaman boyunca harcanan toplam enerji $\int x^2 dt$’dir. Bu yüzden enerji “$|x|^2$’nin altındaki <strong>toplam alan</strong>”, güç ise “zaman başına düşen <strong>ortalama alan</strong>” olarak düşünülür. Kısa süren veya sönen sinyallerin enerjisi sonludur. Sonsuza kadar süren sinyallerin (sinüs gibi) enerjisi sonsuzdur, ama ortalama güçleri sonlu olabilir.` },
      { t: 'def', title: 'Formüller (s. 16)', h: T`$$E = \int_{-\infty}^{\infty} |x(t)|^2\,dt \qquad\qquad E = \sum_{n=-\infty}^{\infty} |x[n]|^2$$
$$P = \lim_{T\to\infty} \frac{1}{T}\int_{-T/2}^{T/2} |x(t)|^2\,dt \qquad\qquad P = \lim_{N\to\infty} \frac{1}{2N+1}\sum_{n=-N}^{N} |x[n]|^2$$` },
      { t: 'table', head: ['Parça', 'Sözle ne diyor?', 'Neden var?'], rows: [
        [T`$|x(t)|^2$`, T`“Sinyalin o anki büyüklüğünün karesi”, yani o anki güç.`, T`Dirençteki güç gerilimin karesiyle orantılıdır ($V^2/R$). Kare almak eksi değerleri de artıya çevirir: $-3$ V da $+3$ V kadar ısıtır. Mutlak değer, karmaşık sinyaller ($e^{j\omega t}$ gibi) için büyüklüğü almak içindir.`],
        [T`$E = \int_{-\infty}^{\infty}|x(t)|^2dt$`, T`“Bütün zaman boyunca harcanan toplam enerji”: $|x|^2$ eğrisinin altındaki toplam alan.`, T`Sinyalin “toplam ne kadar iş yaptığı”. Kısa süren ya da sönen sinyaller için sonlu bir sayı çıkar.`],
        [T`$P = \lim\limits_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2}|x|^2dt$`, T`“Ortalama güç”: $T$ uzunluğunda bir pencerede enerjiyi topla, pencerenin süresine böl. Sonra pencereyi bütün zaman eksenini kaplayana kadar büyüt.`, T`Sonsuza kadar süren sinyallerde (sinüs, sabit) toplam enerji sonsuzdur, işe yaramaz. Bunun yerine “saniye başına ne kadar enerji” sorusu sorulur.`],
        [T`$\sum_{n=-\infty}^{\infty}|x[n]|^2$`, T`Ayrık enerji: her örneğin karesini topla.`, T`Ayrık zamanda alan yerine toplam kullanılır (integral ↔ toplam).`],
        [T`$\frac{1}{2N+1}\sum_{n=-N}^{N}|x[n]|^2$`, T`Ayrık ortalama güç: $-N$’den $N$’ye kadar örneklerin karelerini topla, örnek sayısına böl.`, T`$-N, \ldots, 0, \ldots, N$ arasında tam $2N+1$ örnek vardır. Paydaki o yüzden $2N+1$: “toplam bölü adet = ortalama”.`]] },
      { t: 'table', head: ['Durum', 'Sonuç', 'Tipik örnekler'], rows: [
        ['$0 < E < \\infty$', 'Enerji sinyali ($P = 0$ olur)', 'sönen üstel $e^{-at}u(t)$, sonlu darbe, $4(0.5)^n u[n]$'],
        ['$0 < P < \\infty$', 'Güç sinyali ($E = \\infty$ olur)', 'sinüs, her periyodik sinyal, sabit, $u(t)$'],
        ['$E = \\infty$ ve $P = \\infty$', 'Hiçbiri', '$t\\,u(t)$, $e^{t}$']] },
      { t: 'trap', h: T`Bir sinyal aynı anda hem enerji hem güç sinyali <strong>olamaz</strong>: $E$ sonluysa $E/T \to 0$ olur, yani $P=0$. Periyodik (ve sıfır olmayan) bir sinyalin enerjisi ise her zaman sonsuzdur. Bu yüzden periyodik sinyallerde doğrudan güce bak: <strong>bir periyot üzerinden ortalama</strong> yeterlidir, $\;P = \frac{1}{T_0}\int_{T_0}|x|^2dt$.` },
      { t: 'def', title: 'Toplam formülleri (s. 17): ayrık sorularda gerekecek', h: T`$$\sum_{n=0}^{N-1}\alpha^n = \begin{cases}\frac{1-\alpha^N}{1-\alpha} & \alpha \ne 1 \\ N & \alpha = 1\end{cases} \qquad \sum_{n=0}^{\infty}\alpha^n = \frac{1}{1-\alpha} \qquad \sum_{n=k}^{\infty}\alpha^n = \frac{\alpha^k}{1-\alpha}$$
$$\sum_{n=0}^{\infty} n\alpha^n = \frac{\alpha}{(1-\alpha)^2} \qquad \sum_{n=0}^{\infty} n^2\alpha^n = \frac{\alpha^2+\alpha}{(1-\alpha)^3} \qquad (|\alpha|<1)$$` },
      { t: 'idea', title: 'Bu toplam formülleri ne işe yarıyor?', h: T`Bunlar <strong>geometrik seri</strong> formülleridir: her terim bir öncekinin $\alpha$ katı olan sayıların toplamı ($1 + \alpha + \alpha^2 + \ldots$).<br><strong>Neden gerekli?</strong> Ayrık sinyaller çoğunlukla $x[n] = A\alpha^n u[n]$ biçimindedir. Enerjiyi hesaplarken $|x[n]|^2 = A^2(\alpha^2)^n$ olur, yani karşına bir geometrik seri çıkar. Sonsuz terimi tek tek toplayamazsın; bu formüller toplamı tek adımda verir.<br>• <strong>$\sum_0^{N-1}\alpha^n$:</strong> sonlu sayıda terim (ilk $N$ terim). Sinyal belli bir aralıkta varsa.<br>• <strong>$\sum_0^\infty\alpha^n = \frac{1}{1-\alpha}$:</strong> sonsuz terim, $n=0$’dan başlıyor. En çok kullanacağın formül bu. Yalnızca $|\alpha|<1$ ise geçerli; terimler küçülmezse toplam sonsuz olur.<br>• <strong>$\sum_k^\infty\alpha^n = \frac{\alpha^k}{1-\alpha}$:</strong> toplam $n=k$’dan başlıyorsa (ör. $u[n-2]$ ile kesilmiş sinyal). İlk terim $\alpha^k$, gerisi aynı.<br>• <strong>$n\alpha^n$ ve $n^2\alpha^n$ formülleri:</strong> sinyalin içinde $n$ çarpanı varsa ($n(0.5)^n u[n]$ gibi). Daha az çıkar.<br>Ezber ipucu: “<strong>ilk terim bölü (1 − oran)</strong>.” Bu cümle hem $\frac{1}{1-\alpha}$’yı hem $\frac{\alpha^k}{1-\alpha}$’yı verir.` },
      { t: 'recipe', steps: [
        T`$|x|^2$’yi yaz. Karmaşık sinyallerde $|e^{j\theta}| = 1$ kullan, örneğin $|10e^{j2n}| = 10$.`,
        T`Sinyal sönüyor veya sınırlı bir aralıkta mı? Önce $E$’yi hesapla. $0 < E < \infty$ (sonlu ve sıfırdan farklı) ise enerji sinyalidir. Bu durumda $P = 0$ çıkar, yani güç sinyali olamaz.`,
        T`Sinyal periyodik veya sabite yaklaşıyorsa $P$’yi hesapla (periyodikse bir periyot üzerinden). $0 < P < \infty$ (sonlu ve sıfırdan farklı) ise güç sinyalidir. Bu durumda $E = \infty$ çıkar, yani enerji sinyali olamaz.`,
        T`$|x|^2$ büyüyorsa ($t$, $e^{t}$ gibi) ikisi de sonsuzdur: hiçbiri.`] },
      { t: 'example', src: 's. 18', title: 'Dört hızlı örnek', q: T`(a) $x[n] = 4(0.5)^n$, $n \ge 0$ &nbsp; (b) $x[n] = 2\cos\left(\frac{2\pi}{4}n\right)$ &nbsp; (c) $x(t) = 3e^{-t}$, $t \ge 0$ &nbsp; (d) $x(t) = 3\cos\left(\frac{\pi}{8}t\right)$`,
        steps: [T`(a) $E = \sum_{n=0}^{\infty} 16(0.25)^n = \frac{16}{1 - 0.25} = \frac{64}{3}$. Sonlu: <strong>enerji</strong>.`,
          T`(b) Periyot $N = 4$, değerler $2, 0, -2, 0$. $P = \frac14\sum_{n=0}^{3}|x[n]|^2 = \frac14(4 + 0 + 4 + 0) = 2$: <strong>güç</strong>.`,
          T`(c) $E = \int_0^\infty 9e^{-2t}dt = \frac{9}{2}$: <strong>enerji</strong>.`,
          T`(d) Periyot $T_0 = \frac{2\pi}{\pi/8} = 16$. $P = \frac{1}{16}\int_{-8}^{8} 9\cos^2\left(\frac{\pi}{8}t\right)dt = \frac{9}{32}\int_{-8}^{8}\left(1 + \cos\frac{2\pi}{8}t\right)dt = \frac{9}{32}\cdot 16 = \frac92$: <strong>güç</strong>.`],
        ans: T`(a) $E = 64/3$, (b) $P = 2$, (c) $E = 9/2$, (d) $P = 9/2$` },
      { t: 'example', src: 's. 19–20', q: T`(a) $x(t) = e^{-at}u(t)$, $a>0$ &nbsp; (b) $x(t) = A\cos(\omega t + \theta)$ &nbsp; (c) $x[n] = 10e^{j2n}$`,
        steps: [T`(a) $E = \int_0^\infty e^{-2at}dt = \left.\frac{e^{-2at}}{-2a}\right|_0^\infty = \frac{1}{2a} < \infty$: enerji.`,
          T`(b) Periyodik, $T = 2\pi/\omega$. $P = \frac{\omega}{2\pi}\int_0^{2\pi/\omega} A^2\cos^2(\omega t+\theta)dt = \frac{A^2\omega}{2\pi}\cdot\frac12\cdot\frac{2\pi}{\omega} = \frac{A^2}{2}$: güç. <em>Ezberle: sinüsün gücü genliğin karesinin yarısıdır.</em>`,
          T`(c) $|x[n]| = 10|\cos 2n + j\sin 2n| = 10\sqrt{\cos^2 2n + \sin^2 2n} = 10$. $P = \lim \frac{1}{2N+1}\sum_{-N}^{N}100 = \lim\frac{100(2N+1)}{2N+1} = 100$: güç. (Bu dizi periyodik bile değil, ama gücü yine de sonlu.)`],
        ans: T`(a) $E = \frac{1}{2a}$ &nbsp; (b) $P = \frac{A^2}{2}$ &nbsp; (c) $P = 100$` },
      { t: 'example', src: 's. 21', q: T`(a) $x[n] = 2e^{j3n}$ &nbsp; (b) $x(t) = t\,u(t)$`,
        steps: [T`(a) $|x[n]| = 2$ → $P = \lim\frac{1}{2N+1}\cdot 4(2N+1) = 4$: güç.`, T`(b) $E = \int_0^\infty t^2 dt = \infty$. $\;P = \lim\frac{1}{T}\int_0^{T/2} t^2dt = \lim\frac{1}{T}\frac{(T/2)^3}{3} = \lim \frac{T^2}{24} = \infty$.`],
        ans: T`(a) Güç sinyali, $P = 4$. (b) Ne enerji ne güç sinyali.` },
      { t: 'lab', id: 'energy' },
      { t: 'hw', src: 's. 20', q: T`Aşağıdaki sinyallerin enerji, güç ya da ikisi de olmadığını belirle. (a) $-2<t<2$ aralığında 5, dışarıda 0 olan darbe. (b) Bu darbenin periyodik olarak tekrarlanmış hâli (şekilde 8 birimde bir tekrarlanıyor). (c) $f[k] = e^{-0.5k}$ ($k \ge 0$), 0 ($k<0$).`,
        hint: T`(b)’de bir periyot üzerinden ortalama al: darbenin enerjisini periyoda böl.`,
        steps: [T`(a) $E = \int_{-2}^{2} 25\,dt = 100$: sonlu, <strong>enerji sinyali</strong>.`, T`(b) Periyodik, $T_0 = 8$ (şekilden okunan değer). Bir periyottaki enerji 100. $P = \frac{100}{8} = 12.5$: <strong>güç sinyali</strong>.`,
          T`(c) $E = \sum_{k=0}^{\infty} e^{-k} = \sum (e^{-1})^k = \frac{1}{1 - e^{-1}} \approx 1.582$: <strong>enerji sinyali</strong>.`],
        ans: T`(a) Enerji, $E=100$ · (b) Güç, $P = 12.5$ · (c) Enerji, $E = \frac{e}{e-1} \approx 1.58$` },
      { t: 'quiz', items: [
        { q: T`$x(t) = u(t)$ (birim basamak) hangi sınıftadır?`, opts: ['Enerji sinyali', 'Güç sinyali, $P = 1/2$', 'Hiçbiri'], a: 1, why: T`$E = \int_0^\infty 1\,dt = \infty$. $P = \lim\frac{1}{T}\int_0^{T/2}1\,dt = \frac12$. Sinyal yalnızca pencerenin yarısında “açık”.` },
        { q: T`$x(t) = 5\sin(100t)$ sinyalinin gücü nedir?`, opts: ['25', '12.5', '5'], a: 1, why: T`$A^2/2 = 25/2$. Frekans gücü etkilemez.` },
        { q: T`Enerjisi $E = 7$ olan bir sinyalin gücü nedir?`, opts: ['7', '0', '$\\infty$'], a: 1, why: T`Sonlu enerji, sonsuz uzun bir pencereye bölünürse sıfıra gider.` }] }
    ]
  });

  /* ====================================================================== */
  const uE = (t) => 0.5, uO = (t) => (t > 0 ? 0.5 : t < 0 ? -0.5 : 0);
  SS.lessons.push({
    id: '1.4', chap: 's', title: 'Çift ve tek sinyaller', pages: 's. 22–27',
    sub: 'Simetri, çift/tek bileşen, çarpım kuralları',
    lead: 'Her sinyal, bir çift ve bir tek sinyalin toplamı olarak tek bir şekilde yazılabilir. Bu ayrıştırma ileride Fourier dönüşümünde işini çok kolaylaştıracak.',
    goals: ['Çift ve tek tanımı', 'Çift/tek bileşen formülleri', 'Çarpımın tekliği/çiftliği', 'Ayrık sinyalde ayrıştırma'],
    blocks: [
      { t: 'idea', h: T`<strong>Çift</strong> sinyal dikey eksende <em>ayna</em> gibidir: sol ve sağ taraf aynıdır ($\cos t$, $t^2$, $|t|$). <strong>Tek</strong> sinyal ise orijin etrafında 180° döndürülünce kendisine oturur: sağ taraf, sol tarafın baş aşağı hâlidir ($\sin t$, $t$, $t^3$). Tek sinyalin $t=0$’daki değeri her zaman 0’dır.` },
      { t: 'def', title: 'Tanım ve ayrıştırma (s. 22)', h: T`Çift: $x(t) = x(-t)$ &nbsp;&nbsp;&nbsp; Tek: $x(t) = -x(-t)$<br>
<strong>Her sinyal, çift bileşeni ile tek bileşeninin toplamına eşittir:</strong>
$$x(t) = \underbrace{x_e(t)}_{\text{çift bileşen}} + \underbrace{x_o(t)}_{\text{tek bileşen}}$$
<strong>Çift bileşen</strong> $x_e(t)$ (e: <em>even</em>, çift), sinyal ile aynasının toplamının yarısıdır:
$$x_e(t) = \frac{x(t) + x(-t)}{2}$$
<strong>Tek bileşen</strong> $x_o(t)$ (o: <em>odd</em>, tek), sinyal ile aynasının farkının yarısıdır:
$$x_o(t) = \frac{x(t) - x(-t)}{2}$$
Ayrık zamanda aynısı geçerli: $x_e[n] = \frac{x[n] + x[-n]}{2}$, $\;x_o[n] = \frac{x[n] - x[-n]}{2}$.` },
      { t: 'p', h: T`Neden işe yarıyor? $x_e(-t) = \frac{x(-t)+x(t)}{2} = x_e(t)$, yani çift. $x_o(-t) = \frac{x(-t)-x(t)}{2} = -x_o(t)$, yani tek. Toplamları da $x_e + x_o = x$ olur: çift bileşen ile tek bileşeni toplayınca sinyalin kendisi geri gelir.` },
      { t: 'idea', title: 'Sözle: formül ne yapıyor, neden var?', h: T`Her $t$ noktasını aynası $-t$ ile eşleştir. Bu iki noktadaki değerler $x(t)$ ve $x(-t)$’dir.<br>• <strong>Çift bileşen</strong> bu iki değerin <em>ortalamasını</em> alır ve iki noktaya da aynı değeri koyar. İki taraf eşit olduğu için sonuç çifttir.<br>• <strong>Tek bileşen</strong> farkın yarısını alır, bir tarafa $+$, öbür tarafa $-$ koyar. Bu yüzden sonuç tektir.<br>Örnek: $x(3) = 5$ ve $x(-3) = 1$ ise ortalama 3, yarı fark 2’dir. $x_e(\pm3) = 3$, $x_o(3) = 2$, $x_o(-3) = -2$. Kontrol: $3+2 = 5$ ✓, $3-2 = 1$ ✓.<br><strong>Neden var?</strong> Simetrik sinyallerle hesap çok kolaylaşır: tek bir sinyalin simetrik aralıktaki integrali hiç hesap yapmadan 0’dır, çift sinyalinki ise yarısının iki katıdır. Fourier serisinde de çift parça yalnızca kosinüslerle, tek parça yalnızca sinüslerle yazılır. Sinyali ikiye ayırınca her parçaya uygun kısa yolu kullanabilirsin.` },
      { t: 'table', head: ['Çarpım (s. 27)', 'Sonuç', 'Neden?'], rows: [
        ['çift × çift', 'çift', '$x_1(-t)x_2(-t) = x_1(t)x_2(t)$'],
        ['tek × tek', 'çift', '$(-x_1)(-x_2) = x_1x_2$'],
        ['çift × tek', 'tek', '$x_1\\cdot(-x_2) = -x_1x_2$']] },
      { t: 'idea', title: 'Ezber kısayolu', h: T`İşaretler gibi düşün: çift = $+$, tek = $-$. $(-)(-) = +$, $(+)(-) = -$. Ayrıca: polinomun <strong>çift kuvvetleri ve sabiti</strong> çift parçaya, <strong>tek kuvvetleri</strong> tek parçaya gider.` },
      { t: 'example', src: 's. 23a', q: T`$x(t) = 10\sin t + 5\cos t - 2\cos t\sin t$ sinyalinin çift ve tek bileşenlerini bul.`,
        steps: [T`$\sin(-t) = -\sin t$, $\cos(-t) = \cos t$ kullan: $x(-t) = -10\sin t + 5\cos t + 2\cos t\sin t$.`,
          T`$x_e(t) = \frac{x(t) + x(-t)}{2} = \frac{10\cos t}{2} = 5\cos t$`, T`$x_o(t) = \frac{x(t) - x(-t)}{2} = \frac{20\sin t - 4\cos t\sin t}{2} = 10\sin t - 2\cos t\sin t$`],
        ans: T`$x_e = 5\cos t$, $\;x_o = 10\sin t - 2\cos t\sin t$. (Kısayol: $\cos$ çift; $\sin$ ve $\cos\cdot\sin$ tek.)` },
      { t: 'example', src: 's. 23b–24', q: T`$y(t) = u(t)$ (birim basamak) sinyalinin çift ve tek bileşenlerini bul ve çiz.`,
        steps: [T`$y(-t)$: $t<0$ için 1, $t>0$ için 0 (basamağın aynası).`,
          T`$y_e(t) = \frac{y(t)+y(-t)}{2}$: $t<0$ için $\frac{0+1}{2}$, $t>0$ için $\frac{1+0}{2}$. Her yerde $\frac12$.`,
          T`$y_o(t) = \frac{y(t)-y(-t)}{2}$: $t<0$ için $\frac{0-1}{2} = -\frac12$, $t>0$ için $+\frac12$.`,
          { h: 'Çizim:', fig: [spec([-3, 3], [-0.8, 1.2], [fn(uE, 'h', { n: 2000 })], { title: 'yₑ(t) = 1/2' }), spec([-3, 3], [-0.8, 1.2], [fn(uO, 'y', { n: 2000 })], { title: 'yₒ(t)' })] }],
        ans: T`$y_e(t) = \frac12$, $\quad y_o(t) = \begin{cases}-\frac12 & t<0 \\ \frac12 & t>0\end{cases}$. Not: $y_e$ ile $y_o$’nun toplamı $t>0$’da 1, $t<0$’da 0 eder ✓.` },
      { t: 'example', src: 's. 25', q: T`$x[n] = \{0, 2, 4, 2\}$ ($n = 0, 1, 2, 3$) dizisinin çift ve tek bileşenlerini bul.`,
        fig: spec([-4.6, 4.6], [-0.5, 4.8], [stems((n) => ({ 1: 2, 2: 4, 3: 2 }[n] || 0), -4, 4)], { xLabel: 'n', xStep: 1 }),
        steps: [T`$x[-n]$ dizinin aynası: $x[-1] = 2$, $x[-2] = 4$, $x[-3] = 2$ (pozitif tarafta 0).`,
          T`$x_e[n] = \frac{x[n] + x[-n]}{2}$: $n=\pm1 \to 1$, $n=\pm2 \to 2$, $n=\pm3 \to 1$, $n=0 \to 0$.`,
          T`$x_o[n] = \frac{x[n] - x[-n]}{2}$: $n=1,2,3 \to 1, 2, 1$; $n=-1,-2,-3 \to -1,-2,-1$; $x_o[0] = 0$.`],
        ans: T`$\{x_e\} = \{0, 1, 2, 1, \underbrace{0}_{\uparrow}, 1, 2, 1, 0\}$, $\;\{x_o\} = \{0, -1, -2, -1, \underbrace{0}_{\uparrow}, 1, 2, 1, 0\}$ ($n = -4 \ldots 4$)` },
      { t: 'example', src: 's. 27', q: T`$x(t) = e^{jt}$ sinyalinin çift ve tek bileşenlerini bul.`,
        steps: [T`$x(-t) = e^{-jt}$`, T`$x_e(t) = \frac12(e^{jt} + e^{-jt}) = \cos t$`, T`$x_o(t) = \frac12(e^{jt} - e^{-jt}) = j\sin t$`],
        ans: T`$x_e = \cos t$, $\;x_o = j\sin t$. Euler formülünün $e^{jt} = \cos t + j\sin t$ yazılışı tam olarak bu ayrıştırmadır.` },
      { t: 'lab', id: 'evenodd' },
      { t: 'hw', src: 's. 26', q: T`(a) $z(t) = t^2 + 4t - 10$ &nbsp; (b) $h(t) = 1$ ($0<t<1$), 0 (diğer) &nbsp; (c) $x[n] = 4$ ($n = 0, \ldots, 5$), 0 (diğer). Çift ve tek bileşenleri bul.`,
        hint: T`(a)’da kısayolu kullan. (b) ve (c)’de önce aynayı çiz, sonra formülleri uygula. $n=0$’a dikkat et.`,
        steps: [T`(a) $z(-t) = t^2 - 4t - 10$. $z_e = t^2 - 10$, $z_o = 4t$.`,
          T`(b) $h(-t)$, $-1<t<0$ aralığında 1’dir. $h_e(t) = \frac12$ ($|t|<1$). $h_o(t) = \frac12$ ($0<t<1$), $-\frac12$ ($-1<t<0$).`,
          T`(c) $x_e[0] = \frac{4+4}{2} = 4$, $\;x_e[n] = 2$ ($1 \le |n| \le 5$). $\;x_o[0] = 0$, $\;x_o[n] = 2$ ($1 \le n \le 5$), $-2$ ($-5 \le n \le -1$).`],
        ans: T`Laboratuvarda “ödev s. 26” seçeneklerini seçerek çizimleri kontrol et.` },
      { t: 'quiz', items: [
        { q: T`$x(t) = t^3\cos(5t)$ sinyali nasıldır?`, opts: ['Çift', 'Tek', 'Hiçbiri'], a: 1, why: T`$t^3$ tek, $\cos$ çift: tek × çift = tek.` },
        { q: T`Tek bir sinyal için hangisi her zaman doğrudur?`, opts: ['$x(0) = 0$', '$x(0) = 1$', '$x$ periyodiktir'], a: 0, why: T`$x(0) = -x(-0) = -x(0)$ ⇒ $x(0) = 0$.` },
        { q: T`$\int_{-5}^{5} t\cos t\,dt$ kaçtır?`, opts: ['0', '$10\\sin 5$', 'Hesaplanamaz'], a: 0, why: T`$t\cos t$ tek bir fonksiyon. Simetrik bir aralıkta sağdaki alanı soldaki alan götürür.` }] }
    ]
  });
})();
