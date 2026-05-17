import json
import os
import cloudscraper
from bs4 import BeautifulSoup
from datetime import datetime
import requests

marukyuID = "6960443662b4343e0fb34ef7"
rockysID = "695bf7949571d57fd75e26eb"
ippodoID = "699f4b6f96376fdf35515c4a"
namiID = "699f4bb696376fdf35515c4c"
emailToggle = False  # Set to False to disable email notifications

def scrape_marukyu(scraper):
    """
    Scrapes Marukyu Koyamaen matcha products from their website.
    Returns list of products with title, status, and url.
    """
    url = "https://www.marukyu-koyamaen.co.jp/english/shop/products/catalog/matcha/principal"
    products_data = []
    
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
            
            products_data.append({
                "title": title,
                "status": status,
                "url": product_url,
                "vendor": "marukyu"
            })
    except Exception as e:
        print(f"Error scraping Marukyu: {str(e)}")
    
    return products_data


def fetch_rockys_products():
    """
    Fetches specific Rocky's matcha products from their products JSON endpoint.
    Returns list of products with title, price, availability, and id.
    """
    # Specific product IDs to track
    product_ids = [9715651445050, 9774862401850, 8633348555066]
    products_data = []
    
    try:
        response = requests.get("https://www.rockysmatcha.com/products.json", timeout=10)
        all_products = response.json()["products"]
        
        for product in all_products:
            # Only include products in our tracking list
            if product.get("id") not in product_ids:
                continue
            
            # Extract first variant for price and availability
            variant = product.get("variants", [{}])[0] if product.get("variants") else {}
            
            status = "in_stock" if variant.get("available", False) else "out_of_stock"
            
            products_data.append({
                "title": product.get("title", "N/A"),
                "status": status,
                "url": f"https://www.rockysmatcha.com/products/{product.get('handle', '')}",
                "price": variant.get("price", "N/A"),
                "product_id": product.get("id"),
                "vendor": "rockys"
            })
    except Exception as e:
        print(f"Error fetching Rocky's products: {str(e)}")
    
    return products_data


def fetch_ippodo_products():
    """
    Fetches specific Ippodo matcha products from their products JSON endpoint.
    Returns list of products with title, price, availability, and id.
    """
    # Specific product IDs to track
    product_ids = [9241731104997, 9280769753317, 9241730842853, 9280765788389]
    products_data = []
    
    try:
        response = requests.get("https://ippodotea.com/products.json", timeout=10)
        all_products = response.json()["products"]
        
        for product in all_products:
            # Only include products in our tracking list
            if product.get("id") not in product_ids:
                continue
            
            # Extract first variant for price and availability
            variant = product.get("variants", [{}])[0] if product.get("variants") else {}
            
            status = "in_stock" if variant.get("available", False) else "out_of_stock"
            
            products_data.append({
                "title": product.get("title", "N/A"),
                "status": status,
                "url": f"https://ippodotea.com/collections/matcha/products/{product.get('handle', '')}",
                "price": variant.get("price", "N/A"),
                "product_id": product.get("id"),
                "vendor": "ippodo"
            })
    except Exception as e:
        print(f"Error fetching Ippodo products: {str(e)}")
    
    return products_data


def fetch_nami_products():
    """
    Fetches specific Nami matcha products from their products JSON endpoint.
    Returns list of products with title, price, availability, and id.
    """
    # Specific product IDs to track
    product_ids = [9982687346980, 9386575069476, 10087083442468, 10038606201124, 9476250730788]
    products_data = []
    
    try:
        response = requests.get("https://namimatcha.com/products.json", timeout=10)
        all_products = response.json()["products"]
        
        for product in all_products:
            # Only include products in our tracking list
            if product.get("id") not in product_ids:
                continue
            
            # Extract first variant for price and availability
            variant = product.get("variants", [{}])[0] if product.get("variants") else {}
            
            status = "in_stock" if variant.get("available", False) else "out_of_stock"
            
            products_data.append({
                "title": product.get("title", "N/A"),
                "status": status,
                "url": f"https://namimatcha.com/products/{product.get('handle', '')}",
                "price": variant.get("price", "N/A"),
                "product_id": product.get("id"),
                "vendor": "nami"
            })
    except Exception as e:
        print(f"Error fetching Nami products: {str(e)}")
    
    return products_data


