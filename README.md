# Sinyal Defteri

Sinyaller ve Sistemler dersini **sezgi, etkileşimli grafik ve adım adım çözümlerle** anlatan bir ders sitesi. Saf HTML, CSS ve JavaScript ile yazıldı; hiçbir dış kütüphane veya kurulum gerektirmez. Formüller de dahili küçük bir dizgi motoruyla çizilir.

**Canlı site:** https://efekocal.github.io/Sinyaller-ve-Sistemler-Calismasi/

## Neden var?

Dersin notları (Ömer Akgün, *Sinyaller ve Sistemler Ders Notları*) bir slayt özeti gibi: formüller ve örnekler var ama aradaki açıklamalar yok. Bu site her konuyu notun sırasıyla ele alır, eksik açıklamaları tamamlar ve notun **kendi örneklerini ve ödevlerini** adım adım çözer. Notta fark edilen hatalar ayrıca **“Notta düzeltme”** kutusuyla işaretlenir.

## Konular

| Bölüm | Not sayfaları | Dersler | Vize |
|---|---|---|---|
| 1 · Sinyaller | s. 2–53 | 1.1 Sinyal ve sistem · 1.2 Periyodik sinyaller · 1.3 Enerji ve güç · 1.4 Çift ve tek · 1.5 Temel sürekli sinyaller (u, δ, r, Π, Λ) · 1.6 Temel ayrık sinyaller · 1.7 Sinyal işlemleri | ✓ |
| 1 · Sistemler | s. 54–68 | 1.8 Lineerlik · 1.9 Nedensellik ve bellek · 1.10 Zamanla değişmezlik · 1.11 Kararlılık ve dört özellik analizi | ✓ |
| 2 · LTI Sistemler | s. 69–109 | 2.1 İmpuls cevabı ve konvolüsyon · 2.2 Grafik konvolüsyon · 2.3 Blok diyagramlar · 2.4 h’den sistem özellikleri · 2.5 Ayrık konvolüsyon · 2.6 Basamak cevabı · 2.7 Fark denklemleri | final |

Vize kapsamı Bölüm 1’dir; Bölüm 2 sitede “vize dışı” olarak işaretlidir.

## Her ders aynı döngüyü izler

1. **Sezgi:** Formülden önce fikir. Bu kavram neden var, gündelik hayatta neye benziyor?
2. **Tanım:** Notun kırmızı çerçeveli formülleri, sade bir dille.
3. **Laboratuvar:** Kaydırıcıyla sinyali değiştir, sonucu kendi gözünle gör.
4. **Çözümlü örnek:** Notun örnekleri adım adım açılır. Her adımdan önce kendin dene.
5. **Ödev:** Notun ödevleri ipucu ve çözümle.
6. **Kendini yokla:** Ders sonunda açıklamalı kısa sorular.

Her derste ayrıca bir **çözüm reçetesi** (o soru tipinin adım adım yöntemi) ve **dikkat** kutuları (sık yapılan hatalar) bulunur.

## Kalıcı öğrenme: Antrenman

Okumak tanıdık hissettirir ama kalıcı yapmaz. **Antrenman** sayfası üç öğrenme ilkesini birleştirir:

- **Geri çağırma:** Her soru rastgele üretilir (ezberlenemez); cevaptan sonra kısa bir gerekçe gösterilir.
- **Karıştırma:** Karışık tekrar modunda soru tipleri karışık gelir, “hangi yöntem?” kararı sınavdaki gibi her seferinde yeniden verilir.
- **Aralıklı tekrar:** Her beceri bir Leitner kutusunda tutulur. Art arda 3 doğru seviye atlatır, tek yanlış başa döndürür; beceri 1, 3, 7 gün sonra yeniden gelir. Kenar çubuğu ve ana sayfa bugün tekrar edilecek becerileri gösterir.

