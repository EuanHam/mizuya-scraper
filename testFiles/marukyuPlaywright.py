from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    # Use non-headless 
    browser = p.chromium.launch(headless=False)
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 720}
    )
    page = context.new_page()
    
    page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/products/1171020c1")
    
    # Wait for Cloudflare challenge
    time.sleep(5)
    
    page.wait_for_load_state("load")

    product_name = page.locator("h1.product_title.entry-title").text_content()
    print(f"Product: {product_name}")
    
    out_of_stock = page.locator("p.stock.out-of-stock").count() > 0
    
    if out_of_stock:
        stock_text = page.locator("p.stock.out-of-stock").text_content()
        print(f"Status: OUT OF STOCK - {stock_text}")
    else:
        print("Status: IN STOCK")

    browser.close()