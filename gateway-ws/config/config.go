package config

import (
	"context"
	"os"

	"github.com/joho/godotenv"
	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	AppServiceName string `env:"APP_SERVICE_NAME"`
	ServerPort     string `env:"SERVER_PORT"`
	BackendUrlBase string `env:"BACKEND_URL_BASE"`
	LoggerLevel    string `env:"LOGGER_LEVEL"`
}

func LoadEnvConfig() (Config, error) {
	goDotEnvVariable("APP_SERVICE_NAME")
	goDotEnvVariable("SERVER_PORT")
	goDotEnvVariable("BACKEND_URL_BASE")
	goDotEnvVariable("LOGGER_LEVEL")
	return buildConfig(), nil
}

func goDotEnvVariable(key string) string {
	godotenv.Load(".env")
	return os.Getenv(key)
}

func buildConfig() Config {
	var config Config
	context := context.Background()
	if err := envconfig.Process(context, &config); err != nil {
		panic(err)
	}

	return config
}
