#include <ESP8266WiFi.h>

const char* host = "192.168.3.14";
const int httpPort = 314;

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin("GyroMouse1", "terminal");  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {

  char ch;
  String message = "";

  while (Serial.available() > 0) {
    ch = Serial.read();
    message += ch;
  }

  if(message != "") {
    WiFiClient client;
    if (!client.connect(host, httpPort)) {
      return;
    }
    String url = "/?" + message;
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" + 
                 "Connection: close\r\n\r\n");
  }
  delay(10);
}
