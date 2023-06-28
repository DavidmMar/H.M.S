#include "sensor_node.h"

HardwareSerial PZEMSerial = HardwareSerial(1);
PZEM004Tv30_MODBUS pzem(&PZEMSerial, 1);

DHT dht(DHT_PIN, DHT_TYPE);

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "ntp1.tecnico.ulisboa.pt");

unsigned long currMillis = 0;
unsigned long pzemMillis = 0;
unsigned long dhtMillis = 0;

void setup()
{
  // // init led
  // pinMode(LED_BUILTIN, OUTPUT);

  // initiallize serial
  Serial.begin(9600);

  // setup pzem
  pzem.setupPZEM004();

  // setup dht
  dht.begin();

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
    // get measurements
    float voltage = pzem.getPZEM004Voltage();     // V
    float current = pzem.getPZEM004Current();     // A
    float power = pzem.getPZEM004Power();         // W
    float energy = pzem.getPZEM004Energy();       // kWh
    float frequency = pzem.getPZEM004Frequency(); // Hz
    float pf = pzem.getPZEM004Pf();

    timeClient.forceUpdate();
    String timestamp = timeClient.getFormattedDate();

    // check for outlier
    Serial.println("voltage: " + String(voltage));
    if (voltage < VOLTAGE_ALARM_LOWER_LIMIT || voltage > VOLTAGE_ALARM_UPPER_LIMIT)
    {
      Serial.println("OUTLIER FOUND!!!");
      digitalWrite(LED_BUILTIN, HIGH);
      delay(5000);
      digitalWrite(LED_BUILTIN, LOW);
    }

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

  // DHT
  if (currMillis - dhtMillis >= DHT_SAMPLE_RATE_MS)
  {
    // get measurnments
    float temp = dht.readTemperature(); // ºC
    float hum = dht.readHumidity();     // %

    timeClient.forceUpdate();
    String timestamp = timeClient.getFormattedDate();

    // Debug
    // Serial.println("Temperature: " + String(temp) + "ºC");
    // Serial.println("Humidity: " + String(hum) + "%");
    // Serial.println("Next =================================");

    // compose object to send
    StaticJsonDocument<JSON_OBJECT_SIZE(20)> doc;
    doc["sensor"] = "humNtemp";

    JsonObject data = doc.createNestedObject("data");
    data["temperature"] = temp;
    data["humidity"] = hum;
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
    dhtMillis = currMillis;
  }
}