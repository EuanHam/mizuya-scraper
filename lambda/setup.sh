#!/bin/bash

# Lambda Setup and Deployment Script
# This script packages the Lambda function with dependencies for deployment to AWS Lambda

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="${SCRIPT_DIR}/build"
PACKAGE_NAME="tea-scraper-lambda"

echo "Building Lambda package..."

# clean and recreate
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# copy lambda
cp "${SCRIPT_DIR}/lambda_function.py" "$BUILD_DIR/"

pip install cloudscraper beautifulsoup4 requests -t "$BUILD_DIR"

# rm unnecessary files
find "$BUILD_DIR" -type d -name "*.dist-info" -exec rm -rf {} + 2>/dev/null || true
find "$BUILD_DIR" -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
find "$BUILD_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "$BUILD_DIR" -type f -name "*.pyc" -delete
find "$BUILD_DIR" -type f -name "*.pyo" -delete

# create new build dir
cd "$BUILD_DIR"
zip -r "${SCRIPT_DIR}/${PACKAGE_NAME}.zip" . -q

cd "$SCRIPT_DIR"
rm -rf "$BUILD_DIR"

echo "✅ Package created: ${PACKAGE_NAME}.zip"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in AWS Lambda:"
echo "   - API_ENDPOINT: https://your-api.com/api/admin/product/sync"
echo "   - VENDOR_ID: your-vendor-mongodb-id"
echo ""
echo "2. Upload the zip to AWS Lambda"
echo "3. Set up EventBridge rule to trigger on schedule"
echo ""
echo "📦 Package contents:"
unzip -l "${SCRIPT_DIR}/${PACKAGE_NAME}.zip" | head -20