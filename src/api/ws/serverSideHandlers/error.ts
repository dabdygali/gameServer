import Client from "../../../pkg/ws/client";
import WS_SERVER from "./handlers";

export default function sendError(client:Client, message:string) {
    client.send(WS_SERVER.Error, {message})
}
