import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

// TODO
type GameState = {
    player1Pos:number
    player2Pos:number
    ballX:number
    ballY:number
}


export default function sendSync(client:Client, gameState: GameState) {
    client.send(WS_SERVER.Sync, gameState)
}
