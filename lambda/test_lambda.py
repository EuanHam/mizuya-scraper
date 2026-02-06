import os
import json
from lambda_function import lambda_handler

# Set environment variables
os.environ['VENDOR_ID'] = '6960443662b4343e0fb34ef7'
os.environ['API_ENDPOINT'] = 'http://localhost:3000/api/admin/product/sync'
os.environ['NOTIFY_ENDPOINT'] = 'http://localhost:3000/api/admin/product/notify'

# Run the function
result = lambda_handler({}, {})
print(json.dumps(result, indent=2))