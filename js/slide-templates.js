// 九种版式渲染函数（slides_visual_spec.md §2.2）：数据进 → HTML 出。
// 页眉/页脚/页码由 deck.js 统一渲染；这里只产出 .slide-body 内容。

import { MAP } from './map-paths.js';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* L1 封面 */
export function renderCover(cover) {
  return `
  <div class="cover-motif">${motifSvg()}</div>
  <div class="cover-block rise">
    <h1>${esc(cover.title)}</h1>
    <div class="subtitle">${esc(cover.subtitle)}</div>
  </div>`;
}

function motifSvg() {
  // 框图线稿母题（装饰，≤12% 透明度由 CSS 控制）
  return `
  <svg viewBox="0 0 760 430" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
    <g fill="none" stroke="var(--state-blue)" stroke-width="2">
      <rect x="60" y="180" width="110" height="100" rx="12" opacity=".5"/>
      <rect x="590" y="180" width="120" height="100" rx="12" opacity=".5"/>
      <rect x="196" y="140" width="8" height="200" rx="4" opacity=".7"/>
      <rect x="556" y="140" width="8" height="200" rx="4" opacity=".7"/>
      <path d="M204 170 H556 M204 210 H556 M204 250 H556 M204 290 H556" opacity=".6"/>
      <path d="M170 230 H196 M564 230 H590" opacity=".8"/>
    </g>
    <g fill="none" stroke="var(--state-blue)" stroke-width="1.6" stroke-dasharray="5 5" opacity=".4">
      <path d="M380 60 V140"/>
    </g>
  </svg>`;
}

/* L2 开场 */
export function renderIntro() {
  return `
  <div class="l2-grid">
    <div class="l2-copy rise">
      <p class="lead">2003 年 8 月 14 日下午，美国东北部与加拿大安大略省发生<b>大停电</b>——约 5000 万人受影响、约 61,800 MW 负荷被切除（官方估计口径）。</p>
      <p class="sub">一条 345 kV 线路退出后，潮流如何沿并联路径转移、级联如何自我加速、监视失效如何放大物理故障？本演示用六阶段框图讲清其中的物理机理。</p>
      <p class="src">事实依据以美加联合调查工作组最终报告为准（来源 S1–S7）。</p>
    </div>
    <div class="card region-card rise">
      <div><span class="kicker">AFFECTED AREA</span><h3>受影响范围</h3></div>
      <div class="region-map">${regionMapSvg()}</div>
      <div class="region-note"><span class="lg lg-hit"></span>受影响地区 <span class="lg lg-nb"></span>周边 <span class="lg lg-water"></span>水域 · 约 5000 万人（估计）· 边界经简化</div>
    </div>
  </div>`;
}

