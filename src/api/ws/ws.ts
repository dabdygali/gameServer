import { FastifyInstance } from "fastify";
import WebSocketProvider from "../../pkg/ws/ws";
import WS_CLIENT from "./clientSideHandlers/handlers";
import playerMoveDown from "./clientSideHandlers/playerMoveDown";
import playerMoveUp from "./clientSideHandlers/playerMoveUp";
import playerStop from "./clientSideHandlers/playerStop";
import playerMatchJoin from "./clientSideHandlers/playerJoin";
import Client from "../../pkg/ws/client";
import Server from "../../lib/server";
import Match from "../../lib/match";
import Player from "../../lib/player";

function updatePlayerStatus(client: Client) {
	const userId: number = client.getUserId() as number;
	if (userId === undefined)
		throw new Error(`User with ID ${userId} not found`);
	const match: Match = Server.findMatchByUserId(userId) as Match;
	if (match === undefined)
		throw new Error(`Match for user ID ${userId} not found`);
	const player = match.getPlayerByUserId(userId) as Player;
	if (player === undefined)
		throw new Error(`Player entity for user ID ${userId} not found`);
	player.isOnline = false;
}

const connectionListeners = {
    onConnect: undefined,
    onDisconnect: updatePlayerStatus,
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
