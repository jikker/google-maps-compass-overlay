# gmaps-compass-overlay

# Google Maps 指南針覆蓋

本專案（**gmaps-compass-overlay**）提供一段可直接在 Google Maps 網頁上執行的使用者腳本，用於在地圖上覆蓋可自訂的 SVG 指南針與互動滑鼠追蹤，方便在衛星影像上量測建築物的方位角度。

## 功能

* **SVG 指南針**：3 倍尺寸純 SVG，包含：

  * 外圈與中心十字線
  * 24 個刻度（每 15° 一格），主次刻度樣式
  * 8 個方位標籤（N, NE, E, SE, S, SW, W, NW）
  * 預設黃色，可根據需求自訂顏色

* **即時滑鼠追蹤**：

  * 白底狀態框顯示：

    * 游標畫面座標 (X, Y)
    * 相對中心偏移 (ΔX, ΔY)
    * 相對正北的角度 (0–360°)
    * 方位文字標籤

* **點擊畫線**：

  * 點擊地圖任意處，從指南針中心畫出紅線
  * 第二次點擊會清除舊線並繪製新線
  * 藍底大狀態框顯示該線段的 ΔX、ΔY、角度與方位

## 安裝與使用

1. 開啟瀏覽器並前往 \*\*[https://www.google.com/maps/](https://www.google.com/maps)
2. 按下 `F12` 或 `Ctrl+Shift+I` (Windows/Linux)、`Cmd+Option+I` (macOS) 開啟開發者工具。
3. 切換到 **Console** 分頁。
4. 將 `compass.js` 中的整段腳本貼入並按下 `Enter`。

```js
// << 在此貼上完整 IIFE 腳本 >>
```

* **滑鼠移動**：在地圖上移動游標，即時更新小白框資訊。
* **點擊**：於地圖任意位置點擊，畫出紅線並顯示藍底狀態框。再次點擊將更新並替換舊線與資訊。

## 自訂化

* **指南針顏色**：修改腳本中所有 `'yellow'` 為所需 CSS 顏色。
* **指南針尺寸**：調整 CSS `#compass-svg` 中的 `width` 與 `height` 屬性。
* **面板樣式**：編輯 `#compass-info` 與 `#compass-status` 的 CSS，改變字體、顏色或位置。

## 為何使用

在衛星空拍圖中，精確量測建築物相對正北的方向往往較為困難。本覆蓋圖層可：

* 提供恆定的正北參考 (0°)
* 點擊建築物邊緣即可量得其方位角
* 立即呈現數值結果，適合建築研究、都市規劃或教學示範

## 授權條款

本專案採用 **WTFPL** 授權 (Do What the Fuck You Want to Public License)。

## 程式碼來源

此程式碼乃透過與 ChatGPT 約 10 次對談，由 ChatGPT (OpenAI o4-mini 模型) 所生成。

---

# Google Maps Compass Overlay

This project (gmaps-compass-overlay) provides a user script that overlays a customizable SVG compass and interactive mouse tracking on the Google Maps web interface, making it easy to study building orientations and angles in satellite view.

## Features

* **SVG Compass**: A 3× sized, pure SVG compass including:

  * Outer ring and center crosshair
  * 24 tick marks (every 15°) with major/minor styling
  * 8 cardinal/intercardinal labels (N, NE, E, SE, S, SW, W, NW)
  * Default yellow stroke color, customizable via CSS

* **Real-Time Mouse Tracking**:

  * White info panel displaying:

    * Screen coordinates (X, Y)
    * Offset from map center (ΔX, ΔY)
    * Angle relative to true north (0–360°)
    * Direction label

* **Click-and-Draw**:

  * Click anywhere on the map to draw a red line from the compass center
  * Subsequent clicks clear the previous line and draw a new one
  * Blue status panel shows ΔX, ΔY, angle, and direction of the drawn line

## Installation & Usage

1. Open your browser and navigate to `https://www.google.com/maps`.
2. Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) to open Developer Tools.
3. Switch to the **Console** tab.
4. Paste the entire IIFE script from `compass.js` and press `Enter`.

```js
// << Paste the full IIFE script here >>
```

* **Mouse move**: See live updates in the white info panel.
* **Click**: Draw a red line and display the blue status panel; clicking again updates the line and info.

## Customization

* **Compass Color**: Change `'yellow'` in the script to any CSS color.
* **Compass Size**: Adjust the `width` and `height` in the `#compass-svg` CSS.
* **Panel Styles**: Modify CSS for `#compass-info` and `#compass-status` to suit your needs.

## Why Use This

Measuring building orientations in satellite view can be challenging. This overlay:

* Provides a fixed true north reference (0°)
* Lets you click on building edges to measure orientation angles
* Offers instant numeric feedback, ideal for architectural analysis, urban planning, or teaching demonstrations

## License

This project is released under the **WTFPL** (Do What the Fuck You Want to Public License).

## Code Origin

This code was generated through approximately 10 conversational turns with ChatGPT (OpenAI o4-mini model).
