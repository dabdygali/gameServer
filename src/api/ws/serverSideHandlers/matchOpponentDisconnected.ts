import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

type MatchOpponentDisconnectedInfo = {
    timeLeft?: number,
}

export default function sendMatchOpponentDisconnected(client:Client) {
    
	// TODO
    // Should follow this logic:
    // 1. By client instance and userId inside it, try to get current match
    // 2. If current match is exists send an appropriate message to all players in the match
    // 3. If current match is not exists, do nothing (connected by misstake)
    // 4. Send in the message timeLeft that equal 30 seconds and assumes time to reconnect
    
    
    // const payload:MatchOpponentDisconnectedInfo = {
    //     timeLeft: isAllConnected ? 5 : undefined
    // }

    // client.send(WS_SERVER.MatchOpponentDisconnected, payload)
}
