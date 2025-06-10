import Fastify from 'fastify'
import { registerRestRoutes } from './api/rest/rest'
import registerWebSocketRoutes from './api/ws/ws'
import RadishClient from './pkg/client/client'
import Config from './config/Config'
import { setUpJwtGenerator } from './pkg/jwt/JwtGenerator'
import Server from "./lib/server"
import loggerMiddleware from './pkg/middlewares/loggerMiddleware'
import cors from '@fastify/cors'

const app = Fastify()

async function main() {
  const config = new Config()

  const cacheClient = new RadishClient({
    host: config.radishHost,
    port: config.radishPort,
  })

  await app.register(cors, {
    origin: true, // разрешить ВСЕ источники
    methods: ['GET', 'POST', 'PUT',' PATCH', 'DELETE', 'OPTIONS']
  });
  
  setUpJwtGenerator(cacheClient);


  await registerRestRoutes(app)
  await registerWebSocketRoutes(app)

  app.addHook('onRequest', loggerMiddleware);

  app.listen({ port: config.port, host: config.host }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1) 
    }
    console.log("Server listening at " + address)
  })
}

main()
