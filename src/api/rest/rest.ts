import { FastifyInstance } from 'fastify'
import { IHandler } from '../../pkg/handler/handler'
import { restHandler } from './handlers/restHandler'

const routes: IHandler[] = [
  {
    method: 'POST',
    route: '/game/internal/match',
    handler: restHandler,
  }
]

export async function registerRestRoutes(app: FastifyInstance) {
  for (const route of routes) {
    app.route({
      method: route.method,
      url: route.route,
      handler: route.handler
    })
  }
}
