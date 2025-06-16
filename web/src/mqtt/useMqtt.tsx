import { useEffect, useRef } from 'react'
import mqtt, { MqttClient } from 'mqtt'

interface MQTTOptions {
    onMessage: (topic: string, message: string) => void
    onStatusChange?: (status: 'connected' | 'disconnected') => void
}

export default function useMQTT({ onMessage, onStatusChange }: MQTTOptions) {
    const clientRef = useRef<MqttClient | null>(null)

    useEffect(() => {
        const client = mqtt.connect('ws://192.168.213.78:9000')
        clientRef.current = client

        client.on('connect', () => {
            console.log('Connected to MQTT broker')
            client.subscribe('esp32/sensor/suhu')
            client.subscribe('esp32/sensor/kelembaban')
            // client.subscribe('esp32/relay/contr')
            onStatusChange?.('connected')
        })

        client.on('message', (topic, message) => {
            onMessage(topic, message.toString())
        })

        client.on('close', () => {
            console.log('Disconnected from MQTT broker')
            onStatusChange?.('disconnected')
        })

        return () => {
            client.end()
        }
    }, [onMessage, onStatusChange])

    const publish = (topic: string, message: string) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish(topic, message)
        } else {
            console.warn('MQTT not connected. Cannot publish:', topic, message)
        }
    }

    return { publish }
}



// import { useEffect } from 'react'
// import mqtt from 'mqtt'

// interface MQTTOptions {
//     onMessage: (topic: string, message: string) => void
//     onStatusChange?: (status: 'connected' | 'disconnected') => void
// }

// export default function useMQTT({ onMessage, onStatusChange }: MQTTOptions) {
//     useEffect(() => {
//         const client = mqtt.connect('ws://192.168.213.78:9000')

//         client.on('connect', () => {
//             console.log('Connected to MQTT broker')
//             client.subscribe('esp32/sensor/suhu')
//             client.subscribe('esp32/sensor/kelembaban')
//             onStatusChange?.('connected')
//         })

//         client.on('message', (topic, message) => {
//             onMessage(topic, message.toString())
//         })

//         client.on('close', () => {
//             console.log('Disconnected from MQTT broker')
//             onStatusChange?.('disconnected')
//         })

//         return () => {
//             client.end()
//         }
//     }, [onMessage, onStatusChange])
// }
