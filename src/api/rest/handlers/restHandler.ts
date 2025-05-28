import { FastifyRequest, FastifyReply } from 'fastify'

export async function restHandler(request: FastifyRequest, reply: FastifyReply) {
  return { pong: "pong" }
}
