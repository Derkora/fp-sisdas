# sisdas


FINAL PROJECT SISTEM CERDAS - KELOMPOK 9
| NRP | Nama |
| ------ | ------ |
| 5027221005 | Bhisma Elki Pratama |
| 5027221014 | Siti Nur Ellyzah |
| 5027221021 | Steven FIgo |
| 5027221030 | Atha Rahma Arianti |
| 5027221035 | Azzahra Sekar Rahmadina |

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
