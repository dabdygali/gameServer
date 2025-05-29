import Client from "../../../pkg/ws/client";
import WebSocketRequest from "../../../pkg/ws/request";
import sendUnautorized from "../serverSideHandlers/unauthorized";
import WS_CLIENT from "./handlers";

export default function playerJoin(client:Client, request: WebSocketRequest<WS_CLIENT>) {
    
    const payload = request.payload as {accessToken: string};
    if (!payload || !payload.accessToken) {
        return sendUnautorized(client);
    }

    
}