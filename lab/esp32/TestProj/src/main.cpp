#include <Arduino.h>

void setup() {
    Serial.begin(921600);
    Serial.println("Hello from setup");
}

void loop() {
    Serial.println("Hello from loop");
    delay(1000);
}