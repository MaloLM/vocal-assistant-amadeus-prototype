import * as fs from 'fs'
import dotenv from 'dotenv'
import * as path from 'path'

// Configure the path to the environment variables
const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath })

// Path to the log file for the WebSocket server
const logFilePath = path.resolve(__dirname, '../files/logs/websocket-logs.txt')

/**
 * Logs messages to a predefined file.
 *
 * @param {string} message - The message to log.
 */
export function logToFile(message: string) {
    /** Writes given message to the congigured log file */
    const formattedMessage = `[${new Date().toISOString()}] ${message}\n`
    fs.appendFile(logFilePath, formattedMessage, (err) => {
      if (err) {
        console.error(`Failed to write to log file: ${err}`)
      }
    })
  }