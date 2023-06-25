#!/bin/sh

rm terraform.tfstate.backup terraform.tfstate .terraform.lock.hcl
rm -rf .terraform

docker compose down
rm -rf volumes/localstack
rm -rf volumes/mqtt/data
rm -rf volumes/mqtt/log
rm -rf volumes/mysql
rm ../.env

docker rmi $(docker images 'starter-gateway-ws' -a -q)
docker rmi $(docker images 'starter-message-processor' -a -q)
docker rmi $(docker images 'starter-backend' -a -q)
docker rmi $(docker images 'starter-frontend' -a -q)