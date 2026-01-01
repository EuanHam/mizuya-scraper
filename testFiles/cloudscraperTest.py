import cloudscraper
from bs4 import BeautifulSoup

scraper = cloudscraper.create_scraper()

url = "https://www.marukyu-koyamaen.co.jp/english/shop/products/catalog/matcha/principal"

print(f"Visiting {url}")

try:
    response = scraper.get(url, timeout=10)
    print(f"Response status: {response.status_code}\n")
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # find all products from principal page
    products = soup.find_all('li', class_='product')
    print(f"Total products found: {len(products)}\n")
    
    for i, product in enumerate(products, 1):
        # get title
        link = product.find('a', class_='woocommerce-loop-product__link')
        title = link.get('title') if link else 'N/A'
        product_url = link.get('href') if link else 'N/A'
        
        # stock status
        status = "❌ Out of Stock"
        if 'outofstock' not in product.get('class', []):
            status = "✅ In Stock"
        
        print(f"[{i}] {title}")
        print(f"    Status: {status}")
        print(f"    URL: {product_url}\n")

except Exception as e:
    print(f"Error: {e}")
