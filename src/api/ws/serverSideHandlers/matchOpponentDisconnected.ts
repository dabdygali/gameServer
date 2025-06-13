import Match from "../../../lib/match";
import Server from "../../../lib/server";
import Client from "../../../pkg/ws/client"
import sendError from "./error";
import WS_SERVER from "./handlers"

type MatchOpponentDisconnectedInfo = {
    timeLeft?: number,
}

export default function sendMatchOpponentDisconnected(client:Client) {
    
	const userId: number = client.getUserId() as number;
	if (userId === undefined)
		sendError(client, `User with ID ${userId} not found`);
	const match: Match = Server.findMatchByUserId(userId) as Match;
	if (match === undefined)
		sendError(client, `Match for user ID ${userId} not found`);
	let opponent: Client;
	if (match.getPlayer1().id === userId)
		opponent = match.getPlayer2().client as Client;
	else
		opponent = match.getPlayer1().client as Client;
	opponent.send(WS_SERVER.MatchOpponentDisconnected, {timeoutStamp: match.getTimoutStamp()});
}
