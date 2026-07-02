// 預設資料：初次使用或清除 localStorage 後的起始持股資料
// 股利來源：股利整合_三家券商.xlsx（101筆，2019~2026/6）
// 持倉來源：全持股交易明細總整合.xlsx
// 鴻海2023~2025股利使用集保實際入帳總額（最權威數字）
// 更新日期：2026/07/01

const DEFAULT = {stocks:{

  // ── 鴻海 2317 ────────────────────────────────────────
  '2317':{
    ticker:'2317', name:'鴻海精密', exchange:'TSE',
    shares:156550, avgCost:119.36, totalCost:18686173, buyAvg:114.55,
    brokers:[
      {name:'元大證券',      shares:5400,  avg:106.84, cost:576920},
      {name:'國泰證券',      shares:40402, avg:115.47, cost:4665231},
      {name:'日盛(內湖)',    shares:33000, avg:102.56, cost:3486953},
      {name:'永豐金證(原)',  shares:4110,  avg:101.41, cost:416812},
      {name:'永豐金證(內湖)',shares:30800, avg:124.71, cost:3841053},
      {name:'統一證券',      shares:38838, avg:127.72, cost:5216019},
      {name:'富邦證券',      shares:4000,  avg:120.80, cost:483185},
    ],
    transactions:[],
    dividends:[
      // 2020~2022：集保無資料，用對帳單記錄
      {year:2020, date:'2020-07-23', cash:4.2,  stock:0, shares:4000,  amount:16800,  note:'日盛/富邦'},
      {year:2021, date:'2021-07-22', cash:4.0,  stock:0, shares:10250, amount:41000,  note:'日盛/富邦'},
      {year:2022, date:'2022-07-04', cash:5.2,  stock:0, shares:10340, amount:53768,  note:'日盛/富邦'},
      // 2023~2025：集保實際入帳總額（含所有券商，最終正確數字）
      {year:2023, date:'2023-07-28', cash:5.3,       stock:0, shares:57753, amount:306092, note:'集保實際入帳（全券商）'},
      {year:2024, date:'2024-07-02', cash:5.4,       stock:0, shares:123340, amount:666034, note:'集保實際入帳（全券商）'},
      {year:2025, date:'2025-07-02', cash:5.799984,  stock:0, shares:155075, amount:899436, note:'集保實際入帳（全券商）'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 達欣工 2535 ──────────────────────────────────────
  '2535':{
    ticker:'2535', name:'達欣工', exchange:'TSE',
    shares:9103, avgCost:46.5, totalCost:423317, buyAvg:46.5,
    brokers:[{name:'國泰證券', shares:9103, avg:46.5, cost:423317}],
    transactions:[],
    dividends:[
      {year:2019, date:'2019-07-18', cash:1.6211, stock:0, shares:1000, amount:1621,  note:'日盛/富邦'},
      {year:2024, date:'2024-04-11', cash:3.0,    stock:0, shares:7693, amount:23079, note:'國泰'},
      {year:2025, date:'2025-04-01', cash:3.75,   stock:0, shares:9003, amount:33761, note:'國泰'},
      {year:2026, date:'2026-04-09', cash:4.6,    stock:0, shares:9103, amount:41873, note:'國泰'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 永豐金 2890 ──────────────────────────────────────
  '2890':{
    ticker:'2890', name:'永豐金', exchange:'TSE',
    shares:17899, avgCost:19.88, totalCost:355648, buyAvg:19.88,
    brokers:[
      {name:'國泰證券',     shares:14799, avg:20.52, cost:303692},
      {name:'永豐金證(原)', shares:3100,  avg:15.31, cost:47456},
    ],
    transactions:[],
    dividends:[
      {year:2023, date:'2023-08-09', cash:0.6,  stock:0, shares:3431,  amount:2059,  note:'國泰'},
      {year:2024, date:'2024-08-22', cash:0.75, stock:0, shares:14071, amount:10553, note:'國泰'},
      {year:2025, date:'2025-08-21', cash:0.91, stock:0, shares:18356, amount:16703, note:'國泰'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 富邦金 2881 ──────────────────────────────────────
  '2881':{
    ticker:'2881', name:'富邦金', exchange:'TSE',
    shares:4007, avgCost:65.35, totalCost:261743, buyAvg:65.35,
    brokers:[
      {name:'國泰證券',     shares:3877, avg:65.95, cost:257003},
      {name:'永豐金證(原)', shares:130,  avg:56.46, cost:7340},
    ],
    transactions:[],
    dividends:[
      {year:2023, date:'2023-07-20', cash:1.5,  stock:0,   shares:792,  amount:1188,  note:'國泰'},
      {year:2023, date:'2023-09-04', cash:0,    stock:44,  shares:882,  amount:0,     note:'除權配股'},
      {year:2024, date:'2024-07-19', cash:2.5,  stock:0,   shares:3470, amount:8675,  note:'國泰'},
      {year:2024, date:'2024-09-09', cash:0.5,  stock:174, shares:3492, amount:0,     note:'除權配股'},
      {year:2025, date:'2025-07-01', cash:4.25, stock:0,   shares:4225, amount:17956, note:'國泰'},
      {year:2025, date:'2025-09-25', cash:0.25, stock:105, shares:4225, amount:0,     note:'除權配股'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 力成 6239 ────────────────────────────────────────
  '6239':{
    ticker:'6239', name:'力成', exchange:'TSE',
    shares:2550, avgCost:107.26, totalCost:273507, buyAvg:107.26,
    brokers:[
      {name:'國泰證券',     shares:910,  avg:137.63, cost:125243},
      {name:'永豐金證(原)', shares:2140, avg:92.46,  cost:197873},
    ],
    transactions:[],
    dividends:[
      {year:2019, date:'2019-08-01', cash:4.8, stock:0, shares:2000, amount:9600,  note:'日盛/富邦'},
      {year:2023, date:'2023-08-01', cash:7.0, stock:0, shares:2410, amount:16870, note:'國泰'},
      {year:2024, date:'2024-08-01', cash:7.0, stock:0, shares:410,  amount:2870,  note:'國泰'},
      {year:2025, date:'2025-07-31', cash:7.0, stock:0, shares:1000, amount:7000,  note:'國泰'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 國泰永續高股息 00878 ─────────────────────────────
  '00878':{
    ticker:'00878', name:'國泰永續高股息', exchange:'TSE',
    shares:5000, avgCost:18.21, totalCost:91061, buyAvg:18.21,
    brokers:[{name:'永豐金證(原)', shares:5000, avg:18.21, cost:91061}],
    transactions:[],
    dividends:[
      {year:2023, date:'2023-05-17', cash:0.27, stock:0, shares:5000, amount:1350, note:''},
      {year:2023, date:'2023-08-16', cash:0.35, stock:0, shares:5000, amount:1750, note:''},
      {year:2023, date:'2023-11-16', cash:0.35, stock:0, shares:5000, amount:1750, note:''},
      {year:2024, date:'2024-02-27', cash:0.4,  stock:0, shares:5000, amount:2000, note:''},
      {year:2024, date:'2024-05-17', cash:0.51, stock:0, shares:5000, amount:2550, note:''},
      {year:2024, date:'2024-08-16', cash:0.55, stock:0, shares:5000, amount:2750, note:''},
      {year:2024, date:'2024-11-18', cash:0.55, stock:0, shares:5000, amount:2750, note:''},
      {year:2025, date:'2025-02-20', cash:0.5,  stock:0, shares:5000, amount:2500, note:''},
      {year:2025, date:'2025-05-19', cash:0.47, stock:0, shares:5000, amount:2350, note:''},
      {year:2025, date:'2025-08-18', cash:0.4,  stock:0, shares:5000, amount:2000, note:''},
      {year:2025, date:'2025-11-18', cash:0.4,  stock:0, shares:5000, amount:2000, note:''},
      {year:2026, date:'2026-02-26', cash:0.42, stock:0, shares:5000, amount:2100, note:''},
      {year:2026, date:'2026-05-19', cash:0.66, stock:0, shares:5000, amount:3300, note:''},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 群益ESG投等債20+ 00724B（代號00937B在國泰） ──────
  '00724B':{
    ticker:'00724B', name:'群益ESG投等債20+', exchange:'TSE',
    shares:6000, avgCost:15.96, totalCost:351858, buyAvg:15.96,
    brokers:[{name:'國泰證券', shares:6000, avg:15.96, cost:351858}],
    transactions:[],
    dividends:[
      {year:2024, date:'2024-04-18', cash:0.084, stock:0, shares:1127,  amount:95,   note:''},
      {year:2024, date:'2024-05-17', cash:0.084, stock:0, shares:2252,  amount:189,  note:''},
      {year:2024, date:'2024-06-24', cash:0.084, stock:0, shares:3376,  amount:284,  note:''},
      {year:2024, date:'2024-07-19', cash:0.084, stock:0, shares:5376,  amount:452,  note:''},
      {year:2024, date:'2024-08-21', cash:0.082, stock:0, shares:7145,  amount:586,  note:''},
      {year:2024, date:'2024-09-23', cash:0.082, stock:0, shares:10628, amount:871,  note:''},
      {year:2024, date:'2024-10-22', cash:0.082, stock:0, shares:14491, amount:1188, note:''},
      {year:2024, date:'2024-11-21', cash:0.082, stock:0, shares:18169, amount:1490, note:''},
      {year:2024, date:'2024-12-20', cash:0.082, stock:0, shares:18889, amount:1549, note:''},
      {year:2025, date:'2025-01-22', cash:0.082, stock:0, shares:21979, amount:1802, note:''},
      {year:2025, date:'2025-02-18', cash:0.082, stock:0, shares:22042, amount:1807, note:''},
      {year:2025, date:'2025-03-18', cash:0.08,  stock:0, shares:22042, amount:1763, note:''},
      {year:2025, date:'2025-04-21', cash:0.08,  stock:0, shares:22042, amount:1763, note:''},
      {year:2025, date:'2025-05-19', cash:0.077, stock:0, shares:22042, amount:1697, note:''},
      {year:2025, date:'2025-06-17', cash:0.077, stock:0, shares:22042, amount:1697, note:''},
      {year:2025, date:'2025-07-16', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2025, date:'2025-08-18', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2025, date:'2025-09-16', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2025, date:'2025-10-20', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2025, date:'2025-11-18', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2025, date:'2025-12-16', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2026, date:'2026-01-20', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2026, date:'2026-02-26', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2026, date:'2026-03-17', cash:0.072, stock:0, shares:20000, amount:1440, note:''},
      {year:2026, date:'2026-04-20', cash:0.072, stock:0, shares:14000, amount:1008, note:''},
      {year:2026, date:'2026-05-19', cash:0.072, stock:0, shares:14000, amount:1008, note:''},
      {year:2026, date:'2026-06-16', cash:0.072, stock:0, shares:6000,  amount:432,  note:''},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 合庫金 5880 ──────────────────────────────────────
  '5880':{
    ticker:'5880', name:'合庫金', exchange:'TSE',
    shares:1520, avgCost:26.16, totalCost:39763, buyAvg:26.16,
    brokers:[
      {name:'永豐金證(原)', shares:4000,  avg:26.16, cost:104640},
      {name:'國泰證券',     shares:-2480, avg:26.16, cost:-64877},
    ],
    transactions:[],
    dividends:[
      {year:2023, date:'2023-08-09', cash:0.5,  stock:206, shares:4120, amount:2060, note:'國泰（除權息）'},
      {year:2024, date:'2024-08-14', cash:0.65, stock:154, shares:4426, amount:2877, note:'國泰（除權息）'},
      {year:2025, date:'2025-08-13', cash:0.7,  stock:90,  shares:3000, amount:2100, note:'國泰（除權息）'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 國泰台灣5G+ 00881 ────────────────────────────────
  '00881':{
    ticker:'00881', name:'國泰台灣5G+', exchange:'TSE',
    shares:4000, avgCost:15.0, totalCost:60000, buyAvg:15.0,
    brokers:[
      {name:'日盛(內湖)',   shares:1000, avg:15.0, cost:15000},
      {name:'永豐金證(原)', shares:3000, avg:15.0, cost:45000},
    ],
    transactions:[],
    dividends:[
      {year:2021, date:'2021-08-17', cash:0.54, stock:0, shares:1000, amount:540,  note:'日盛/富邦'},
      {year:2022, date:'2022-01-18', cash:0.59, stock:0, shares:1000, amount:590,  note:'日盛/富邦'},
      {year:2022, date:'2022-08-16', cash:0.26, stock:0, shares:1000, amount:260,  note:'日盛/富邦'},
      {year:2023, date:'2023-01-30', cash:0.35, stock:0, shares:1000, amount:350,  note:'日盛/富邦'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 聯電 2303 ────────────────────────────────────────
  '2303':{
    ticker:'2303', name:'聯電', exchange:'TSE',
    shares:1000, avgCost:57.48, totalCost:57481, buyAvg:57.48,
    brokers:[{name:'永豐金證(原)', shares:1000, avg:57.48, cost:57481}],
    transactions:[],
    dividends:[
      {year:2023, date:'2023-06-27', cash:3.6004, stock:0, shares:1000, amount:3600, note:'國泰'},
      {year:2024, date:'2024-07-02', cash:3.0001, stock:0, shares:1000, amount:3000, note:'國泰'},
      {year:2025, date:'2025-06-24', cash:2.8502, stock:0, shares:1000, amount:2850, note:'國泰'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 元大高股息 0056 ──────────────────────────────────
  '0056':{
    ticker:'0056', name:'元大高股息', exchange:'TSE',
    shares:1003, avgCost:26.5, totalCost:26580, buyAvg:26.5,
    brokers:[
      {name:'日盛(內湖)', shares:1000, avg:26.5,  cost:26550},
      {name:'統一證券',   shares:3,    avg:28.27, cost:85},
    ],
    transactions:[],
    dividends:[
      {year:2019, date:'2019-10-23', cash:1.8, stock:0, shares:304,  amount:547,  note:'日盛/富邦'},
      {year:2020, date:'2020-10-28', cash:1.6, stock:0, shares:304,  amount:486,  note:'日盛/富邦'},
      {year:2021, date:'2021-10-22', cash:1.8, stock:0, shares:304,  amount:547,  note:'日盛/富邦'},
      {year:2022, date:'2022-10-19', cash:2.1, stock:0, shares:1000, amount:2100, note:'日盛/富邦'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

  // ── 國泰金 2882 ──────────────────────────────────────
  '2882':{
    ticker:'2882', name:'國泰金', exchange:'TSE',
    shares:700, avgCost:41.85, totalCost:29295, buyAvg:41.85,
    brokers:[
      {name:'永豐金證(原)', shares:700,  avg:41.85, cost:29295},
      {name:'國泰證券',     shares:-840, avg:26.16, cost:-21974},
    ],
    transactions:[],
    dividends:[
      {year:2023, date:'2023-06-28', cash:0.9, stock:0, shares:1000, amount:900,  note:'國泰（含匯撥）'},
      {year:2024, date:'2024-07-01', cash:2.0, stock:0, shares:1000, amount:2000, note:'國泰（含匯撥）'},
      {year:2025, date:'2025-06-30', cash:3.5, stock:0, shares:1000, amount:3500, note:'國泰（含匯撥）'},
    ],
    lastPrice:null, lastPriceTime:null,
  },

}};

// ══ 已結清持股 ════════════════════════════════════════
// 格式：buyCost（買入總成本，負值）、sellIncome（賣出總收入）、dividends（期間股利）
// realizedPnl = sellIncome + buyCost + dividends
const CLOSED_STOCKS = [
  {ticker:'1101',  name:'台泥',           period:'2021~2024',  buyCost:-163117, sellIncome:119216, dividends:9084,  note:'日盛+統一'},
  {ticker:'2002',  name:'中鋼',           period:'2017~2018',  buyCost:-25185,  sellIncome:25090,  dividends:0,     note:'日盛'},
  {ticker:'3323',  name:'加百裕',         period:'2016~2017',  buyCost:-59934,  sellIncome:66407,  dividends:0,     note:'日盛'},
  {ticker:'2103',  name:'台橡',           period:'2017~2019',  buyCost:-71251,  sellIncome:48685,  dividends:1960,  note:'日盛'},
  {ticker:'8088',  name:'品安',           period:'2017~2019',  buyCost:-22732,  sellIncome:23198,  dividends:440,   note:'日盛'},
  {ticker:'3625',  name:'西勝',           period:'2017~2019',  buyCost:-40257,  sellIncome:21655,  dividends:1000,  note:'日盛'},
  {ticker:'3231',  name:'緯創',           period:'2017~2019',  buyCost:-53776,  sellIncome:54889,  dividends:1575,  note:'日盛'},
  {ticker:'2888',  name:'新光金',         period:'2018~2019',  buyCost:-24132,  sellIncome:22028,  dividends:202,   note:'日盛'},
  {ticker:'3022',  name:'威強電',         period:'2016~2017',  buyCost:-45014,  sellIncome:46744,  dividends:0,     note:'日盛'},
  {ticker:'2353',  name:'宏碁',           period:'2018',       buyCost:-24534,  sellIncome:25338,  dividends:0,     note:'日盛'},
  {ticker:'1504',  name:'東元',           period:'2017',       buyCost:-28640,  sellIncome:28475,  dividends:0,     note:'日盛'},
  {ticker:'2404',  name:'漢唐',           period:'2017~2018',  buyCost:-67295,  sellIncome:54957,  dividends:0,     note:'日盛'},
  {ticker:'6532',  name:'瑞耘',           period:'2016~2017',  buyCost:-31494,  sellIncome:26832,  dividends:0,     note:'日盛'},
  {ticker:'1216',  name:'統一',           period:'2017',       buyCost:-61086,  sellIncome:64713,  dividends:0,     note:'日盛'},
  {ticker:'8358',  name:'金居',           period:'2017',       buyCost:-40858,  sellIncome:43209,  dividends:0,     note:'日盛'},
  {ticker:'6154',  name:'順發',           period:'2016~2017',  buyCost:-16573,  sellIncome:17225,  dividends:0,     note:'日盛'},
  {ticker:'00915', name:'國泰台灣科技龍頭', period:'2023',      buyCost:0,       sellIncome:59932,  dividends:0,     note:'匯撥後賣出'},
  {ticker:'00687B',name:'國泰20年美債',   period:'2024~2025',  buyCost:-75983,  sellIncome:65053,  dividends:3764,  note:'國泰'},
  {ticker:'00720B',name:'元大投資級公司債', period:'2023~2024', buyCost:-71347,  sellIncome:82062,  dividends:3301,  note:'國泰'},
  {ticker:'00725B',name:'國泰投資級公司債', period:'2024',      buyCost:-57320,  sellIncome:84986,  dividends:1927,  note:'國泰'},
];
