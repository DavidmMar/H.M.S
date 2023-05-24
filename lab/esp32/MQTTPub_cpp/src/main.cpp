#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>

const char *ssid = "DM";
const char *password = "novilho123";
// const char *mqttServer = "194.210.198.50";
IPAddress mqttServer(194, 210, 198, 50);
const int mqttPort = 1883;
const char *mqttTopic = "test/topic";
const char *mqttClientId = "esp32-s2-client";
const char *mqttMessage = "Hello, MQTT!";

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void makeRequest()
{
    HTTPClient http;
    String serverPath = "http://www.example.com";

    // Your Domain name with URL path or IP address with path
    http.begin(serverPath.c_str());

    // Send HTTP GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
    }
    else
    {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
}

void setup()
{
    Serial.begin(115200);

    // Connect to wifi
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi...");

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("Connected to Wifi network!");

    makeRequest();

    // Connect to broker
    mqttClient.setServer(mqttServer, mqttPort);
    Serial.println("Connecting to MQTT...");
    while (!mqttClient.connected())
    {
        if (mqttClient.connect(mqttClientId))
        {
            Serial.println("Connected");
        }
        else
        {
            Serial.print("Failed with state ");
            Serial.println(mqttClient.state());
            Serial.println(":: :: :: :: :: :: :: :: :: :: ::");
            delay(2000);
        }
    }
}

void loop()
{
    delay(10);

    Serial.println("In loop!");

    if (mqttClient.publish(mqttTopic, "Hello!") == true) {
      Serial.println("Success sending message");
    } else {
      Serial.println("Error sending message");
    }

    delay(10000);
}
