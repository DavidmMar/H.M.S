#include <WiFi.h>
#include <PubSubClient.h>

const char *ssid = "DM";
const char *password = "novilho123";
const char *mqttServer = "192.168.137.1";
const int mqttPort = 1883;
const char *mqttTopic = "test/topic";
const char *mqttClientId = "esp32-s2-client";
const char *mqttMessage = "Hello, MQTT!";

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void setup()
{
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }

    Serial.println("Connected to WiFi");

    mqttClient.setServer(mqttServer, mqttPort);

    while (!mqttClient.connected())
    {
        if (mqttClient.connect(mqttClientId))
        {
            Serial.println("Connected to MQTT broker");
        }
        else
        {
            Serial.println("Connection to MQTT broker failed. Retrying...");
            delay(2000);
        }
    }
}

void loop()
{
    if (mqttClient.connected())
    {
        mqttClient.publish(mqttTopic, mqttMessage);
        Serial.println("Message published");
    }

    delay(5000);
}
