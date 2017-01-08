int PIN = 9;

void setup() {
    pinMode(PIN, OUTPUT);
}

void loop() {
    digitalWrite(PIN, HIGH);
    delay(1250);
    digitalWrite(PIN, LOW);
    delay(75000);
}
