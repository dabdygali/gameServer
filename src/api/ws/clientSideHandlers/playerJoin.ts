import Server from "../../../lib/server";
import { isTokenValid } from "../../../pkg/jwt/JwtGenerator";
import Client from "../../../pkg/ws/client";
import WebSocketRequest from "../../../pkg/ws/request";
import example from "../exampleMatch";
import sendAuthorized from "../serverSideHandlers/authorized";
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
    sendAuthorized(client);
}
