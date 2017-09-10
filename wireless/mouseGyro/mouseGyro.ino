#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>

IPAddress local_IP(192,168,3,14); 
IPAddress gateway(192,168,3,1);
IPAddress subnet(255,255,255,0);

ESP8266WebServer server(314);

void setup() {
  delay(1000);
  Serial.begin(115200);
  WiFi.softAPConfig(local_IP, gateway, subnet);
  WiFi.softAP("GyroMouse1", "terminal", 1, false);
  delay(500);
  server.on("/", HTTP_GET, [](){
    handleRequest();
  });
  server.begin();
}

void handleRequest() {
  Serial.print("received request");
  server.send(200, "text/html", "<h1>You are connected</h1>");
  for (int i = 0; i < server.args(); i++) {
    Serial.print(server.arg(i));
    Serial.print("&");
  }  
}

void loop() {
  server.handleClient();
  delay(1);
}
/*
void loop() {
  WiFiClient client = server.available(); 
  if (!client) {
    return;
  }

  
    while (client.connected())
    {
      if (client.available())
      {
        String line = "";
        line = client.readStringUntil('\r');
        line = line.substring(line.indexOf("/?") + 2, line.lastIndexOf(" ")) + "~";
        Serial.print(line);
        client.flush();
        break;
      }
    }
    delay(1); // give the web client time to receive the data
    client.stop();
  }
}
*/
