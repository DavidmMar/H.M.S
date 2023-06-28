#include <PZEM004Tv30_MODBUS.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <NTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

#include "credentials.h"

#define MQTT_PORT 1883
#define MQTT_TOPIC "testTopicOutlier"
#define MQTT_CLIENT_ID "esp32-s2-client-test"


#define DHT_PIN 45
#define DHT_TYPE DHT11

#define PZEM_SAMPLE_RATE_MS 1000
#define DHT_SAMPLE_RATE_MS 10000

#define VOLTAGE_ALARM_UPPER_LIMIT 250
#define VOLTAGE_ALARM_LOWER_LIMIT 200

// #define SENSOR_TYPE "electricity"