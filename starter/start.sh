#!/bin/sh

cd ../message-processor
npm i
cd ../backend
npm i
cd ../frontend
npm i
cd ../mock-device
npm i
cd ../starter
docker compose up -d
terraform init
terraform apply -auto-approve
terraform output | sed 's/"//g' | sed 's/ = /=/g' > ../.env
docker-compose restart message-processor
docker-compose restart backend
open http://localhost:8030
echo "\nExecute 'cd ../mock-device && npm run dev' to start the device mock and update the browser tab 😀"