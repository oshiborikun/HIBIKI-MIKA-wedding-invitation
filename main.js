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

/* hibiki jump */
const hibiki = document.querySelector('.site-img__hibiki');
const heart = document.querySelector('.site-img__heart');
const block = document.querySelector('.site-img__block');

const normalSrc = './assets/img/hibiki_dot.png';
const jumpSrc = './assets/img/hibiki_jump.png';
const mBlockSrc = './assets/img/m_block.png';
const sukaBlockSrc = './assets/img/suka_block.png';

[normalSrc, jumpSrc, mBlockSrc, sukaBlockSrc].forEach(src => {
  const img = new Image();
  img.src = src;
});

function leafHotJump() {
  hibiki.src = jumpSrc;
  hibiki.style.width = '96px';
  hibiki.style.marginRight = '-6px';
  hibiki.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
  hibiki.style.transform = 'translateY(-35px)';

  block.src = sukaBlockSrc;
  block.style.transition = 'transform 0.3s ease-out';
  block.style.transform = 'translateY(-18px)';

  heart.classList.remove('is-spinning');
  void heart.offsetWidth; // 
  heart.style.opacity = '1';
  heart.style.transition = 'bottom 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
  heart.style.bottom = '60px';
  heart.classList.add('is-spinning');

  setTimeout(() => {
    hibiki.style.transition = 'transform 0.4s cubic-bezier(0.64, 0, 0.78, 0)';
    hibiki.style.transform = 'translateY(0)';

    block.style.transition = 'transform 0.4s ease-in';
    block.style.transform = 'translateY(0)';

    heart.style.transition = 'bottom 0.8s ease-out, opacity 0.5s ease-out 0.3s';
    heart.style.bottom = '90px';
    heart.style.opacity = '0';
  }, 400);

  setTimeout(() => {
    hibiki.src = normalSrc;
    hibiki.style.width = '90px';
    hibiki.style.marginRight = '0';
    block.src = mBlockSrc;
  }, 850);

  setTimeout(() => {
    heart.style.transition = 'none';
    heart.style.bottom = '10px';
    heart.classList.remove('is-spinning');
  }, 1700);
}

leafHotJump();
setInterval(leafHotJump, 4500);


/* gsap */
gsap.registerPlugin(ScrollTrigger);

/* text animation */
const paragraphs = document.querySelectorAll(".message-text p");
const textTl = gsap.timeline({
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

  textTl.to(chars, {
    visibility: "visible",
    duration: 0,
    stagger: 0.06
  });
});


/* power on */
const slides = document.querySelectorAll(".flame-gba__slide");

slides.forEach((slide) => {
  const slideTl = gsap.timeline({
    scrollTrigger: {
      trigger: slide,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  slideTl.to(slide, {
    scaleX: 1,
    duration: 0.2,
    ease: "power4.out"
  })