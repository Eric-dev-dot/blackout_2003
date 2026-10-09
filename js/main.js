// 入口：加载两个 JSON → 构建 deck → 接线控制条/?autoplay=1。
// 音频已移除（旁白与 BGM 由作者后期自行录制合成）：自动播放按每页 fallbackDuration 计时翻页。
import { createDeck } from './deck.js?v=8';

const q = (s) => document.querySelector(s);

async function loadJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

async function boot() {
  const viewport = q('#slide-vp');
  const tipEl = q('#line-tip');
  let slidesData, eventsData;
  try {
    [slidesData, eventsData] = await Promise.all([
      loadJson('data/slides.json?v=9'),
      loadJson('data/M1_events.json?v=8'),
    ]);
  } catch (err) {
    const panel = q('#load-error');
    panel.hidden = false;
    panel.textContent = `无法加载页面数据：${err.message}。请在项目根目录运行 python -m http.server 8765 后访问 /blackout_slides/index.html（直接双击 HTML 会因浏览器安全策略失败）。`;
    q('#gate').classList.add('hidden');
    return;
  }

  const deck = createDeck({ slidesData, eventsData, viewport, tipEl });
  deck.build();
  deck.updateProgress();

  const btnPlay = q('#ctl-play');
  function setPlayLabel() {
    btnPlay.textContent = deck.autoplay ? '❚❚ 暂停' : '▶ 播放';
  }

  /* ---------- 自动播放计时（无音频：每页停留 slides.json 的 fallbackDuration） ---------- */
  let session = 0;
  let timer = null;
  deck.setChangeListener((globalIndex) => {
    clearTimeout(timer);
    const my = ++session;
    if (!deck.autoplay) return;
    const page = slidesData.pages[globalIndex];
    if (!page) return;
    timer = setTimeout(() => {
      if (my !== session || !deck.autoplay) return;
      if (globalIndex >= slidesData.pages.length - 1) {
        deck.setAutoplay(false);   // 尾页停留结束，自动模式结束
        setPlayLabel();
        return;
      }
      deck.next();
    }, page.fallbackDuration || 6000);
  });

  /* ---------- 画布缩放 ---------- */
  function fit() {
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    viewport.style.transform = `scale(${Math.min(scale, 1.15)})`;
  }
  window.addEventListener('resize', fit);
  fit();

  /* ---------- 控制条 ---------- */
  const btnPrev = q('#ctl-prev'), btnNext = q('#ctl-next');
  function toggleAutoplay() {
    deck.setAutoplay(!deck.autoplay);
    setPlayLabel();
    if (deck.autoplay) deck.next();
  }
  btnPrev.addEventListener('click', () => deck.prev());
  btnNext.addEventListener('click', () => deck.next());
  btnPlay.addEventListener('click', toggleAutoplay);

  /* ---------- 键盘 ---------- */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      deck.next();
    } else if (e.key === ' ') {
      e.preventDefault();
      toggleAutoplay();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      deck.prev();
    } else if (e.key === 'Escape') {
      deck.setAutoplay(false);
      setPlayLabel();
    }
  });

  /* ---------- 开始演示 ---------- */
  const gate = q('#gate');
  const autoWanted = new URLSearchParams(location.search).get('autoplay') === '1';
  // 录屏模式（?autoplay=1）下隐藏控制条，避免按钮压住页脚日期入镜；键盘操作仍可用
  if (autoWanted) q('#control-bar').classList.add('auto-hidden');
  gate.querySelector('button').addEventListener('click', () => {
    gate.classList.add('hidden');
    if (autoWanted) {
      deck.setAutoplay(true);
      setPlayLabel();
      deck.next(); // 从封面出发全自动播至尾页
    }
    // 手动模式：封面停留，方向键/播放按钮接管
  });

  setPlayLabel();
}

boot();
