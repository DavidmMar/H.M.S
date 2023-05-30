#include <PZEM004Tv30_MODBUS.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <NTPClient.h>

#define SSID "HomeAM"
#define PWD "VX327S6H"
#define MQTT_SERVER "192.168.1.249"
#define MQTT_PORT 1883
#define MQTT_TOPIC "test/topic"
#define MQTT_CLIENT_ID "esp32-s2-client-test"

#define SENSOR_TYPE "eletricity"