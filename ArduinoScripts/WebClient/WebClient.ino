#include <SPI.h>
#include <DHT.h>
#include <Ethernet.h>

//Define pins
#define DHTPIN 7     // what pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE); //// Initialize DHT sensor for normal 16mhz Arduino

//Variables
const int pResistor = A0; // Photoresistor at Arduino analog pin A0
const int ledPin=9; // Led pin at Arduino pin 9
float temp; //Temperature sensor value
float hum; //Humidity sensor Value
int lightVal; //Light sensor Value

// Arduino mac address
byte mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDA, 0x02 };

//Server IP
char server[] = "192.168.1.116";


// Static IP address for Arduino to use if the DHCP fails to assign
IPAddress ip(192, 168, 1, 118);
IPAddress myDns(192, 168, 0, 1);

//EthernetClient for internet connections
EthernetClient client;

// Variables to measure the speed
unsigned long beginMicros, endMicros;
unsigned long byteCount = 0;
bool printWebData = true;  // set to false for better speed measurement

void setup() {
  //Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; //wait for serial port to connect. Needed for native USB port only
  }

  //Start the sensors
  dht.begin();
  //Set light sensor pins
  pinMode(ledPin, OUTPUT);  // Set lepPin - 9 pin as an output
  pinMode(pResistor, INPUT);// Set pResistor - A0 pin as an input (optional)

  //read data from sensors
  hum = dht.readHumidity();
  temp = dht.readTemperature();
  lightVal = analogRead(pResistor);

  //Collect sensor data in a string for easy access
  String queryString = String("?data=") + String(temp) + String(";") + String(hum) + String(";") + String(lightVal);
  Serial.print(queryString);

  // start the Ethernet connection:
  Serial.println("Initialize Ethernet with DHCP:");
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    
    // Check for Ethernet hardware present
    if (Ethernet.hardwareStatus() == EthernetNoHardware) {
      Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
      while (true) {
        delay(1); // do nothing, no point running without Ethernet hardware
      }
    }
    if (Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Ethernet cable is not connected.");
    }
    //try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip, myDns);
  } else {
    Serial.print("  DHCP assigned IP ");
    Serial.println(Ethernet.localIP());
  }
  //give the Ethernet shield a second to initialize:
  delay(1000);
  Serial.print("connecting to ");
  Serial.print(server);
  Serial.println("...");

  // if you get a connection, report back via serial:
  if (client.connect(server, 25252)) {
    Serial.print("connected to ");
    Serial.println(client.remoteIP());
    
    //Make a HTTP request:
    client.println("GET /arduino" + queryString + " HTTP/1.1");
    client.println("Host: 192.168.1.116:25252");
    client.println("User-Agent: Arduino/1.0");
    client.println("Content-Type: application/json; charset=utf-8");
    client.println("Apikey: iCMrmPuB2KKtscylfIGoFfdKl8x9SIWBdMQbZHH0vn1O2xcUejjog9QXyY5D");
    client.println("Connection: close");
    client.println();
  } else {
    //if you didn't get a connection to the server:
    Serial.println("connection failed");
  }
  beginMicros = micros();
}

void loop() {
  // if there are incoming bytes available
  // from the server, read them and print them:
  int len = client.available();
  if (len > 0) {
    byte buffer[80];
    if (len > 80) len = 80;
    client.read(buffer, len);
    if (printWebData) {
      Serial.write(buffer, len); // show in the serial monitor (slows some boards)
    }
    byteCount = byteCount + len;
  }

  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    endMicros = micros();
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();
    Serial.print("Received ");
    Serial.print(byteCount);
    Serial.print(" bytes in ");
    float seconds = (float)(endMicros - beginMicros) / 1000000.0;
    Serial.print(seconds, 4);
    float rate = (float)byteCount / seconds / 1000.0;
    Serial.print(", rate = ");
    Serial.print(rate);
    Serial.print(" kbytes/second");
    Serial.println();

    while (true) {
        delay(1); // do nothing, no point running without Ethernet hardware
      }
    }
    //Delay 5 seconds
    delay(5000);
    
    //Run
    setup();
}
