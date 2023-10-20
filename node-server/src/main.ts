import http from 'http'
import dotenv from 'dotenv'
import path from 'path'
import { fastifyApp, main } from './utils/fastifyServer'
import * as websocketServer from './utils/webSocketServer'

// Initialize the dotenv module to load environment variables
dotenv.config()

// Configure the path to the environment variables
const envPath = path.join(__dirname, '../.env')
dotenv.config({ path: envPath })

// Retrieve the API and WebSocket ports from environment variables
const API_PORT = process.env.API_PORT
const WEB_SOCKET_PORT = process.env.WEB_SOCKET_PORT

// Create an HTTP server instance
export const httpServer = http.createServer()

// Start listening on the specified WebSocket port
httpServer.listen(WEB_SOCKET_PORT, () => {
  console.log(`WebSocket is listening on ${WEB_SOCKET_PORT}`)
})

/**
 * Start the Fastify and WebSocket servers.
 */
async function startServer() {
  await main(Number(API_PORT))
  websocketServer.startWSServer(httpServer)
}

/**
 * Handles the graceful shutdown of the WebSocket, HTTP, and Fastify servers.
 */
function onShutdown() {
  console.log('Shutting down...')
  websocketServer.stopWSServer()
  httpServer.close(() => {
    console.log('HTTP server closed')
  })
  fastifyApp.close(() => {
    console.log('Fastify server closed')
  })
}

// Register shutdown handlers for graceful shutdown on termination and interrupt signals
process.on('SIGTERM', onShutdown)
process.on('SIGINT', onShutdown)

// Start the main server function
startServer()
