#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <time.h>

// ===== Firebase Config =====
#define FIREBASE_URL "https://camlert-default-rtdb.asia-southeast1.firebasedatabase.app"

// ===== MQTT Config (Hardcoded) =====
int mqtt_port = 2050;
const char* mqtt_topic_pub_suhu = "esp32/sensor/suhu";
const char* mqtt_topic_pub_kelembaban = "esp32/sensor/kelembaban";
const char* mqtt_topic_sub = "esp32/relay/control";
String mqtt_server = "192.168.213.78";  // ← GANTI dengan IP broker MQTT milikmu

// ===== NTP Config =====
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 0;

// ===== MQTT Client =====
WiFiClient espClient;
PubSubClient client(espClient);

// ===== Pin Definitions =====
#define SENSOR1_PIN 34
#define SENSOR2_PIN 35
#define RELAY_PIN   23

// ===== Timing =====
unsigned long lastHealthCheck = 0;
unsigned long lastMQTTSend = 0;
const long intervalHealth = 5000;
const long intervalMQTT = 2000;

// ===== Global State =====
int lastSuhu = -1;
int lastKelembapan = -1;
bool relayStatus = false;

// ===== Setup =====
void setup() {
  Serial.begin(115200);
  pinMode(SENSOR1_PIN, INPUT);
  pinMode(SENSOR2_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFiManager wm;
  if (!wm.autoConnect("ESP32-Setup")) {
    Serial.println("Gagal konek WiFi. Restart...");
    ESP.restart();
  }

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  Serial.println("[INFO] MQTT Broker IP: " + mqtt_server);
  client.setServer(mqtt_server.c_str(), mqtt_port);
  client.setCallback(callback);

  Serial.println("Setup selesai.");
}

// ===== Loop =====
void loop() {
  if (!client.connected()) reconnectMQTT();
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
    if (msg == "1") {
      relayStatus = true;
      digitalWrite(RELAY_PIN, HIGH);
    } else if (msg == "0") {
      relayStatus = false;
      digitalWrite(RELAY_PIN, LOW);
    }
  }
}

// ===== Reconnect MQTT =====
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Menghubungkan MQTT ke ");
    Serial.print(mqtt_server); Serial.print(":"); Serial.print(mqtt_port); Serial.print("... ");

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

// ===== Baca Sensor (0–100%) =====
int readPercent(int analogValue) {
  return map(analogValue, 0, 4095, 0, 100);
}

// ===== Kirim Data Sensor ke MQTT =====
void sendSensorData() {
  int rawSuhu = analogRead(SENSOR1_PIN);
  int rawKelembapan = analogRead(SENSOR2_PIN);

  int suhu = readPercent(rawSuhu);
  int kelembapan = readPercent(rawKelembapan);

  lastSuhu = suhu;
  lastKelembapan = kelembapan;

  // Kirim ke MQTT (dua topik)
  client.publish(mqtt_topic_pub_suhu, String(suhu).c_str());
  Serial.println("MQTT suhu: " + String(suhu));

  client.publish(mqtt_topic_pub_kelembaban, String(kelembapan).c_str());
  Serial.println("MQTT kelembapan: " + String(kelembapan));
}

// ===== Kirim Status ke Firebase =====
void sendFirebaseUpdate() {
  HTTPClient http;
  http.begin(FIREBASE_URL "/camlert/devices/esp.json");
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"connection\":{";
  json += "\"connection\":\"connected\",";
  json += "\"timestamp\":\"" + getISOTime() + "\"";
  json += "}";
  json += "}";

  int httpResponseCode = http.PUT(json);
  Serial.print("Firebase code: "); Serial.println(httpResponseCode);
  http.end();
}


// ===== Format Waktu =====
String getISOTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "01-01-1970 00:00:00";
  char buf[30];
  strftime(buf, sizeof(buf), "%d-%m-%Y %H:%M:%S", &timeinfo);
  return String(buf);
}
