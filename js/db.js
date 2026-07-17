// 資料存取層：唯一可以讀寫 localStorage 的地方
// 之後若改用 Firebase，只需要修改這個檔案
//
// 兩種版本號，語意不同（見 Spec.md §6.1）：
// - DATA_VERSION：種子資料版本。開發者更新 defaultData.js 時 +1，
//   只在「使用者完全沒有自己的資料」時才會用到。
// - SCHEMA_VERSION：資料結構版本。使用者已有資料、但結構是舊格式時，
//   會觸發 migrate() 轉換既有資料，絕不清空使用者資料。

const DATA_VERSION   = 5;  // 每次更新 defaultData.js 的「內容」時 +1
const SCHEMA_VERSION = 1;  // 每次 Stock/Transaction 的「結構」有變動時 +1
const VERSION_KEY    = 'tstock_version';
const SCHEMA_KEY     = 'tstock_schema_version';
const DB_KEY         = 'tstock_v2';
const BACKUP_KEY     = 'tstock_v2_backup_pre_migration';
const BACKUP_META_KEY= 'tstock_backup_meta';
const THEME_KEY       = 'tstock_theme'; // v3.0：'dark'|'light'，跟 DB 資料本身無關，獨立存放

// ══ UUID ══════════════════════════════════════════════
// 優先使用瀏覽器原生 crypto.randomUUID()；不支援時退回 fallback，
// 仍產生標準格式的 UUID v4（僅隨機性來源不同，格式相容）。
function uuid(){
  if(typeof crypto!=='undefined' && typeof crypto.randomUUID==='function'){
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{
    const r = Math.random()*16|0;
    const v = c==='x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

// ══ 判斷資料是否為舊格式 ══════════════════════════════
// 舊格式特徵：任一 Stock 缺少 calcMode，或任一既有 Transaction 缺少 id。
function isLegacyFormat(data){
  if(!data || !data.stocks) return false;
  return Object.values(data.stocks).some(s=>{
    if(typeof s.calcMode==='undefined') return true;
    return (s.transactions||[]).some(t=>typeof t.id==='undefined');
  });
}

// ══ Migration ═════════════════════════════════════════
// 把舊格式資料轉換成新格式（Spec.md §6.2）。純函式：不讀寫 localStorage，
// 呼叫方負責備份、寫入、顯示提示。
function migrate(oldData){
  const errors=[];
  let newData;
  try{
    newData = JSON.parse(JSON.stringify(oldData)); // 深拷貝，不動原始物件
    const nowIso = new Date().toISOString();

    Object.keys(newData.stocks).forEach(ticker=>{
      const s = newData.stocks[ticker];
      if(typeof s.calcMode==='undefined') s.calcMode='manual';
      if(typeof s.openingBalanceAdjustment==='undefined') s.openingBalanceAdjustment=null;

      (s.dividends||[]).forEach(d=>{ if(typeof d.id==='undefined') d.id=uuid(); });

      const oldTxs = s.transactions||[];
      s.transactions = oldTxs
        .filter(t=>t.type!=='配息') // 配息不進 Transaction，只留在 dividends[]（Architecture §10）
        .map(t=>{
          const migratedNote = (t.note||'').includes('（Migration 補登時間）')
            ? t.note
            : (t.note||'') + '（Migration 補登時間）';
          return {
            id: t.id || uuid(),
            stockTicker: ticker,
            date: t.date,
            type: t.type,
            shares: t.shares,
            price: (typeof t.price==='undefined') ? null : t.price,
            amount: t.amount,
            note: typeof t.id==='undefined' ? migratedNote : (t.note||''), // 只有真的補登才加註記
            dividendRef: t.dividendRef || null,
            fee: typeof t.fee==='undefined' ? null : t.fee,
            tax: typeof t.tax==='undefined' ? null : t.tax,
            currency: t.currency || 'TWD',
            source: t.source || 'manual',
            createdAt: t.createdAt || nowIso,
            updatedAt: t.updatedAt || nowIso
          };
        });
    });
  }catch(e){
    return { success:false, data:null, errors:['Migration 過程發生例外：'+e.message] };
  }

  const validationErrors = validateMigration(oldData, newData);
  if(validationErrors.length){
    return { success:false, data:null, errors:validationErrors };
  }
  return { success:true, data:newData, errors:[] };
}

// ══ Migration 驗證（Spec.md §7） ══════════════════════
function validateMigration(oldData, newData){
  const errors=[];
  const oldTickers = Object.keys(oldData.stocks||{});
  const newTickers = Object.keys(newData.stocks||{});
  if(oldTickers.length !== newTickers.length){
    errors.push('股票數量不一致（舊：'+oldTickers.length+'，新：'+newTickers.length+'）');
  }

  oldTickers.forEach(ticker=>{
    const o = oldData.stocks[ticker], n = newData.stocks[ticker];
    if(!n){ errors.push(ticker+' 在新資料中消失'); return; }
    if(o.shares !== n.shares) errors.push(ticker+' 持股數不一致');
    if(o.avgCost !== n.avgCost) errors.push(ticker+' 成本均價不一致');
    if(o.totalCost !== n.totalCost) errors.push(ticker+' 總成本不一致');

    const oldNonDivCount = (o.transactions||[]).filter(t=>t.type!=='配息').length;
    const newCount = (n.transactions||[]).length;
    if(oldNonDivCount !== newCount){
      errors.push(ticker+' 交易筆數不一致（不含已捨棄的配息記錄，舊：'+oldNonDivCount+'，新：'+newCount+'）');
    }

    const oldDivSum = (o.dividends||[]).reduce((sum,d)=>sum+(d.amount||0),0);
    const newDivSum = (n.dividends||[]).reduce((sum,d)=>sum+(d.amount||0),0);
    if(oldDivSum !== newDivSum) errors.push(ticker+' 股利加總不一致');
  });

  const allIds = Object.values(newData.stocks).flatMap(s=>(s.transactions||[]).map(t=>t.id));
  if(new Set(allIds).size !== allIds.length){
    errors.push('存在重複的 Transaction ID');
  }

  try{
    JSON.parse(JSON.stringify(newData));
  }catch(e){
    errors.push('新資料無法序列化：'+e.message);
  }

  return errors;
}

// ══ 載入 ═════════════════════════════════════════════
// 回傳值供 index.html 決定要不要顯示升級中/完成/失敗的提示。
function loadDB(){
  try {
    const raw = localStorage.getItem(DB_KEY);

    if(!raw){
      // 全新使用者，沒有既有資料，不需要 Migration
      const savedVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0');
      DB = JSON.parse(JSON.stringify(DEFAULT));
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
      localStorage.setItem(SCHEMA_KEY, SCHEMA_VERSION);
      return { migrated:false };
    }

    const oldData = JSON.parse(raw);

    if(!isLegacyFormat(oldData)){
      // 已經是新格式，直接使用
      DB = oldData;
      return { migrated:false };
    }

    // 舊格式，需要 Migration
    if(!localStorage.getItem(BACKUP_KEY)){
      // 只保留最早的一份備份，避免多次執行 Migration 時備份被覆蓋成中間狀態
      localStorage.setItem(BACKUP_KEY, raw);
      localStorage.setItem(BACKUP_META_KEY, JSON.stringify({ backedUpAt: new Date().toISOString() }));
    }

    const result = migrate(oldData);
    if(result.success){
      DB = result.data;
      saveDB();
      localStorage.setItem(SCHEMA_KEY, SCHEMA_VERSION);
      return { migrated:true, success:true };
    } else {
      // 驗證失敗：完全不動 localStorage，繼續用舊格式資料運作
      console.error('Migration 驗證失敗：', result.errors);
      DB = oldData;
      return { migrated:true, success:false, errors:result.errors };
    }
  } catch(e) {
    console.error('loadDB 發生例外：', e);
    DB = JSON.parse(JSON.stringify(DEFAULT));
    return { migrated:false, success:false, errors:[e.message] };
  }
}

function saveDB(){
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
  } catch(e) {}
}

// ══ 還原（永久保留，Spec.md §6.4） ═══════════════════
function hasBackup(){
  return !!localStorage.getItem(BACKUP_KEY);
}
function getBackupMeta(){
  try{ return JSON.parse(localStorage.getItem(BACKUP_META_KEY)||'null'); }
  catch(e){ return null; }
}
function restoreFromBackup(){
  const backup = localStorage.getItem(BACKUP_KEY);
  if(!backup) return false;
  localStorage.setItem(DB_KEY, backup);
  localStorage.removeItem(SCHEMA_KEY);
  return true;
}

function getStock(t){ return DB.stocks[t]; }

// ══ 主題偏好（v3.0） ═══════════════════════════════════
// 跟 DB 資料本身無關（不是投資組合資料），但一樣走 localStorage，
// 所以還是放在 db.js 這個唯一允許讀寫 localStorage 的地方，維持既有規範。
// index.html 的 bootstrap script 是唯一的例外（見 index.html 開頭註解），
// 因為那段必須在 db.js 載入前就跑完，避免主題閃爍。
function getTheme(){
  try{ return localStorage.getItem(THEME_KEY)==='light' ? 'light' : 'dark'; }
  catch(e){ return 'dark'; }
}
function setTheme(theme){
  try{ localStorage.setItem(THEME_KEY, theme==='light'?'light':'dark'); }
  catch(e){}
}
