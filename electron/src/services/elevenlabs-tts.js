const dotenv = require('dotenv')
const axios = require('axios')
const path = require('path')
const { logToFile } = require('./fileManager')

// Load environment variables from the .env file located two directories up.
const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath })

/**
 * Converts a text string into speech using the ElevenLabs API.
 *
 * @param {string} text - The text string to convert into speech.
 * @param {string} [voiceId='onwK4e9ZLuTAKqWW03F9'] - The identifier for the voice model. Default is 'onwK4e9ZLuTAKqWW03F9'.
 * @returns {Promise<axios.Response>} - A promise that resolves with the audio response or rejects with an error.
 *
 * @example
 *
 * const audioResponse = await textToSpeech("Hello, World!");
 * if(audioResponse) {
 *   // Handle the audio response
 * }
 */
async function textToSpeech(text, voiceId = 'onwK4e9ZLuTAKqWW03F9') {
  const voiceURL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

  // API reference: https://docs.elevenlabs.io/api-reference/text-to-speech
  const response = await axios({
    method: 'POST',
    url: voiceURL,
    data: {
      text: text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
        use_speaker_boost: true,
        style: 0, // 0 is the less optimized but yields better results.
      },
      model_id: 'eleven_multilingual_v2', // alternative: eleven_multilingual_v1
      optimize_streaming_latency: 0, // 0 is the less optimized but better result
    },
    headers: {
      Accept: 'audio/mpeg',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    responseType: 'stream',
  })

  // Log any potential errors from the API response.
  if (response.status !== 200) {
    logToFile(response.detail)
    return
  }

  return response
}

module.exports = { textToSpeech }
