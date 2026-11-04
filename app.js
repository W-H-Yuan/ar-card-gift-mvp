(function () {
  const cfg = window.AR_CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const startScreen = $('#start-screen');
  const arStage = $('#ar-stage');
  const mindarContainer = $('#mindar-container');
  const pwScreen = $('#password-screen');
  const statusToast = $('#status-toast');
  const playBtn = $('#play-video-btn');
  const fullscreen = $('#fullscreen-video');
  const fullscreenVideo = $('#fullscreen-video-el');
  const cardName = $('#card-name');

  function toast(msg) {
    statusToast.textContent = msg;
    statusToast.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { statusToast.hidden = true; }, 2200);
  }

  function bindAREvents() {
    const target = document.querySelector('[mindar-image-target]');
    if (!target) return;
    target.addEventListener('targetFound', () => {
      toast('已识别卡片，AR 出现了');
      if (cfg.showVideo) playBtn.hidden = false;
    });
    target.addEventListener('targetLost', () => {
      playBtn.hidden = true;
      toast('未识别到卡片');
    });
  }

  function buildARScene() {
    const videoPlane = cfg.showVideo
      ? '<a-entity id="ar-video-plane" position="0 0.45 0.02" rotation="-90 0 0">' +
          '<a-plane width="0.9" height="0.5" material="src: %23blessing; transparent: true; opacity: .95; side: double"></a-plane>' +
        '</a-entity>'
      : '';
    const flower = cfg.show3D
      ? '<a-entity id="flower" position="0 0.28 0.06" animation="property: rotation; to: 0 360 360; loop: true; dur: 14000; easing: linear">' +
          '<a-box color="#e1523d" position="0 0 0" scale="0.08 0.016 0.016"></a-box>' +
          '<a-box color="#e1523d" position="0 0 0" rotation="0 0 60" scale="0.08 0.016 0.016"></a-box>' +
          '<a-sphere radius="0.016" color="#ffd56b" position="0 0 0"></a-sphere>' +
        '</a-entity>'
      : '';

    const targetSrc = cfg.targetSrc || 'assets/targets.mind';
    const videoSrc = cfg.videoSrc || 'assets/blessing.mp4';
    mindarContainer.innerHTML =
      '<a-scene mindar-image="imageTargetSrc: ' + targetSrc + '; maxTrack: 1" ' +
      'embedded vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">' +
      '  <a-assets>' +
      '    <img id="ticket" src="assets/ticket.png" />' +
      '    <video id="blessing" src="' + videoSrc + '" preload="auto" playsinline webkit-playsinline muted loop></video>' +
      '  </a-assets>' +
      '  <a-camera position="0 0 0" look-controls="enabled: false" wasd-controls="enabled: false"></a-camera>' +
      '  <a-entity mindar-image-target="targetIndex: 0">' +
      '    <a-plane src="#ticket" position="0 0 0.001" rotation="-90 0 0" width="1.2" height="0.72"></a-plane>' +
      videoPlane +
      flower +
      '    <a-text id="ar-text" value="' + (cfg.copy.bless || '生日快乐') + '" color="#1a1612" align="center" position="0 -0.16 0.02" width="1.1"></a-text>' +
      '  </a-entity>' +
      '</a-scene>';
  }

  function loadScript(src, done) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = done;
    s.onerror = () => toast('AR 脚本加载失败，请检查网络');
    document.head.appendChild(s);
  }

  function loadAR() {
    pwScreen.hidden = true;
    startScreen.hidden = true;
    arStage.hidden = false;
    buildARScene();
    loadScript('https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe-master.min.js', () => {
      loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js', () => {
        bindAREvents();
        toast(cfg.show3D ? '请对准备后的卡片，等待 AR 出现' : '请对准备后的卡片');
      });
    });
  }

  function startAR() {
    if (cfg.enablePassword && cfg.password) {
      pwScreen.hidden = false;
      startScreen.hidden = true;
      return;
    }
    openAR();
  }

  function openAR() {
    loadAR();
  }

  function showFullscreenVideo() {
    if (!cfg.showVideo) return;
    if (!fullscreenVideo.src) fullscreenVideo.src = cfg.videoSrc;
    fullscreen.hidden = false;
    fullscreenVideo.muted = false;
    fullscreenVideo.play().catch(() => toast('视频加载中，请稍后'));
  }

  $('#start-btn').addEventListener('click', startAR);
  $('#password-btn').addEventListener('click', () => {
    if ($('#password-input').value === cfg.password) openAR();
    else toast('口令不对');
  });
  $('#back-btn').addEventListener('click', () => {
    arStage.hidden = true;
    startScreen.hidden = false;
  });
  playBtn.addEventListener('click', showFullscreenVideo);
  $('#close-video').addEventListener('click', () => {
    fullscreen.hidden = true;
    fullscreenVideo.pause();
  });

  cardName.textContent = cfg.cardName || 'AR 卡片礼物';
  if (!cfg.show3D && !cfg.showVideo) {
    document.body.innerHTML = '<div class="panel"><h2>当前未开启任何 AR 内容</h2><p>请打开 config.js 配置 show3D / showVideo</p></div>';
  }
})();
