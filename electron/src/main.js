const { app, BrowserWindow, ipcMain } = require('electron')
const { initializeWebSocket } = require('./services/webSocket.js')
const {
  saveAudioBlob,
  logToFile,
  generateRandomFileName,
} = require('./services/fileManager.js')
const { sendTextToServer } = require('./services/api.js')
const { speechToText } = require('./services/openai-transcription.js')
const eventModule = require('./eventModule.js')
const path = require('path')

let mainWindow

/**
 * Creates and initializes the main Electron window.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600, // Initial witdh
    height: 600, // Initial height
    resizable: true, // Avoid re-sizing
    maximizable: true, // Avoid maximization
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })
  // mainWindow.webContents.openDevTools() // uncomment to open devtools menu by default, for debug purposes

  // Load the HTML file for the renderer process.
  mainWindow.loadFile('./src/renderer/index.html')
}

/**
 * Listens to custom events from the eventModule and forwards
 * them to the renderer process.
 */
eventModule.on('send-to-renderer', (message, data) => {
  mainWindow.webContents.send(message, data)
})

/**
 * IPC event listener for receiving audio blobs from the renderer process.
 *
 * 1. The received audio blob is saved.
 * 2. OpenAI API is used for audio transcription.
 * 3. The transcribed text is sent to the server.
 */
ipcMain.on('audio-blob', async (event, audioBlob) => {
  const fileName = generateRandomFileName()
  const audioPath = path.join(__dirname, `/assets/reccords/${fileName}.wav`) // Path to save audio

  saveAudioBlob(audioBlob, audioPath)

  const userText = await speechToText(audioPath).catch((error) => {
    logToFile(`Error during transcription : ${error}`)
    return 'The user you are chatting with you is facing a problem talking with you. Tell him that you were not able to reach was he said and that you are sorry aboyt that.'
  })

  logToFile(`USER SAID: ${userText}`)
  const serverResponse = await sendTextToServer(userText)
  logToFile('Server response status:', serverResponse.status)
})

// Initialize the WebSocket when the Electron app is ready.
app.on('ready', initializeWebSocket)
app.whenReady().then(createWindow)

// Quit the Electron app when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Create the main window when the Electron app is activated.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
