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
  block.src = sukaBlockSrc;

  heart.classList.remove('is-spinning');
  void heart.
