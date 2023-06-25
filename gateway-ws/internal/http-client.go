package internal

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
)

func HttpPostRequest(url string, body interface{}) error {
	// Convert body to JSON
	jsonBody, err := json.Marshal(body)
	if err != nil {
		return errors.New(fmt.Sprint("[HTTP SENDER] error marshalling body: ", err))
	}

	// Create a HTTP post request
	r, err := http.NewRequest("POST", url, bytes.NewReader(jsonBody))
	if err != nil {
		return errors.New(fmt.Sprint("[HTTP SENDER] error creating http request: ", err))
	}

	r.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(r)
	if err != nil {
		return errors.New(fmt.Sprint("[HTTP SENDER] error sending http request: ", err))
	} else {
		log.Println("[HTTP SENDER] response from cloud: ", res.Status)
	}

	defer res.Body.Close()

	return nil
}
