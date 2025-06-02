import { FastifyInstance } from "fastify";
import WebSocketProvider from "../../pkg/ws/ws";
import WS_CLIENT from "./clientSideHandlers/handlers";
import playerMoveDown from "./clientSideHandlers/playerMoveDown";
import playerMoveUp from "./clientSideHandlers/playerMoveUp";
import playerStop from "./clientSideHandlers/playerStop";
import playerMatchJoin from "./clientSideHandlers/playerJoin";


const connectionListeners = {
    onConnect: undefined,
    onDisconnect: undefined,
    onError: undefined,    
}

const provider = new WebSocketProvider<WS_CLIENT>("/game/api/ws", connectionListeners)
.on(WS_CLIENT.MoveUp, playerMoveUp)
.on(WS_CLIENT.MoveDown, playerMoveDown)
.on(WS_CLIENT.Stop, playerStop)
.on(WS_CLIENT.Join, playerMatchJoin);

export default async function registerWebSocketRoutes(fastify: FastifyInstance) {
    provider.register(fastify);
} 
