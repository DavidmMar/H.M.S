#include <PZEM004Tv30_MODBUS.h>

HardwareSerial PZEMSerial = HardwareSerial(1);
PZEM004Tv30_MODBUS sensor(&PZEMSerial, 1);

void setup()
{
    // Config serial
    Serial.begin(9600);
    // Initialize sensor and connect to it through the Modbus protocol
    // Serial.println("Initializing PZEM004-v3.0 ...");
    sensor.setupPZEM004();
}

void loop()
{

    double value;

    value = sensor.getPZEM004Voltage();
    Serial.print("Voltage: ");
    Serial.println(value); // V
    delay(1000);

    value = sensor.getPZEM004Current();
    Serial.print("Current: ");
    Serial.println(value); // A
    delay(1000);

    value = sensor.getPZEM004Power();
    Serial.print("Power: ");
    Serial.println(value); // W
    delay(1000);

    value = sensor.getPZEM004Energy();
    Serial.print("Energy: ");
    Serial.println(value); // kWh
    delay(1000);

    value = sensor.getPZEM004Frequency();
    Serial.print("Frequency: ");
    Serial.println(value); // Hz
    delay(1000);

    value = sensor.getPZEM004Pf();
    Serial.print("Power Factor: ");
    Serial.println(value);
    delay(1000);

    Serial.println("Next =================================");
}