import cloudscraper
from bs4 import BeautifulSoup

# Create a scraper instance that bypasses Cloudflare
scraper = cloudscraper.create_scraper()

url = "https://www.marukyu-koyamaen.co.jp/english/shop/products/catalog/green-tea/houjicha"

print(f"Visiting {url}")

try:
    response = scraper.get(url, timeout=10)
    print(f"Response status: {response.status_code}\n")
    
    # Parse the HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all product items
    products = soup.find_all('li', class_='product')
    print(f"Total products found: {len(products)}\n")
    
    for i, product in enumerate(products, 1):
        # Get product title
        link = product.find('a', class_='woocommerce-loop-product__link')
        title = link.get('title') if link else 'N/A'
        product_url = link.get('href') if link else 'N/A'
        
        # Check stock status
        status = "❌ Out of Stock"
        if 'outofstock' not in product.get('class', []):
            status = "✅ In Stock"
        
        print(f"[{i}] {title}")
        print(f"    Status: {status}")
        print(f"    URL: {product_url}\n")

except Exception as e:
    print(f"Error: {e}")
