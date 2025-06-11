#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <time.h>

// ===== Firebase Config =====
#define FIREBASE_URL "https://camlert-default-rtdb.asia-southeast1.firebasedatabase.app"

// ===== MQTT Config (dinamis) =====
String mqtt_server = "";
const int mqtt_port = 1883;
const char* mqtt_topic_pub = "esp32/sensor/data";
const char* mqtt_topic_sub = "esp32/relay/control";

// ===== NTP Config =====
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 25200;  // UTC+7 (Jakarta)
const int daylightOffset_sec = 0;

// ===== MQTT Client =====
WiFiClient espClient;
PubSubClient client(espClient);

// ===== Pin Definitions =====
#define SENSOR1_PIN 34
#define SENSOR2_PIN 35
#define SENSOR3_PIN 5
#define SENSOR4_PIN 4
#define RELAY_PIN   23

// ===== Timing =====
unsigned long lastHealthCheck = 0;
unsigned long lastMQTTSend = 0;
const long intervalHealth = 5000;  // 5 detik
const long intervalMQTT = 2000;    // 2 detik

// ===== Setup =====
void setup() {
  Serial.begin(115200);
  pinMode(SENSOR1_PIN, INPUT);
  pinMode(SENSOR2_PIN, INPUT);
  pinMode(SENSOR3_PIN, INPUT);
  pinMode(SENSOR4_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  // WiFi AutoConnect
  WiFiManager wm;
  if (!wm.autoConnect("ESP32-Setup")) {
    Serial.println("Gagal konek WiFi. Restart...");
    ESP.restart();
  }

  // NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // Ambil IP broker dari Firebase
  mqtt_server = fetchBrokerIP();
  if (mqtt_server == "") {
    Serial.println("Gagal ambil IP broker. Restart...");
    ESP.restart();
  }

  client.setServer(mqtt_server.c_str(), mqtt_port);
  client.setCallback(callback);

  Serial.println("Setup selesai. MQTT ke: " + mqtt_server);
}

// ===== Loop =====
void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  unsigned long now = millis();

  if (now - lastHealthCheck > intervalHealth) {
    lastHealthCheck = now;
    sendFirebaseUpdate();
  }

  if (now - lastMQTTSend > intervalMQTT) {
    lastMQTTSend = now;
    sendSensorData();
  }
}

// ===== MQTT Callback =====
void callback(char* topic, byte* message, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) msg += (char)message[i];

  Serial.print("MQTT Message ["); Serial.print(topic); Serial.print("]: "); Serial.println(msg);

  if (String(topic) == mqtt_topic_sub) {
    if (msg == "ON") digitalWrite(RELAY_PIN, HIGH);
    else if (msg == "OFF") digitalWrite(RELAY_PIN, LOW);
  }
}

// ===== Reconnect MQTT =====
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Menghubungkan MQTT...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Connected!");
      client.subscribe(mqtt_topic_sub);
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(client.state());
      Serial.println(" coba lagi dalam 3 detik");
      delay(3000);
    }
  }
}

// ===== Send Sensor via MQTT =====
void sendSensorData() {
  int s1 = analogRead(SENSOR1_PIN);
  int s2 = analogRead(SENSOR2_PIN);
  int s3 = analogRead(SENSOR3_PIN);
  int s4 = analogRead(SENSOR4_PIN);

  String payload = "{";
  payload += "\"s1\":" + String(s1) + ",";
  payload += "\"s2\":" + String(s2) + ",";
  payload += "\"s3\":" + String(s3) + ",";
  payload += "\"s4\":" + String(s4);
  payload += "}";

  client.publish(mqtt_topic_pub, payload.c_str());
  Serial.println("Data MQTT terkirim: " + payload);
}

// ===== Send Health to Firebase =====
void sendFirebaseUpdate() {
  HTTPClient http;
  http.begin(FIREBASE_URL "/camlert/devices/esp-cam.json");
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"connection\":{\"connection\":\"connected\",\"timestamp\":\"" + getISOTime() + "\"}";
  json += "}";

  int httpResponseCode = http.PUT(json);
  Serial.print("Firebase code: "); Serial.println(httpResponseCode);
  http.end();
}

// ===== Format ISO Time =====
String getISOTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "01-01-1970 00:00:00";
  char buf[30];
  strftime(buf, sizeof(buf), "%d-%m-%Y %H:%M:%S", &timeinfo);
  return String(buf);
}

// ===== Ambil IP Broker dari Firebase =====
String fetchBrokerIP() {
  HTTPClient http;
  http.begin(FIREBASE_URL "/camlert/devices/broker/ip.json");

  int httpCode = http.GET();
  String brokerIP = "";

  if (httpCode == 200) {
    brokerIP = http.getString();
    brokerIP.replace("\"", "");  // Hapus tanda kutip dari string JSON
    Serial.println("IP Broker dari Firebase: " + brokerIP);
  } else {
    Serial.print("Gagal ambil broker IP, kode: ");
    Serial.println(httpCode);
  }

  http.end();
  return brokerIP;
}
