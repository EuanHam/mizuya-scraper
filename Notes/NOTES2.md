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

More admin API endpoints implemented like 
- api/admin/product/[id] - updates the product history
- api/admin/product/sync - syncs up all of the products

I made these endpoints so that the lambda function could invoke them when scraping the first and subsequent times.

I updated the lambda and ran it. Success! I went to mizuya-api.vercel.app/api/products (a handful, i know) and saw that all of the Marukyu tins were there with the "out of stock" labels

Now I went to event bridge to invoke the lambda twice a day: 2am and 2pm est. I used the cron notation for cron(0, 2/12, *, *, ?, *) EST.

![EventBridge](/Notes/Images/eventbridge.png)

It's currently Thursday, Jan 8, 2026. When I wake up tomorrow on Friday, I'll check the products endpoint and see if it worked out!

In the meantime though I need to figure out how to work out things like mailing as that's the next step. Some options
- Resend
- AWS SES
- Mailgun

Besides that I also have concerns on security--in terms of environment variables as well as well as rate limiting as well as preventing others from using POST or PATCH endpoints

In terms of emailing services now, I decided that AWS SES was the way to go. For something like Resend, it looks like easy setup but there's a max 3000 free emails per month and a max 100 emails per day on the free tier. The first paid tier is 20 dollars/month for an amount of emails I realistically won't reach.

However AWS SES is pay-as-you-go for $0.10/1000 emails outbound where an email is an incoming mail chunk or about 256 kb. I really only intend on having the email just say x vendor had a restock.

To test to begin with i'm going to have marukyu koyamaen and just have email notifications for when ANY of the products are back in stock. But for other configurations in the future that will have to change. 

I'm playing around with SES and managed to send an email from euanham05@gmail.com to my junk email

However, because of the AWS security features they prevent just anyone from sending emails to anyone without production access. I first realized when I was asked to put something into the sending domain and had nothing to show for that. I mean i can send emails between emails i get verified just to test but I want to deploy ASAP so I might as well get a domain.

So I'm going to hopefully get a free domain with freenom and put it on Cloudflare to manage DNS.

So I ended up buying mizuya-api.com from Cloudflare for just 10 dollars a year. I put the cname and a records into cloudflare and now the domain links to my website!

But I need to request production access. In terms of DNS stuff that's good. I just need to link my site and request access but I'll put some docs on the website before requesting so that it doesn't look to suspicious!