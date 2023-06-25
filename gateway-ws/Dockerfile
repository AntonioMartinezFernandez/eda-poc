###########################################################
# Development image
###########################################################

FROM golang:1.20-alpine

RUN apk update && apk add git && apk add curl

ARG APP_NAME
ENV APP_NAME="gateway-ws"

RUN mkdir /app
WORKDIR /app
COPY . ./gateway-ws
WORKDIR /app/gateway-ws
RUN go mod download

# set install version to v1.42.0 until this issue is fixed:
# https://github.com/cosmtrek/air/issues/415
RUN curl -fLo install.sh https://raw.githubusercontent.com/cosmtrek/air/master/install.sh \
  && chmod +x install.sh \
  && sh install.sh v1.42.0 \
  && cp ./bin/air /bin/air

CMD air -c .air.toml