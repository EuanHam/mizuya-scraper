# Notes
### Vendor 1
[Marukyu koyamaen principle matcha](https://www.marukyu-koyamaen.co.jp/english/shop/products/catalog/matcha/principal) - english/shop/products/catalog/matcha/principle -> english/shop/products/1g36020c1 for Kiwami Choan for example
- Product page says "This product is currently out of stock and unavailable" if out of stock

- Matcha will be restocked randomly only during business hours (Mon to Fri, 9am to 5:30pm in Japan time)

Lucily I can use this as an anchor
```html
<h1 class="product_title entry-title">Yugen</h1>
```
```html
<p class="stock single-stock-status out-of-stock">This product is currently out of stock and unavailable.</p>
```
We also need to avoid the list at the bottom of the page linking to other matcha products in pagination:
```html
<li class="product product-type-variable status-publish outofstock last swiper-slide" id="item-340" style="width: 260px;"> <a class="woocommerce-loop-product__link" /li>
```

Used [this medium article](https://medium.com/@joerosborne/intro-to-web-scraping-build-your-first-scraper-in-5-minutes-1c36b5c4b110) to do an example scrape for content. But I got this instead:
![Challenge Screen](/Notes/Images/challengeScreen.png)

Turns out this is Cloudflare's challenge screen.

So we're pivoting to playwright so now we actually interact with the browser. First we aren't headless, used a realistic user-agent string, use a different viewport size, and use a sleep function to wait for the Cloudflare JS challenge to complete.

![Success!](/Notes/Images/success.png)

Using the anchors we got our first success screen with the product name as well as in stock status!