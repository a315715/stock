// 股價服務層
// 從同源的 data/prices.json 讀取股價（由 GitHub Actions 定時更新）
// 不直接呼叫外部 API，避免 CORS 問題

let _priceCache = null; // 本次頁面載入的快取

async function loadPrices() {
  if (_priceCache) return _priceCache;
  try {
    const res = await fetch('data/prices.json?t=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    _priceCache = await res.json();
    return _priceCache;
  } catch(e) {
    console.warn('prices.json 讀取失敗:', e);
    return null;
  }
}

// 取得單一股票價格資訊
// 回傳 {price, prevClose, change, changePct, updated} 或 null
async function getPrice(ticker) {
  const data = await loadPrices();
  if (!data || !data.prices) return null;
  const info = data.prices[ticker];
  if (!info || !info.price) return null;
  return info;
}

// 取得 prices.json 的最後更新時間（台灣時間字串）
async function getPricesUpdatedTime() {
  const data = await loadPrices();
  if (!data || !data._updated) return null;
  // 格式化成 HH:MM
  const d = new Date(data._updated);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// 清除本次快取，強制下次重新讀取
function clearPriceCache() {
  _priceCache = null;
}
