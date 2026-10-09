# 2003 年美加大停电 · 六阶段机理演示（幻灯片版）

电力系统分析第一次选做作业的解释性可视化：14 页调度中心暗色幻灯片，讲述 2003 年 8 月 14 日美加大停电的**背景 → 事件经过 → 事后**全过程，围绕事故演变的关键环节解释物理机理（潮流分配 / N-1 / 无功-电压 / 有功-频率两条天平）。

## 在线演示

GitHub Pages 部署后此链接生效：`https://eric-dev-dot.github.io/blackout_2003/`

## 本地打开

纯静态站，无任何构建依赖，但需走本地 HTTP（浏览器对 `file://` 下的 fetch/ES modules 有安全限制）：

```bash
# 在本目录的上一级（或本目录）启动
python -m http.server 8765
# 浏览器访问
# http://127.0.0.1:8765/blackout_slides/index.html        手动模式
# http://127.0.0.1:8765/blackout_slides/index.html?autoplay=1  录屏模式（全自动播放）
```

打开后点击"开始演示"即可。

- **手动模式**：←→ 方向键翻页；空格 播放/暂停；Esc 停止
- **录屏模式（`?autoplay=1`）**：点"开始演示"后从封面自动播到尾页，每页按预设停留时长自动翻页，配合 OBS / Win+G 录屏零操作
- 阶段页（4–9）之间导航时框图原地做状态差分动画（不整页翻页），视线可以始终钉在"哪条线变了"

## 配音与 BGM

页面内不含音频。旁白文稿见 `data/slides.json` 各页的 `narration`（含 `tts` 读音标注），视频成片的配音与背景音乐由作者在录屏后自行合成。

## 资料来源与 AI 使用说明

主要资料来源（S1–S7）与 AI 工具使用声明见演示最后一页。核心事实依据：

- S1 · 美加联合调查工作组《Final Report on the August 14, 2003 Blackout in the United States and Canada: Causes and Recommendations》(2004)：https://www.energy.gov/sites/prod/files/oeprod/DocumentsandMedia/BlackoutFinal-Web.pdf
- S7 · Energy Policy Act of 2005, Public Law 109-58 §1211：https://www.govinfo.gov/content/pkg/PLAW-109publ58/pdf/PLAW-109publ58.pdf

本作品的资料检索与来源整理、交互网页与框图可视化（HTML/CSS/JS）编写、机理注解与录屏文稿起草，均借助 AI 编程助手（ZCode）完成；官方报告正文的检索定位与页码核对亦由 AI 辅助完成。视频成片的配音与背景音乐由作者后期制作合成。页面中的关键事实、时间口径与影响数字由人工对照官方来源核实；未经报告正文核对的内容（如首条线路退出的精确时刻、级联设备顺序）不写入确定性时间轴，以保守表述呈现。

## 视觉与事实边界

- 状态色语义全片唯一：绿＝正常、黄＝负荷增加/风险、红＝退出、灰＝信息不可用、蓝＝机构/来源
- SVG 框图是机制解释性示意，不代表完整真实电网拓扑或潮流计算；箭头粗细只表达相对变化
- 电压支撑/频率芯片为定性机制示意，不含实测数值或曲线；影响数字保留"约/估计"官方口径

## 目录结构

```
├─ index.html            # 唯一页面（1280×720 画布自适应缩放）
├─ css/slides.css        # 调度中心暗色设计 token + 版式 + 动效
├─ js/                   # ES modules：main/deck/diagram/slide-templates/map-paths
├─ data/
│  ├─ slides.json        # 14 页编排：版式/页眉/旁白文稿/每页停留时长
│  └─ M1_events.json     # 内容源：六阶段 + 两条过程 + 机理回顾 + 背景/事后
└─ .nojekyll             # GitHub Pages：跳过 Jekyll 处理
```
