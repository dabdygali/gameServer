import Client from "../../../pkg/ws/client";
import WS_SERVER from "./handlers";

type MatchEnterInfo = {
    timeLeft: number, // 30 seconds for connect, 5 seconds for match start
    player1: {
        id: number,
        score: number,
    },
    player2: {
        id: number,
        score: number,
    },
    isMatchReady?: boolean, // All players are connected to the game and can play
}

export default function sendAuthorized(client:Client, info:MatchEnterInfo) {
    client.send(WS_SERVER.Authorized, info)
}