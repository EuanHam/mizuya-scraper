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
    api_endpoint = os.environ.get("API_ENDPOINT", "https://mizuya-api.com/api/admin/product/sync")
    notify_endpoint = os.environ.get("NOTIFY_ENDPOINT", "https://mizuya-api.com/api/admin/product/notify")
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
        in_stock_count = 0
        for product in products:
            link = product.find('a', class_='woocommerce-loop-product__link')
            title = link.get('title') if link else 'N/A'
            product_url = link.get('href') if link else 'N/A'
            
            status = "out_of_stock"
            if 'outofstock' not in product.get('class', []):
                status = "in_stock"
                in_stock_count += 1
            
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
            
            # If products are in stock, send notifications
            if in_stock_count > 0:
                try:
                    notify_response = requests.post(
                        notify_endpoint,
                        timeout=15
                    )
                    notify_status = notify_response.status_code
                    notify_body = notify_response.json() if notify_response.status_code == 200 else notify_response.text
                except Exception as notify_error:
                    notify_status = 500
                    notify_body = str(notify_error)
            else:
                notify_status = None
                notify_body = None
            
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "success": True,
                    "scrape_count": len(products),
                    "in_stock_count": in_stock_count,
                    "sync_result": sync_result,
                    "notify_status": notify_status,
                    "notify_response": notify_body,
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