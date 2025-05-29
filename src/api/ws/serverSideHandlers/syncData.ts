import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

type GameState = {
    player1Pos:number
    player2Pos:number
    ballX:number
    ballY:number
}


export default function sendSync(client:Client, gameState: GameState) {
    client.info(WS_SERVER.Sync, gameState)
}