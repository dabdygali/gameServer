import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

export default function sendMatchOver(client:Client, matchResult: string) {
    client.send(WS_SERVER.MatchOver, {matchResult});
}
