import requests
import json

products = [9715651445050, 9774862401850, 8633348555066]
rockysProductsUrl = "https://www.rockysmatcha.com/products.json"

response = requests.get(rockysProductsUrl)
all_products = response.json()["products"]

for product_id in products:
    product = next((p for p in all_products if p["id"] == product_id), None)
    
    if product:
        print(f"\n{'='*60}")
        print(f"Product ID: {product['id']}")
        print(f"Name: {product['title']}")
        
        if product.get("variants"):
            variant = product["variants"][0]
            print(f"\nVariant: {variant.get('title', 'N/A')}")
            print(f"Price: ${variant.get('price', 'N/A')}")
            print(f"Availability: {variant.get('available', 'N/A')}")
        print(f"{'='*60}")
    else:
        print(f"Product {product_id} not found")