10 beceri: sürekli ve ayrık temel periyot, enerji/güç, çift/tek, δ’lı integral, x(ct+d) aralığı, lineerlik, nedensellik, ötelemeyle değişmezlik, kararlılık. **Sınav tipi karma soru** modu, hocanın tarzında tek soruda giriş sinyalinin temel periyodunu ve sistemin dört özelliğini birlikte sorar (sistem havuzu: nottaki 21 sistem + 24 ek sistem).

Soru üreteci (`js/trainer.js`) DOM’dan bağımsızdır. Her soru tipi Node.js ile sayısal olarak doğrulandı: verilen periyotta sinyalin gerçekten tekrar ettiği ve daha küçük periyot olmadığı, enerji/güç değerlerinin sayısal integrale uyduğu, aralıkların ve çift/tek sınıfının doğru olduğu (30.000 üretilmiş soru).

## Deneme vizeleri

Hocanın sınav formatında (3 ana soru, altında 1.1, 1.2… alt sorular) hazırlanmış 5 deneme vardır. İlk dördü, ders notunun da dayandığı H. Hsu, *Schaum’s Outline of Signals and Systems* (2. baskı) kitabının 1. bölümünden vize kapsamına girenler seçilerek Türkçeleştirildi ve adım adım çözüldü. **Deneme 5** karma sorulardan oluşur: her ana soruda bir giriş sinyali ve bir sistem verilir; temel periyot, lineerlik, ötelemeyle değişmezlik, nedensellik, kararlılık ve çıkışın periyodikliği birlikte sorulur. Her alt sorunun altında konunun anlatıldığı derse bağlantı bulunur.

**Vize hazırlık** sayfasında Bölüm 1’in bütün soru tiplerinin haritası, en çok puan kaybettiren hatalar ve notun tarzında yeni deneme soruları vardır. **Formül kağıdı** sınav öncesi tek sayfalık özettir.

## Laboratuvarlar

| Laboratuvar | Ne yapar? |
|---|---|
| Analog, ayrık ve sayısal sinyal | Örnekleme periyodu ve bit sayısıyla oynayarak ayrıklaşmayı gösterir |
| Periyot bulucu | Sinüs toplamının temel periyodunu oranlar ve EKOK ile adım adım hesaplar; ayrık sinüsün periyodunu bulur |
| Enerji mi, güç mü? | Pencere büyüdükçe enerjinin ve ortalama gücün nereye gittiğini çizer |
| Çift ve tek bileşen ayırıcı | x(t), x(−t), çift ve tek parçaları yan yana çizer |
| Temel sürekli sinyaller | δ’nın limit olarak doğuşu, elek özelliği, Π ve Λ, basamaklarla sinyal inşası ve türevi, döner fazör |
| Ayrık diziler | Grafiğe tıklayarak dizi çizilir, ifadesi δ[n−k] toplamı olarak yazılır |
| Dönüşüm tezgâhı | A·x(at+b)+B’yi adım adım uygular; kritik noktaların nereye taşındığını gösterir; ayrıkta tablo yöntemi |
| Sistem test tezgâhı | Nottaki 23 sistemi lineerlik, zamanla değişmezlik, nedensellik ve kararlılık için sayısal olarak sınar |
| Konvolüsyon araçları (Bölüm 2) | İmpulslara ayırma, grafik konvolüsyon, ayrık konvolüsyon (tablo yöntemi), blok diyagramlar, h’den özellikler, basamak cevabı, fark denklemi çözücü |

## Kullanım

- **Online:** Yukarıdaki canlı site bağlantısını aç.
- **Yerelde:** Depoyu indir ve `index.html` dosyasına çift tıkla. Sunucu gerekmez.

```bash
git clone https://github.com/EFEKOCAL/Sinyaller-ve-Sistemler-Calismasi.git
cd Sinyaller-ve-Sistemler-Calismasi
start index.html        # Windows  (macOS: open index.html)
```

