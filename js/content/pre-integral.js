/*
 * Ders öncesi ön bilgi: 0.1 İntegral tekrarı · 0.2 Sinyallerde integral
 * Bölüm 1 ve 2'de (enerji/güç, δ, sistemler, konvolüsyon) gereken integral becerileri.
 */
(function () {
  'use strict';
  const SS = window.SS;
  SS.lessons = SS.lessons || [];
  const T = String.raw;
  const fn = (f, color, o) => Object.assign({ kind: 'fn', f, color: color || 'x', fill: true, alpha: 0.12, n: 2000 }, o || {});
  const spec = (x, y, layers, o) => () => Object.assign({ x, y, h: 170, xLabel: 't', layers: layers.map((l) => (typeof l === 'function' ? l() : l)) }, o || {});
  const area = (f, from, to, color) => ({ kind: 'area', f, from, to, color: color || 'y', alpha: 0.3, n: 2000 });

  /* ====================================================================== */
  SS.lessons.push({
    id: '0.1', chap: 'pre', title: 'İntegral tekrarı', pages: 'ön bilgi',
    sub: 'Alan fikri, temel integraller, sonsuz sınır, trigonometri, simetri, kısmi integrasyon',
    lead: 'Sinyaller dersinde enerji, güç, impuls ve konvolüsyon hep bir integralle hesaplanır. Ama gereken integral çeşidi azdır: birkaç kalıp ve üç dört numara. Bu sayfa yalnızca dersin gerçekten kullandığı kısmı toplar.',
    goals: ['İntegrali “işaretli alan” olarak okumak', 'Temel integral tablosunu ve $f(at+b)$ kuralını kullanmak', '$\\int_0^\\infty e^{-at}dt = \\frac1a$ gibi sonsuz sınırlı integralleri almak', '$\\cos^2$ ve çarpım dönüşümleriyle sinüs integrallerini almak', 'Simetri ve kısmi integrasyonla hesabı kısaltmak'],
    blocks: [
      { t: 'h', h: 'Fikir: integral alandır' },
      { t: 'idea', h: T`$\int_a^b f(t)\,dt$, $f$’nin $a$ ile $b$ arasındaki grafiğinin altında kalan <strong>işaretli alandır</strong>: eksenin üstü artı, altı eksi sayılır. Ayrık zamandaki karşılığı toplamdır: $\int$ ↔ $\sum$. Sinyaller dersinde enerji “$|x|^2$’nin altındaki alan”, güç “zaman başına ortalama alan”dır. Bu yüzden integral bu derste bir hesap aracından çok bir <strong>alan ölçme</strong> aracıdır.` },
      { t: 'def', title: 'Hesaplama kuralı', h: T`$F'(t) = f(t)$ olan bir $F$ (ilkel) bul. Sonra $$\int_a^b f(t)\,dt = \Big[F(t)\Big]_a^b = F(b) - F(a)$$ <strong>Kontrol yöntemi:</strong> bulduğun $F$’nin türevini al. $f$’yi veriyorsa doğrudur. Sınavda bu 10 saniyelik kontrol çoğu işaret hatasını yakalar.` },
      { t: 'lab', id: 'integral' },

      { t: 'h', h: 'Temel integral tablosu' },
      { t: 'table', head: ['$f(t)$', '$\\int f(t)\\,dt$', 'Dersin neresinde?'], rows: [
        ['$k$ (sabit)', '$kt$', 'Dikdörtgen darbenin enerjisi: $\\int_{-2}^{2} 25\\,dt = 100$'],
        ['$t^n$', '$\\dfrac{t^{n+1}}{n+1}$ &nbsp;($n \\ne -1$)', 'Rampa parçaları: $\\int_0^1 (3t)^2dt = 3$'],
        ['$e^{at}$', '$\\dfrac{e^{at}}{a}$', 'Sönen üstel, konvolüsyon. $a$ karmaşık da olabilir: $\\int e^{j\\omega t}dt = \\frac{e^{j\\omega t}}{j\\omega}$'],
        ['$\\cos \\omega t$', '$\\dfrac{\\sin \\omega t}{\\omega}$', 'Periyot üzerinde integral 0'],
        ['$\\sin \\omega t$', '$-\\dfrac{\\cos \\omega t}{\\omega}$', 'Eksiye dikkat!'],
        ['$\\cos^2 \\omega t$', '$\\dfrac{t}{2} + \\dfrac{\\sin 2\\omega t}{4\\omega}$', 'Sinüsün gücü: $A^2/2$'],
        ['$\\sin^2 \\omega t$', '$\\dfrac{t}{2} - \\dfrac{\\sin 2\\omega t}{4\\omega}$', 'Aynı, ortalaması yine $\\frac12$'],
        ['$\\dfrac1t$', '$\\ln|t|$', 'Nadiren gerekir']] },
      { t: 'def', title: 'İki temel özellik', h: T`<strong>Doğrusallık:</strong> $\int (a f + b g)\,dt = a\int f\,dt + b\int g\,dt$. Sabitler dışarı çıkar, toplam terim terim alınır.<br><strong>Aralık bölme:</strong> $\int_a^c f = \int_a^b f + \int_b^c f$ ve $\int_a^b f = -\int_b^a f$. Parçalı tanımlı sinyallerin hepsi bu kuralla çözülür (bkz. 0.2).` },
      { t: 'recipe', title: 'İçeride doğrusal ifade varsa: f(at + b)', steps: [
        T`İçeriyi tek bir değişken gibi düşün ve tablodan ilkeli yaz.`,
        T`Sonucu içerinin türevine, yani $a$’ya böl: $\displaystyle\int f(at+b)\,dt = \frac{F(at+b)}{a}$.`,
        T`Örnek: $\int \cos(2t+1)\,dt = \frac{\sin(2t+1)}{2}$, $\;\int e^{-3t+2}\,dt = \frac{e^{-3t+2}}{-3}$.`] },
      { t: 'example', title: 'Polinom', q: T`Aşağıdaki integrali hesaplayınız.
$$\int_0^2 (3t^2 - 2t + 1)\,dt$$`,
        steps: [T`Terim terim ilkel:
$$F(t) = t^3 - t^2 + t$$
Kontrol: $F'(t) = 3t^2 - 2t + 1$ ✓`, T`Sınırları yerine koy:
$$F(2) - F(0) = (8 - 4 + 2) - 0 = 6$$`], ans: T`$6$. Laboratuvarda “3t² − 2t + 1” seçip $[0, 2]$ aralığına bak.` },

      { t: 'h', h: 'Sonsuz sınır ve sönen üstel' },
      { t: 'p', h: T`Enerji hesaplarının çoğu $\int_0^\infty$ şeklindedir. Sonsuz sınırda $F(\infty)$ yerine <strong>limit</strong> alınır: $\lim_{t\to\infty} F(t)$. Bu derste neredeyse her zaman karşına çıkan limit $e^{-at} \to 0$ ($a>0$) limitidir.` },
      { t: 'def', title: 'En çok kullanılan integral', h: T`$$\int_0^\infty e^{-at}\,dt = \left[\frac{e^{-at}}{-a}\right]_0^\infty = 0 - \frac{1}{-a} = \frac1a \qquad (a > 0)$$ Benzer şekilde $\int_{t_0}^\infty e^{-at}dt = \frac{e^{-at_0}}{a}$.` },
      { t: 'trap', h: T`$a \le 0$ ise $e^{-at}$ sönmez, integral <strong>sonsuzdur</strong>. Enerji sorularında “sinyal sönüyor mu?” sorusu tam olarak budur. Bir de kare alırken üs ikiye katlanır: $|3e^{-t}|^2 = 9e^{-2t}$, $9e^{-t}$ değil.` },
      { t: 'example', src: '1.3, s. 18', title: 'Enerji integrali', q: T`Aşağıdaki sinyalin enerjisini bulunuz.
$$x(t) = 3e^{-t}u(t)$$`,
        steps: [T`Karesini al. $u(t)$ yüzünden sinyal yalnızca $t \ge 0$’da var, integral 0’dan başlar:
$$|x(t)|^2 = 9e^{-2t}, \qquad t \ge 0$$`, T`$$E = \int_0^\infty 9e^{-2t}\,dt = 9\cdot\frac{1}{2} = \frac{9}{2}$$`,
          { h: T`Alan olarak:`, fig: spec([-0.5, 4], [-0.5, 9.5], [area((t) => (t >= 0 ? 9 * Math.exp(-2 * t) : 0), 0, 4), fn((t) => (t >= 0 ? 9 * Math.exp(-2 * t) : 0), 'x', { fill: false })], { title: '|x(t)|² = 9e^(−2t) altındaki alan = 9/2', xStep: 1, yStep: 3 }) }],
        ans: T`$E = \frac92$` },

      { t: 'h', h: 'Trigonometrik integraller' },
      { t: 'def', title: 'Üç gerçek', h: T`<strong>1. Tam periyotta sinüs ve kosinüsün integrali 0’dır:</strong> $\int_0^{2\pi/\omega}\cos\omega t\,dt = \int_0^{2\pi/\omega}\sin\omega t\,dt = 0$. Pozitif ve negatif alanlar birbirini götürür.<br>
<strong>2. Kare alınca yarıya iner:</strong> $$\cos^2\theta = \frac{1 + \cos 2\theta}{2}, \qquad \sin^2\theta = \frac{1 - \cos 2\theta}{2}$$ Bir periyot üzerinde $\cos 2\theta$ kısmı 0 verir, geriye $\frac12$ kalır. Yani $\cos^2$’nin <strong>ortalaması $\frac12$</strong>’dir.<br>
<strong>3. Çarpımı toplama çevir:</strong> $$\cos A\cos B = \tfrac12[\cos(A-B) + \cos(A+B)] \qquad \sin A\sin B = \tfrac12[\cos(A-B) - \cos(A+B)] \qquad \sin A\cos B = \tfrac12[\sin(A+B) + \sin(A-B)]$$` },
      { t: 'idea', title: 'Sinüsün gücü neden $A^2/2$?', h: T`$P = \frac{1}{T_0}\int_{T_0} A^2\cos^2(\omega t)\,dt = A^2 \cdot (\cos^2\text{’nin ortalaması}) = A^2\cdot\frac12$. Frekans ve faz sonucu değiştirmez, çünkü tam periyotta ortalama hep $\frac12$’dir. İki farklı frekanslı sinüs toplanırsa çapraz terim (3. gerçekle) iki kosinüse ayrılır ve 0 verir. Bu yüzden güçler toplanır: $3\cos t + 4\sin 2t$ için $P = \frac92 + \frac{16}{2} = 12.5$.` },
      { t: 'example', src: '1.3, s. 18', title: 'Periyot üzerinden güç', q: T`Aşağıdaki sinyalin gücünü integral alarak bulunuz.
$$x(t) = 3\cos\left(\frac{\pi}{8}t\right)$$`,
        steps: [T`Periyot:
$$T_0 = \frac{2\pi}{\pi/8} = 16$$
Bir periyot üzerinden ortalama:
$$P = \frac{1}{16}\int_{-8}^{8} 9\cos^2\left(\frac{\pi}{8}t\right)dt$$`,
          T`$\cos^2$ formülü $\cos^2\theta = \frac{1 + \cos 2\theta}{2}$ ile:
$$P = \frac{9}{32}\int_{-8}^{8}\left(1 + \cos\frac{\pi}{4}t\right)dt$$`,
          T`$\cos\frac{\pi}{4}t$’nin periyodu 8. $[-8, 8]$ iki tam periyot olduğu için integrali 0. Geriye kalan:
$$P = \frac{9}{32}\cdot 16 = \frac{9}{2}$$`],
        ans: T`$P = \frac92 = \frac{A^2}{2}$ ✓` },

      { t: 'h', h: 'Simetri: hesap yapmadan sonuç' },
      { t: 'def', h: T`Simetrik aralıkta ($-c$’den $c$’ye):<br><strong>Tek</strong> fonksiyon ($f(-t) = -f(t)$; örn. $t$, $t^3$, $\sin t$, $t^2\sin t$): $\displaystyle\int_{-c}^{c} f\,dt = 0$.<br><strong>Çift</strong> fonksiyon ($f(-t) = f(t)$; örn. $t^2$, $\cos t$, $e^{-|t|}$): $\displaystyle\int_{-c}^{c} f\,dt = 2\int_0^c f\,dt$.` },
      { t: 'example', q: T`Aşağıdaki integralleri hesaplayınız.
$$\text{(a)}\;\; \int_{-\pi}^{\pi} t^2\sin t\,dt \qquad\qquad \text{(b)}\;\; \int_{-\infty}^{\infty} e^{-2|t|}\,dt$$`,
        steps: [T`(a) $t^2$ çift, $\sin t$ tek, çarpım tek (çift · tek = tek, bkz. Ders 1.4). Simetrik aralıkta tek fonksiyonun integrali <strong>0</strong>’dır. Kısmi integrasyonla uğraşmaya gerek yok.`,
          T`(b) $e^{-2|t|}$ çift, yarısını alıp iki katına çıkar:
$$\int_{-\infty}^{\infty} e^{-2|t|}\,dt = 2\int_0^\infty e^{-2t}\,dt = 2\cdot\frac{1}{2} = 1$$`],
        ans: T`(a) $0$<br>(b) $1$` },

      { t: 'h', h: 'Kısmi integrasyon: $t\\,e^{-at}$ gibi çarpımlar' },
      { t: 'def', h: T`$$\int u\,dv = uv - \int v\,du$$ <strong>Seçim kuralı:</strong> polinomu $u$ seç (türevi alındıkça sadeleşir), üsteli veya sinüsü $dv$ seç (integrali kolay). Konvolüsyonda ve rampa çarpı üstel sinyallerde gerekir.` },
      { t: 'example', title: 'Kısmi integrasyon', q: T`Aşağıdaki integrali hesaplayınız.
$$\int_0^\infty t\,e^{-t}\,dt$$`,
        steps: [T`Parçaları seç:
$$u = t, \quad dv = e^{-t}dt \qquad\Longrightarrow\qquad du = dt, \quad v = -e^{-t}$$`,
          T`$\int u\,dv = uv - \int v\,du$ formülünü uygula:
$$\int_0^\infty t\,e^{-t}\,dt = \Big[-t\,e^{-t}\Big]_0^\infty + \int_0^\infty e^{-t}\,dt$$`,
          T`Köşeli parantez 0’dır: $t \to \infty$ iken $t\,e^{-t} \to 0$ (üstel her polinomu yener), $t = 0$’da da 0. Kalan:
$$\int_0^\infty e^{-t}\,dt = 1$$`],
        ans: T`$1$. Genel kalıp:
$$\int t\,e^{-at}\,dt = -\frac{at + 1}{a^2}\,e^{-at} \qquad\Longrightarrow\qquad \int_0^\infty t\,e^{-at}\,dt = \frac{1}{a^2}$$` },

      { t: 'hw', title: 'Isınma seti', q: T`Aşağıdaki integralleri hesaplayınız.
$$\text{(a)}\;\; \int_{-1}^{2}(t^2 + 1)\,dt \qquad \text{(b)}\;\; \int_0^\infty 4e^{-3t}\,dt \qquad \text{(c)}\;\; \int_0^{\pi}\sin t\,dt$$
$$\text{(d)}\;\; \int_{-\pi}^{\pi}t^2\sin t\,dt \qquad \text{(e)}\;\; \int_0^\infty t\,e^{-2t}\,dt$$`,
        hint: T`(d) için simetriye bak. (e) için kısmi integrasyon ya da yukarıdaki genel kalıp ($a = 2$).`,
        steps: [T`(a)
$$\left[\frac{t^3}{3} + t\right]_{-1}^{2} = \left(\frac{8}{3} + 2\right) - \left(-\frac{1}{3} - 1\right) = \frac{14}{3} + \frac{4}{3} = 6$$`,
          T`(b) $\int_0^\infty e^{-at}dt = \frac{1}{a}$ kalıbı ile:
$$4\cdot\frac{1}{3} = \frac{4}{3}$$`,
          T`(c)
$$\Big[-\cos t\Big]_0^\pi = -\cos\pi - (-\cos 0) = 1 + 1 = 2$$`,
          T`(d) Tek fonksiyon, simetrik aralık: $0$.`,
          T`(e) $\int_0^\infty t\,e^{-at}dt = \frac{1}{a^2}$ kalıbı ile, $a = 2$:
$$\frac{1}{4}$$`],
        ans: T`(a) $6$<br>(b) $\frac{4}{3}$<br>(c) $2$<br>(d) $0$<br>(e) $\frac{1}{4}$` },
      { t: 'quiz', items: [
        { q: T`$\int \sin(3t)\,dt$ nedir?`, opts: ['$-\\frac{\\cos 3t}{3}$', '$\\frac{\\cos 3t}{3}$', '$-3\\cos 3t$'], a: 0, why: T`$\sin$’in ilkeli $-\cos$; içerideki 3’e bölünür. Kontrol:
$$\frac{d}{dt}\left(-\frac{\cos 3t}{3}\right) = \sin 3t \;\;✓$$` },
        { q: T`$\int_0^\infty e^{-5t}dt$ kaçtır?`, opts: ['$5$', '$\\frac15$', '$\\infty$'], a: 1, why: T`$\int_0^\infty e^{-at}dt = \frac1a$.` },
        { q: T`$\int_{-2}^{2} t^5\,dt$ kaçtır?`, opts: ['$0$', '$\\frac{64}{6}$', '$\\frac{32}{3}$'], a: 0, why: T`$t^5$ tek, aralık simetrik.` },
        { q: T`$\frac{1}{T_0}\int_{T_0}\cos^2(\omega_0 t)\,dt$ (bir tam periyot) kaçtır?`, opts: ['$0$', '$1$', '$\\frac12$'], a: 2, why: T`$\cos^2 = \frac{1 + \cos 2\theta}{2}$; kosinüs kısmı tam periyotta 0 verir.` }] }
    ]
  });

  /* ====================================================================== */
  SS.lessons.push({
    id: '0.2', chap: 'pre', title: 'Sinyallerde integral', pages: 'ön bilgi',
    sub: 'Parçalı sinyaller, u(t) ile sınırlar, değişken üst sınır, δ, limitle güç',
    lead: 'Derste integraller genellikle tek formül hâlinde gelmez: içinde $u(t)$, parçalı tanımlar, $\\delta(t)$ veya sınırında $t$ olan ifadeler bulunur. Bunları tablodaki temel integrallere indirmenin dört numarası var.',
    goals: ['Parçalı tanımlı sinyalin integralini aralıklara bölmek', '$u(t)$’leri integral sınırına çevirmek', '$\\int_{-\\infty}^{t}$ tipi integrali durumlara ayırarak çözmek (konvolüsyona hazırlık)', 'Güç limitini hesaplamak'],
    blocks: [
      { t: 'h', h: '1. Parçalı sinyal: aralıklara böl' },
      { t: 'p', h: T`Sinyal farklı aralıklarda farklı formülle veriliyorsa integrali her aralık için ayrı al ve topla. Sinyalin 0 olduğu aralıklar hiçbir şey katmaz.` },
      { t: 'example', src: '1.7, s. 50', title: 'Yamuk sinyalin enerjisi', q: T`Aşağıdaki sinyalin enerjisini bulunuz.
$$x(t) = \begin{cases} 3t, & 0 < t < 1 \\ 3, & 1 < t < 2 \\ 0, & \text{diğer} \end{cases}$$`,
        steps: [T`Karesini parça parça al:
$$|x(t)|^2 = \begin{cases} 9t^2, & 0 < t < 1 \\ 9, & 1 < t < 2 \\ 0, & \text{diğer} \end{cases}$$`,
          T`İntegrali aralıklara böl:
$$E = \int_0^1 9t^2\,dt + \int_1^2 9\,dt = 9\cdot\frac{1}{3} + 9\cdot 1 = 3 + 9$$`,
          { h: T`$E = 12$`, fig: spec([-0.5, 2.8], [-0.8, 10], [area((t) => (t > 0 && t < 1 ? 9 * t * t : 0), 0, 1, 'y'), area((t) => (t >= 1 && t < 2 ? 9 : 0), 1, 2, 'h'), fn((t) => (t > 0 && t < 1 ? 9 * t * t : t >= 1 && t < 2 ? 9 : 0), 'x', { fill: false })], { title: '|x(t)|²: iki parça, iki integral', xStep: 1, yStep: 3 }) }],
        ans: T`$E = 3 + 9 = 12$` },
      { t: 'trap', h: T`Enerjide $|x|^2$’nin integrali alınır, $x$’in değil. Negatif parçalar da kare alınınca <strong>pozitif</strong> katkı verir. Önce kare al, sonra integral al.` },

      { t: 'h', h: '2. Birim basamak integral sınırını keser' },
      { t: 'def', h: T`$u(t - a)$, $t<a$ için 0, $t>a$ için 1’dir. Bu yüzden integralin içinde <strong>alt sınırı $a$’ya çeker</strong> ve kendisi kaybolur:
$$\int_{-\infty}^{\infty} f(t)\,u(t-a)\,dt = \int_a^\infty f(t)\,dt \qquad \int_{-\infty}^{\infty} f(t)\,u(b - t)\,dt = \int_{-\infty}^{b} f(t)\,dt$$
$$\int_{-\infty}^{\infty} f(t)\,\big[u(t-a) - u(t-b)\big]\,dt = \int_a^b f(t)\,dt \qquad (a<b)$$` },
      { t: 'recipe', steps: [
        T`Her $u(\cdot)$ için “hangi $t$’lerde 1?” sorusunu cevapla: $u(t-a) \Rightarrow t>a$, $\;u(b-t) \Rightarrow t<b$.`,
        T`Bu koşulların hepsinin sağlandığı aralığı bul (kesişim). Boşsa integral 0’dır.`,
        T`Sınırları bu aralık yap, $u$’ları sil, kalan temel integrali al.`] },
      { t: 'example', q: T`Aşağıdaki integralleri hesaplayınız.
$$\text{(a)}\;\; \int_{-\infty}^{\infty} e^{-2t}\,u(t-1)\,dt \qquad \text{(b)}\;\; \int_{-\infty}^{\infty} e^{-t}\big[u(t) - u(t-2)\big]dt \qquad \text{(c)}\;\; \int_{-\infty}^{\infty} u(t+1)\,u(3-t)\,dt$$`,
        steps: [T`(a) $u(t-1)$ yalnızca $t > 1$’de 1:
$$\int_1^\infty e^{-2t}\,dt = \frac{e^{-2}}{2}$$`,
          T`(b) $u(t) - u(t-2)$ yalnızca $0 < t < 2$’de 1:
$$\int_0^2 e^{-t}\,dt = 1 - e^{-2}$$`,
          T`(c) $u(t+1)$ için $t > -1$, $u(3-t)$ için $t < 3$. İkisi birlikte:
$$\int_{-1}^{3} 1\,dt = 4$$`],
        ans: T`(a) $\frac{e^{-2}}{2}$<br>(b) $1 - e^{-2}$<br>(c) $4$` },

      { t: 'h', h: '3. Üst sınırda $t$ varsa: durumlara ayır' },
      { t: 'p', h: T`Sistemlerde ($y(t) = \int_{-\infty}^{t}x(\tau)d\tau$) ve Bölüm 2’deki konvolüsyonda sonuç bir <strong>sayı değil, $t$’nin fonksiyonudur</strong>. İntegralin içinde $\tau$ değişkendir, $t$ ise sınırda duran bir sabit gibi davranır.` },
      { t: 'recipe', title: 'Koşan integral reçetesi', steps: [
        T`$x(\tau)$’nun kırılma noktalarını işaretle (örn. $\tau = 0$ ve $\tau = 2$).`,
        T`Üst sınır $t$’yi sayı doğrusunda soldan sağa gezdir. Her kırılma noktası yeni bir <strong>durum</strong> başlatır.`,
        T`Her durumda integral aralığını yaz: alt sınır sinyalin başladığı yer, üst sınır $\min(t, \text{sinyalin bittiği yer})$.`,
        T`Sonuçları $t$’nin aralıklarına göre parçalı yaz. Kontrol: sonuç sürekli olmalı (sınırlarda değerler tutmalı).`] },
      { t: 'example', title: 'Darbenin koşan integrali', q: T`Aşağıda verilen $x(t)$ için $y(t)$’yi bulunuz.
$$x(t) = u(t) - u(t-2), \qquad y(t) = \int_{-\infty}^{t} x(\tau)\,d\tau$$`,
        steps: [T`$t < 0$: integral aralığında sinyal yok, $y(t) = 0$.`,
          T`$0 < t < 2$:
$$y(t) = \int_0^t 1\,d\tau = t$$`,
          T`$t > 2$: darbe bitti, alan sabit kaldı:
$$y(t) = \int_0^2 1\,d\tau = 2$$`,
          { h: T`$y(t) = r(t) - r(t-2)$: rampa, sonra düzleşme. Kontrol: $t=2$’de iki formül de 2 veriyor ✓`, fig: [spec([-1.5, 4.5], [-0.3, 1.4], [fn((t) => (t >= 0 && t < 2 ? 1 : 0), 'x')], { title: 'x(τ)', xStep: 1, xLabel: 'τ' }), spec([-1.5, 4.5], [-0.3, 2.5], [fn((t) => Math.min(Math.max(t, 0), 2), 'y')], { title: 'y(t) = ∫ x(τ)dτ, −∞ → t', xStep: 1 })] }],
        ans: T`$$y(t) = \begin{cases} 0, & t < 0 \\ t, & 0 < t < 2 \\ 2, & t > 2 \end{cases} \;=\; r(t) - r(t-2)$$` },
      { t: 'example', title: 'Üstelin koşan integrali', q: T`Aşağıdaki integrali $t$’ye bağlı olarak bulunuz.
$$y(t) = \int_{-\infty}^{t} e^{-\tau}u(\tau)\,d\tau$$`,
        steps: [T`$t < 0$: aralıktaki her $\tau$ için $u(\tau) = 0$, sonuç 0.`,
          T`$t > 0$:
$$y(t) = \int_0^t e^{-\tau}\,d\tau = \Big[-e^{-\tau}\Big]_0^t = 1 - e^{-t}$$`],
        ans: T`$(1 - e^{-t})\,u(t)$. Bu ifade Bölüm 2’de RC devresinin basamak cevabı olarak tekrar karşına çıkacak.` },
      { t: 'trap', h: T`$\int_{-\infty}^{t} x(t)\,dt$ yazma: sınırdaki $t$ ile integral değişkeni aynı harf olamaz. İçeride $\tau$ kullan. Sonuçta $\tau$ kalmaz, sadece $t$ kalır.` },

      { t: 'h', h: '4. δ’lı integral: integral almadan sonuç' },
      { t: 'p', h: T`$\delta$ içeren integralde ilkel aranmaz. Elek özelliği doğrudan değeri verir: $\int f(t)\delta(t-a)\,dt = f(a)$ ($a$ aralığın içindeyse, değilse 0). $u$ ve $\delta$ birlikteyse önce $\delta$’nın yerini bul, sonra $u$’nun orada 1 mi 0 mı olduğuna bak: $\int_{-\infty}^{\infty} e^{-t}u(t)\,\delta(t-2)\,dt = e^{-2}\cdot u(2) = e^{-2}$. Ayrıntılar ve örnekler: <a href="#/ders/1.5">Ders 1.5</a>.` },

      { t: 'h', h: '5. Güç: integral ve limit' },
      { t: 'def', h: T`$$P = \lim_{T\to\infty}\frac1T\int_{-T/2}^{T/2}|x(t)|^2\,dt$$ Önce integrali $T$ cinsinden hesapla, sonra $T$’ye böl ve limit al. Limitte <strong>en yüksek dereceli terimler</strong> kazanır.` },
      { t: 'example', src: '1.3, s. 21', q: T`Aşağıdaki sinyallerin gücünü bulunuz.
$$\text{(a)}\;\; x(t) = u(t) \qquad\qquad \text{(b)}\;\; x(t) = t\,u(t)$$`,
        steps: [T`(a) $u$ yalnızca $t > 0$’da 1, pencerenin yarısını kaplar:
$$\int_{-T/2}^{T/2}u(t)\,dt = \int_0^{T/2}1\,dt = \frac{T}{2}$$
$$P = \lim_{T\to\infty}\frac{1}{T}\cdot\frac{T}{2} = \frac{1}{2}$$`,
          T`(b)
$$\int_0^{T/2}t^2\,dt = \frac{(T/2)^3}{3} = \frac{T^3}{24}$$
$$P = \lim_{T\to\infty}\frac{1}{T}\cdot\frac{T^3}{24} = \lim_{T\to\infty}\frac{T^2}{24} = \infty$$`],
        ans: T`(a) $P = \frac{1}{2}$, güç sinyali<br>(b) $P = \infty$, hiçbiri` },

      { t: 'h', h: 'Hepsi bir arada' },
      { t: 'recipe', title: 'Bir integral sorusu gelince', steps: [
        T`Enerji/güç sorusuysa önce $|x|^2$’yi yaz.`,
        T`$\delta$ varsa: elek özelliği, integral yok.`,
        T`$u(\cdot)$’ları sınıra çevir ve sil.`,
        T`Parçalı ise aralıklara böl.`,
        T`Tablodan ilkeli bul (simetri ile 0 çıkıyor mu, önce ona bak). Türevini alıp kontrol et.`,
        T`Sınırları yerine koy; $\infty$ için limit al ($e^{-at} \to 0$).`,
        T`Sonuç mantıklı mı? Enerji negatif olamaz, alan grafiğe göre makul olmalı.`] },
      { t: 'hw', title: 'Derse benzer set', q: T`(a) Aşağıdaki sinyalin enerjisini bulunuz.
$$x(t) = \begin{cases} 2, & -1 < t < 1 \\ 1, & 1 < t < 3 \\ 0, & \text{diğer} \end{cases}$$
(b) Aşağıdaki integrali hesaplayınız.
$$\int_{-\infty}^{\infty} t^2\big[u(t) - u(t-3)\big]\,dt$$
(c) Aşağıdaki $y(t)$’yi bulunuz.
$$y(t) = \int_{-\infty}^{t}\big[u(\tau+1) - u(\tau-1)\big]\,d\tau$$
(d) Aşağıdaki sinyalin enerjisini bulunuz.
$$x(t) = 4e^{-3t}u(t-1)$$`,
        hint: T`(c)’de kırılma noktaları $\tau = -1$ ve $\tau = 1$: üç durum var. (d)’de karede üs $-6t$ olur, sınır 1’den başlar.`,
        steps: [T`(a)
$$E = \int_{-1}^{1}2^2\,dt + \int_1^3 1^2\,dt = 8 + 2 = 10$$`,
          T`(b) Basamaklar sınırları $0$ ile $3$ yapar:
$$\int_0^3 t^2\,dt = \frac{27}{3} = 9$$`,
          T`(c) Darbe $-1 < \tau < 1$ aralığında 1:
$$y(t) = \begin{cases} 0, & t < -1 \\ \int_{-1}^{t}d\tau = t + 1, & -1 < t < 1 \\ \int_{-1}^{1}d\tau = 2, & t > 1 \end{cases}$$`,
          T`(d) $|x|^2 = 16e^{-6t}$, $t > 1$:
$$E = \int_1^\infty 16e^{-6t}\,dt = 16\cdot\frac{e^{-6}}{6} = \frac{8}{3}e^{-6}$$`],
        ans: T`(a) $10$<br>(b) $9$<br>(c) $0$, $t + 1$, $2$; yani $y(t) = r(t+1) - r(t-1)$<br>(d) $\frac{8}{3}e^{-6} \approx 0.0066$` },
      { t: 'quiz', items: [
        { q: T`$\int_{-\infty}^{\infty} f(t)\,u(t-3)\,dt$ neye eşittir?`, opts: ['$\\int_{-\\infty}^{3} f\\,dt$', '$\\int_{3}^{\\infty} f\\,dt$', '$f(3)$'], a: 1, why: T`$u(t-3)$ yalnızca $t>3$’te 1: alt sınır 3 olur. $f(3)$ cevabı $\delta(t-3)$ için doğru olurdu.` },
        { q: T`$\int_{-\infty}^{t} u(\tau)\,d\tau$ nedir?`, opts: ['$\\delta(t)$', '$u(t)$', '$t\\,u(t) = r(t)$'], a: 2, why: T`$$\int_{-\infty}^{t}u(\tau)\,d\tau = \begin{cases} 0, & t < 0 \\ \int_0^t 1\,d\tau = t, & t > 0 \end{cases}$$
Basamağın integrali rampadır.` },
        { q: T`$\int_{-\infty}^{\infty} e^{-t}u(t)\,\delta(t+2)\,dt$ kaçtır?`, opts: ['$e^{2}$', '$0$', '$e^{-2}$'], a: 1, why: T`$\delta$, $t=-2$’de. Orada $u(-2) = 0$, sonuç 0. $e^{2}$ diyen, $u$’yu unutmuştur.` },
        { q: T`$\Pi(t/4)$ sinyalinin enerjisi nedir?`, opts: ['$4$', '$16$', '$2$'], a: 0, why: T`$|x|^2 = 1$, genişlik 4: $\int_{-2}^{2}1\,dt = 4$.` }] }
    ]
  });
})();
