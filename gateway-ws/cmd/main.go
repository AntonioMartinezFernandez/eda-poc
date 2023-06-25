package main

import (
	"fmt"
	"log"
	"net/http"

	internal "gateway-ws/internal"

	config "gateway-ws/config"
)

func main() {
	// Load config
	config, _ := config.LoadEnvConfig()
	log.Println(config.AppServiceName, "is running")

	// Start ws hub
	wsHub := internal.NewWebsocketsHub(config)
	go wsHub.Run()

	// Create http router
	internal.NewRouter(wsHub)

	// Start server
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", config.ServerPort), nil))
}
