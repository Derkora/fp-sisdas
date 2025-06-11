import socket
import time
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import db, credentials

# Zona waktu Jakarta
tz = pytz.timezone("Asia/Jakarta")

# Ambil IP lokal dari interface aktif
def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close()
    return ip

# Inisialisasi Firebase sekali saja
def init_firebase():
    FIREBASE_CRED_PATH = "firebase-admin.json"
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://camlert-default-rtdb.asia-southeast1.firebasedatabase.app"
    })

# Upload data ke Firebase
def upload_to_firebase(ip):
    ref = db.reference("camlert/devices/broker")
    ref.set({
        "ip": ip,
        "status": "active",
        "timestamp": datetime.now(tz).strftime('%d-%m-%Y %H:%M:%S')
    })
    print("[INFO] Uploaded IP:", ip)

# === Main loop ===
if __name__ == "__main__":
    init_firebase()
    while True:
        try:
            ip = get_ip()
            upload_to_firebase(ip)
            time.sleep(5)  # Delay 5 detik
        except Exception as e:
            print("[ERROR]", e)
            time.sleep(5)
