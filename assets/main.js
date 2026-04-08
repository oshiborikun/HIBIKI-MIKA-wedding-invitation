/* GSAPの登録 */
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  
  // --- 1. Loader Animation ---
  const loader = document.querySelector('.loader-container');
  const loadingImg = document.querySelector('.site-img__loading');
  const loadingText = document.querySelector('.loading-text');
  const dotsSpan = document.querySelector('.loading-text span');
  const startTime = Date.now();

  const loadTl = gsap.timeline();
  loadTl.to(loadingImg, { opacity: 1, duration: 0.5, delay: 0.1 })
        .to(loadingText, { opacity: 1, duration: 0.5 }, "-=0.2");

  const dots = ['', '.', '..', '...'];
  let dotObj = { i: 0 };
  const dotAnim = gsap.to(dotObj, {
    i: 3, duration: 1.5, repeat: -1, ease: "steps(3)",
    onUpdate: () => { dotsSpan.textContent = dots[Math.round(dotObj.i)]; }
  });

  const hideLoader = () => {
    if (loader.style.display === 'none') return;
    dotAnim.kill();
    gsap.to(loader, {
      opacity: 0, duration: 0.8, ease: "power2.out",
      onComplete: () => { loader.style.display = 'none'; }
    });
  };

  const remaining = Math.max(0, 3000 - (Date.now() - startTime));
  gsap.delayedCall(remaining / 1000, hideLoader);
  gsap.delayedCall(5, hideLoader); // 最大5秒で強制非表示


  // --- 2. Hibiki Jump (GSAP Timeline Loop) ---
  const hibiki = document.querySelector('.site-img__hibiki');
  const heart = document.querySelector('.site-img__heart');
  const block = document.querySelector('.site-img__block');

  const normalSrc = './assets/img/hibiki_dot.png';
  const jumpSrc = './assets/img/hibiki_jump.png';
  const mBlockSrc = './assets/img/m_block.png';
  const sukaBlockSrc = './assets/img/suka_block.png';

  // タイムライン定義：絶対にズレない無限ループ
  const jumpTl = gsap.timeline({ 
    repeat: -1, 
    repeatDelay: 2.5,
    defaults: { ease: "power2.out" } 
  });

  jumpTl
    // [上昇開始] 画像切り替えと同時に跳ねる
    .set(hibiki, { attr: { src: jumpSrc }, width: '96px', marginRight: '-6px' })
    .set(block, { attr: { src: sukaBlockSrc } })
    .set(heart, { opacity: 1 })
    .add(() => {
      heart.classList.remove('is-spinning');
      void heart.offsetWidth;
      heart.classList.add('is-spinning');
    })
    // 物理的な移動（yのマイナス値を大きくして高さを出す）
    .to(hibiki, { y: -65, duration: 0.15 }, 0)
    .to(block, { y: -25, duration: 0.1 }, 0)
    .to(heart, { y: -80, duration: 0.2 }, 0)

    // [落下] 
    .to(hibiki, { y: 0, duration: 0.18, ease: "power2.in" }, "+=0.02")
    .to(block, { y: 0, duration: 0.18, ease: "power2.in" }, "<")
    .to(heart, { y: -130, duration: 0.45 }, "<") // ハートはそのまま空へ

    // [着地後]
    .set(hibiki, { attr: { src: normalSrc }, width: '90px', marginRight: '0' })
    .to(heart, { opacity: 0, duration: 0.2 }, "+=0.3")
    .set(block, { attr: { src: mBlockSrc } })
    .set(heart, { y: 0 }); // 次のループ用に座標リセット


  // --- 3. Text Animation (ScrollTrigger) ---
  document.querySelectorAll(".message-text p").forEach((p) => {
    const text = p.innerHTML;
    p.innerHTML = "";
    const nodes = Array.from(new DOMParser().parseFromString(text, 'text/html').body.childNodes);
    nodes.forEach(node => {
      if (node.nodeType === 3) {
        node.textContent.split("").forEach(char => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.display = "inline-block";
          span.style.visibility = "hidden";
          p.appendChild(span);
        });
      } else {
        p.appendChild(node.cloneNode(true));
      }
    });

    gsap.to(p.querySelectorAll("span"), {
      visibility: "visible",
      duration: 0,
      stagger: 0.06,
      scrollTrigger: {
        trigger: p,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });


  // --- 4. GBA Power On Animation ---
  document.querySelectorAll(".flame-gba__slide").forEach((slide) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: slide,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    })
    .fromTo(slide, { scaleX: 0, scaleY: 0.01 }, { scaleX: 1, duration: 0.3, ease: "power4.out" })
    .to(slide, { scaleY: 1, duration: 0.3, ease: "power4.out" })
    .to(slide, { backgroundColor: "transparent", duration: 0.1 });
  });


  // --- 5. Roulette Text Animation ---
  const rouletteChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  document.querySelectorAll(".event-wrap__content").forEach((el) => {
    const targetText = el.innerText;
    gsap.set(el, { visibility: "hidden" });
    let obj = { val: 0 };
    gsap.to(obj, {
      val: targetText.length,
      duration: 1.0,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
        onEnter: () => gsap.set(el, { visibility: "visible" })
      },
      onUpdate: () => {
        let res = "";
        const prog = Math.floor(obj.val);
        for (let i = 0; i < targetText.length; i++) {
          res += (i < prog) ? targetText[i] : rouletteChars.charAt(Math.floor(Math.random() * rouletteChars.length));
        }
        el.innerText = res;
      },
      onComplete: () => { el.innerText = targetText; }
    });
  });


  // --- 6. Parallax Animation ---
  const parallaxItems = [
    { sel: ".js-parallax01", y: -40, r: 45},
    { sel: ".js-parallax02", y: -80, r: -45}
  ];

  parallaxItems.forEach((item) => {
    document.querySelectorAll(item.sel).forEach((el) => {
      gsap.fromTo(el, { y: 0, rotation: 0 }, { 
        y: item.y, rotation: item.r, ease: "none",
        scrollTrigger: {
          trigger: el, start: "top bottom", end: "bottom top", scrub: 1.5
        }
      });
    });
  });
});
