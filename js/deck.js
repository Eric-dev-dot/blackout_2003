// 翻页框架：14 页导航、阶段组（4–9 共用一个持久框图原地差分）、切换规则、进度与键盘。
// 切换规则（slides_visual_spec.md §4）：
//  - 组外：水平推移 300ms（.slide-in-right / .slide-in-left）
//  - 阶段组内：不整页推移——框图原地 morph 600ms，仅页眉与右栏 200ms 淡换
//  - 首入阶段组（3→4）：推移 + 线路描线生成 800ms

import {
  renderCover, renderIntro, renderBackground, renderStageShell,
  renderStageSide, changeBarText, renderImpact, renderProcesses,
  renderRecap, renderAftermath, renderSources,
} from './slide-templates.js?v=8';
import { mountDiagram, updateDiagram, drawInOnce, initDiagramTips } from './diagram.js';

const STAGE_FALLBACK = '四条线路全部正常 · 高温正在压窄安全裕度';

export function createDeck(opts) {
  const { slidesData, eventsData, viewport, tipEl, onChange } = opts;
  const pages = slidesData.pages;
  const events = [...(eventsData.events || [])].sort((a, b) => a.order - b.order);
  const cover = slidesData.cover;

  const deck = {
    index: 0,          // 当前页（slides.pages 下标，0–13）
    stage: 0,          // 阶段组内部下标（0–5）
    autoplay: false,
    started: false,
  };

  const sections = [];   // 与 pages 对齐；阶段组 6 页共享同一 section
  let stagesSection = null;
  let stagesEntered = false;
  let firstStageIdx = pages.findIndex((p) => p.group === 'stages');
  let changeCb = onChange || (() => {});

  /* ---------- 构建 ---------- */
  function pillDots(n) {
    let html = '';
    for (let i = 0; i < 6; i++) html += `<i class="${i < n + 1 ? 'on' : ''}">●</i>`;
    return html;
  }

  function stageHeader(page, idx) {
    const ev = events[page.stageIndex];
    return `
      <span class="stage-pill"><span class="dots">${pillDots(page.stageIndex)}</span>${String(page.stageIndex + 1).padStart(2, '0')}/06 · ${esc(ev.timelineLabel)}</span>
      <h1>${esc(ev.title)}</h1>
      <span class="spacer"></span>
      <span class="page-no">${String(firstStageIdx + page.stageIndex + 1).padStart(2, '0')} / 14</span>`;
  }

  function plainHeader(page, idx) {
    const h = page.header || {};
    return `
      ${h.kicker ? `<span class="kicker">${esc(h.kicker)}</span>` : ''}
      <h1>${esc(h.title || '')}</h1>
      <span class="spacer"></span>
      <span class="page-no">${String(idx + 1).padStart(2, '0')} / 14</span>`;
  }

  function footer() {
    return `<span>来源 S1–S7</span><span>2003-08-14 · 美加大停电</span>`;
  }

  function bodyFor(page) {
    switch (page.layout) {
      case 'L1': return renderCover(cover);
      case 'L2': return renderIntro();
      case 'L3': return renderBackground(eventsData.background);
      case 'L4': return renderStageShell();
      case 'L5': return renderImpact(eventsData);
      case 'L6': return renderProcesses(eventsData.processes);
      case 'L7': return renderRecap(eventsData.mechanismRecap);
      case 'L8': return renderAftermath(eventsData.aftermath);
      case 'L9': return renderSources(slidesData.sourcesPage);
      default: return '';
    }
  }

  function build() {
    pages.forEach((page, idx) => {
      if (page.group === 'stages') {
        if (!stagesSection) {
          stagesSection = document.createElement('section');
          stagesSection.className = 'slide l4';
          stagesSection.innerHTML = `
            <header class="slide-header" id="stages-header"></header>
            <div class="slide-body">${renderStageShell()}</div>
            <footer class="slide-footer">${footer()}</footer>`;
          viewport.appendChild(stagesSection);
          mountDiagram(stagesSection.querySelector('#diagram-slot'));
          initDiagramTips(() => events[deck.stage], tipEl, viewport);
        }
        sections[idx] = stagesSection;
        return;
      }
      const sec = document.createElement('section');
      sec.className = `slide ${page.layout.toLowerCase()}`;
      sec.innerHTML = `
        ${page.layout === 'L1' ? '' : `<header class="slide-header">${plainHeader(page, idx)}</header>`}
        <div class="slide-body">${bodyFor(page)}</div>
        <footer class="slide-footer">${page.layout === 'L1' ? '' : footer()}</footer>`;
      viewport.appendChild(sec);
      sections[idx] = sec;
    });
    sections[0].classList.add('active');
  }

  /* ---------- 阶段组内部更新（morph） ---------- */
  function setStage(stageIdx) {
    deck.stage = stageIdx;
    deck.index = firstStageIdx + stageIdx;   // morph 导航同步全局下标
    const ev = events[stageIdx];
    const prev = stageIdx > 0 ? events[stageIdx - 1] : null;

    const header = stagesSection.querySelector('#stages-header');
    header.innerHTML = stageHeader({ stageIndex: stageIdx });

    const side = stagesSection.querySelector('#l4-side');
    side.innerHTML = renderStageSide(ev);
    side.classList.remove('refresh');
    void side.offsetWidth;
    side.classList.add('refresh');

    const bar = stagesSection.querySelector('#change-bar');
    const { text, tone } = changeBarText(ev, STAGE_FALLBACK);
    bar.textContent = `本页变化 · ${text}`;
    bar.className = `change-bar ${tone}`;

    updateDiagram(ev, prev);
  }

  /* ---------- 切换 ---------- */
  function slideTo(newIdx, dir) {
    const cur = sections[deck.index];
    const nextSec = sections[newIdx];
    const page = pages[newIdx];

    cur.classList.remove('active', 'slide-in-right', 'slide-in-left');
    nextSec.classList.add('active', dir > 0 ? 'slide-in-right' : 'slide-in-left');
    setTimeout(() => nextSec.classList.remove('slide-in-right', 'slide-in-left'), 340);

    deck.index = newIdx;
    updateProgress();

    const info = { type: 'slide', firstStage: false };
    if (page.group === 'stages') {
      if (!stagesEntered) {
        stagesEntered = true;
        setStage(0);
        drawInOnce();
        info.firstStage = true;
      } else {
        setStage(deck.stage); // 回看时同步到记住的阶段
      }
    }
    if (page.layout === 'L5') setTimeout(runCounters, 250);
    changeCb(deck.index, info);
  }

  function next() {
    const page = pages[deck.index];
    if (page.group === 'stages' && deck.stage < 5) {
      setStage(deck.stage + 1);
      updateProgress();
      changeCb(deck.index, { type: 'morph' });
      return;
    }
    if (deck.index < pages.length - 1) slideTo(deck.index + 1, +1);
  }

  function prev() {
    const page = pages[deck.index];
    if (page.group === 'stages' && deck.stage > 0) {
      setStage(deck.stage - 1);
      updateProgress();
      changeCb(deck.index, { type: 'morph' });
      return;
    }
    if (deck.index > 0) slideTo(deck.index - 1, -1);
  }

  function updateProgress() {
    const globalPos = pages[deck.index].group === 'stages' ? firstStageIdx + deck.stage : deck.index;
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${((globalPos + 1) / pages.length) * 100}%`;
  }

  /* ---------- L5 数字上滚 ---------- */
  function runCounters() {
    viewport.querySelectorAll('[data-count]').forEach((el) => {
      const raw = el.getAttribute('data-count');
      const m = raw.match(/([\d,]+)(.*)/);
      if (!m) return;
      const target = parseInt(m[1].replace(/,/g, ''), 10) || 0;
      const suffix = m[2] || '';
      const t0 = performance.now();
      const dur = 800;
      function tick(t) {
        const k = Math.min(1, (t - t0) / dur);
        const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
        el.textContent = v.toLocaleString('en-US') + suffix;
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- 对外 ---------- */
  deck.build = build;
  deck.next = next;
  deck.prev = prev;
  deck.setAutoplay = (on) => { deck.autoplay = on; };
  deck.setChangeListener = (fn) => { changeCb = fn || (() => {}); };
  deck.currentGlobal = () => (pages[deck.index].group === 'stages' ? 3 + deck.stage : deck.index);
  deck.emitCurrent = (extra = {}) => changeCb(deck.currentGlobal(), { type: 'slide', ...extra });
  deck.updateProgress = updateProgress;

  return deck;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
