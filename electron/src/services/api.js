const axios = require('axios')

/**
 * Sends the provided text to the server for processing.
 *
 * @param {string} userText - The text input provided by the user.
 * @returns {Promise<Object>} A promise that resolves to the server's response or an error.
 */
async function sendTextToServer(userText) {
  // URL of the server's API endpoint
  const serverUrl = 'http://localhost:3000/api/request'

  try {
    // Sending a POST request to the server with the user's text
    const response = await axios.post(serverUrl, {
      request: userText,
    })

    return response
  } catch (error) {
    // Handle and log any errors that might occur during the request
    console.error('Erreur lors de l’envoi du texte au serveur:', error)
  }
}

module.exports = { sendTextToServer }