/* 真实边界地区图：受影响 8 州 + 安大略橙色高亮，邻居灰绿，五大湖青蓝（数据：map-paths.js） */
function regionMapSvg() {
  // 大地块：名字内嵌
  const inner = {
    安大略: [268, 148], 密歇根: [168, 170], 俄亥俄: [262, 366],
    宾夕法尼亚: [430, 325], 纽约: [446, 266],
  };
  // 小地块：引出线 + 海上标签
  const leaders = [
    { name: '佛蒙特', from: [542, 214], to: [598, 194], at: [604, 197] },
    { name: '马萨诸塞', from: [580, 292], to: [622, 302], at: [628, 305] },
    { name: '康涅狄格', from: [528, 316], to: [580, 342], at: [586, 345] },
    { name: '新泽西', from: [474, 362], to: [542, 384], at: [548, 387] },
  ];
  const lakeLabels = [
    { name: '休伦湖', at: [330, 148] },
    { name: '安大略湖', at: [452, 213] },
    { name: '伊利湖', at: [388, 396] },
  ];
  return `
  <svg viewBox="${MAP.viewBox}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="受影响地区真实边界示意图：安大略与俄亥俄、密歇根、宾夕法尼亚、纽约、佛蒙特、马萨诸塞、康涅狄格、新泽西八州，以及五大湖">
    <rect x="0" y="0" width="682" height="486" class="rm-water-bg"/>
    ${MAP.base.map((b) => `<path class="rm-base" d="${b.d}"/>`).join('')}
    ${MAP.affected.map((a, i) => `<path class="rm-hit${a.name === '安大略' ? ' ca' : ''}" style="animation-delay:${0.15 + i * 0.09}s" d="${a.d}"/>`).join('')}
    ${MAP.lakes.map((l) => `<path class="rm-lake" d="${l.d}"/>`).join('')}
    ${lakeLabels.map((l) => `<text class="rm-lake-name" x="${l.at[0]}" y="${l.at[1]}">${esc(l.name)}</text>`).join('')}
    ${leaders.map((l) => `
      <line class="rm-leader" x1="${l.from[0]}" y1="${l.from[1]}" x2="${l.to[0]}" y2="${l.to[1]}"/>
      <circle class="rm-leader-dot" cx="${l.from[0]}" cy="${l.from[1]}" r="1.6"/>
      <text class="rm-label out" x="${l.at[0]}" y="${l.at[1]}">${esc(l.name)}</text>`).join('')}
    ${Object.entries(inner).map(([name, at]) => `<text class="rm-label" x="${at[0]}" y="${at[1]}">${esc(name)}</text>`).join('')}
  </svg>`;
}

