(function(){
  // —— 1. 注入 CSS 樣式 —— 
  const css = `
    /* 指南針 SVG 容器 */
    #compass-svg {
      position: absolute;
      top: 50%; left: 50%;
      width: 450px; height: 450px;            /* 3 倍尺寸 */
      transform: translate(-50%,-50%);       /* 完全置中 */
      pointer-events: none;                  /* 讓滑鼠事件穿透 */
      z-index: 9999;                         /* 放最上層 */
    }
    /* 滑鼠移動時的小白框 */
    #compass-info {
      position: absolute;
      top: calc(50% + 235px);                /* 放在指南針底下 */
      left: 50%;
      transform: translateX(-50%);
      font: 16px sans-serif;
      background: rgba(255,255,255,0.8);
      padding: 4px 8px;
      border-radius: 4px;
      pointer-events: none;
      z-index: 9999;
      white-space: nowrap;
    }
    /* 點擊後顯示的藍底大狀態欄，初始隱藏 */
    #compass-status {
      position: absolute;
      top: calc(50% + 275px);                /* 緊接在白框下方 */
      left: 50%;
      transform: translateX(-50%);
      font: 18px sans-serif;
      background: rgba(0, 123, 255, 0.9);    /* 藍底 */
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      pointer-events: none;
      z-index: 10000;
      display: none;                         /* 先隱藏，點擊時顯示 */
    }
    /* 全螢幕用來畫紅線的 SVG Overlay */
    #compass-line-overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 9998;                         /* 置於指南針下方 */
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);


  // —— 2. 建立純 SVG 指南針 —— 
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, 'svg');
  svg.id = 'compass-svg';
  svg.setAttribute('viewBox', '-100 -100 200 200');

  // 2.1 外圈
  const circle = document.createElementNS(xmlns, 'circle');
  circle.setAttribute('cx', 0);
  circle.setAttribute('cy', 0);
  circle.setAttribute('r', 80);
  circle.setAttribute('stroke', 'yellow');
  circle.setAttribute('fill', 'none');
  svg.appendChild(circle);

  // 2.2 中心十字準心線 （水平 & 垂直）
  [['line',{x1:-80,y1:0,x2:80,y2:0}], ['line',{x1:0,y1:-80,x2:0,y2:80}]]
    .forEach(([tag, attrs])=>{
      const line = document.createElementNS(xmlns, tag);
      Object.entries(attrs).forEach(([k,v])=> line.setAttribute(k, v));
      line.setAttribute('stroke', 'yellow');
      line.setAttribute('stroke-width', 1);
      svg.appendChild(line);
    });

  // 2.3 24 刻度（每 15° 一格）
  for (let i = 0; i < 24; i++) {
    const ang = i * 2 * Math.PI / 24;
    // 不同刻度長度 & 粗細
    const len = (i % 6 === 0 ? 20 : i % 6 === 3 ? 15 : 10);
    const sw  = (i % 6 === 0 ? 3  : i % 6 === 3  ? 2  : 1);
    // 起點、終點座標
    const x1 = 80 * Math.sin(ang),      y1 = -80 * Math.cos(ang);
    const x2 = (80 - len) * Math.sin(ang), y2 = -(80 - len) * Math.cos(ang);
    const line = document.createElementNS(xmlns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'yellow');
    line.setAttribute('stroke-width', sw);
    svg.appendChild(line);
  }

  // 2.4 8 方位文字
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  dirs.forEach((d, j) => {
    const ang = j * 2 * Math.PI / 8;
    const tx = 90 * Math.sin(ang);
    const ty = -90 * Math.cos(ang) + 4;      // 微調 baseline
    const text = document.createElementNS(xmlns, 'text');
    text.setAttribute('x', tx);
    text.setAttribute('y', ty);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', 'yellow');
    text.textContent = d;
    svg.appendChild(text);
  });

  document.body.appendChild(svg);


  // —— 3. 建立資訊欄 & 狀態欄 & 線條 Overlay —— 
  // 3.1 小白框：滑鼠移動時更新
  const info = document.createElement('div');
  info.id = 'compass-info';
  info.textContent = 'X:0 Y:0 ΔX:0 ΔY:0 Angle:0.0° Dir:N';
  document.body.appendChild(info);

  // 3.2 藍底大狀態欄：點擊時顯示
  const status = document.createElement('div');
  status.id = 'compass-status';
  document.body.appendChild(status);

  // 3.3 全螢幕紅線 SVG Overlay
  const lineSvg = document.createElementNS(xmlns, 'svg');
  lineSvg.id = 'compass-line-overlay';
  document.body.appendChild(lineSvg);


  // —— 4. 事件綁定＆函式 —— 
  let pending = false;  // RAF 節流旗標

  // 4.1 更新滑鼠座標 & 角度函式（回傳計算結果）
  function updateMouse(e){
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // 以正北為 0°，順時鐘增加
    const rad = Math.atan2(dx, -dy);
    const deg = (rad * 180/Math.PI + 360) % 360;
    const dir = dirs[Math.round(deg/45) % 8];
    // 更新小白框內容
    info.textContent =
      `X:${e.clientX} Y:${e.clientY} ` +
      `ΔX:${dx} ΔY:${dy} ` +
      `Angle:${deg.toFixed(1)}° Dir:${dir}`;
    pending = false;
    return { deg, dx, dy, dir };
  }

  // 4.2 滑鼠移動事件（capture + RAF 節流）
  function onMouseMove(e){
    if (pending) return;
    pending = true;
    requestAnimationFrame(()=> updateMouse(e));
  }
  document.addEventListener('mousemove', onMouseMove, { capture: true });

  // 4.3 點擊事件：畫紅線 + 顯示藍底狀態
  document.addEventListener('click', e => {
    // 清除舊線
    while (lineSvg.firstChild) {
      lineSvg.removeChild(lineSvg.firstChild);
    }
    // 畫新的紅線：從中心到游標
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const line = document.createElementNS(xmlns, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', e.clientX);
    line.setAttribute('y2', e.clientY);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', 2);
    lineSvg.appendChild(line);

    // 計算並顯示狀態欄（ΔX,ΔY,角度,方位）
    const { deg, dx, dy, dir } = updateMouse(e);
    status.textContent = 
      `Line → ΔX:${dx} ΔY:${dy} | Angle:${deg.toFixed(1)}° (${dir})`;
    status.style.display = 'block';
  }, { capture: true });

})();
