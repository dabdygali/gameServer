import Match from "../../../lib/match";
import Player from "../../../lib/player";
import Server from "../../../lib/server";
import Client from "../../../pkg/ws/client";
import WebSocketRequest from "../../../pkg/ws/request";
import WS_CLIENT from "./handlers";

export default function playerMoveDown(client:Client, request: WebSocketRequest<WS_CLIENT>) {
	const userId: number = client.getUserId() as number;
	if (typeof userId !== 'number' || Number.isNaN(userId) || !Number.isFinite(userId))
		throw new Error(`User ID of the client connection ${client.id} is not recognized.`);
	const match: Match = Server.findMatchByUserId(userId) as Match;
	if (match === undefined)
		throw new Error(`Match for user ID ${userId} not found`);
	const player: Player = match.getPlayerByUserId(userId) as Player;
	if (player === undefined)
		throw new Error(`Player entity for user ID ${userId} in match ID ${match.id} not found`);
	player.command = "DOWN";
}
