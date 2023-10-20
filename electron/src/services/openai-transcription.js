const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const OpenAI = require('openai')

// Set the path for the .env file located two directories up from the current directory
const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath })

// Initialize the OpenAI API with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Converts an audio file into text using the OpenAI API.
 *
 * @param {string} audio_file_path - The path to the audio file that needs to be transcribed.
 * @param {string} [model='whisper-1'] - The transcription model to use. Default is 'whisper-1'.
 * @returns {Promise<string>} - A promise that resolves with the transcribed text or rejects with an error.
 *
 * @example
 *
 * const transcription = await speechToText("/path/to/audio/file.mp3");
 * console.log(transcription);
 */
function speechToText(audio_file_path, model) {
  model = model || 'whisper-1'

  return openai.audio.transcriptions
    .create({
      file: fs.createReadStream(audio_file_path),
      model: model,
    })
    .then((transcription) => transcription.text)
}

module.exports = {
  speechToText,
}
