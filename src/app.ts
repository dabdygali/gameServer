import Fastify from 'fastify'
import { registerRestRoutes } from './api/rest/rest'
import registerWebSocketRoutes from './api/ws/ws'
import RadishClient from './pkg/client/client'
import Config from './config/Config'
import { setUpJwtGenerator } from './pkg/jwt/JwtGenerator'
import Server from "./lib/server"

const app = Fastify()

async function main() {
  const config = new Config()

  console.log({config})

  const cacheClient = new RadishClient({
    host: config.radishHost,
    port: config.radishPort,
  })
  
  setUpJwtGenerator(cacheClient);


  await registerRestRoutes(app)
  await registerWebSocketRoutes(app)


  app.listen({ port: config.port }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log("Server listening at " + address)
  })
}

main()
