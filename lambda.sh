mkdir tea-scraper-lambda
cd tea-scraper-lambda

# depencendies installed
pip install cloudscraper beautifulsoup4 -t .

# create lambda_function.py
cat > lambda_function.py << 'EOF'
import json
import cloudscraper
from bs4 import BeautifulSoup
from datetime import datetime

def lambda_handler(event, context):
    scraper = cloudscraper.create_scraper()
    url = "https://www.marukyu-koyamaen.co.jp/english/shop/products/catalog/matcha/principal"
    
    results = {
        "timestamp": datetime.utcnow().isoformat(),
        "url": url,
        "products": []
    }
    
    try:
        response = scraper.get(url, timeout=10)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        products = soup.find_all('li', class_='product')
        
        for product in products:
            link = product.find('a', class_='woocommerce-loop-product__link')
            title = link.get('title') if link else 'N/A'
            product_url = link.get('href') if link else 'N/A'
            
            status = "out_of_stock"
            if 'outofstock' not in product.get('class', []):
                status = "in_stock"
            
            results["products"].append({
                "title": title,
                "status": status,
                "url": product_url
            })
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "success": True,
                "total_products": len(products),
                "data": results
            }, ensure_ascii=False)
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "success": False,
                "error": str(e)
            })
        }
EOF

# zip this and upload to lambda
zip -r tea-scraper.zip .