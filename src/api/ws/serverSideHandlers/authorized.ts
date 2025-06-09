import Client from "../../../pkg/ws/client";
import WS_SERVER from "./handlers";

type MatchEnterInfo = {
	player1: {
		id: number,
		score: number,
		isOnline: boolean,
	},
	player2: {
		id: number,
		score: number,
		isOnline: boolean,
	},
	timeoutStamp: number | null,
	scene: {
		table: {
			length: number,
			width: number,
		},
		paddle1: {
			length: number,
			width: number,
			topLeftCornerPosX: number,
			topLeftCornerPosY: number,
			speed: number,
		},
		paddle2: {
			length: number,
			width: number,
			topLeftCornerPosX: number,
			topLeftCornerPosY: number,
			speed: number,
		},
		ball: {
			length: number,
			width: number,
			topLeftCornerPosX: number,
			topLeftCornerPosY: number,
			speedX: number,
			speedY: number,
		},
	}
}

export default function sendAuthorized(client:Client, info:MatchEnterInfo) {
    client.send(WS_SERVER.Authorized, info)
}
