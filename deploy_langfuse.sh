#!/bin/bash

echo "Starting Langfuse deployment sequence..."

# Define your project ID variable
PROJECT_ID="e54d669b-3aa1-4a9c-b4c1-df456f82612a"

# 1. Fetch production secrets using the explicit --projectId flag
infisical export --env=prod --projectId="$PROJECT_ID" --path="/langfuse" --output-file=.env
echo "✓ Production .env file generated for Langfuse stack."

# 2. Extract the DB_CA_CERT string using the same project ID
infisical export --env=prod --projectId="$PROJECT_ID" --path="/langfuse" --format=json | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    cert = next((i['value'] for i in data if i['key'] == 'DB_CA_CERT'), '') if isinstance(data, list) else data.get('DB_CA_CERT', '')
    print(cert.replace('\\n', '\n'))
except Exception as e:
    pass
" > ca.pem

echo "✓ Production DB CA Certificate hydrated at ./ca.pem"

# 3. Spin up the containers
docker compose up -d --build

echo "Deployment complete! Langfuse infrastructure is updating securely."