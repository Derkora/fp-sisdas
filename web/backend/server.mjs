import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()
const PORT = 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(cors())
app.use(express.json())

app.post('/log', (req, res) => {
    const { result, timestamp } = req.body
    const logLine = `[${timestamp}] Result: ${result}\n`
    const logPath = path.join(__dirname, 'result.log')

    fs.appendFile(logPath, logLine, (err) => {
        if (err) {
            console.error('Gagal menulis log:', err)
            return res.status(500).json({ message: 'Gagal menulis log' })
        }
        res.status(200).json({ message: 'Log berhasil disimpan' })
    })
})

// 👇 This allows external devices to connect (e.g. from phone to laptop)
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Server logging aktif di http://0.0.0.0:${PORT}`)
})
