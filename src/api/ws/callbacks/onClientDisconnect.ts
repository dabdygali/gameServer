import Match from "../../../lib/match";
import Player from "../../../lib/player";
import Server from "../../../lib/server";
import Client from "../../../pkg/ws/client";
import sendMatchOpponentDisconnected from "../serverSideHandlers/matchOpponentDisconnected";

function updatePlayerStatusOffline(client: Client) {
	const userId: number = client.getUserId() as number;
	if (userId === undefined)
		return;

	const match: Match = Server.findMatchByUserId(userId) as Match;
	if (match === undefined)
		return;
    
	const player = match.getPlayerByUserId(userId) as Player;
	if (player === undefined)
		return;
	player.isOnline = false;
	sendMatchOpponentDisconnected(client);
}

function onClientDisconnect(client: Client) {
	try {
		updatePlayerStatusOffline(client);
	} catch (e) {
		console.error("Error during set client offline in the match:", e);
	}
}
 
export default onClientDisconnect;
