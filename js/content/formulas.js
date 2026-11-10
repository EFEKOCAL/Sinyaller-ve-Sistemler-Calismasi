/*
 * Formül kağıdı: sınav öncesi tek sayfalık özet. Her kart ilgili derse bağlanır.
 */
(function () {
  'use strict';
  const SS = window.SS;
  const T = String.raw;
  SS.formulas = [
    { title: 'Periyodiklik', lesson: '1.2', items: [
      T`$$x(t) = x(t+T), \qquad T = \frac{2\pi}{\omega}$$`,
      T`Toplam: $\frac{T_1}{T_2} = \frac{k}{m}$ rasyonel ise periyodik, $T_0 = mT_1 = kT_2$. Kısa yol: $\omega_0 = \text{EBOB}(\omega_i)$.`,
      T`Ayrık: $\cos(\Omega n)$ periyodik $\iff \frac{\Omega}{2\pi} = \frac{m}{N}$ rasyonel. $N_0$ = en sade paydası.`] },
    { title: 'Enerji ve güç', lesson: '1.3', items: [
      T`$$E = \int_{-\infty}^{\infty}|x(t)|^2dt \qquad E = \sum_{n}|x[n]|^2$$`,
      T`$$P = \lim_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2}|x|^2dt \qquad P = \lim_{N\to\infty}\frac{1}{2N+1}\sum_{-N}^{N}|x[n]|^2$$`,
      T`$0<E<\infty$ → enerji ($P=0$). $0<P<\infty$ → güç ($E=\infty$). Sinüs: $P = A^2/2$. $|e^{j\theta}| = 1$.`] },
    { title: 'Geometrik seriler', lesson: '1.3', items: [
      T`$$\sum_{n=0}^{N-1}\alpha^n = \frac{1-\alpha^N}{1-\alpha} \qquad \sum_{n=0}^{\infty}\alpha^n = \frac{1}{1-\alpha} \qquad \sum_{n=k}^{\infty}\alpha^n = \frac{\alpha^k}{1-\alpha}$$`,
      T`$$\sum_{n=0}^{\infty}n\alpha^n = \frac{\alpha}{(1-\alpha)^2} \qquad \sum_{n=0}^{\infty}n^2\alpha^n = \frac{\alpha^2+\alpha}{(1-\alpha)^3} \quad (|\alpha|<1)$$`] },
    { title: 'Çift ve tek', lesson: '1.4', items: [
      T`$$x_e = \frac{x(t)+x(-t)}{2} \qquad x_o = \frac{x(t)-x(-t)}{2}$$`,
      T`çift·çift = çift, tek·tek = çift, çift·tek = tek. Tek sinyalde $x(0) = 0$.`] },
    { title: 'Temel sinyaller', lesson: '1.5', items: [
      T`$$\int\phi(t)\,\delta(t-a)\,dt = \phi(a) \qquad \delta(at) = \frac{\delta(t)}{|a|} \qquad x(t)\delta(t-\tau) = x(\tau)\delta(t-\tau)$$`,
      T`$$\delta = \frac{du}{dt}, \quad u = \frac{dr}{dt}, \quad \Pi\!\left(\frac{t}{\tau}\right) = u\!\left(t+\frac{\tau}{2}\right) - u\!\left(t-\frac{\tau}{2}\right)$$`,
      T`$\Pi(t/\tau)$: genişlik $\tau$. $\;\Lambda(t/\tau)$: taban $2\tau$, tepe 1.`] },
    { title: 'Ayrık temel diziler', lesson: '1.6', items: [
      T`$$\delta[n] = u[n]-u[n-1] \qquad u[n] = \sum_{k=-\infty}^{n}\delta[k] \qquad x[n] = \sum_k x[k]\delta[n-k]$$`] },
    { title: 'Sinyal işlemleri', lesson: '1.7', items: [
      T`$x(t-t_0)$: $t_0>0$ sağa. $\;x(at)$: $|a|>1$ sıkıştır. $\;x(-t)$: ayna.`,
      T`$$x(at+b) = x\!\left(a\left(t+\frac{b}{a}\right)\right), \qquad t_k \;\to\; \frac{t_k - b}{a}$$`,
      T`Sıra: önce öteleme ($b$), sonra ölçekleme ($a$), en son genlik ($A\cdot{}+B$).`] },
    { title: 'Sistem özellikleri', lesson: '1.11', items: [
      T`<strong>Lineer:</strong> $T\{k_1x_1+k_2x_2\} = k_1y_1+k_2y_2$. Sıfır giriş → sıfır çıkış.`,
      T`<strong>Zamanla değişmez:</strong> $T\{x(t-\tau)\} = y(t-\tau)$. Açık $t$ veya $x(at)$ bu özelliği bozar.`,
      T`<strong>Nedensel:</strong> çıkış yalnızca $\tau \le t$ girişlerine bağlı. <strong>Belleksiz:</strong> yalnızca $x(t)$’ye bağlı.`,
      T`<strong>Kararlı (BIBO):</strong> $|x|\le k_1 \Rightarrow |y|\le k_2$. Kararsızlık için tek karşı örnek yeter.`] },
    { title: 'Konvolüsyon', lesson: '2.1', items: [
      T`$$y(t) = \int_{-\infty}^{\infty}x(\tau)h(t-\tau)\,d\tau \qquad y[n] = \sum_{k=-\infty}^{\infty}x[k]h[n-k]$$`,
      T`$x*\delta = x$, $\;x*\delta(t-t_0) = x(t-t_0)$, $\;x*u = \int_{-\infty}^{t}x$, $\;x_1(t-t_1)*x_2(t-t_2) = y(t-t_1-t_2)$`,
      T`Destek: $[a,b]*[c,d] \to [a+c,\, b+d]$. Ayrık uzunluk: $L_x + L_h - 1$.`] },
    { title: 'Hazır konvolüsyonlar', lesson: '2.2', items: [
      T`$$e^{-at}u(t)*u(t) = \frac{1}{a}(1-e^{-at})u(t) \qquad u(t)*u(t) = t\,u(t)$$`,
      T`$$e^{-at}u*e^{-bt}u = \frac{e^{-at}-e^{-bt}}{b-a}u(t) \qquad \Pi*\Pi = \text{üçgen}$$`,
      T`$$u[n]*u[n] = (n+1)u[n] \qquad a^nu[n]*u[n] = \frac{1-a^{n+1}}{1-a}u[n]$$`,
      T`$$a^nu[n]*b^nu[n] = \frac{a^{n+1}-b^{n+1}}{a-b}u[n]$$`] },
    { title: 'Blok diyagramlar', lesson: '2.3', items: [
      T`Seri: $h = h_1 * h_2$ (sıra önemsiz). $\;$ Paralel: $h = h_1 + h_2$.`] },
    { title: 'LTI özellikleri (h’den)', lesson: '2.4', items: [
      T`Belleksiz: $h = K\delta$. $\;$ Nedensel: $h(t) = 0$, $t<0$.`,
      T`$$\text{Kararlı:}\quad \int_{-\infty}^{\infty}|h(\tau)|\,d\tau<\infty \qquad \sum_k|h[k]|<\infty$$`] },
    { title: 'Basamak cevabı', lesson: '2.6', items: [
      T`$$s[n] = \sum_{k=-\infty}^{n}h[k], \quad h[n] = s[n]-s[n-1] \qquad s(t) = \int_{-\infty}^{t}h, \quad h = \frac{ds}{dt}$$`] },
    { title: 'Fark denklemleri', lesson: '2.7', items: [
      T`$$\sum_{k=0}^{N}a_ky[n-k] = \sum_{k=0}^{M}b_kx[n-k]$$`,
      T`$y[n]-ay[n-1] = Kb^nu[n]$, $y[-1] = y_{-1}$:`,
      T`$$y[n] = y_{-1}a^{n+1} + K\frac{b^{n+1}-a^{n+1}}{b-a}$$`,
      T`$y[n]-ay[n-1] = x[n]$: $\;h[n] = a^nu[n]$, $\;s[n] = \frac{1-a^{n+1}}{1-a}u[n]$`] }
  ];
})();
