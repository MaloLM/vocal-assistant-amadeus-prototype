import { fastify, FastifyReply, FastifyRequest } from 'fastify' // FastifyInstance
import Chat from './gptStream'
import dotenv from 'dotenv'

// Load environment variables from a .env file
dotenv.config()

// Initialize Chat instance to interact with GPT stream
const chat = new Chat()

/**
 * Creates a Fastify application instance with specific logger settings.
 *
 * @type {import('fastify').FastifyInstance}
 */
export const fastifyApp = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})

/**
 * API endpoint to handle chat requests.
 *
 * @route POST /api/request
 * @param {FastifyRequest} request - The request object containing the chat request.
 * @param {FastifyReply} reply - The reply object used to send back the response.
 * @returns {FastifyReply} - Returns the reply object with the chat response and a status code.
 *
 */
fastifyApp.post('/api/request', {
  handler: async (
    request: FastifyRequest<{
      Body: {
        request: string
      }
    }>,
    reply: FastifyReply
  ) => {
    const body = request.body
    const response = await chat.send(body.request)
    reply.send({
      message: `${response}`,
    })
    return reply.code(201) // bad practice to fix !
  },
})

/**
 * Root endpoint to provide a basic response.
 *
 * @route GET /
 * @returns {Object} - Returns a JSON object with a greeting message.
 *
 * @example
 * GET /
 *
 * response: {
 *   hello: "Hello world"
 * }
 */
fastifyApp.get('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: `Hello world` }
})

/**
 * Starts the Fastify server on a specified port.
 *
 * @param {number} port - The port on which the Fastify server should listen.
 */
export async function main(port: number) {
  console.log('Node version:', process.version)
  await fastifyApp.listen({
    port: port,
  })
}
