#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>

const char* ssid = "Yoyo"; // Sawan12A_5G
const char* password = "12345678"; //Sawan53721
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "68487dfa-0cc5-479a-bb8b-bce72c2f4fc3";
const char* mqtt_username = "sSKrp69Gh7PitmL2RLSJcqQYu6ZGibiF";
const char* mqtt_password = "_iNlUj0w-1czEuk0V(moGZ#P1shsiEw!";

char msg[100];
String tmp = "";
int HeartRate   = 0;
int HumanTemp   = 2;
int Humidity    = 3;
int WeatherTemp = 4;
bool fanOpening = false;


// Set up a new SoftwareSerial object
SoftwareSerial mySerial;

WiFiClient espClient;
PubSubClient client(espClient);

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
      Serial.println("connected");
      setup();
      //break;
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

 void callback(char* topic, byte* payload, unsigned int length) {
   Serial.println("Message arrived");
   digitalWrite(D2,HIGH);
}

float calculateHeatIndex(float temperature, float humidity) {
    // Calculate the heat index
    float c1 = -8.78469475556;
    float c2 = 1.61139411;
    float c3 = 2.33854883889;
    float c4 = -0.14611605;
    float c5 = -0.012308094;
    float c6 = -0.0164248277778;
    float c7 = 0.002211732;
    float c8 = 0.00072546;
    float c9 = -0.000003582;

    float heatIndex = c1 + (c2 * temperature) + (c3 * humidity) + (c4 * temperature * humidity)
                    + (c5 * temperature * temperature) + (c6 * humidity * humidity)
                    + (c7 * temperature * temperature * humidity) + (c8 * temperature * humidity * humidity)
                    + (c9 * temperature * temperature * humidity * humidity);
    return heatIndex;
}

// check if heat stroke
bool CheckHeatStroke() {
  int risk = 0;
  
  float heatIndex = calculateHeatIndex(WeatherTemp, Humidity);
  if (heatIndex < 90.0) {

  } else if (heatIndex < 103.0) {
    risk += 1;
  } else if (heatIndex < 125.0) {
    risk += 2;
  } else {
    risk += 3;
  }

  if (HeartRate > 200) {
    risk += 2;
  } else if (HeartRate > 150) {
    risk += 1;
  }

  if (HumanTemp > 40) {
    risk += 2;
  } else if (HumanTemp > 37) {
    risk += 1;
  }
  Serial.println(String(risk)); 
  return risk < 5;
}

void setup() {
  //------uart-----
  // Define pin modes for TX and RX
  delay(1000);
  pinMode(D6, INPUT);
  pinMode(D8, OUTPUT);
  pinMode(D1, OUTPUT); // OnPin
  pinMode(D2, OUTPUT); // togglePin
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
  client.subscribe("@msg/fan");
  client.setCallback(callback);
  loop();
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
  digitalWrite(D1,LOW); // signal interupt
  digitalWrite(D2,LOW);
  // update database
  if (CheckHeatStroke()) {
    //Serial.println("Turn Fan off");
    digitalWrite(D2,HIGH);
    
  } else {
    //Serial.println("Turn Fan on");
    digitalWrite(D1,HIGH);
  }
  if (mySerial.available() > 0) {
    char character = mySerial.read();
    Serial.write(character);
    if (character == '\r') {
      int space = tmp.indexOf(' ');
      //Serial.println(tmp.substring(space+1,tmp.length()-1));
      if (tmp[0] == 'H') {
        HeartRate = tmp.substring(space+1,tmp.length()-1).toInt();
        send_data = true;
      }
      if (tmp[0] == 'O') {
        HumanTemp = tmp.substring(space+1,tmp.length()-1).toInt();
        send_data = true;
      }
      if (tmp[0] == 'W') {
        WeatherTemp = tmp.substring(space+1,tmp.length()-1).toInt();
        send_data = true;
      }
      if (tmp[0] == 'h') {
        Humidity = tmp.substring(space+1,tmp.length()-1).toInt();
        send_data = true;
      }
      tmp = "";
    } else {
      //Serial.println(" not found");
      tmp += character;
      send_data = false;
    }
  }
  if(send_data){
    String data = "{\"data\":{\"HeartRate\":" + String(HeartRate) +
    ",\"HumanTemp\":"+String(HumanTemp) + 
    ",\"Humidity\":"+String(Humidity) + 
    ",\"WeatherTemp\":"+String(WeatherTemp) +"}}"; // send to @shadow/data/update 
    Serial.println(data);
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@shadow/data/update", msg); 
    // send massage to html
  //  data = case_send;
  //  data.toCharArray(msg, (data.length() + 1));
    client.publish("@msg/feedback", msg);
  }
}
