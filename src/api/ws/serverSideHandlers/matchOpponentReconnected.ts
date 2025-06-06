import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

type MatchOpponentReconnectedInfo = {
    timeLeft?: number,
}

export default function sendMatchOpponentReconnected(client:Client, isAllConnected: boolean) {
    
    const payload:MatchOpponentReconnectedInfo = {
        timeLeft: isAllConnected ? 5 : undefined
    }

    client.send(WS_SERVER.MatchOpponentReconnected, payload)
}