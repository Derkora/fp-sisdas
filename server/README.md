```sh
sudo apt update
sudo apt install mosquitto mosquitto-clients
sudo mosquitto -c /etc/mosquitto/mosquitto.conf
```

sudo nano /etc/mosquitto/mosquitto.conf
```conf
listener 1883
allow_anonymous true
```
