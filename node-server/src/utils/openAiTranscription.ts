import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import OpenAI from 'openai'

// Load environment variables from the specified .env path
const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Initialize the OpenAI API client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Converts the provided audio file to text using OpenAI's transcription service.
 * 
 * @param {string} audio_file_path - The path to the audio file to be transcribed.
 * @param {string} [model='whisper-1'] - The model to use for transcription. Default is 'whisper-1'.
 * @returns {Promise<string>} A promise that resolves to the transcribed text of the audio file.
 */
export async function speechToText(
  audio_file_path: string,
  model: string = 'whisper-1'
) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audio_file_path),
    model: model,
  })

  return transcription.text
}
