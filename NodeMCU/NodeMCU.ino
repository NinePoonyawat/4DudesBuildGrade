#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>

const char* ssid = "Sawan12A_5G"; // Sawan12A_5G
const char* password = "Sawan53721"; //Sawan53721
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "68487dfa-0cc5-479a-bb8b-bce72c2f4fc3";
const char* mqtt_username = "sSKrp69Gh7PitmL2RLSJcqQYu6ZGibiF";
const char* mqtt_password = "_iNlUj0w-1czEuk0V(moGZ#P1shsiEw!";

char msg[100];
String tmp = "";
int Humidity = 0;
int WeatherTemp = 0;
int HeartRate = 0;
int HumanTemp = 0;

// Set up a new SoftwareSerial object
SoftwareSerial mySerial;

WiFiClient espClient;
PubSubClient client(espClient);

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
      Serial.println("connected");
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  //------uart-----
  // Define pin modes for TX and RX
  delay(1000);
  pinMode(D6, INPUT);
  pinMode(D8, OUTPUT);
  pinMode(D1, OUTPUT);
  // Set the baud rate for the SoftwareSerial object
  mySerial.begin(9600,SWSERIAL_8N1, D6, D8, false);
  //---------------
  Serial.begin(9600);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
//  client.setCallback(callback);
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
//   read from uart
  String data;
  bool send_data = false;
  String case_send = "";
  digitalWrite(D1,HIGH); // signal interupt
  if (mySerial.available() > 0) {
        
    }
  // update database
  if(send_data){
    String data = "{\"data\": {\"Humidity\":" + String(Humidity) +
    ",\"WeatherTemp\":\""+String(WeatherTemp) + 
    ",\"HumanTemp\":\""+String(HumanTemp) + 
    "\",\"HeartRate\":\""+HeartRate + "\"}}"; // send to @shadow/data/update 
    Serial.println(data);
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@shadow/data/update", msg); 
    // send massage to html
    data = case_send;
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@msg/feedback", msg);
  }
}
