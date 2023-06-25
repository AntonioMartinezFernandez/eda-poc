package internal

import "net/http"

func NewRouter(wsHub *WebsocketsHub) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(wsHub, w, r)
	})
	http.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		sendMessageToWsClient(wsHub, w, r)
	})
}
