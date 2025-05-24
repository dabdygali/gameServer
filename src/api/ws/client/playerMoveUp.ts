import Client from "../../../pkg/ws/client";
import WebSocketRequest from "../../../pkg/ws/request";
import example from "../exampleMatch";
import WS_CLIENT from "./client";

export default function playerMoveUp(client:Client, request: WebSocketRequest<WS_CLIENT>) {
    console.log(`Player ${client.id} is moving up`);

    example.addClient(client)
}