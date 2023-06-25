package internal

type WsMessage struct {
	ClientId string `json:"clientId"`
	Message  string `json:"message"`
}

type MessageToWs struct {
	ConnectionId string `json:"connectionId"`
	Payload      string `json:"payload"`
}

type MessageToCloud struct {
	ConnectionId string `json:"connectionId"`
	Message      string `json:"message"`
}

type ConnectivityMessageToCloud struct {
	ConnectionId string `json:"connectionId"`
	DeviceId     string `json:"deviceId"`
}
