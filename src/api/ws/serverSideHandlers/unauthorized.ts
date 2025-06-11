import Client from "../../../pkg/ws/client";
import WS_SERVER from "./handlers";

export default function sendUnauthorized(client:Client) {
    client.send(WS_SERVER.Unauthorized);
}   