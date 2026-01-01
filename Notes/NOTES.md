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

Now we just need to turn this into a lambda!

Soooo we can't. Real engineering constraints start showing up. My budget is ideally 0. If the project turns too big that i start facing costs, that would be annoying for me but at least that means the project did a good job attracting people which is ultimately good for me. However, if I start incurring costs before that, then that's useless??? Here's why I need to pivot from chromium and playwright:
- Playwright + chromium exceeds Lambda's free tier
- Chromium cold start times add to runtime (and billing)
- Transitioning from twice a day to once an hour for anticipated restock hours for example may even triple costs
- I want to add scraping for other sites too which will 5-10x the cost

Solution:
I found out about this library called [Cloudscraper](https://pypi.org/project/cloudscraper/). It's relatively lightweight and it's also easy to use. The issue with the first time scraping was the Cloudflare challenge screen, but this library bypasses this. With this configured, the scraping is basically the same as using Requests.

I tried this locally and it worked. 

I converted this to a Lambda function and wrote a small bash script to configure easily.

Here're the results for Hojicha on Marukyu.

```Python
scraper = cloudscraper.create_scraper()
url = "marukyu-koyamaen.co.jp/.../matcha/principal"
print(f"Visiting {url}")
response = scraper.get(url, timeout=10)
```

![Lambda Success!](/Notes/Images/lambdaSuccess.png)