import Client from "../../../pkg/ws/client"
import WS_SERVER from "./server"

type GameState = {
    player1Pos:number
    player2Pos:number
    ballX:number
    ballY:number
}


export default function (client:Client, gameState: GameState) {
    client.info(WS_SERVER.SYNC, gameState)
}