/* L3 背景 */
export function renderBackground(bg) {
  const layers = (bg && bg.layers) || [];
  return `
  <div class="l3-stack">
    ${layers.map((layer) => `
    <div class="card layer-card rise">
      <div class="tag">${esc(layer.tag)}</div>
      <div style="flex:1;min-width:0">
        <div class="claim">${esc(layer.claim)}</div>
        <div class="detail">${esc(layer.detail)}</div>
        ${layer.bars ? `<div class="bars">${layer.bars.map((b) => `
          <div class="bar-row">
            <span class="bar-label">${esc(b.label)}</span>
            <span class="bar-track"><span class="bar-fill tone-${esc(b.tone)}" style="width:${Math.max(2, (b.value / 26) * 100)}%"></span></span>
            <span class="bar-value">${esc(b.display)}</span>
          </div>`).join('')}</div>` : ''}
        ${layer.foreshadows ? `<div class="foreshadows">${layer.foreshadows.map((f) => `<span class="foreshadow">${esc(f.text)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="src">${esc(layer.source)}</div>
    </div>`).join('')}
  </div>`;
}

/* L4 阶段页（返回外壳；右栏内容由 deck 按阶段刷新） */
export function renderStageShell() {
  return `
  <div class="l4-grid">
    <div class="card diagram-card">
      <div class="card-heading">
        <div><span class="kicker">SYSTEM VIEW</span></div>
        <span class="fact-pill">机制示意 · 非完整电网拓扑</span>
      </div>
      <div class="diagram-slot" id="diagram-slot"></div>
      <div class="change-bar" id="change-bar"></div>
    </div>
    <div class="l4-side" id="l4-side"></div>
  </div>`;
}

/* L4 右栏内容（天平芯片 + 机理注解 ≤2 条） */
const VOLTAGE = { normal: ['正常支撑', 'good'], declining: ['开始下降', 'warn'], low: ['明显偏低', 'alert'], collapsed: ['崩溃', 'alert'] };
const FREQUENCY = { normal: ['正常', 'good'], unstable: ['波动风险上升', 'warn'], islanded: ['解列后孤岛内失稳', 'alert'] };

export function renderStageSide(event) {
  const v = VOLTAGE[event.voltageState] || VOLTAGE.normal;
  const f = FREQUENCY[event.frequencyState] || FREQUENCY.normal;
  const notes = (event.mechanismNotes || []).slice(0, 2);
  return `
  <div class="gauge-row fade-swap">
    <span class="gauge-chip"><i class="gauge-dot dot-${v[1]}"></i>电压支撑 <b>${esc(v[0])}</b></span>
    <span class="gauge-chip"><i class="gauge-dot dot-${f[1]}"></i>系统频率 <b>${esc(f[0])}</b></span>
  </div>
  <div class="card mech-card fade-swap">
    <div><span class="kicker">MECHANISM · 故障现象 → 课程概念</span></div>
    <p class="screen-lead">${esc(event.screenText)}</p>
    <div class="mech-list">
      ${notes.map((note) => `
      <div class="mech-item">
        <div class="mech-chain"><span class="mech-fault">${esc(note.fault)}</span><i>→</i><span class="mech-term">${esc(note.concept)}</span></div>
        <p class="mech-text">${esc(note.text)}</p>
      </div>`).join('')}
    </div>
  </div>`;
}

/* L4 "本页变化"条 */
export function changeBarText(event, fallback) {
  const changed = Object.entries(event.lineStates || {}).filter(([, v]) => v !== 'normal');
  if (!changed.length) return { text: event.quietNote || fallback, tone: 'calm' };
  const names = { harding_chamberlin: 'Harding–Chamberlin', cleveland_1: 'L1', cleveland_2: 'L2', cleveland_3: 'L3' };
  const label = { increased: '负荷增加', risk: '风险升高', out: '退出' };
  const text = changed.map(([k, v]) => `${names[k]} ${label[v]}`).join(' · ');
  const worst = changed.some(([, v]) => v === 'out') ? 'alarm' : 'warn';
  return { text, tone: worst };
}

/* L5 大数字 */
export function renderImpact(data) {
  const stage6 = (data.events || []).find((e) => e.id === 'impact_summary');
  const metrics = (stage6 && stage6.metrics) || [];
  return `
  <div class="l5-grid">
    ${metrics.map((m) => `
    <div class="card metric-card rise">
      <span class="qualifier">${m.qualifier === 'estimated' ? '估计口径' : esc(m.qualifier)}</span>
      <div class="value"><span class="approx">约</span><span data-count="${esc(m.value)}">${esc(m.value.replace('约 ', ''))}</span></div>
      <div class="label">${esc(m.label)}</div>
    </div>`).join('')}
    <div class="metric-note">数字为官方估计口径（S1）；受影响约 5000 万人 · 8 个州 + 安大略省</div>
  </div>`;
}

/* L6 两条过程：双泳道动态流程图（浓缩自 data.processes，节点图形化） */
export function renderProcesses(processes) {
  return `<div class="card flow-card rise">${processFlowSvg()}</div>`;
}

/* 图标（与框图页同一符号语言：Ⓧ=退出、状态色语义一致） */
const ICONS = {
  thermo: '<circle cx="-7" cy="9" r="6"/><path d="M-7 3 V-10 M-3 -8 a4 4 0 1 0 -8 0"/>',
  break: '<circle r="11"/><path d="M-6 -6 L6 6 M6 -6 L-6 6"/>',
  fork: '<path d="M-10 8 V0 L10 -8 M-10 8 L10 0 M-10 8 L10 8"/>',
  domino: '<path d="M-9 8 V-2 M-1 8 V-6 M7 8 V-10"/>',
  wavebreak: '<path d="M-11 0 q3 -7 6 0 t6 0"/><path d="M4 0 q3 -7 6 0"/>',
  eyeoff: '<path d="M-11 0 q11 -10 22 0 q-11 10 -22 0 Z"/><path d="M-8 -9 L8 9"/>',
  window: '<rect x="-8" y="-9" width="16" height="18" rx="2"/><path d="M-8 -1 H8 M0 -9 V9"/>',
  bolt: '<path d="M2 -12 L-7 2 h5 L-2 12 L7 -2 h-5 Z"/>',
};

function processFlowSvg() {
  const phys = [
    { word: '高温重载', note: '弧垂增大 · 裕度收窄', icon: 'thermo', tone: 'yellow' },
    { word: '线路退出', note: '树障跳闸 · 保护动作', icon: 'break', tone: 'red' },
    { word: '潮流转移', note: '并联线路自动承接', icon: 'fork', tone: 'yellow' },
    { word: '过载级联', note: '两条回路自我加速', icon: 'domino', tone: 'red' },
  ];
  const mon = [
    { word: '告警异常', note: '关键告警未呈现', icon: 'wavebreak', tone: 'gray' },
    { word: '态势感知丢失', note: '察觉-理解-预判失效', icon: 'eyeoff', tone: 'gray' },
    { word: '干预窗口错过', note: '减载 / 切机未执行', icon: 'window', tone: 'gray' },
  ];
  const PX = [118, 328, 538, 748], PY = 132;   // 物理节点
  const MX = [223, 433, 643], MY = 346;        // 监视节点
  const END = [960, 239];                      // 汇聚终点
  const crosses = [
    { from: [433, 300], to: [538, 178], label: '风险无人察觉', at: [468, 244] },
    { from: [643, 300], to: [748, 178], label: '窗口尽数错过', at: [678, 244] },
  ];
  const times = ['正常运行', '异常累积', '级联扩大', '16:00 后 · 停电'];

  const node = (n, x, y, delay) => `
    <g class="fs-node tone-${n.tone}" style="animation-delay:${delay}s" transform="translate(${x},${y})">
      <circle r="33" class="fs-ball"/>
      <g class="fs-ic ic-${n.tone}">${ICONS[n.icon]}</g>
      <text y="52" class="fs-word">${esc(n.word)}</text>
      <text y="68" class="fs-note">${esc(n.note)}</text>
    </g>`;

  const link = (x1, y1, x2, y2, delay, tone = 'gray') => `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="fs-link lk-${tone}" style="animation-delay:${delay}s"/>`;

  return `
  <svg viewBox="0 0 1120 470" preserveAspectRatio="xMidYMid meet" role="img" aria-label="两条过程泳道图：上为电网物理过程（高温重载、线路退出、潮流转移、过载级联），下为运行监视过程（告警异常、态势感知丢失、干预窗口错过），两条线并行发展、相互放大，汇聚成跨区域大停电">
    <defs>
      <marker id="fa-y" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--state-yellow)"/></marker>
      <marker id="fa-r" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--state-red)"/></marker>
      <marker id="fa-g" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--state-gray)"/></marker>
    </defs>

    <text x="20" y="72" class="fs-lane-title t-yellow">▸ 电网物理过程 · 制造故障</text>
    <text x="20" y="300" class="fs-lane-title t-gray">▸ 运行监视过程 · 错过拦截</text>

    ${phys.slice(0, -1).map((n, i) => link(PX[i] + 40, PY, PX[i + 1] - 40, PY, 0.35 + i * 0.25, phys[i + 1].tone)).join('')}
    ${mon.slice(0, -1).map((n, i) => link(MX[i] + 40, MY, MX[i + 1] - 40, MY, 0.45 + i * 0.25, 'gray')).join('')}

    ${phys.map((n, i) => node(n, PX[i], PY, 0.15 + i * 0.25)).join('')}
    ${mon.map((n, i) => node(n, MX[i], MY, 0.3 + i * 0.25)).join('')}

    ${crosses.map((c, i) => `
      <g class="fs-cross" style="animation-delay:${1.15 + i * 0.2}s">
        <line x1="${c.from[0]}" y1="${c.from[1]}" x2="${c.to[0]}" y2="${c.to[1]}" class="fs-xlink" marker-end="url(#fa-r)"/>
        <text x="${c.at[0]}" y="${c.at[1]}" class="fs-xlabel">${esc(c.label)}</text>
      </g>`).join('')}

    <path d="M${PX[3] + 40} ${PY} H960 V${END[1] - 54}" class="fs-link lk-red" style="animation-delay:1.5s" marker-end="url(#fa-r)"/>
    <path d="M${MX[2] + 40} ${MY} H960 V${END[1] + 54}" class="fs-link lk-gray" style="animation-delay:1.5s" marker-end="url(#fa-g)"/>

    <g class="fs-end" style="animation-delay:1.7s" transform="translate(${END[0]},${END[1]})">
      <circle r="45" class="fs-end-ball"/>
      <g class="fs-ic ic-end">${ICONS.bolt}</g>
      <text y="66" class="fs-word w-end">跨区域大停电</text>
    </g>

    <line x1="60" y1="446" x2="1060" y2="446" class="fs-time-axis"/>
    ${times.map((t, i) => `
      <circle cx="${118 + i * 281}" cy="446" r="3.5" class="fs-time-dot"/>
      <text x="${118 + i * 281}" y="468" class="fs-time-word">${esc(t)}</text>`).join('')}
  </svg>`;
}

/* L7 机理回顾 */
export function renderRecap(recap) {
  if (!recap) return '';
  return `
  <div class="l7-grid">
    ${(recap.scales || []).map((s) => `
    <div class="card scale-card rise">
      <h3>${esc(s.name)}<span class="scope-chip">${esc(s.scope)}</span></h3>
      <p>${esc(s.mechanism)}</p>
      <p class="in-event"><strong>在本事件中：</strong>${esc(s.inEvent)}</p>
    </div>`).join('')}
    ${(recap.loops || []).map((l) => `
    <div class="card loop-card ${esc(l.tone)} rise">
      <span class="loop-name">${esc(l.name)}</span>
      <div class="loop-steps">${l.steps.map((step, i) => `${i ? '<i>→</i>' : ''}<span class="loop-step">${esc(step)}</span>`).join('')}</div>
      <span class="loop-note">${esc(l.note)}</span>
    </div>`).join('')}
    <div class="conclusion-bar">${esc(recap.conclusion)}</div>
    <div class="disclaimer">${esc(recap.disclaimer)}</div>
  </div>`;
}

/* L8 事后 */
export function renderAftermath(after) {
  if (!after) return '';
  const r = after.restore, c = after.change;
  return `
  <div class="l8-grid">
    <div class="card restore-col rise">
      <h3>${esc(r.title)} <span class="fact-pill" style="margin-left:8px">S1 · 部分地区口径</span></h3>
      ${r.cards.map((card) => `
      <div class="time-card">
        <span class="value">${esc(card.value)}</span>
        <span class="label"><b>${esc(card.label)}</b><br>${esc(card.detail)}</span>
      </div>`).join('')}
      <div class="restore-note">${esc(r.note)}</div>
      <div class="metric-chips">
        ${r.metrics.map((m) => `<div class="metric-chip"><span class="v">${esc(m.value)}</span><span class="l">${esc(m.label)}</span></div>`).join('')}
      </div>
    </div>
    <div class="card change-col rise">
      <h3>${esc(c.title)} <span class="fact-pill" style="margin-left:8px">S1 · S7</span></h3>
      <div class="change-chain">
        ${c.nodes.map((node, i) => `
        ${i ? '<div class="chain-link">▼</div>' : ''}
        <div class="chain-node${i === c.nodes.length - 1 ? ' final' : ''}">
          <span class="label">${esc(node.label)}</span>
          <span class="text">${esc(node.text)}</span>
          ${node.badges ? `<span class="badge-grid">${node.badges.map((b) => `<span class="badge">${esc(b)}</span>`).join('')}</span>` : ''}
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* L9 来源与 AI */
export function renderSources(sourcesPage) {
  const items = (sourcesPage && sourcesPage.sources) || [];
  const ai = (sourcesPage && sourcesPage.aiNote) || '';
  return `
  <div class="l9-grid">
    <div class="card sources-col rise">
      <h3>主要资料来源</h3>
      <ol class="source-list">
        ${items.map((s) => `
        <li><span class="no">${esc(s.no)}</span><span><span class="org">${esc(s.org)}</span>《${esc(s.title)}》<br><span class="use">——${esc(s.use)}</span></span></li>`).join('')}
      </ol>
    </div>
    <div class="card ai-col rise">
      <div class="ai-kicker">AI TOOLS</div>
      <h3>AI 工具使用情况</h3>
      <p>${esc(ai)}</p>
    </div>
  </div>`;
}
