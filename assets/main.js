/* GSAPの登録 */
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  /* loading */
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

  function leafHotJump() {
    if (document.hidden) return;

    // --- ここから修正 ---

    // 1. まずトランジションを「なし」にして、地面（y:0）にいる状態をブラウザに確定させる
    hibiki.style.transition = 'none';
    block.style.transition = 'none';
    heart.style.transition = 'none';
    hibiki.style.transform = 'translateY(0)';
    block.style.transform = 'translateY(0)';
    
    // 強制再描画（これを入れないと、次のトランジション有効化とまとめて処理されてしまう）
    void hibiki.offsetWidth; 

    // 2. ブラウザが描画を更新する次のタイミング（数ミリ秒後）にジャンプ命令を出す
    // requestAnimationFrameを使うことで、爆速バグを防ぎつつ滑らかに動かせる
    requestAnimationFrame(() => {
      if (document.hidden) return; // 念のため再チェック

      // 画像切り替えと、ジャンプのための余白調整
      hibiki.src = jumpSrc;
      hibiki.style.width = '96px';
      hibiki.style.marginRight = '-6px';

      // 上昇アニメーションの適用（y:-60pxに設定）
      hibiki.style.setProperty('transform', 'translateY(-60px)', 'important');
      hibiki.style.transition = 'transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)';

      // ブロックも連動して上げる
      block.src = sukaBlockSrc;
      block.style.setProperty('transform', 'translateY(-20px)', 'important');
      block.style.transition = 'transform 0.08s ease-out';

      // ハートの上昇
      heart.classList.remove('is-spinning');
      void heart.offsetWidth;
      heart.classList.add('is-spinning');
      heart.style.opacity = '1';
      heart.style.bottom = '80px';
      heart.style.transition = 'bottom 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)';
    });

    // --- ここまで修正 ---

    // 3. 落下処理（setTimeoutのタイミング等は元のまま）
    setTimeout(() => {
      hibiki.style.setProperty('transform', 'translateY(0)', 'important');
      hibiki.style.transition = 'transform 0.15s cubic-bezier(0.8, 0, 1, 1)';

      block.style.setProperty('transform', 'translateY(0)', 'important');
      block.style.transition = 'transform 0.15s ease-in';

      // ハートは着地後、さらに上に消えていく動き
      heart.style.bottom = '110px';
      heart.style.transition = 'bottom 0.35s ease-out';
    }, 110);

    // 4. 着地後のソースリセット
    setTimeout(() => {
      hibiki.src = normalSrc;
      hibiki.style.width = '90px';
      hibiki.style.marginRight = '0';
    }, 260);

    // 5. ハート消去とブロック戻し
    setTimeout(() => {
      heart.style.opacity = '0';
      heart.style.transition = 'opacity 0.2s ease-out';
      block.src = mBlockSrc;
    }, 1000);

    setTimeout(() => {
      heart.style.transition = 'none';
      heart.style.bottom = '10px';
      heart.classList.remove('is-spinning');
    }, 1250);
  }

  leafHotJump();
  setInterval(() => {
    if (!document.hidden) leafHotJump();
  }, 3000);


  /* gsap */
  // （ GSAP部分、Text Animation、PowerOn、ルーレット、パララックスは元のままのため割愛 ）
  // ... (GSAP registration, Text animation tl, PowerOn slides.forEach, Text animation2 event-wrap__content.forEach, Parallax parallaxItems.forEach)
});
