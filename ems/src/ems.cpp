#include "ems.h"

HardwareSerial PZEMSerial = HardwareSerial(1);
PZEM004Tv30_MODBUS sensor(&PZEMSerial, 1);

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

void setup()
{
  // initiallize serial
  Serial.begin(9600);

  // setup pzem
  sensor.setupPZEM004();

  // connect to wifi
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PWD);
  Serial.print("Connecting to WiFi...");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
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

  //start ntp
  timeClient.begin();
  timeClient.setTimeOffset(0);
}

void loop()
{
  // get measurements
  float voltage = sensor.getPZEM004Voltage();     // V
  float current = sensor.getPZEM004Current();     // A
  float power = sensor.getPZEM004Power();         // W
  float energy = sensor.getPZEM004Energy();       // kWh
  float frequency = sensor.getPZEM004Frequency(); // Hz
  float pf = sensor.getPZEM004Pf();

  timeClient.forceUpdate();
  String timestamp = timeClient.getFormattedDate();
  Serial.println(timestamp);

  // Debug
  Serial.println("Voltage: " + String(voltage) + "V");
  Serial.println("Current: " + String(current) + "A");
  Serial.println("Power: " + String(power) + "W");
  Serial.println("Energy: " + String(energy) + "kWh");
  Serial.println("Frequency: " + String(frequency) + "Hz");
  Serial.println("Power Factor: " + String(pf));
  Serial.println("Next =================================");

  // compose object to send
  StaticJsonDocument<JSON_OBJECT_SIZE(10)> doc;

  doc["sensor"] = SENSOR_TYPE;
  doc["voltage"] = voltage;
  doc["current"] = current;
  doc["power"] = power;
  doc["energy"] = energy;
  doc["frequency"] = frequency;
  doc["pf"] = pf;
  doc["timestamp"] = timestamp;

  // Debug
  serializeJsonPretty(doc, Serial);
  Serial.println(" ");

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
  Serial.println(" ");

  delay(5000);
}