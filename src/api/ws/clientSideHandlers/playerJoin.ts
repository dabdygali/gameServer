import Server from "../../../lib/server";
import { isTokenValid } from "../../../pkg/jwt/JwtGenerator";
import Client from "../../../pkg/ws/client";
import WebSocketRequest from "../../../pkg/ws/request";
import example from "../exampleMatch";
import sendAuthorized from "../serverSideHandlers/authorized";
import sendMatchOpponentConnected from "../serverSideHandlers/matchOpponentConnected";
import sendMatchOpponentReconnected from "../serverSideHandlers/matchOpponentReconnected";
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
	try {
		Server.joinClient(client);
	} catch(e) {
		sendUnautorized(client);
	}
    // Assume user as this Client
    client.setUserId(tokenPayload.userId)
    
    const isOpponentConnected = false;
    const isMatchInProgress = false;
    const matchInfo = {
        player1: {id: 1, score: 0},
        player2: {id: 2, score: 0},
        timeLeft: isOpponentConnected ? 5 : 30, // 30 seconds for connect, 5 seconds for match start
        isMatchReady: isOpponentConnected ? true : undefined, // flag assumes everything is ready to start the match
    }

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
