const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

const envPath = path.join(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

async function textToSpeech(text, voiceId = 'Ifejixv4yhOXa7MFXEPZ') {
  const voiceURL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await axios({
    method: 'POST',
    url: voiceURL,
    data: {
      text: text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
        use_speaker_boost: true,
        style: 0,
      },
      model_id: 'eleven_multilingual_v1',
      optimize_streaming_latency: 0, // 0 is the less optimized but better result
    },
    headers: {
      Accept: 'audio/mpeg',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    responseType: 'stream',
  });

  return response;
}

module.exports = { textToSpeech };
