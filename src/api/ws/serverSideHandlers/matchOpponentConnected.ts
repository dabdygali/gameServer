import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

type MatchOpponentConnectedInfo = {
    timeLeft?: number,
}

export default function sendMatchOpponentConnected(client:Client, isAllConnected: boolean) {
    
    const payload:MatchOpponentConnectedInfo = {
        timeLeft: isAllConnected ? 5 : undefined
    }

    client.send(WS_SERVER.MatchOpponentConnected, payload)
}