İlerleme (tamamlanan dersler, soru cevapları) yalnızca kendi tarayıcında saklanır.

### Kısayollar

| Tuş | İşlev |
|---|---|
| `←` `→` | Ders sayfasında önceki / sonraki ders |

### Renk dili

Bütün grafiklerde aynı: **mavi** giriş x(t), **turuncu** impuls cevabı veya ikinci sinyal, **yeşil** çıkış veya sonuç, **kırmızı** uyarı.

## Notta düzeltilen yerler

| Sayfa | Notta yazan | Doğrusu |
|---|---|---|
| s. 59 | y[n] = x[n/2] nedensel örneği | n < 0 için geleceğe bakar, nedensel değildir (büyük olasılıkla x[n−2] kastedilmiş) |
| s. 73, 86 | u(τ)u(t−τ) = 1, 0 < t < τ | 0 < τ < t |
| s. 75 | h(t) = 1, 0 < t < 2 | h(t) = 2 (şekil ve hesap 2 kullanıyor) |
| s. 94 | “n = 0…5, y = 1” | y = {0, 1, 2, 3, 2, 1}, n = 0…5 |
| s. 96 | Σ(a/b)ᵏ = (1 − (a/b)ⁿ⁻¹)/(1 − a/b) | üs n+1 olmalı |
| s. 100 | h[n] = n·u[n] için “belleksiz” | bellekli (h[n] ≠ 0, n ≥ 1) |

## Dosya yapısı

```
index.html                  uygulama kabuğu (kenar çubuğu, ana alan)
style.css                   açık/koyu tema "mühendislik defteri" arayüzü
js/
  core/math.js              küçük TeX alt kümesi → HTML (\frac, \int, \sum, cases, renkler…)
  core/sig.js               temel sinyaller, sayısal konvolüsyon, integral, kesir bulma (DOM'dan bağımsız)
  core/plot.js              canvas çizim: sürekli eğri, stem, impuls oku, taralı alan
  core/ui.js                kaydırıcı, seçim, sekme, oynat düğmesi, okuma kutuları
  labs/lab-signals.js       örnekleme, periyot bulucu, enerji/güç, çift/tek
  labs/lab-basics.js        temel sürekli ve ayrık sinyaller
  labs/lab-transform.js     A·x(at+b)+B dönüşüm tezgâhı
  labs/lab-systems.js       sistem test tezgâhı (nottaki tüm sistemler ve cevapları)
  labs/lab-conv.js          impulslara ayırma, grafik ve ayrık konvolüsyon
  labs/lab-lti.js           blok diyagram, h'den özellikler, basamak cevabı
  labs/lab-diffeq.js        fark denklemi çözücü
  content/ch1-signals-a.js  dersler 1.1–1.4
  content/ch1-signals-b.js  dersler 1.5–1.7
  content/ch1-systems.js    dersler 1.8–1.11
  content/ch2-lti-a.js      dersler 2.1–2.4
  content/ch2-lti-b.js      dersler 2.5–2.7
  content/formulas.js       formül kağıdı
  content/vize.js           vize hazırlık: soru tipleri haritası ve deneme soruları
  content/deneme.js         deneme vizeleri (Schaum Bölüm 1 problemleri + karma sorular, Türkçe ve çözümlü)
  trainer.js                antrenman: rastgele soru üreteci, karma sorular, Leitner aralıklı tekrar (DOM'dan bağımsız)
  app.js                    yönlendirme, ders sayfası, ilerleme
```

Yeni bir ders eklemek için ilgili `content/` dosyasında `SS.lessons.push({...})` ile bir nesne eklemek yeterli. Blok türleri (`idea`, `def`, `example`, `hw`, `recipe`, `trap`, `erratum`, `lab`, `quiz`…) `app.js` içindeki `renderBlock` fonksiyonunda tanımlıdır. Metinlerde `$...$` satır içi, `$$...$$` blok formül yazar.
