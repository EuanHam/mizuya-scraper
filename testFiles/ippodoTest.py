import requests
import json

products = [9241731104997, 9280769753317, 9241730842853, 9280765788389]
rockysProductsUrl = "https://ippodotea.com/products.json"

response = requests.get(rockysProductsUrl)
all_products = response.json()["products"]

for product_id in products:
    product = next((p for p in all_products if p["id"] == product_id), None)
    
    if product:
        print(f"\n{'='*60}")
        print(f"Product ID: {product['id']}")
        print(f"Name: {product['title']}")
        
        # Construct URL
        handle = product.get('handle', 'N/A')
        if handle != 'N/A':
            url = f"https://ippodotea.com/collections/matcha/products/{handle}"
            print(f"URL: {url}")
        
        if product.get("variants"):
            variant = product["variants"][0]
            print(f"\nVariant: {variant.get('title', 'N/A')}")
            print(f"Price: ${variant.get('price', 'N/A')}")
            print(f"Availability: {variant.get('available', 'N/A')}")
        print(f"{'='*60}")
    else:
        print(f"Product {product_id} not found")