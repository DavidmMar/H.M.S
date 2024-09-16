#include "sensor_node.h"

HardwareSerial PZEMSerial = HardwareSerial(1);
PZEM004Tv30 pzem(&PZEMSerial, 18, 17, 0x1);
//  PZEM004Tv30 pzem2(&PZEMSerial, 18, 17, 0x2);

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "ntp1.tecnico.ulisboa.pt");

unsigned long currMillis = 0;
unsigned long pzemMillis = 0;

void setup()
{
  // initiallize serial
  Serial.begin(9600);

  // connect to wifi
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PWD);
  Serial.print("Connecting to WiFi...");

  Serial.println("Connected to Wifi network!");

  // Connect to broker
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  Serial.println("Connecting to MQTT...");
  while (!mqttClient.connected())
  {
    if (mqttClient.connect(MQTT_CLIENT_ID))
    {
      Serial.println("Connected");
    }
    else
    {
      Serial.print("Failed with state ");
      Serial.println(mqttClient.state());
      Serial.println("Retrying \n");
      delay(2000);
    }
  }

  // start ntp
  timeClient.begin();
  timeClient.setTimeOffset(0);
}

void loop()
{
  currMillis = millis();

  // PZEM004
  if (currMillis - pzemMillis >= PZEM_SAMPLE_RATE_MS)
  {
    float voltage = pzem.voltage();     // V
    float current = pzem.current();     // A
    float power = pzem.power();         // W
    float energy = pzem.energy();       // kWh
    float frequency = pzem.frequency(); // Hz
    float pf = pzem.pf();

    timeClient.forceUpdate();
    String timestamp = timeClient.getFormattedDate();

    // Debug
    // Serial.println("Voltage: " + String(voltage) + "V");
    // Serial.println("Current: " + String(current) + "A");
    // Serial.println("Power: " + String(power) + "W");
    // Serial.println("Energy: " + String(energy) + "kWh");
    // Serial.println("Frequency: " + String(frequency) + "Hz");
    // Serial.println("Power Factor: " + String(pf));
    // Serial.println("Next =================================");

    // compose object to send
    StaticJsonDocument<JSON_OBJECT_SIZE(20)> doc;
    doc["sensor"] = "electricity";

    JsonObject data = doc.createNestedObject("data");
    data["voltage"] = voltage;
    data["current"] = current;
    data["power"] = power;
    data["energy"] = energy;
    data["frequency"] = frequency;
    data["pf"] = pf;
    data["timestamp"] = timestamp;

    // Debug
    // serializeJsonPretty(doc, Serial);
    // Serial.println(" ");

    String payload;
    serializeJson(doc, payload);

    // send to the broker
    if (mqttClient.publish(MQTT_TOPIC, payload.c_str()) == true)
    {
      Serial.println("Success sending message");
    }
    else
    {
      Serial.println("Error sending message");
    }

    // update millis
    pzemMillis = currMillis;
  }
}