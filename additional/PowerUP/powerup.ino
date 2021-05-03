#include <ESP8266WiFi.h>

const char* ssid      = "YourSSID";
const char* password  = "YourPassword";

// Static IP details
IPAddress ipAddress(192, 168, 0, 102);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(1, 1, 1, 1);
IPAddress secondaryDNS(1, 0, 0, 1);

WiFiServer server(80);

String header;
int outputPin = 16;

void setup() {
    Serial.begin(115200);

    // Configures static IP address
    if (!WiFi.config(ipAddress, gateway, subnet, primaryDNS, secondaryDNS)) {
       Serial.println("STA Failed to configure");
    }

    pinMode(outputPin, OUTPUT);
    digitalWrite(outputPin, LOW);
  
    delay(500);

    Serial.print("Connecting to ");
    Serial.print(ssid);
    Serial.println();
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println(" Connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    server.begin();
}

void loop() {
    WiFiClient client = server.available();

    if (!client) {
        return;
    }

    Serial.println("New client connected");
    String request = client.readStringUntil('\r');
    
    if (request.indexOf("/powerUP") != -1) {
      
      Serial.println("-- POWERING UP --");
      
      digitalWrite(outputPin, HIGH);
      delay(500); // Send ON signal for 0.5 seconds
      digitalWrite(outputPin, LOW);
      
      Serial.println("-- Complete --");
      
      // Make sure the output stays OFF for at least 2 seconds to 
      //prevent shutdown due to power button being pressed for a long time   
      delay(2000);  
    }

    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html");
    client.println("");

}
