/* loading */
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader-container');
  const loadingImg = document.querySelector('.site-img__loading');
  const loadingText = document.querySelector('.loading-text');
  const startTime = Date.now();

  //now loading...
  setTimeout(() => {
    loadingImg.style.opacity = '1';
  }, 100);

  const dotsSpan = document.querySelector('.loading-text span');
  const dots = ['', '.', '..', '...'];
  let dotIndex = 0;
  
  // loading text fadein
  setTimeout(() => {
    loadingText.style.opacity = '1';
  }, 1000);

  const dotInterval = setInterval(() => {
    dotsSpan.textContent = dots[dotIndex];
    dotIndex = (dotIndex + 1) % dots.length;
  }, 400);

  //img fadein
  const hideLoader = () => {
    if (loader.style.display === 'none') return;
    clearInterval(dotInterval);
    loader.style.transition = 'opacity 0.8s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800);
  };

  //loader fadein-out
  const forceShowTimeout = setTimeout(() => {
    hideLoader();
  }, 5000);

  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, 3000 - elapsedTime);

  setTimeout(() => {
    clearTimeout(forceShowTimeout);
    hideLoader();
  }, remainingTime);
});

/* gsap */
gsap.registerPlugin(ScrollTrigger);

/* text animation */
const paragraphs = document.querySelectorAll(".message-text p");
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".message-text",
    start: "top 80%",
    toggleActions: "play none none none"
  }
});

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

  tl.to(chars, {
    visibility: "visible",
    duration: 0,
    stagger: 0.06
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

  el.innerText = targetText.replace(/./g, () => 
    rouletteChars.charAt(Math.floor(Math.random() * rouletteChars.length))
  );

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
