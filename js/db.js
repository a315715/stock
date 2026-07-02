// 資料存取層：唯一可以讀寫 localStorage 的地方
// 之後若改用 Firebase，只需要修改這個檔案
//
// 版本號機制：每次 defaultData.js 有更新，將 DATA_VERSION 加一
// 工具啟動時自動比對，版本不符就清除舊資料載入新預設值
// 使用者不需要手動清除 localStorage

const DATA_VERSION = 4; // 每次更新 defaultData.js 時 +1
const VERSION_KEY  = 'tstock_version';
const DB_KEY       = 'tstock_v2';

function loadDB(){
  try {
    const savedVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0');
    if(savedVersion < DATA_VERSION){
      // 版本過舊，自動清除，載入最新預設值
      localStorage.removeItem(DB_KEY);
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
      DB = JSON.parse(JSON.stringify(DEFAULT));
      console.log(`資料已更新至 v${DATA_VERSION}`);
    } else {
      const raw = localStorage.getItem(DB_KEY);
      DB = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT));
    }
  } catch(e) {
    DB = JSON.parse(JSON.stringify(DEFAULT));
  }
}

function saveDB(){
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
  } catch(e) {}
}

function getStock(t){ return DB.stocks[t]; }
