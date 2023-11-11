import http from 'http'
import { Server as WebSocketServer, WebSocket } from 'ws'
import { logToFile } from './fileManager'

// Define the WebSocket server instance
export let wss: WebSocketServer

// State to check if the WebSocket server is running
let isWSServerRunning = false

/**
 * Sends a message to all connected clients.
 *
 * @param {string} message - The message to send.
 */
export function sendMessage(message: string) {
  if (wss.clients.size > 0) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message || '')
      }
    })
  }
}

/**
 * Starts the WebSocket server and sets up connection and message event listeners.
 *
 * @param {http.Server} httpServer - The HTTP server instance to bind to.
 */
export async function startWSServer(httpServer: http.Server) {
  wss = new WebSocketServer({ server: httpServer })

  wss.on('connection', (ws) => {
    logToFile('New WebSocket connection.')

    ws.on('message', async (message) => {
      logToFile(`WebSocket received a message: ${message}`)
    })

    ws.on('error', (error) => {
      logToFile(`WebSocket Error: ${error}`)
    })
  })

  isWSServerRunning = true
  logToFile('WebSocket server started.')
}

/**
 * Terminates all client connections and stops the WebSocket server.
 */
export function stopWSServer() {
  if (!isWSServerRunning) {
    return
  }

  wss.clients.forEach((client) => client.terminate())
  wss.close(() => {
    console.log('WebSocket server closed')
  })
  isWSServerRunning = false
}
