# sisdas

jalankan mqtt

```sh
mosquitto -c mosquitto.conf -v
```

dengan informasi

```sh
1750091054: mosquitto version 2.0.18 starting
1750091054: Config loaded from mosquitto.conf.
1750091054: Opening websockets listen socket on port <port>.
1750091054: Opening ipv6 listen socket on port <port>.
1750091054: Opening ipv4 listen socket on port <port>.
1750091054: mosquitto version 2.0.18 running
```

akses mqtt

```sh
mosquitto_sub -h <ip_broker> -p <port> -t esp32/sensor/suhu
mosquitto_sub -h <ip_broker> -p <port> -t esp32/sensor/kelembaban
```

tembak ke topic ini untuk relay

```sh
esp32/relay/control
```
