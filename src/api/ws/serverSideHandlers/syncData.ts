import Client from "../../../pkg/ws/client"
import WS_SERVER from "./handlers"

// TODO
type GameState = {
	paddle1: {
		topLeftCornerPosX: number,
		topLeftCornerPosY: number,
	},
	paddle2: {
		topLeftCornerPosX: number,
		topLeftCornerPosY: number,
	},
	ball: {
		topLeftCornerPosX: number,
		topLeftCornerPosY: number,
		speedX: number,
		speedY: number,
	},
}


export default function sendSync(client:Client, gameState: GameState) {
    client.send(WS_SERVER.Sync, gameState)
}
