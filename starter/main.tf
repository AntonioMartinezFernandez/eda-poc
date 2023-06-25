provider "aws" {
  region                      = "eu-central-1"
  access_key                  = "mock_access_key"
  secret_key                  = "mock_secret_key"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    apigateway     = "http://localhost:4566"
    apigatewayv2   = "http://localhost:4566"
    cloudformation = "http://localhost:4566"
    cloudwatch     = "http://localhost:4566"
    es             = "http://localhost:4566"
    firehose       = "http://localhost:4566"
    iam            = "http://localhost:4566"
    lambda         = "http://localhost:4566"
    route53        = "http://localhost:4566"
    redshift       = "http://localhost:4566"
    s3             = "http://localhost:4566"
    secretsmanager = "http://localhost:4566"
    ses            = "http://localhost:4566"
    sns            = "http://localhost:4566"
    sqs            = "http://localhost:4566"
    ssm            = "http://localhost:4566"
    stepfunctions  = "http://localhost:4566"
    sts            = "http://localhost:4566"
  }
}

# Create SNS topics
resource "aws_sns_topic" "to_cloud_sns_topic" {
  name = "to-cloud-sns-topic"
}

resource "aws_sns_topic" "to_device_sns_topic" {
  name = "to-device-sns-topic"
}

# Create SQS queues
resource "aws_sqs_queue" "to_cloud_sqs_queue" {
  name = "to-cloud-sqs-queue"
}

resource "aws_sqs_queue" "to_device_sqs_queue" {
  name = "to-device-sqs-queue"
}

# Subscribe SQS queues to SNS topics
resource "aws_sns_topic_subscription" "subscription_sqs_to_sns_device_to_cloud" {
  topic_arn = aws_sns_topic.to_cloud_sns_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.to_cloud_sqs_queue.arn
}

resource "aws_sns_topic_subscription" "subscription_sqs_to_sns_cloud_to_device" {
  topic_arn = aws_sns_topic.to_device_sns_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.to_device_sqs_queue.arn
}
