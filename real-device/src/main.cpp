#include <stdio.h>
#include <Arduino.h>

#include <ArduinoJson.h>
#include <ArduinoUnit.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "time.h"

#include "wifi_config.h"
#include "mqtt_config.h"

// Config MQTT connection

// Config MQTT id and topics
String clientId = "ANTONIOMARTINEZREALDEVICE1";
const char *connectivity_topic = "eda-poc/devices/ANTONIOMARTINEZREALDEVICE1/connectivity";
const char *commands_topic = "eda-poc/devices/ANTONIOMARTINEZREALDEVICE1/commands";
const char *events_topic = "eda-poc/devices/ANTONIOMARTINEZREALDEVICE1/events";
const char *telemetry_topic = "eda-poc/devices/ANTONIOMARTINEZREALDEVICE1/telemetry";

boolean telemetryEnabled;
boolean deviceStarted;
String commandReceived;
int dimmer = 0;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastTelemetryMsg = 0;
#define MSG_BUFFER_SIZE (100)
time_t timeNow;

void reconnectMqtt()
{
  // Loop until we're reconnected
  while (!mqttClient.connected())
  {
    Serial.print("Attempting MQTT connection...");
    const char *lwt_disconnected = "false";

    // Attempt to connect
    if (mqttClient.connect(clientId.c_str(), mqtt_user, mqtt_pass, connectivity_topic, 1, 0, lwt_disconnected))
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      mqttClient.publish(connectivity_topic, "true");
      // ... and resubscribe
      mqttClient.subscribe(commands_topic);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

// Send Telemetry EVENT
void sendTelemetry()
{
  unsigned long lastTime = millis();

  if (lastTime - lastTelemetryMsg > 5000)
  {
    lastTelemetryMsg = lastTime;
    if (telemetryEnabled == true)
    {
      int temperature = random(25);

      Serial.print("Temperature: ");
      Serial.println(temperature);

      // Telemetry Event
      DynamicJsonDocument telemetryEventAsJson(1024);
      char telemetryEventAsChar[1024];

      telemetryEventAsJson["type"] = "TELEMETRY";
      telemetryEventAsJson["name"] = "TEMPERATURE";
      telemetryEventAsJson["payload"]["sensor"] = "device_temperature";
      telemetryEventAsJson["payload"]["value"] = temperature;
      telemetryEventAsJson["ocurredOn"] = time(&timeNow);
      telemetryEventAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

      serializeJson(telemetryEventAsJson, telemetryEventAsChar);

      mqttClient.publish(telemetry_topic, telemetryEventAsChar);
    }
  }
}

void processMqttCommands(char *topic, byte *payload, int length)
{
  commandReceived = "";
  for (int i = 0; i < length; i++)
  {
    commandReceived.concat((char)payload[i]);
  }

  printf("Command received at %s\n", topic);

  Serial.println(commandReceived);

  // ### DESERIALIZE COMMAND ###

  // Define json document variable
  DynamicJsonDocument jsonDoc(1024);

  // Convert String commandReceived to std::string stringInput
  std::string stringInput = std::string(commandReceived.c_str());

  // Deserialize string input in json document
  deserializeJson(jsonDoc, stringInput);
  JsonObject obj = jsonDoc.as<JsonObject>();

  // Define fields
  std::string type = obj["type"];
  std::string id = obj["id"];
  std::string name = obj["name"];
  int payload_value = obj["payload"]["value"];

  // Print field values
  printf("Type: %s\n", type.c_str());
  printf("Id: %s\n", id.c_str());
  printf("Name: %s\n", name.c_str());
  printf("Payload > Value: %i\n", payload_value);

  // ### PROCESS COMMANDS ###

  // START command
  if (name == "START")
  {
    // Command Error
    if (deviceStarted)
    {
      DynamicJsonDocument commandErrorAsJson(1024);
      char commandErrorAsChar[1024];

      commandErrorAsJson["type"] = "EVENT";
      commandErrorAsJson["name"] = "COMMAND_ERROR";
      commandErrorAsJson["payload"]["command_id"] = id;
      commandErrorAsJson["payload"]["error"] = "Device already started";
      commandErrorAsJson["ocurredOn"] = time(&timeNow);
      commandErrorAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

      serializeJson(commandErrorAsJson, commandErrorAsChar);

      mqttClient.publish(events_topic, commandErrorAsChar);
      return;
    }

    deviceStarted = true;

    // Command Result
    DynamicJsonDocument commandResultAsJson(1024);
    char commandResultAsChar[1024];

    commandResultAsJson["type"] = "EVENT";
    commandResultAsJson["name"] = "COMMAND_RESULT";
    commandResultAsJson["payload"]["command_id"] = id;
    commandResultAsJson["payload"]["message"] = "Started successfully";
    commandResultAsJson["ocurredOn"] = time(&timeNow);
    commandResultAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

    serializeJson(commandResultAsJson, commandResultAsChar);

    mqttClient.publish(events_topic, commandResultAsChar);
  }

  // STOP command
  if (name == "STOP")
  {
    // Command Error
    if (!deviceStarted)
    {
      DynamicJsonDocument commandErrorAsJson(1024);
      char commandErrorAsChar[1024];

      commandErrorAsJson["type"] = "EVENT";
      commandErrorAsJson["name"] = "COMMAND_ERROR";
      commandErrorAsJson["payload"]["command_id"] = id;
      commandErrorAsJson["payload"]["error"] = "Device already stopped";
      commandErrorAsJson["ocurredOn"] = time(&timeNow);
      commandErrorAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

      serializeJson(commandErrorAsJson, commandErrorAsChar);

      mqttClient.publish(events_topic, commandErrorAsChar);
      return;
    }

    deviceStarted = false;

    // Command Result
    DynamicJsonDocument commandResultAsJson(1024);
    char commandResultAsChar[1024];

    commandResultAsJson["type"] = "EVENT";
    commandResultAsJson["name"] = "COMMAND_RESULT";
    commandResultAsJson["payload"]["command_id"] = id;
    commandResultAsJson["payload"]["message"] = "Stopped successfully";
    commandResultAsJson["ocurredOn"] = time(&timeNow);
    commandResultAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

    serializeJson(commandResultAsJson, commandResultAsChar);

    mqttClient.publish(events_topic, commandResultAsChar);
  }

  // ENABLE_TELEMETRY command
  if (name == "ENABLE_TELEMETRY")
  {
    // Command Error
    if (telemetryEnabled)
    {
      DynamicJsonDocument commandErrorAsJson(1024);
      char commandErrorAsChar[1024];

      commandErrorAsJson["type"] = "EVENT";
      commandErrorAsJson["name"] = "COMMAND_ERROR";
      commandErrorAsJson["payload"]["command_id"] = id;
      commandErrorAsJson["payload"]["error"] = "Telemetry already enabled";
      commandErrorAsJson["ocurredOn"] = time(&timeNow);
      commandErrorAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

      serializeJson(commandErrorAsJson, commandErrorAsChar);

      mqttClient.publish(events_topic, commandErrorAsChar);
      return;
    }

    telemetryEnabled = true;

    // Command Result
    DynamicJsonDocument commandResultAsJson(1024);
    char commandResultAsChar[1024];

    commandResultAsJson["type"] = "EVENT";
    commandResultAsJson["name"] = "COMMAND_RESULT";
    commandResultAsJson["payload"]["command_id"] = id;
    commandResultAsJson["payload"]["message"] = "Telemetry enabled successfully";
    commandResultAsJson["ocurredOn"] = time(&timeNow);
    commandResultAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

    serializeJson(commandResultAsJson, commandResultAsChar);

    mqttClient.publish(events_topic, commandResultAsChar);
  }

  // DISABLE_TELEMETRY command
  if (name == "DISABLE_TELEMETRY")
  {
    // Command Error
    if (!telemetryEnabled)
    {
      DynamicJsonDocument commandErrorAsJson(1024);
      char commandErrorAsChar[1024];

      commandErrorAsJson["type"] = "EVENT";
      commandErrorAsJson["name"] = "COMMAND_ERROR";
      commandErrorAsJson["payload"]["command_id"] = id;
      commandErrorAsJson["payload"]["error"] = "Telemetry already disabled";
      commandErrorAsJson["ocurredOn"] = time(&timeNow);
      commandErrorAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

      serializeJson(commandErrorAsJson, commandErrorAsChar);

      mqttClient.publish(events_topic, commandErrorAsChar);
      return;
    }

    telemetryEnabled = false;

    // Command Result
    DynamicJsonDocument commandResultAsJson(1024);
    char commandResultAsChar[1024];

    commandResultAsJson["type"] = "EVENT";
    commandResultAsJson["name"] = "COMMAND_RESULT";
    commandResultAsJson["payload"]["command_id"] = id;
    commandResultAsJson["payload"]["message"] = "Telemetry disabled successfully";
    commandResultAsJson["ocurredOn"] = time(&timeNow);
    commandResultAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

    serializeJson(commandResultAsJson, commandResultAsChar);

    mqttClient.publish(events_topic, commandResultAsChar);
  }

  // SET DIMMER command
  if (name == "SET_DIMMER")
  {
    dimmer = payload_value;

    // Command Result
    DynamicJsonDocument commandResultAsJson(1024);
    char commandResultAsChar[1024];

    commandResultAsJson["type"] = "EVENT";
    commandResultAsJson["name"] = "COMMAND_RESULT";
    commandResultAsJson["payload"]["command_id"] = id;
    commandResultAsJson["payload"]["message"] = "Dimmer set successfully";
    commandResultAsJson["ocurredOn"] = time(&timeNow);
    commandResultAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

    serializeJson(commandResultAsJson, commandResultAsChar);

    mqttClient.publish(events_topic, commandResultAsChar);

    // Status Event
    DynamicJsonDocument statusEventAsJson(1024);
    char statusEventAsChar[1024];

    statusEventAsJson["type"] = "EVENT";
    statusEventAsJson["name"] = "STATUS";
    statusEventAsJson["payload"]["dimmer"] = dimmer;
    statusEventAsJson["ocurredOn"] = time(&timeNow);
    statusEventAsJson["id"] = "01H483A4YV9AKP6BTBFHMNCZY6";

    serializeJson(statusEventAsJson, statusEventAsChar);

    mqttClient.publish(events_topic, statusEventAsChar);
  }
}

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);

  telemetryEnabled = false;
  deviceStarted = true;

  Serial.begin(115200);

  start_wifi();

  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(processMqttCommands);
}

void loop()
{
  if (deviceStarted)
  {
    analogWrite(LED_BUILTIN, 255 - (dimmer * 2.5)); // Turn the LED on (with inverse variable intensity)
  }
  else
  {
    digitalWrite(LED_BUILTIN, HIGH); // Turn the LED off
  }

  if (!mqttClient.connected())
  {
    reconnectMqtt();
  }
  mqttClient.loop();

  sendTelemetry();
}