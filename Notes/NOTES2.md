Schema brainstorming:

at the minimum we want products and vendors. there will be users later, but for the bare minimum for the API I think these 2 should suffice

actually, even if i have users in the future i'm not even sure if they would need to sign in. but also having a being like oh "enter your email for this specific product to get matcha" but users can put other people's emails?! so i don't know how i feel about that. also logging in also allows the user to access at any point all the vendors and products they are "subscribed to"

for the subscription even, how would that work. Lets say someones subscribed to aorashi for instance. it's currently out of stock but then gets in stock again. after that are they off of the list? or should they stay on. I guess it depends on whether they got the matcha from the first notification as well as if they want to continue. I guess I'll have this be a user togglable thing. additionally in the email there should be an unsubscribe button. that unsubscribes from everything on the site. for specific products, interact with the dashboard?

anywho schema!

product
- id
- name
- most recent price
- most recent date
- most recent availability
- history - tuple of (date, availability, price)
- link (to product)
- link (to image)
- vendor

vendor

- id
- name
- list of products
- link (to site)
- link (to logo image)

Now to make a mongo atlas cluster and write some read and post endpoints! also update the lambda function to interact with this. 

There's probably a lot of things to do with the actual API but I'm just gonna write stuff for interacting with product/vendor like obvious GET and POST endpoints

Luckily doing this is pretty easy (thanks bits of good dev bootcamp)

Here's a postman result for a 200 with a sample body for Rocky's

![Post request success](/Notes/images/postSuccess.png)

After this I went to the Marukyu website and actually came across this:

![Random stock](/Notes/images/randomStock.png)

Aorashi actually in stock!? But I decided not to buy. 

Two reasons
- I still have my Hatoya matcha (an a little bit of a Rocky's tin)
- Something with my ego. I want to earn my chance to get the Aorashi

Anywho, besides those GET and POST endpoints I need to also have PATCH endpoints to easily update product availability/price history

For the MVP a final POST /api/scrape endpoint might be necessary for EventBridge to call to trigger the lambda. Not entirely sure about this yet