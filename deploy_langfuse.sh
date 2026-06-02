#!/bin/bash

echo "Starting Langfuse deployment sequence..."

# 1. Fetch production secrets from your dedicated folder into the host .env file
# Adjust --path="/langfuse" if your folder name differs
infisical export --env=prod --path="/langfuse" --output-file=.env
echo "✓ Production .env file generated for Langfuse stack."

# 2. Extract the DB_CA_CERT string cleanly using python parsing to handle formatting
infisical export --env=prod --path="/langfuse" --format=json | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    cert = next((i['value'] for i in data if i['key'] == 'DB_CA_CERT'), '') if isinstance(data, list) else data.get('DB_CA_CERT', '')
    print(cert.replace('\\n', '\n'))
except Exception as e:
    pass
" > ca.pem

echo "✓ Production DB CA Certificate hydrated at ./ca.pem"

# 3. Spin up the containers using the standard compose command
docker compose up -d --build

echo "Deployment complete! Langfuse infrastructure is updating securely."