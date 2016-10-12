int led = 8;
float timingFactor = 0.0625;

void setup() {
    pinMode(led, OUTPUT);
}

void loop() {
    digitalWrite(led, HIGH);
    delay(62);
    digitalWrite(led, LOW);
    delay(63);
}
