import { uuidV4 } from './uuid'
import { TypedEmitter } from 'tiny-typed-emitter'
import dotenv from 'dotenv'
import path from 'path'
import { sendMessage } from './webSocketServer'
import { findSentence, replaceNumbersWithWords } from './phraseParser'

const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath })

// A prompt used for initializing the chat session with current date & time.
const SYSTEM_PROMPT = () => `${process.env.INIT_PROMPT}
Heure : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
`

// Defines event types for the Chat class.
interface ChatEvents {
  message: (text: string, messageId: string) => void
  fullMessage: (text: string) => void
}

/**
 * The Chat class manages interactions with the OpenAI API
 * for chat-based completions using the GPT-3.5 model.
 */
export default class Chat extends TypedEmitter<ChatEvents> {
  private _currentChat: {
    role: string
    content: any
  }[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT(),
    },
  ]
  private _controller: AbortController | null = null

  constructor() {
    if (!process.env.OPENAI_API_KEY)
      throw new Error('OPENAI_API_KEY is not set')
    super()
  }

  /**
   * Sends a message to OpenAI's API and manages the response.
   * @param {string} input - The message text to be sent.
   * @returns {Promise<string>} The full response text from OpenAI.
   */
  async send(input: string) {
    const messageId = uuidV4()

    this._currentChat.push({
      role: 'user',
      content: input,
    })

    this._controller = new AbortController()
    const signal = this._controller.signal

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: this._currentChat,
          max_tokens: 300,
          stream: true,
        }),
        signal,
      })

      if (!res.ok) {
        console.log(res)
        throw new Error(`Unexpected response ${res.statusText}`)
      }
      if (res.body === null) {
        throw new Error('Response body is null')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let text = ''
      let prevMatchLength = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, '').trim()) // Remove the "data: " prefix
          .filter((line) => line !== '' && line !== '[DONE]') // Remove empty lines and "[DONE]"
          .map((line) => JSON.parse(line))

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine
          const { delta } = choices[0]
          const { content } = delta

          if (content) {
            text += content
          }
        }
        this.emit('message', text, messageId)

        let match = findSentence(text) // Use of a regex for detecting phrases

        console.log('matches: ', match)
        if (match && match.length > prevMatchLength) {
          let toSend = replaceNumbersWithWords(match[match.length - 1])
          console.log('--- Sending to Electron -> ', toSend)
          sendMessage(toSend)
          prevMatchLength = match.length
        }
      }

      this.emit('fullMessage', text)
      this._currentChat.push({
        role: 'assistant',
        content: text,
      })

      console.log(res)
      return text
    } catch (error) {
      console.log(error)
    }
  }
}
