const path = require('path')
const WebSocket = require('ws')
const eventModule = require('../eventModule.js')
const { textToSpeech } = require('./elevenlabs-tts')
const {
  saveTtsAudio,
  getFileBuffer,
  logToFile,
  generateRandomFileName,
} = require('./fileManager')
const { Queue } = require('./queue.js')
const { Dictionary } = require('./dictionary.js')

let ws
let retryCount = 0 // Counts the number of websocket reconnection attempts.
const retryMax = 10
let increment = 0
let idQueue = new Queue() // Queue to maintain order of incoming IDs.
let audioDictionnary = new Dictionary() // Store ID to audio file name mapping.
let phraseDictionnary = new Dictionary() // Store ID to phrase text mapping.

/**
 * Initializes the WebSocket connection.
 */
function initializeWebSocket() {
  const port = 8023
  ws = new WebSocket(`ws://localhost:${port}`)

  ws.onopen = () => {
    eventModule.emit('send-to-renderer', 'ws-status', 'connected')
  }

  ws.onmessage = async (event) => {
    const gptString = event.data
    logToFile('Incoming GPT phrase: ' + gptString)

    const id = increment++
    logToFile('INCREMENT AFTER:', increment)
    idQueue.push(id)
    logToFile('ID Queue: ' + idQueue)

    let fileName = await generateVoice(gptString)
    phraseDictionnary.add(id, gptString)
    audioDictionnary.add(id, fileName)
  }

  audioDictionnary.on(Dictionary.Event.AddElement, async () => {
    console.log('Receive new element')
    let idIsCorrect = true
    while (idIsCorrect && !idQueue.isEmpty()) {
      // Check if the id is the first in the queue

      const id = idQueue.peek()
      console.log(`Processing item: ${id}`)
      const fileName = audioDictionnary.pop(id)
      console.log(audioDictionnary.toString())
      if (!fileName) {
        idIsCorrect = false
        return
      }
      await playNextAudio(fileName, id)
      idQueue.pop()
    }
  })

  ws.onerror = () => {
    logToFile('Socket error triggered client disconnection')
    handleDisconnection()
  }

  ws.onclose = () => {
    handleDisconnection()
  }
}

/**
 * Handles WebSocket disconnection and retries connection if retryCount is less than retryMax.
 */
function handleDisconnection() {
  logToFile('Client disconnection')
  // Notify render process of deconection
  eventModule.emit('send-to-renderer', 'ws-status', 'disconnected')

  if (retryCount < retryMax) {
    // 10 reconnection attempts
    logToFile('Connection attempt N° ' + retryCount)
    retryCount++
    setTimeout(() => {
      initializeWebSocket()
    }, 5000) // 5 seconds between each attempt
  }
}

/**
 * Prepares and sends the audio file to the render process.
 *
 * @param {string} fileName - Name of the audio file.
 * @param {number} id - ID corresponding to the audio.
 */
async function playNextAudio(fileName, id) {
  // Prepare and send audio file to render process

  const audioPath = path.join(__dirname, `../assets/tts/${fileName}.mp3`)

  const audioBufferToSend = await getFileBuffer(audioPath)

  // Creation of an object to encapsulate data to send to renderer process
  const dataToSend = {
    id: id,
    phrase: phraseDictionnary.getValue(id),
    audioBuffer: audioBufferToSend,
  }
  console.log(
    `Send phrase to renderer ( ${dataToSend.id} ): ${dataToSend.phrase}`
  )
  eventModule.emit('send-to-renderer', 'play-audio', dataToSend)
}

/**
 * Generates voice audio for the given sentence using text-to-speech.
 *
 * @param {string} sentence - The text to generate voice for.
 * @returns {string} - The generated file name for the voice audio.
 */
async function generateVoice(sentence) {
  // Trigger TTS
  const file = await textToSpeech(sentence)
  // Generate a file name
  const fileName = generateRandomFileName()
  // Save audio file
  await saveTtsAudio(file, fileName)

  return fileName
}

exports.initializeWebSocket = initializeWebSocket
