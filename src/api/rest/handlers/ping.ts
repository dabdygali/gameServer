import { FastifyRequest, FastifyReply } from 'fastify'

export async function pingHandler(request: FastifyRequest, reply: FastifyReply) {
  return { pong: "pong" }
}
