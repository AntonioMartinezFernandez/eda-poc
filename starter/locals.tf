locals {
  environment                 = "local"
  gateway_ws_url              = "http://gateway-ws:9001/send"
  message_processor_url       = "message-processor"
  message_processor_http_port = 8010
  backend_url                 = "backend"
  backend_http_port           = 8020
  frontend_url                = "frontend"
  frontend_http_port          = 8030
}
