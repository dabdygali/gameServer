import Fastify from 'fastify'
import { registerRestRoutes } from './api/rest/rest'
import registerWebSocketRoutes from './api/ws/ws'

const app = Fastify()

async function main() {
  await registerRestRoutes(app)
  await registerWebSocketRoutes(app)

  app.listen({ port: 5002 }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log("Server listening at " + address)
  })
}

main()
