import Client from "../../../pkg/ws/client";
import WebSocketRequest from "../../../pkg/ws/request";
import WS_CLIENT from "./handlers";

export default function playerMoveDown(client:Client, request: WebSocketRequest<WS_CLIENT>) {
    console.log(`Player ${client.id} is moving down`);
}