import { useEffect, useRef } from 'react'
import mqtt, { MqttClient } from 'mqtt'

interface MQTTOptions {
    onMessage: (topic: string, message: string) => void
    onStatusChange?: (status: 'connected' | 'disconnected') => void
}

export default function useMQTT({ onMessage, onStatusChange }: MQTTOptions) {
    const clientRef = useRef<MqttClient | null>(null)

    useEffect(() => {
        // pakai ip yang ada di file .env
        const client = mqtt.connect('')
        clientRef.current = client

        client.on('connect', () => {
            console.log('Connected to MQTT broker')
            client.subscribe('esp32/sensor/suhu')
            client.subscribe('esp32/sensor/kelembaban')
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
            console.log('MQTT Publish:', topic, message)
        } else {
            console.warn('MQTT not connected. Cannot publish:', topic, message)
        }
    }

    const publishWithRetry = (topic: string, message: string, retries = 5, delay = 300) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish(topic, message)
            console.log('MQTT Publish:', topic, message)
        } else if (retries > 0) {
            console.log('Publish retrying...', topic, message, 'retries left:', retries)
            setTimeout(() => {
                publishWithRetry(topic, message, retries - 1, delay)
            }, delay)
        } else {
            console.warn('MQTT not connected after retry. Cannot publish:', topic, message)
        }
    }

    return { publish, publishWithRetry }
}
