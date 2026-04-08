/* GSAPの登録 */
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  /* loading */
  const loader = document.querySelector('.loader-container');
  const loadingImg = document.querySelector('.site-img__loading');
  const loadingText = document.querySelector('.loading-text');
  const startTime = Date.now();

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
  const remainingTime = Math.max(0, 3000 - elapsedTime) / 1000; // 秒換算

  // タイムアウトと完了を管理
  gsap.delayedCall(5, hideLoader); // 強制非表示
  gsap.delayedCall(remainingTime, hideLoader);


  /* hibiki jump */
  const hibiki = document.querySelector('.site-img__hibiki');
  const heart = document.querySelector('.site-img__heart');
  const block = document.querySelector('.site-img__block');

  const normalSrc = './assets/img/hibiki_dot.png';
  const jumpSrc = './assets/img/hibiki_jump.png';
  const mBlockSrc = './assets/img/m_block.png';
  const sukaBlockSrc = './assets/img/suka_block.png';

  [jumpSrc, sukaBlockSrc].forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // GSAP Timelineで1セットの動きを定義
  const jumpTl = gsap.timeline({ repeat: -1, repeatDelay: 2.5 });

  function leafHotJump() {
    jumpTl
      .add(() => {
        hibiki.src = jumpSrc;
        hibiki.style.width = '96px';
        hibiki.style.marginRight = '-6px';
        block.src = sukaBlockSrc;
        heart.classList.remove('is-spinning');
        void heart.offsetWidth;
        heart.classList.add('is-spinning');
        heart.style.opacity = '1';
      })
      .to(hibiki, { y: -35, duration: 0.1, ease: "sine.out" })
      .to(block, { y: -18, duration: 0.08, ease: "power1.out" }, "<")
      .to(heart, { bottom: "60px", duration: 0.15, ease: "sine.out" }, "<")
      .to(hibiki, { y: 0, duration: 0.15, ease: "sine.in" }, "+=0.01")
      .to(block, { y: 0, duration: 0.15, ease: "power1.in" }, "<")
      .to(heart, { bottom: "90px", duration: 0.35, ease: "power1.out" }, "<")
      .add(() => {
        hibiki.src = normalSrc;
        hibiki.style.width = '90px';
        hibiki.style.marginRight = '0';
      }, "-=0.15")
      .to(heart, { opacity: 0, duration: 0.2 }, "+=0.5")
      .add(() => {
        block.src = mBlockSrc;
        heart.style.bottom = '10px';
        heart.classList.remove('is-spinning');
      });
  }

  leafHotJump();


  /* gsap */
  // (ScrollTriggerの登録は冒頭へ移動済み)

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

    const chars = p.querySelectorAll("span");

    gsap.to(chars, {
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
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: slide,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.to(slide, {
      scaleX: 1,
      duration: 0.2,
      ease: "power4.out"
    })
    .to(slide, {
      scaleY: 1,
      duration: 0.2,
      ease: "power4.out"
    })
    .to(slide, {
      backgroundColor: "transparent",
      duration: 0.1
    });
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
          if (i < progress) {
            result += targetText[i];
          } else {
            result += rouletteChars.charAt(Math.floor(Math.random() * rouletteChars.length));
          }
        }
        el.innerText = result;
      },
      onComplete: () => {
        el.innerText = targetText;
      }
    });
  });


  /* parallax */
  const parallaxItems = [
    { selector: ".js-parallax01", y: -30, rotate: 45},
    { selector: ".js-parallax02", y: -70, rotate: -45}
  ];

  parallaxItems.forEach((item) => {
    const elements = document.querySelectorAll(item.selector);

    elements.forEach((el) => {
      gsap.fromTo(el, 
        { yPercent: 0,
          rotation: 0
         }, 
        { 
          yPercent: item.y, 
          rotation: item.rotate,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom", 
            end: "bottom top",   
            scrub: 2
          }
        }
      );
    });
  });
});
