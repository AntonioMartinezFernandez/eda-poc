package internal

import (
	"gateway-ws/config"
	"log"
)

// Hub maintains the set of active clients and broadcasts messages to the clients
type WebsocketsHub struct {
	// registered clients
	clients map[*Client]bool

	// messages from the cloud
	messageToClient chan WsMessage

	// messages from the clients
	messageToCloud chan WsMessage

	// register requests from the clients
	register chan *Client

	// unregister requests from clients
	unregister chan *Client

	// environment config
	config config.Config
}

func NewWebsocketsHub(config config.Config) *WebsocketsHub {
	return &WebsocketsHub{
		clients:         make(map[*Client]bool),
		messageToClient: make(chan WsMessage),
		messageToCloud:  make(chan WsMessage),
		register:        make(chan *Client),
		unregister:      make(chan *Client),
		config:          config,
	}
}

func (h *WebsocketsHub) FindClientById(id string) *Client {
	for client := range h.clients {
		if client.connectionId.String() == id {
			return client
		}
	}
	return nil
}

func (h *WebsocketsHub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			log.Println("[HUB] client connected:", client.connectionId)
			// json body
			url := h.config.BackendUrlBase + "/ws/connect"
			body := ConnectivityMessageToCloud{
				ConnectionId: client.connectionId.String(),
				DeviceId:     client.deviceId,
			}
			// send HTTP POST request
			err := HttpPostRequest(url, body)
			if err != nil {
				log.Println("[HUB] error: ", err)
			} else {
				log.Println("[HUB] connection messsage sent to cloud")
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				log.Println("[HUB] client disconnected:", client.connectionId)
				// json body
				url := h.config.BackendUrlBase + "/ws/disconnect"
				body := ConnectivityMessageToCloud{
					ConnectionId: client.connectionId.String(),
					DeviceId:     client.deviceId,
				}
				// send HTTP POST request
				err := HttpPostRequest(url, body)
				if err != nil {
					log.Println("[HUB] error: ", err)
				} else {
					log.Println("[HUB] disconnection messsage sent to cloud")
				}
			}
		case messageToClient := <-h.messageToClient:
			log.Printf("[HUB] message %v from cloud received for the client %v", string(messageToClient.Message), string(messageToClient.ClientId))
			client := h.FindClientById(messageToClient.ClientId)
			if client != nil {
				client.send <- []byte(messageToClient.Message)
			}
		case messageToCloud := <-h.messageToCloud:
			log.Printf("[HUB] message %v received from client %v", string(messageToCloud.Message), string(messageToCloud.ClientId))
			// json body
			url := h.config.BackendUrlBase + "/ws/message"
			body := MessageToCloud{
				ConnectionId: messageToCloud.ClientId,
				Message:      messageToCloud.Message,
			}
			// send HTTP POST request
			err := HttpPostRequest(url, body)
			if err != nil {
				log.Println(err)
			} else {
				log.Printf("[HUB] message %v from client %v sent to cloud", string(messageToCloud.Message), string(messageToCloud.ClientId))
			}
		}
	}
}
