#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Your server URL (Change this to match your PHP script location)
String domain = "http://192.168.100.2"
String URL = "/floodNavigation/upload.php";

// wifi creds
const char* ssid = "Ramos Family";
const char* password = "11110000";
// Ultrasonic pins
const int trigPin = 12;  // GPIO12 or D6 sa esp
const int echoPin = 14;  // GPIO14 or D5 sa esp

#define SOUND_VELOCITY 0.034
#define CM_TO_INCH 0.393701


long duration;
float distanceCm;
float distanceInch;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);

void connectWiFi() {
  WiFi.mode(WIFI_OFF);
  delay(1000);
  WiFi.mode(WIFI_STA);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("connected to: ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

String getFormattedTime() {
  time_t rawTime = timeClient.getEpochTime();
  struct tm* timeInfo = gmtime(&rawTime);

  char buffer[20];
  sprintf(buffer, "%04d-%02d-%02d %02d:%02d:%02d",
          timeInfo->tm_year + 1900, timeInfo->tm_mon + 1, timeInfo->tm_mday,
          timeInfo->tm_hour, timeInfo->tm_min, timeInfo->tm_sec);

  return String(buffer);
}

void setup() {
  Serial.begin(115200);
  connectWiFi();  // Connect sa wifi
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  timeClient.begin();
  timeClient.update();
}


void sendData() {
  if (WiFi.status() == WL_CONNECTED) {

    // Pulse ng ultrasonic
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);

    // Para sa distance
    distanceCm = duration * SOUND_VELOCITY / 2;

    // Create POST data with the measured distance
    String postData = "distance=" + String(distanceCm)
                      + "&sensor_id=2";

    // Create a WiFiClient object to pass to the HTTPClient.begin method
    WiFiClient client;
    HTTPClient http;
    http.begin(client, (domain+URL));  // Use the correct URL

    // Set the content type header correctly
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    int httpCode = http.POST(postData);  // Send the POST request
    String payload = http.getString();   // Get the response payload

    // Log the HTTP response and request details
    Serial.print("URL: ");
    Serial.println(URL);
    Serial.print("DATA: ");
    Serial.println(postData);
    Serial.print("httpCode: ");
    Serial.println(httpCode);
    Serial.print("Payload: ");
    Serial.println(payload);
  } else {
    Serial.println("WiFi not connected");
    connectWiFi();
  }
}
void loop() {
    timeClient.update(); // Refresh time

    // Get formatted timestamp
    String timestamp = getFormattedTime();

    // Check if it's the start of a new minute (seconds == 0)
    if (timeClient.getSeconds() == 0) {
        sendData();
        delay(1000);  // Avoid multiple sends in the same second
    }

    delay(500); // Check time every two second
}
