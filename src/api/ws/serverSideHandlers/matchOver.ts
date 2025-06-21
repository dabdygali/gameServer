import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

export default function sendMatchOver(client:Client, matchResult: string, matchMode: number) {
    client.send(WS_SERVER.MatchOver, {matchResult, isTournament: matchMode === 2});
}
