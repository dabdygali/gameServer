import Client from "../../../pkg/ws/client";
import WS_SERVER from "./handlers";

export default function sendUnautorized(client:Client) {
    client.info(WS_SERVER.Unauthorized);
}   