# Tea Scraper Lambda

This directory contains the AWS Lambda function for scraping matcha products from multiple vendors and syncing them to the Next.js API.

## Supported Vendors

- **Marukyu Koyamaen**: Web scraping from their product catalog
- **Rocky's Matcha**: REST API integration using their products JSON endpoint

## Structure

- `lambda_function.py` - The main Lambda handler code
- `setup.sh` - Script to build and package the Lambda function for deployment

## How It Works

1. **Scrapes** Marukyu Koyamaen website for matcha products
2. **Fetches** Rocky's matcha products from their JSON API
3. **Extracts** product data: title, status (in_stock/out_of_stock), URL, and price (Rocky's)
4. **Posts** combined products to the API endpoint `/api/admin/product/sync`
5. **API** creates new products or updates existing ones and records history

## Setup & Deployment

### Build the Package
```bash
chmod +x setup.sh
./setup.sh
```

This creates `tea-scraper-lambda.zip` with all dependencies included.

### Deploy to AWS Lambda

1. Go to AWS Lambda console
2. Create new function (or update existing)
3. Upload the `tea-scraper-lambda.zip` file
4. Set handler to `lambda_function.lambda_handler`
5. Set timeout to 30+ seconds
6. Add environment variables:
   - `API_ENDPOINT`: `https://your-domain.com/api/admin/product/sync`
   - `VENDOR_ID`: Your MongoDB vendor ID for syncing these vendors (e.g., `695bf7949571d57fd75e26eb`)

### Set Up EventBridge Trigger

1. Go to EventBridge in AWS console
2. Create a rule (e.g., `run-tea-scraper-daily`)
3. Schedule: `cron(0 2 * * ? *)` (runs daily at 2 AM UTC)
4. Target: Lambda function
5. Save

## Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VENDOR_ID` | Yes | `695bf7949571d57fd75e26eb` | MongoDB vendor ID for syncing products |
| `API_ENDPOINT` | No | `https://api.example.com/api/admin/product/sync` | Full URL to sync endpoint (defaults to localhost) |
| `NOTIFY_ENDPOINT` | No | `https://api.example.com/api/admin/product/notify` | Full URL to notification endpoint |

## Response Format

Success (200):
```json
{
  "success": true,
  "marukyu_count": 12,
  "rockys_count": 45,
  "total_count": 57,
  "in_stock_count": 35,
  "sync_result": {
    "created": 5,
    "updated": 50,
    "errors": []
  }
}
```

Error (500):
```json
{
  "success": false,
  "error": "error message"
}
```
