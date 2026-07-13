#!/usr/bin/env python3
"""
台股股價抓取腳本
- 在 GitHub Actions 伺服器端執行，不受瀏覽器 CORS 限制
- 資料來源：Yahoo Finance API
- 輸出：data/prices.json
"""

import json
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

# 持股清單（只需要現有庫存股的代號）
# 2026/07/13 修正：00724B 是舊代碼，群益ESG投等債20+ 正確代碼是 00937B（已跟 Alvin
# 確認）；00881（國泰台灣5G+）、2882（國泰金）已出清，從追蹤清單移除，避免抓不必要
# 的資料，也避免佔用 00937B 原本被漏掉的名額。
TICKERS = [
    '2317',   # 鴻海
    '2535',   # 達欣工
    '2890',   # 永豐金
    '2881',   # 富邦金
    '6239',   # 力成
    '00878',  # 國泰永續高股息
    '00937B', # 群益ESG投等債20+（修正：原本誤植為 00724B）
    '5880',   # 合庫金
    '2303',   # 聯電
    '0056',   # 元大高股息
]

# 債券 ETF 在 TPEx（櫃買）掛牌，symbol 要用 .TWO 而不是 .TW
BOND_ETF_TICKERS = ('00937B',)

def fetch_price(ticker):
    """抓取單一股票現價，回傳 (price, prev_close, source) 或 (None, None, None)。
    source 是診斷用欄位：'live'＝Yahoo 有回傳 regularMarketPrice（真的即時價）、
    'prevClose_fallback'＝Yahoo 沒回傳 regularMarketPrice，退回用昨收價頂替
    （這種情況下 price==prevClose，change/changePct 一定是 0，不代表今天真的平盤）。
    2026/07/13 新增：之前發現 changePct 全部顯示 0，追查後才知道是這個 fallback
    情況一直發生、但沒有任何紀錄可以確認，這次先加診斷欄位，下次排程跑完看
    log／prices.json 裡的 source 欄位，才能確認是 Yahoo 真的沒有即時資料
    （例如非交易時段），還是查詢方式本身有問題。
    """
    symbol = ticker + ('.TWO' if ticker in BOND_ETF_TICKERS else '.TW')

    url = f'https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d'
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        meta = data['chart']['result'][0]['meta']
        return _extract_price(meta)
    except Exception as e:
        print(f'  {ticker} 失敗: {e}')
        # fallback: query2
        try:
            url2 = url.replace('query1', 'query2')
            req2 = urllib.request.Request(url2, headers=headers)
            with urllib.request.urlopen(req2, timeout=10) as resp2:
                data2 = json.loads(resp2.read().decode())
            meta2 = data2['chart']['result'][0]['meta']
            return _extract_price(meta2)
        except Exception as e2:
            print(f'  {ticker} fallback 也失敗: {e2}')
            return None, None, None

def _extract_price(meta):
    live_price = meta.get('regularMarketPrice')
    prev = meta.get('previousClose')
    if live_price:
        source = 'live'
        price = live_price
    else:
        # Yahoo 沒給即時價，退回用昨收價頂替——這樣至少畫面上還有數字可顯示，
        # 但這個數字不是今天的即時價，change/changePct 會是 0，用 source 欄位
        # 標記起來，不要讓它看起來像「今天真的平盤」。
        source = 'prevClose_fallback'
        price = prev
    if price is None:
        raise ValueError('meta 裡連 regularMarketPrice 和 previousClose 都沒有')
    prev_final = prev if prev is not None else price
    return round(float(price), 2), round(float(prev_final), 2), source

def main():
    # 台灣時間 UTC+8
    tz_tw = timezone(timedelta(hours=8))
    now_tw = datetime.now(tz_tw)
    updated = now_tw.strftime('%Y-%m-%dT%H:%M:%S+08:00')

    print(f'開始抓取股價，時間：{updated}')
    results = {}
    ok, fail = 0, 0
    live_count, fallback_count = 0, 0

    for ticker in TICKERS:
        print(f'  抓取 {ticker}...', end=' ')
        price, prev, source = fetch_price(ticker)
        if price is not None:
            change = round(price - prev, 2) if prev else 0
            change_pct = round(change / prev * 100, 2) if prev else 0
            results[ticker] = {
                'price': price,
                'prevClose': prev,
                'change': change,
                'changePct': change_pct,
                'updated': updated,
                'source': source,  # 診斷欄位：'live' 或 'prevClose_fallback'，見 fetch_price() 說明
            }
            if source == 'live':
                live_count += 1
                print(f'OK（即時） → {price}')
            else:
                fallback_count += 1
                print(f'OK（無即時價，退回用昨收價） → {price}')
            ok += 1
        else:
            results[ticker] = {'price': None, 'updated': updated}
            print('FAIL')
            fail += 1

    # 加上整體更新時間；_liveCount/_fallbackCount 是這次新增的診斷統計，
    # 用來確認「regularMarketPrice 缺失」是不是每次都發生
    output = {
        '_updated': updated,
        '_ok': ok,
        '_fail': fail,
        '_liveCount': live_count,
        '_fallbackCount': fallback_count,
        'prices': results,
    }

    with open('data/prices.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f'\n完成：{ok} 支成功（{live_count} 即時／{fallback_count} 退回昨收價），{fail} 支失敗')
    if fallback_count > 0:
        print(f'⚠️ 有 {fallback_count} 支股票 Yahoo 沒回傳即時價（regularMarketPrice 缺失），'
              f'這幾支的 changePct 會是 0，不代表今天真的平盤')
    print(f'已寫入 data/prices.json')

if __name__ == '__main__':
    main()
