#include <ESP8266WiFi.h>
#include <DHT11.h>
extern "C" {
  #include "user_interface.h"
}

const char *ssid = "AT1";
const char *password = "Terminal10";

//const char *ssid = "AT2";
//const char *password = "terminal";

const char *host = "192.168.0.35";
DHT11 dht11(2);

float temp = 0;
float humid = 0;

void setup() {
  Serial.begin(115200);
  delay(100);
  sendData();
  ESP.deepSleep(600 * 1000000);
//  delay(600 * 1000);
}

void loop() {
  
}

void sendData() {
  
//  WiFi.forceSleepWake();
  dht11.read(humid, temp);

  connect();

  WiFiClient client;
  const int httpPort = 8080;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }
  
  // We now create a URI for the request
  String url = "/";
  url += "?s=3";
  
  url += "&t=";
  url += temp;
  url += "&h=";
  url += humid;
  
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }
  
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println();
  Serial.println("closing connection");

  //wifi_set_sleep_type(LIGHT_SLEEP_T);
  WiFi.disconnect();
    
  //WiFi.forceSleepBegin();
}

void connect() {

  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

