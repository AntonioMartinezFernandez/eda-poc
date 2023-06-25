package internal

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/google/uuid"
)

func serveWs(wsHub *WebsocketsHub, w http.ResponseWriter, r *http.Request) {
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// obtain deviceId from request params
	deviceId := r.URL.Query().Get("deviceId")

	// create new uuid
	uuid, _ := uuid.NewRandom()

	// register connection
	client := &Client{wsHub: wsHub, conn: conn, connectionId: uuid, deviceId: deviceId, send: make(chan []byte, 256)}
	client.wsHub.register <- client

	// if client is not subscribed to any device, close connection
	if deviceId == "" {
		log.Printf("[HTTP CONTROLLER] WS client %v connected but not subscribed to any device", uuid)
		err = conn.WriteMessage(1, []byte("{\"error\":\"deviceId is required\"}"))
		if err != nil {
			log.Println(err)
		}
		conn.Close()
		return
	} else {
		log.Printf("[HTTP CONTROLLER] WS client %v connected and subscribed to device %v", uuid, deviceId)
	}

	// send data to client
	wellcomeMessage := fmt.Sprintf("{\"connectionId\":\"%s\", \"deviceId\":\"%s\"}", uuid, deviceId)
	err = conn.WriteMessage(1, []byte(wellcomeMessage))
	if err != nil {
		log.Println(err)
	}

	// allow collection of memory referenced by the caller by doing all work in new goroutines
	go client.writePump()
	go client.readPump()
}

func sendMessageToWsClient(wsHub *WebsocketsHub, w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/send" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.WriteHeader(http.StatusOK)

	// read body
	var bodyBytes []byte
	var err error

	if r.Body != nil {
		bodyBytes, err = io.ReadAll(r.Body)
		if err != nil {
			log.Printf("[HTTP CONTROLLER] Body reading error: %v", err)
			return
		}
		defer r.Body.Close()
	}

	// parse body
	var message MessageToWs
	err = json.Unmarshal(bodyBytes, &message)
	if err != nil {
		log.Printf("[HTTP CONTROLLER] Error unmarshalling message: %v", err)
		return
	}

	// send messsage to WS hub
	wsHub.messageToClient <- WsMessage{ClientId: message.ConnectionId, Message: message.Payload}
}
