import Paddle from "./paddle";
import PongTable from "./pongTable";
import SquareBall from "./squareBall";

// Input parameters
const TABLE_LENGTH: number	= 1000;
const TABLE_WIDTH: number	= 600;
const PADDLE_LENGTH: number = 1;
const PADDLE_WIDTH: number 	= 100;
const PADDLE_GAP_TO_BACKWALL: number = 70;
const PADDLE_SPEED: number	= 2;
const BALL_LENGTH: number 	= 10;
const BALL_SPEED_X: number	= 3;
const BALL_SPEED_Y: number	= 2;

// Initialization data
const tableCenterX: number	= TABLE_LENGTH / 2;
const tableCenterY: number	= TABLE_WIDTH / 2;
const paddle1PosX: number	= PADDLE_GAP_TO_BACKWALL;
const paddle1PosY: number	= tableCenterY - (PADDLE_WIDTH / 2);
const paddle2PosX: number	= TABLE_LENGTH - PADDLE_GAP_TO_BACKWALL - PADDLE_LENGTH;
const paddle2PosY: number	= paddle1PosY;
const ballPosX: number		= tableCenterX - (BALL_LENGTH / 2);
const ballPosY: number		= tableCenterY - (BALL_LENGTH / 2);

export default class Scene {
	public readonly pongTable: PongTable;
	public readonly paddle1: Paddle;
	public readonly paddle2: Paddle;
	public readonly ball: SquareBall;

	public constructor() {
		this.pongTable = new PongTable(TABLE_LENGTH, TABLE_WIDTH);
		this.paddle1 = new Paddle({	length: PADDLE_LENGTH,
									width: PADDLE_WIDTH,
									speed: PADDLE_SPEED,
									originX: paddle1PosX,
									originY: paddle1PosY });
		this.paddle2 = new Paddle({	length: PADDLE_LENGTH,
									width: PADDLE_WIDTH,
									speed: PADDLE_SPEED,
									originX: paddle2PosX,
									originY: paddle2PosY })
		const ballSpeedX = Scene.randomNegate(BALL_SPEED_X);
		const ballSpeedY = Scene.randomNegate(BALL_SPEED_Y);
		this.ball = new SquareBall({ length: BALL_LENGTH,
									 speedX: ballSpeedX,
									 speedY: ballSpeedY,
									 originX: ballPosX,
									 originY: ballPosY })
	}

	private static randomNegate(num: number): number {
		if (Math.random() < 0.5)
			return -num;
		return num;
	}
}
