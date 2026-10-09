2003 年美加大停电 · 六阶段机理演示（PPT 风格幻灯片）
====================================================

【运行环境】
- 现代浏览器（Chrome / Edge / Firefox），无任何外部依赖、无构建步骤
- 需通过本地 HTTP 服务打开（直接双击 HTML 会因浏览器安全策略无法加载 JSON 数据与 ES modules）

【打开方式】
1. 在本文件夹的上一级目录启动本地服务：
   python -m http.server 8765
2. 浏览器访问：
   手动模式：http://127.0.0.1:8765/blackout_slides/index.html
   录屏模式：http://127.0.0.1:8765/blackout_slides/index.html?autoplay=1
3. 进入后点击"开始演示"按钮。

【操作】
- ← / → 方向键：翻页（阶段页之间框图原地切换，不整页翻动）
- 空格：自动播放 / 暂停；Esc：停止自动播放
- 右下角控制条：上一页 / 播放 / 下一页
- 录屏模式：点击"开始演示"后从封面全自动播到尾页（每页按预设时长停留），配合 OBS / Win+G 录屏即可

【配音与 BGM】
- 页面内不含音频；自动播放按 data/slides.json 中各页 fallbackDuration 停留翻页
- 旁白文稿见 data/slides.json 各页 narration 字段（含 tts 读音标注），
  成片配音与背景音乐由作者录屏后自行合成

【文件结构】
- index.html            唯一页面（1280×720 画布，自动缩放适配窗口）
- css/slides.css        全部样式（调度中心暗色主题）
- js/                   main / deck / diagram / slide-templates / map-paths（ES modules）
- data/slides.json      14 页编排、旁白文稿与停留时长
- data/M1_events.json   内容唯一来源：六阶段事件、两条过程、机理回顾、背景与事后

【事实口径】
- 关键事实以美加联合调查最终报告（S1）与《2005 能源政策法》（S7）为准；
  影响数字保留"约/估计"；未核对的精确时刻不写入时间轴（详见演示最后一页来源与 AI 说明）。
