# 🚀 Supabase 實時雲端同步設置指南

> 本文件說明如何啟用 Foodie.AI 的**真正多設備同步**功能

## 📋 需要什麼

- 一個免費 Supabase 帳號（5 分鐘完成）
- 複製粘貼 2 個字符串到程式碼

## ⚡ 快速設置步驟

### 1️⃣ 建立 Supabase 帳號

1. 訪問 **https://supabase.com**
2. 點擊 **「Sign Up」** 或 **「Start your project」**
3. 用 GitHub / Google / Email 登入
4. 選擇免費計畫 ✨

### 2️⃣ 建立新的 Supabase 專案

1. 在 Dashboard 上點 **「+ New project」**
2. 輸入項目名稱（例如 `foodie-saki`）
3. 選擇密碼（會用於登入）
4. 選擇地區（選最近的地區，例如 Asia - Singapore）
5. 點 **「Create new project」** 並等待完成（約 2-3 分鐘）

### 3️⃣ 建立資料表

1. 在左側菜單找 **「SQL Editor」**
2. 點 **「+ New Query」**
3. 複製以下完整 SQL 語句：

```sql
-- 建立餐廳數據表
CREATE TABLE IF NOT EXISTS restaurant_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  rests JSONB,
  picky JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  device_info TEXT
);

-- 啟用即時廣播（多設備實時同步的關鍵）
ALTER PUBLICATION supabase_realtime ADD TABLE restaurant_data;

-- 建立索引以加快查詢
CREATE INDEX idx_user_id ON restaurant_data(user_id);
CREATE INDEX idx_timestamp ON restaurant_data(timestamp);
```

4. 點 **「Run」** 並等待完成（應該看到 ✅）

### 4️⃣ 複製你的 API 認證資訊

1. 點擊左側 **「Settings」**
2. 點 **「API」**
3. 複製以下 2 個值到剪貼板：

```
Project URL:      https://xxxxx.supabase.co
Anon Public Key:  eyJhbG...（很長的字符串）
```

### 5️⃣ 更新應用程式代碼

1. 編輯 `index.html`
2. 找到第 **3-4 行**（在 `<script>` 標簽下）：

```javascript
const SUPABASE_URL = "YOUR_SUPABASE_URL";  // ← 改這裡
const SUPABASE_KEY = "YOUR_SUPABASE_KEY";  // ← 改這裡
```

3. 替換為你複製的值：

```javascript
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_KEY = "eyJhbG...（粘貼你的 Anon Public Key）";
```

4. **保存檔案**

### 6️⃣ 驗證設置成功

1. 重新載入網頁（Ctrl+R 或 Cmd+R）
2. 查看頂部的同步狀態，應該看到：
   - ✅ **「✓ 雲端已連接」** （綠色）

如果看到「💾 本機模式」（紅色），表示配置有誤。檢查：
- URL 和 KEY 是否正確複製（沒有多餘空格）
- 資料表是否已建立

## 🎯 測試多設備同步

1. **電腦**上打開：https://sujannan-bit.github.io/joseph_saki/
2. 新增一間餐廳，例如「太郎拉麵」
3. 等 2-3 秒，看狀態是否顯示「✓ 雲端已連接」
4. **手機**上打開相同網址
5. 應該可以看到「太郎拉麵」已經在清單上！🎉

## 🔒 安全性提示

- Anon Public Key 是**公開**的，Supabase 會自動限制權限，所以沒關係
- 建議啟用 Supabase 的「Row Level Security」來進一步保護（選做）

## 💬 遇到問題？

- **看不到雲端連接**：檢查瀏覽器開發者工具（F12），看 Console 有什麼錯誤
- **資料沒同步**：確認資料表已建立，和 SQL 語句執行無誤
- **手機看不到電腦的資料**：多等 3-5 秒，Supabase 需要時間同步

## 🎊 完成！

現在你有**真正的雲端同步**了！

- 👩 咪在手機上新增的餐廳 👨 蘇在電腦上立即可見
- 沒有網路時會自動存到本機，恢復連線後自動上傳
- 完全免費，無需信用卡

祝你美食手帳同步愉快！ 🍜✨
