import Client from "../../../pkg/ws/client";
import WS_SERVER from "./handlers";

type MatchScoreUpdateInfo = {
    player1Score: number,
    player2Score: number,
}

export default function sendMatchScoreUpdate(client:Client, score: MatchScoreUpdateInfo) {
    client.send(WS_SERVER.Error, score)
}
