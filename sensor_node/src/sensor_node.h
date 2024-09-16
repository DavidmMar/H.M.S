#include <PZEM004Tv30.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <NTPClient.h>

#include "credentials.h"

#define MQTT_PORT 2000
#define MQTT_TOPIC "solar_cell_1"
#define MQTT_CLIENT_ID "solar_cells_mcu"

#define PZEM_SAMPLE_RATE_MS 5000
