/* GSAPの登録 */
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  /* loading */
  const loader = document.querySelector('.loader-container');
  const loadingImg = document.querySelector('.site-img__loading');
  const loadingText = document.querySelector('.loading-text');
  const startTime = Date.now();

  // 初期状態のセット
  gsap.set([loadingImg, loadingText], { opacity: 0 });

  //now loading...
  gsap.to(loadingImg, { opacity: 1, duration: 0.1, delay: 0.1 });

  const dotsSpan = document.querySelector('.loading-text span');
  const dots = ['', '.', '..', '...'];
  let dotObj = { index: 0 };
  
  // loading text fadein
  gsap.to(loadingText, { opacity: 1, duration: 0.5, delay: 1.0 });

  const dotAnim = gsap.to(dotObj, {
    index: 3,
    duration: 1.2,
    repeat: -1,
    ease: "steps(3)",
    onUpdate: () => {
      dotsSpan.textContent = dots[Math.round(dotObj.index)];
    }
  });

  //img fadein
  //loader fadein-out
  const hideLoader = () => {
    if (loader.style.display === 'none') return;
    dotAnim.kill();
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        loader.style.display = 'none';
      }
    });
  };

  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, 3000 - elapsedTime) / 1000;

  gsap.delayedCall(5, hideLoader);
  gsap.delayedCall(remainingTime, hideLoader);


  /* hibiki jump */
  const hibiki = document.querySelector('.site-img__hibiki');
  const heart = document.querySelector('.site-img__heart');
  const block = document.querySelector('.site-img__block');

  const normalSrc = './assets/img/hibiki_dot.png';
  const jumpSrc = './assets/img/hibiki_jump.png';
  const mBlockSrc = './assets/img/m_block.png';
  const sukaBlockSrc = './assets/img/suka_block.png';

  // 重要：CSSのtransitionをJS側で完全に無効化する
  gsap.set([hibiki, heart, block], { 
    transition: "none", 
    transformOrigin: "bottom center",
    force3D: true 
  });

  [jumpSrc, sukaBlockSrc].forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // タイムライン管理（repeatDelayで3秒周期を維持）
  const jumpTl = gsap.timeline({ repeat: -1, repeatDelay: 2.3 });

  function leafHotJump() {
    jumpTl
      // 開始：画像切り替え
      .set(hibiki, { attr: { src: jumpSrc }, scaleX: 1.06, x: -3 })
      .set(block, { attr: { src: sukaBlockSrc } })
      .set(heart, { opacity: 1, bottom: '10px' })
      .add(() => {
        heart.classList.remove('is-spinning');
        void heart.offsetWidth;
        heart.classList.add('is-spinning');
      })
      // 上昇
      .to(hibiki, { y: -35, duration: 0.12, ease: "power2.out" })
      .to(block, { y: -18, duration: 0.1, ease: "power2.out" }, "<")
      .to(heart, { bottom: "60px", duration: 0.15, ease: "power2.out" }, "<")
      // 落下
      .to(hibiki, { y: 0, duration: 0.18, ease: "power2.in" })
      .to(block, { y: 0, duration: 0.18, ease: "power2.in" }, "<")
      .to(heart, { bottom: "90px", duration: 0.4, ease: "power1.out" }, "<")
      // 着地リセット
      .set(hibiki, { attr: { src: normalSrc }, scaleX: 1, x: 0 })
      .to(heart, { opacity: 0, duration: 0.2, delay: 0.5 })
      .set(block, { attr: { src: mBlockSrc } })
      .set(heart, { bottom: '10px' })
      .add(() => heart.classList.remove('is-spinning'));
  }

  leafHotJump();


  /* gsap */
  /* text animation */
  const paragraphs = document.querySelectorAll(".message-text p");
  paragraphs.forEach((p) => {
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
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });


  /* power on */
  const slides = document.querySelectorAll(".flame-gba__slide");
  slides.forEach((slide) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: slide,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    })
    .fromTo(slide, { scaleX: 0, scaleY: 0.01 }, { scaleX: 1, duration: 0.2, ease: "power4.out" })
    .to(slide, { scaleY: 1, duration: 0.2, ease: "power4.out" })
    .to(slide, { backgroundColor: "transparent", duration: 0.1 });
  });


  /* text animation2 */
  const rouletteChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  document.querySelectorAll(".event-wrap__content").forEach((el) => {
    const targetText = el.innerText;
    gsap.set(el, { visibility: "hidden" });
    let obj = { value: 0 };
    gsap.to(obj, {
      value: targetText.length,
      duration: 0.8,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 85%", 
        toggleActions: "play none none none",
        onEnter: () => gsap.set(el, { visibility: "visible" })
      },
      onUpdate: () => {
        let result = "";
        const progress = Math.floor(obj.value);
        for (let i = 0; i < targetText.length; i++) {
          result += (i < progress) ? targetText[i] : rouletteChars.charAt(Math.floor(Math.random() * rouletteChars.length));
        }
        el.innerText = result;
      },
      onComplete: () => { el.innerText = targetText; }
    });
  });


  /* parallax */
  const parallaxItems = [
    { selector: ".js-parallax01", y: -30, rotate: 45},
    { selector: ".js-parallax02", y: -70, rotate: -45}
  ];

  parallaxItems.forEach((item) => {
    document.querySelectorAll(item.selector).forEach((el) => {
      gsap.fromTo(el, { yPercent: 0, rotation: 0 }, { 
        yPercent: item.y, 
        rotation: item.rotate,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom", 
          end: "bottom top",   
          scrub: 2
        }
      });
    });
  });
});
