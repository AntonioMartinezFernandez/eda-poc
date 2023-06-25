output "AWS_REGION" {
  value = "eu-central-1"
}
output "AWS_ENDPOINT" {
  value = "http://localhost:4566"
}

### SQS
output "TO_CLOUD_SQS_URL" {
  value = aws_sqs_queue.to_cloud_sqs_queue.url
}
output "TO_DEVICE_SQS_URL" {
  value = aws_sqs_queue.to_device_sqs_queue.url
}

### SNS
output "TO_CLOUD_SNS_TOPIC_ARN" {
  value = aws_sns_topic.to_cloud_sns_topic.arn
}

output "TO_DEVICE_SNS_TOPIC_ARN" {
  value = aws_sns_topic.to_device_sns_topic.arn
}

### MYSQL
output "MYSQL_HOST" {
  value = "localhost"
}

output "MYSQL_PORT" {
  value = 3306
}

output "MYSQL_USER" {
  value = "dbuser"
}

output "MYSQL_PASSWORD" {
  value = "MyPassword1234"
}

output "MYSQL_DB" {
  value = "mysql-db"
}

### REDIS
output "REDIS_HOST" {
  value = "localhost"
}

output "REDIS_PORT" {
  value = 6379
}

### GATEWAY WS
output "GATEWAY_WS_URL" {
  value = local.gateway_ws_url
}

### MESSAGE PROCESSOR
output "MP_URL" {
  value = local.message_processor_url
}
output "MP_HTTP_PORT" {
  value = local.message_processor_http_port
}

### BACKEND
output "BACKEND_URL" {
  value = local.backend_url
}
output "BACKEND_HTTP_PORT" {
  value = local.backend_http_port
}

### FRONTEND
output "FRONTEND_URL" {
  value = local.frontend_url
}
output "FRONTEND_HTTP_PORT" {
  value = local.frontend_http_port
}

### ENVIRONMENT
output "ENVIRONMENT" {
  value = local.environment
}
