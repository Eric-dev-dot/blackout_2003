// SVG 框图：单实例模板 + 状态驱动更新（移植自旧 index.html 静态 SVG + network.js 映射表）。
// 颜色全部走 CSS 变量（slides_visual_spec.md §6 验收项：本文件零硬编码色值）。

const LINE_KEYS = ['harding_chamberlin', 'cleveland_1', 'cleveland_2', 'cleveland_3'];
const LINE_NAMES = {
  harding_chamberlin: 'Harding–Chamberlin 345 kV',
  cleveland_1: 'Cleveland 方向线路 L1',
  cleveland_2: 'Cleveland 方向线路 L2',
  cleveland_3: 'Cleveland 方向线路 L3',
};
const STATUS_TEXT = { normal: '正常', increased: '负荷增加', risk: '风险升高', out: '退出' };

// SVG 模板：结构与旧版一致；色值全部由 slides.css 的类与变量接管。
function svgMarkup() {
  return `
  <svg class="network-svg" viewBox="0 0 760 430" preserveAspectRatio="xMidYMid meet" role="img" aria-label="发电侧经母线 A、四条并联 345 kV 线路、母线 B 向 Cleveland 负荷供电的机制示意框图">
    <defs>
      <marker id="arrow-normal" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 Z" fill="var(--state-green)"/></marker>
      <marker id="arrow-increased" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 Z" fill="var(--state-yellow)"/></marker>
      <marker id="arrow-risk" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 Z" fill="var(--state-yellow)"/></marker>
    </defs>

    <rect x="14" y="18" width="732" height="394" rx="10" class="svg-bg"/>

    <g class="node control">
      <rect x="290" y="24" width="180" height="64" rx="10"/>
      <circle cx="314" cy="45" r="8"/>
      <path d="M330 41 h96 M330 52 h68" class="screen-line"/>
      <text x="380" y="77">FirstEnergy 控制中心</text>
    </g>
    <path d="M330 88 V106 H100 V186" class="info-link"/>
    <path d="M380 88 V146" class="info-link"/>
    <path d="M430 88 V106 H676 V192" class="info-link"/>
    <g class="info-chip"><rect x="191" y="96" width="48" height="20" rx="6"/><text x="215" y="110">遥测</text></g>
    <g class="info-chip"><rect x="336" y="96" width="88" height="20" rx="6"/><text x="380" y="110">状态 / 告警</text></g>
    <g class="info-chip"><rect x="519" y="96" width="68" height="20" rx="6"/><text x="553" y="110">负荷监视</text></g>

    <g class="node gen-block">
      <rect x="46" y="186" width="108" height="96" rx="10"/>
      <path d="M92 222 L101 206 L106 218 L115 202" class="bolt"/>
      <text x="100" y="250">发电侧</text>
      <text x="100" y="267" class="block-sub">等值电源</text>
    </g>

    <rect class="bus-bar" x="196" y="140" width="8" height="200" rx="4"/>
    <rect class="bus-bar" x="556" y="140" width="8" height="200" rx="4"/>
    <text x="200" y="128" class="bus-label">母线 A（送端）</text>
    <text x="560" y="128" class="bus-label">母线 B（Cleveland 受端）</text>

    <path data-tie="gen" d="M154 236 H196" class="grid-line state-normal delivery" pathLength="1"/>
    <path data-tie-arrow="gen" d="M158 236 H188" class="flow-arrow state-normal" marker-end="url(#arrow-normal)"/>

    <path data-line="harding_chamberlin" d="M204 170 H556" class="grid-line state-normal" pathLength="1"/>
    <path data-line="cleveland_1" d="M204 210 H556" class="grid-line state-normal" pathLength="1"/>
    <path data-line="cleveland_2" d="M204 250 H556" class="grid-line state-normal" pathLength="1"/>
    <path data-line="cleveland_3" d="M204 290 H556" class="grid-line state-normal" pathLength="1"/>

    <path data-line-arrow="harding_chamberlin" d="M300 170 H500" class="flow-arrow state-normal" marker-end="url(#arrow-normal)"/>
    <path data-line-arrow="cleveland_1" d="M300 210 H500" class="flow-arrow state-normal" marker-end="url(#arrow-normal)"/>
    <path data-line-arrow="cleveland_2" d="M300 250 H500" class="flow-arrow state-normal" marker-end="url(#arrow-normal)"/>
    <path data-line-arrow="cleveland_3" d="M300 290 H500" class="flow-arrow state-normal" marker-end="url(#arrow-normal)"/>

    <g data-break="harding_chamberlin" class="break-marker" hidden><circle cx="380" cy="170" r="11"/><path d="M374 164 L386 176 M386 164 L374 176"/></g>
    <g data-break="cleveland_1" class="break-marker" hidden><circle cx="380" cy="210" r="11"/><path d="M374 204 L386 216 M386 204 L374 216"/></g>
    <g data-break="cleveland_2" class="break-marker" hidden><circle cx="380" cy="250" r="11"/><path d="M374 244 L386 256 M386 244 L374 256"/></g>
    <g data-break="cleveland_3" class="break-marker" hidden><circle cx="380" cy="290" r="11"/><path d="M374 284 L386 296 M386 284 L374 296"/></g>

    <text x="210" y="162" class="line-name">Harding–Chamberlin 345 kV</text>
    <text x="210" y="202" class="line-name">L1</text>
    <text x="210" y="242" class="line-name">L2</text>
    <text x="210" y="282" class="line-name">L3</text>
    <text data-status="harding_chamberlin" x="548" y="162" class="line-status st-normal" text-anchor="end">正常</text>
    <text data-status="cleveland_1" x="548" y="202" class="line-status st-normal" text-anchor="end">正常</text>
    <text data-status="cleveland_2" x="548" y="242" class="line-status st-normal" text-anchor="end">正常</text>
    <text data-status="cleveland_3" x="548" y="282" class="line-status st-normal" text-anchor="end">正常</text>

    <path data-tie="delivery" d="M564 236 H606" class="grid-line state-normal delivery" pathLength="1"/>
    <path data-tie-arrow="delivery" d="M578 236 H598" class="flow-arrow state-normal" marker-end="url(#arrow-normal)"/>
    <g class="node load-block">
      <rect x="606" y="192" width="134" height="88" rx="10"/>
      <path d="M650 222 h13 l6-14 9 20 7-12 h20" class="load-wave"/>
      <text x="676" y="252">Cleveland</text>
      <text x="676" y="269" class="block-sub">负荷中心 · 等值负荷</text>
    </g>

    <g class="legend">
      <line x1="42" y1="392" x2="68" y2="392" class="legend-line green"/><text x="76" y="397">正常</text>
      <line x1="130" y1="392" x2="156" y2="392" class="legend-line yellow"/><text x="164" y="397">负荷增加</text>
      <line x1="248" y1="392" x2="274" y2="392" class="legend-line yellow dashed"/><text x="282" y="397">风险升高</text>
      <line x1="366" y1="392" x2="392" y2="392" class="legend-line red"/><text x="400" y="397">退出（断开）</text>
      <line x1="510" y1="392" x2="536" y2="392" class="legend-line info"/><text x="544" y="397">信息关联（非电气）</text>
    </g>
  </svg>`;
}

