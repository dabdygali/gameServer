import Client from "../../../pkg/ws/client";
import WS_SERVER from "./handlers";

type MatchEnterInfo = {
    timeLeft: number,
}

export default function authorized(client:Client, info?:MatchEnterInfo) {
    client.send(WS_SERVER.Authorized, info)
}