def lambda_handler(event, context):
    """
    Scrapes Marukyu Koyamaen and fetches products from Rocky's, Ippodo, and Nami, then syncs to the API.
    """
    scraper = cloudscraper.create_scraper()
    
    # configure from env 
    api_endpoint = os.environ.get("API_ENDPOINT", "https://mizuya-api.com/api/admin/product/sync")
    notify_endpoint = os.environ.get("NOTIFY_ENDPOINT", "https://mizuya-api.com/api/admin/product/notify")
    
    results = {
        "timestamp": datetime.utcnow().isoformat(),
        "marukyu_products": [],
        "rockys_products": []
    }
    
    try:
        # Scrape Marukyu
        marukyu_products = scrape_marukyu(scraper)
        results["marukyu_products"] = marukyu_products
        
        # Fetch Rocky's products
        rockys_products = fetch_rockys_products()
        results["rockys_products"] = rockys_products
        
        # Fetch Ippodo products
        ippodo_products = fetch_ippodo_products()
        results["ippodo_products"] = ippodo_products
        
        # Fetch Nami products
        nami_products = fetch_nami_products()
        results["nami_products"] = nami_products
        
        # Sync Marukyu products
        marukyu_sync_payload = {
            "vendorId": marukyuID,
            "products": marukyu_products
        }
        marukyu_sync_response = requests.post(
            api_endpoint,
            json=marukyu_sync_payload,
            timeout=15
        )
        
        # Sync Rocky's products
        rockys_sync_payload = {
            "vendorId": rockysID,
            "products": rockys_products
        }
        rockys_sync_response = requests.post(
            api_endpoint,
            json=rockys_sync_payload,
            timeout=15
        )
        
        # Sync Ippodo products
        ippodo_sync_payload = {
            "vendorId": ippodoID,
            "products": ippodo_products
        }
        ippodo_sync_response = requests.post(
            api_endpoint,
            json=ippodo_sync_payload,
            timeout=15
        )
        
        # Sync Nami products
        nami_sync_payload = {
            "vendorId": namiID,
            "products": nami_products
        }
        nami_sync_response = requests.post(
            api_endpoint,
            json=nami_sync_payload,
            timeout=15
        )
        
        # Check all responses
        marukyu_success = marukyu_sync_response.status_code == 200
        rockys_success = rockys_sync_response.status_code == 200
        ippodo_success = ippodo_sync_response.status_code == 200
        nami_success = nami_sync_response.status_code == 200
        
        if marukyu_success and rockys_success and ippodo_success and nami_success:
            marukyu_result = marukyu_sync_response.json()
            rockys_result = rockys_sync_response.json()
            ippodo_result = ippodo_sync_response.json()
            nami_result = nami_sync_response.json()
            
            # Combine all products for notification
            all_products = marukyu_products + rockys_products + ippodo_products + nami_products
            in_stock_count = sum(1 for p in all_products if p["status"] == "in_stock")
            
            # If products are in stock, send notifications (if emailToggle is enabled)
            notify_status = None
            notify_body = None
            if in_stock_count > 0 and emailToggle:
                try:
                    in_stock_products = [p for p in all_products if p["status"] == "in_stock"]
                    notify_response = requests.post(
                        notify_endpoint,
                        json={"products": in_stock_products},
                        timeout=15
                    )
                    notify_status = notify_response.status_code
                    notify_body = notify_response.json() if notify_response.status_code == 200 else notify_response.text
                except Exception as notify_error:
                    notify_status = 500
                    notify_body = str(notify_error)
            
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "success": True,
                    "marukyu_count": len(marukyu_products),
                    "rockys_count": len(rockys_products),
                    "ippodo_count": len(ippodo_products),
                    "nami_count": len(nami_products),
                    "total_count": len(all_products),
                    "in_stock_count": in_stock_count,
                    "marukyu_sync_result": marukyu_result,
                    "rockys_sync_result": rockys_result,
                    "ippodo_sync_result": ippodo_result,
                    "nami_sync_result": nami_result,
                    "notify_status": notify_status,
                    "notify_response": notify_body,
                    "scrape_data": results
                }, ensure_ascii=False)
            }
        else:
            errors = []
            if not marukyu_success:
                errors.append(f"Marukyu sync failed with status {marukyu_sync_response.status_code}: {marukyu_sync_response.text}")
            if not rockys_success:
                errors.append(f"Rocky's sync failed with status {rockys_sync_response.status_code}: {rockys_sync_response.text}")
            if not ippodo_success:
                errors.append(f"Ippodo sync failed with status {ippodo_sync_response.status_code}: {ippodo_sync_response.text}")
            if not nami_success:
                errors.append(f"Nami sync failed with status {nami_sync_response.status_code}: {nami_sync_response.text}")
            
            return {
                "statusCode": 502,
                "body": json.dumps({
                    "success": False,
                    "error": "One or more vendor syncs failed",
                    "errors": errors
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