let root = null;

export function mountDiagram(container) {
  container.innerHTML = svgMarkup();
  root = container;
}

function el(selector) { return root ? root.querySelector(selector) : null; }

// 应用某阶段的线路/通道状态；prev 用于判定"新断开"以触发 pop 动画。
export function updateDiagram(event, prev) {
  if (!root) return;
  LINE_KEYS.forEach((key) => {
    const status = (event.lineStates && event.lineStates[key]) || 'normal';
    const line = el(`[data-line="${key}"]`);
    if (line) {
      line.setAttribute('class', `grid-line state-${status}`);
      line.setAttribute('aria-label', `${LINE_NAMES[key]}：${STATUS_TEXT[status] || status}`);
    }
    const arrow = el(`[data-line-arrow="${key}"]`);
    if (arrow) {
      if (status === 'out') arrow.setAttribute('hidden', '');
      else {
        arrow.removeAttribute('hidden');
        arrow.setAttribute('class', `flow-arrow state-${status}`);
        arrow.setAttribute('marker-end', `url(#arrow-${status === 'risk' ? 'risk' : status})`);
      }
    }
    const marker = el(`[data-break="${key}"]`);
    if (marker) {
      if (status === 'out') {
        marker.removeAttribute('hidden');
        const wasOut = prev && prev.lineStates && prev.lineStates[key] === 'out';
        if (!wasOut) {
          marker.classList.remove('pop');
          void marker.getBoundingClientRect();
          marker.classList.add('pop');
        }
      } else marker.setAttribute('hidden', '');
    }
    const label = el(`[data-status="${key}"]`);
    if (label) {
      label.textContent = STATUS_TEXT[status] || status;
      label.setAttribute('class', `line-status st-${status}`);
    }
  });

  // 送端/受端等值通道：跨区域停电（affectedLevel>=3）后失电
  const blackout = (event.affectedLevel || 0) >= 3;
  [['gen', 'gen'], ['delivery', 'delivery']].forEach(([tie, arrow]) => {
    const tieLine = el(`[data-tie="${tie}"]`);
    if (tieLine) tieLine.setAttribute('class', `grid-line state-${blackout ? 'out' : 'normal'} delivery`);
    const tieArrow = el(`[data-tie-arrow="${arrow}"]`);
    if (tieArrow) {
      if (blackout) tieArrow.setAttribute('hidden', '');
      else tieArrow.removeAttribute('hidden');
    }
  });
}

// 首次进入阶段组：线路描线生成动画（.draw-in 由 CSS 播放后移除）。
export function drawInOnce() {
  if (!root) return;
  const lines = root.querySelectorAll('.grid-line');
  lines.forEach((l) => l.classList.add('draw-in'));
  setTimeout(() => lines.forEach((l) => {
    l.classList.remove('draw-in');
    l.style.strokeDasharray = '';
    l.style.strokeDashoffset = '';
  }), 900);
}

// 悬停浮层提示（非录屏场景）：show(key, x, y) / hide()
export function initDiagramTips(getEvent, tipEl, vp) {
  if (!root) return;
  LINE_KEYS.forEach((key) => {
    const line = el(`[data-line="${key}"]`);
    if (!line) return;
    line.addEventListener('mouseenter', (e) => {
      const event = getEvent();
      if (!event) return;
      const status = (event.lineStates && event.lineStates[key]) || 'normal';
      const note = event.lineNotes && event.lineNotes[key];
      tipEl.innerHTML = `<b>${LINE_NAMES[key]} · ${STATUS_TEXT[status]}</b>${note ? note.detail : event.physicalState || ''}（机制示意）`;
      tipEl.style.display = 'block';
      positionTip(e);
    });
    line.addEventListener('mousemove', positionTip);
    line.addEventListener('mouseleave', () => { tipEl.style.display = 'none'; });
  });
  function positionTip(e) {
    const rect = vp.getBoundingClientRect();
    let x = e.clientX - rect.left + 16;
    let y = e.clientY - rect.top + 14;
    if (x + 330 > rect.width) x = e.clientX - rect.left - 336;
    if (y + 110 > rect.height) y = e.clientY - rect.top - 116;
    tipEl.style.left = `${x}px`;
    tipEl.style.top = `${y}px`;
  }
}
