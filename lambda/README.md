# Tea Scraper Lambda

This directory contains the AWS Lambda function for scraping Marukyu Koyamaen matcha products and syncing them to the Next.js API.

## Structure

- `lambda_function.py` - The main Lambda handler code
- `setup.sh` - Script to build and package the Lambda function for deployment

## How It Works

1. **Scrapes** the Marukyu website for matcha products
2. **Extracts** product data: title, status (in_stock/out_of_stock), URL
3. **Posts** to the API endpoint `/api/admin/product/sync`
4. **API** creates new products or updates existing ones and records history

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
   - `VENDOR_ID`: Your MongoDB vendor ID for Marukyu (e.g., `695bf7949571d57fd75e26eb`)

### Set Up EventBridge Trigger

1. Go to EventBridge in AWS console
2. Create a rule (e.g., `run-tea-scraper-daily`)
3. Schedule: `cron(0 2 * * ? *)` (runs daily at 2 AM UTC)
4. Target: Lambda function
5. Save

## Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VENDOR_ID` | Yes | `695bf7949571d57fd75e26eb` | MongoDB vendor ID for the store |
| `API_ENDPOINT` | No | `https://api.example.com/api/admin/product/sync` | Full URL to sync endpoint (defaults to localhost) |

## Response Format

Success (200):
```json
{
  "success": true,
  "scrape_count": 12,
  "sync_result": {
    "created": 2,
    "updated": 10,
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
