// #include <PZEM004Tv30_MODBUS.h>
#include <PZEM004Tv30.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <NTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

#include "credentials.h"

#define MQTT_PORT 1883
#define MQTT_TOPIC "testTopic"
#define MQTT_CLIENT_ID "esp32-s2-client-test"

#define DHT_PIN 33
#define DHT_TYPE DHT11

#define PZEM_SAMPLE_RATE_MS 1000
#define DHT_SAMPLE_RATE_MS 10000

#define VOLTAGE_ALARM_UPPER_LIMIT 250
#define VOLTAGE_ALARM_LOWER_LIMIT 200

#define NR_OF_MODULES 2
#define MULTIPLE_TOPICS [ "testTopicMultiple1", "testTopicMultiple2" ]

// #define SENSOR_TYPE "electricity"