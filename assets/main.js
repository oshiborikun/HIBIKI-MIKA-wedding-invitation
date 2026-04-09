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

  const jumpTl = gsap.timeline({ 
    repeat: -1, 
    repeatDelay: 2.5 
  });

  jumpTl
    // [1. 上昇開始] 0.15sで頂点へ
    .set(hibiki, { attr: { src: jumpSrc }, width: '96px', marginRight: '-6px' })
    .to(hibiki, { y: -70, duration: 0.15, ease: "power2.out" })

    // [2. ブロック衝突] Hibikiが頂点に達した瞬間(0.15s)に発火
    .set(block, { attr: { src: sukaBlockSrc } }, 0.15)
    // ブロックが反動で上に20px動いて戻る
    .to(block, { y: -20, duration: 0.05, yoyo: true, repeat: 1, ease: "power2.out" }, 0.15)
    
    // [3. ハート射出] 衝突と同時に出現
    .set(heart, { y: 0, opacity: 1 }, 0.15) 
    .add(() => {
      heart.classList.remove('is-spinning');
      void heart.offsetWidth;
      heart.classList.add('is-spinning');
    }, 0.15)
    // ハートを大きく上に飛ばす
    .to(heart, { y: -150, duration: 0.5, ease: "power1.out" }, 0.15)

    // [4. 落下・着地]
    .to(hibiki, { y: 0, duration: 0.2, ease: "power2.in" }, "+=0.05") 
    .set(hibiki, { attr: { src: normalSrc }, width: '90px', marginRight: '0' })
    
    // [5. 後処理] ハートが消えてブロックが戻る
    .to(heart, { opacity: 0, duration: 0.1 }, "-=0.1")
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
