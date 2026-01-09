import json
import os
import cloudscraper
from bs4 import BeautifulSoup
from datetime import datetime
import requests

def lambda_handler(event, context):
    """
    Scrapes Marukyu Koyamaen matcha products and syncs to the API.
    """
    scraper = cloudscraper.create_scraper()
    url = "https://www.marukyu-koyamaen.co.jp/english/shop/products/catalog/matcha/principal"
    
    # configure from env 
    api_endpoint = os.environ.get("API_ENDPOINT", "https://mizuya-api.vercel.app/api/admin/product/sync")
    vendor_id = os.environ.get("VENDOR_ID")
    
    if not vendor_id:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "success": False,
                "error": "VENDOR_ID environment variable not set"
            })
        }
    
    results = {
        "timestamp": datetime.utcnow().isoformat(),
        "url": url,
        "products": []
    }
    
    try:
        # scrape the website
        response = scraper.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        products = soup.find_all('li', class_='product')
        
        # extract product data
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
        
        # sync to the API
        sync_payload = {
            "vendorId": vendor_id,
            "products": results["products"]
        }
        
        sync_response = requests.post(
            api_endpoint,
            json=sync_payload,
            timeout=15
        )
        
        if sync_response.status_code == 200:
            sync_result = sync_response.json()
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "success": True,
                    "scrape_count": len(products),
                    "sync_result": sync_result,
                    "scrape_data": results
                }, ensure_ascii=False)
            }
        else:
            return {
                "statusCode": 502,
                "body": json.dumps({
                    "success": False,
                    "error": f"API sync failed with status {sync_response.status_code}",
                    "api_response": sync_response.text
                })
            }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "success": False,
                "error": str(e),
                "error_type": type(e).__name__
            })
        }