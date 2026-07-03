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
TICKERS = [
    '2317',   # 鴻海
    '2535',   # 達欣工
    '2890',   # 永豐金
    '2881',   # 富邦金
    '6239',   # 力成
    '00878',  # 國泰永續高股息
    '00724B', # 群益ESG投等債20+
    '5880',   # 合庫金
    '00881',  # 國泰台灣5G+
    '2303',   # 聯電
    '0056',   # 元大高股息
    '2882',   # 國泰金
]

def fetch_price(ticker):
    """抓取單一股票現價，回傳 (price, prev_close) 或 (None, None)"""
    symbol = ticker + '.TW'
    # 債券ETF用 TWO
    if ticker in ('00724B',):
        symbol = ticker + '.TWO'

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
        price = meta.get('regularMarketPrice') or meta.get('previousClose')
        prev  = meta.get('previousClose', price)
        return round(float(price), 2), round(float(prev), 2)
    except Exception as e:
        print(f'  {ticker} 失敗: {e}')
        # fallback: query2
        try:
            url2 = url.replace('query1', 'query2')
            req2 = urllib.request.Request(url2, headers=headers)
            with urllib.request.urlopen(req2, timeout=10) as resp2:
                data2 = json.loads(resp2.read().decode())
            meta2 = data2['chart']['result'][0]['meta']
            price2 = meta2.get('regularMarketPrice') or meta2.get('previousClose')
            prev2  = meta2.get('previousClose', price2)
            return round(float(price2), 2), round(float(prev2), 2)
        except Exception as e2:
            print(f'  {ticker} fallback 也失敗: {e2}')
            return None, None

def main():
    # 台灣時間 UTC+8
    tz_tw = timezone(timedelta(hours=8))
    now_tw = datetime.now(tz_tw)
    updated = now_tw.strftime('%Y-%m-%dT%H:%M:%S+08:00')

    print(f'開始抓取股價，時間：{updated}')
    results = {}
    ok, fail = 0, 0

    for ticker in TICKERS:
        print(f'  抓取 {ticker}...', end=' ')
        price, prev = fetch_price(ticker)
        if price is not None:
            change = round(price - prev, 2) if prev else 0
            change_pct = round(change / prev * 100, 2) if prev else 0
            results[ticker] = {
                'price': price,
                'prevClose': prev,
                'change': change,
                'changePct': change_pct,
                'updated': updated,
            }
            print(f'OK → {price}')
            ok += 1
        else:
            results[ticker] = {'price': None, 'updated': updated}
            print('FAIL')
            fail += 1

    # 加上整體更新時間
    output = {
        '_updated': updated,
        '_ok': ok,
        '_fail': fail,
        'prices': results,
    }

    with open('data/prices.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f'\n完成：{ok} 支成功，{fail} 支失敗')
    print(f'已寫入 data/prices.json')

if __name__ == '__main__':
    main()
