import Match from "../../../lib/match";
import Server from "../../../lib/server";
import { isTokenValid } from "../../../pkg/jwt/JwtGenerator";
import Client from "../../../pkg/ws/client";
import WebSocketRequest from "../../../pkg/ws/request";
import sendAuthorized from "../serverSideHandlers/authorized";
import sendMatchOpponentConnected from "../serverSideHandlers/matchOpponentConnected";
import sendUnautorized from "../serverSideHandlers/unauthorized";
import WS_CLIENT from "./handlers";

export default async function playerMatchJoin(client:Client, request: WebSocketRequest<WS_CLIENT>) {
    
    // Receive accessToken from payload
    const payload = request.payload as {accessToken: string};
    if (!payload || !payload.accessToken) {
        return sendUnautorized(client);
    }
    
    // Validate token and if it's valid get its payload
    const tokenPayload = await isTokenValid(payload.accessToken) as {userId: number}
    if (!tokenPayload || !tokenPayload.userId) {
        return sendUnautorized(client);
    }

	client.setUserId(tokenPayload.userId);
	sendMatchOpponentConnected(client);
	try {
		Server.joinClient(client);
	} catch(e) {
		sendUnautorized(client);
		return;
	}
    
	const match: Match = Server.findMatchByUserId(tokenPayload.userId) as Match;
	if (match === undefined)
		throw new Error(`Match for user ID ${tokenPayload.userId} not found`);

	// TODO send init data
    const isOpponentConnected = false;
    const isMatchInProgress = false;
    const matchInfo = match.getMatchInfo();

    sendAuthorized(client, matchInfo)
    
    // If opponent is connected and match is in progress
    if (isOpponentConnected && isMatchInProgress) {
        // const opponent = new Client()
        // sendMatchOpponentReconnected(opponent, true);
    
    // If opponet is connected and match is not in progress
    } else if (isOpponentConnected) {
        // const opponent = new Client()
        // sendMatchOpponentConnected(opponent, true);
    }
}
