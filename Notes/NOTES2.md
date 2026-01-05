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
- vendor

vendor

- id
- name
- list of products

Now to make a mongo atlas cluster and write some read and post endpoints! also update the lambda function to interact with this. 