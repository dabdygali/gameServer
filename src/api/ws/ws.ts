import { FastifyInstance } from "fastify";
import WebSocketProvider from "../../pkg/ws/ws";
import WS_CLIENT from "./client/client";
import playerMoveDown from "./client/playerMoveDown";
import playerMoveUp from "./client/playerMoveUp";
import playerStop from "./client/playerStop";


const connectionListeners = {
    onConnect: undefined,
    onDisconnect: undefined,
    onError: undefined,    
}

const provider = new WebSocketProvider<WS_CLIENT>("/", connectionListeners)
.on(WS_CLIENT.MoveUp, playerMoveUp)
.on(WS_CLIENT.MoveDown, playerMoveDown)
.on(WS_CLIENT.Stop, playerStop);

export default async function registerWebSocketRoutes(fastify: FastifyInstance) {
    provider.register(fastify);
} 