# mizuya
This is Mizuya, a Matcha stock monitoring dashboard and API.
Built because checking Matcha sites everyday got tiring. So now it's automated!

To run the lambda function:
1. Configure the lambda zip
    ~~~sh
    chmod +x lambda.sh
    ./lambda.sh
    ~~~
2. Upload tea-scraper.zip to AWS Lambda
3. Set environment variables:
- Key: VENDOR_ID
- Value: Marukyu's vendor ID in MongDB Atlas
4. AWS SES Environment variables:
- AWS_REGION=use-east-1
- SES_SENDER_EMAIL=some_verified_email@gmail.com
- SUBSCRIBER_EMAILS=some_verified_email@gmail.com

Eventbridge to invoke lambda
- cron(0, 2/12, *, *, ?, *) EST


In development:
- API

To be done:
- API Docs
- Dashboard