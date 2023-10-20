const fs = require('fs')
const path = require('path')
const ffmpegPath = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')
const ffprobePath = require('ffprobe-static').path

// Init
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)
const logFilePath = path.join(__dirname, '../assets/logs/websocket-logs.txt')

// Functions

function generateRandomFileName() {
  return Math.random().toString(36).substring(7)
}

function saveAudioBlob(arrayBuffer, filepath) {
  /*
  Convert blob into buffer and store locally
  */

  const buffer = Buffer.from(arrayBuffer)
  fs.writeFileSync(filepath, buffer)
}

/**
 * Asynchronously saves the audio response from ElevenLabs to a specified file.
 *
 * @param {Object} elevenLabsResponse - The response object received from ElevenLabs. It is expected that this object has a `data` property that can be piped into a write stream.
 * @param {string} fileName - The name of the file (without extension) where the audio data should be saved.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object with the status and the file path. The structure of the returned object will be:
 *                              {
 *                                status: 'ok',
 *                                fileName: [full path to the saved file]
 *                              }
 *
 * @throws {Error} - If there's an error writing to the file, the promise will be rejected with the error.
 *
 * Note: Ensure the `fs` and `path` modules are imported and the directory structure exists to save the audio file.
 */
async function saveTtsAudio(elevenLabsResponse, fileName) {
  const filePath = path.resolve(`./src/assets/tts/${fileName}.mp3`)

  const writeStream = fs.createWriteStream(filePath)
  elevenLabsResponse.data.pipe(writeStream)

  return new Promise((resolve, reject) => {
    const responseJson = { status: 'ok', fileName: filePath }
    writeStream.on('finish', () => resolve(responseJson))

    writeStream.on('error', reject)
  })
}

/**
 * Asynchronously reads the content of a file and returns its buffer.
 *
 * @param {string} filePath - The path to the file to be read.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the file's content.
 * @throws {Error} - If there's an error reading the file, the promise will be rejected with the error.
 *
 */
function getFileBuffer(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

/**
 * Logs a message to both the console and a pre-configured log file with a timestamp.
 *
 * @param {string} message - The message to be logged.
 * @throws {Error} - If there's an error writing to the log file, it will log an error message to the console.
 *
 * @example
 * logToFile('This is a sample log message')
 * // Console output: "This is a sample log message"
 * // Log file will have an entry like: "[2023-10-17T12:34:56.789Z] This is a sample log message"
 *
 * Note: Ensure the `fs` module is imported and the `logFilePath` variable is set to the desired log file path.
 */
function logToFile(message) {
  console.log(message)
  const formattedMessage = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFile(logFilePath, formattedMessage, (err) => {
    if (err) {
      console.error(`Failed to write to log file: ${err}`)
    }
  })
}

module.exports = {
  saveAudioBlob,
  saveTtsAudio,
  getFileBuffer,
  logToFile,
  generateRandomFileName,
}
