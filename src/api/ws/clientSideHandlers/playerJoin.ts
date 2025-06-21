import Match from "../../../lib/match";
import Server from "../../../lib/server";
import { isTokenValid } from "../../../pkg/jwt/JwtGenerator";
import Client from "../../../pkg/ws/client";
import Logger from "../../../pkg/ws/logger";
import WebSocketRequest from "../../../pkg/ws/request";
import sendAuthorized from "../serverSideHandlers/authorized";
import sendError from "../serverSideHandlers/error";
import sendMatchOpponentConnected from "../serverSideHandlers/matchOpponentConnected";
import sendUnauthorized from "../serverSideHandlers/unauthorized";
import WS_CLIENT from "./handlers";

export default async function playerMatchJoin(client:Client, request: WebSocketRequest<WS_CLIENT>) {
    
    // Receive accessToken from payload
    const payload = request.payload as {accessToken: string};
    if (!payload || !payload.accessToken) {
        return sendError(client, "Access token is required");
    }
    
    // Validate token and if it's valid get its payload
    const tokenPayload = await isTokenValid(payload.accessToken) as {userId: number}
    if (!tokenPayload || !tokenPayload.userId) {
        return sendUnauthorized(client);
    }

	client.setUserId(tokenPayload.userId);

	try {
		Server.joinClient(client);
	} catch(e) {
		return sendError(client, "Unable to join match");
	}
	
	try {
		sendMatchOpponentConnected(client);
	} catch (e) {
		return sendError(client, `Failed to notify the opponent: ${e}`);
	}

    const match: Match = Server.findMatchByUserId(tokenPayload.userId) as Match;
	if (match === undefined) { 
        return sendError(client, "Match not found");
    }
    const matchInfo = match.getMatchInfo();
    sendAuthorized(client, matchInfo);
}
