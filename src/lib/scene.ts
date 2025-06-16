import Paddle from "./paddle";
import PongTable from "./pongTable";
import SquareBall from "./squareBall";

// Input parameters
const TABLE_LENGTH: number	= 1000;
const TABLE_WIDTH: number	= 600;
const PADDLE_LENGTH: number = 1;
const PADDLE_WIDTH: number 	= 100;
const PADDLE_GAP_TO_BACKWALL: number = 70;
const PADDLE_SPEED: number	= 15;
const BALL_LENGTH: number 	= 10;
const BALL_SPEED_X: number	= 10;
const BALL_SPEED_Y: number	= 7;

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

	private movePaddle(paddle: Paddle, command: string) {
		if (command === "UP") {
			paddle.cornerTopLeft.y -= paddle.speed;
			if (paddle.cornerTopLeft.y < 0)
				paddle.cornerTopLeft.y = 0;
		}
		if (command === "DOWN") {
			paddle.cornerTopLeft.y += paddle.speed;
			if (paddle.cornerTopLeft.y + paddle.width > this.pongTable.width)
				paddle.cornerTopLeft.y = this.pongTable.width - paddle.width;
		}
	}

	private static isOverlapedRanges(start1:number, end1:number, start2: number, end2:number): boolean {
		if (end1 < start2 || end2 < start1)
			return false;
		else
			return true;
	}

	private moveBall(): Array<number> {
		const goal: Array<number> = [0, 0];
		const nextPosX: number = this.ball.cornerTopLeft.x + this.ball.speedX;
		const nextPosY: number = this.ball.cornerTopLeft.y + this.ball.speedY;
		let finalPosX: number = this.ball.cornerTopLeft.x;
		let finalPosY: number = this.ball.cornerTopLeft.y;;
		let finalSpeedX: number = this.ball.speedX;
		let finalSpeedY: number = this.ball.speedY;

		if (nextPosY <= 0) {
			finalPosY = -nextPosY;
			finalSpeedY = -this.ball.speedY;
		} else if (nextPosY >= this.pongTable.width - this.ball.width) {
			finalPosY = 2 * this.pongTable.width - nextPosY - 2 * this.ball.width;
			finalSpeedY = -this.ball.speedY;
		}
		if (nextPosX < 0 || nextPosX > this.pongTable.length - this.ball.length) {
			if (nextPosX < 0)
				goal[1] = 1;
			else
				goal[0] = 1;
			finalPosX = ballPosX;
			finalPosY = ballPosY;
			finalSpeedX = Scene.randomNegate(BALL_SPEED_X);
			finalSpeedY = Scene.randomNegate(BALL_SPEED_Y);
		} else {
			if (nextPosX <= this.paddle1.cornerTopLeft.x + this.paddle1.length && this.ball.cornerTopLeft.x > this.paddle1.cornerTopLeft.x + this.paddle1.length) {
				// current Y pos check
				// if (Scene.isOverlapedRanges(this.ball.cornerTopLeft.y,
				// 	this.ball.cornerTopLeft.y + this.ball.width,
				// 	this.paddle1.cornerTopLeft.y,
				// 	this.paddle1.cornerTopLeft.y + this.paddle1.width)) {}
				if (this.isPaddleHit()) {
						finalPosX = 2 * this.paddle1.cornerTopLeft.x + 2 * this.paddle1.length - nextPosX;
						finalSpeedX = -this.ball.speedX;
				} else {
					finalPosX = nextPosX;
					finalPosY = nextPosY;
				}
			} else if (nextPosX >= this.paddle2.cornerTopLeft.x - this.ball.length && this.ball.cornerTopLeft.x < this.paddle2.cornerTopLeft.x - this.ball.length) {
				// if (Scene.isOverlapedRanges(this.ball.cornerTopLeft.y,
				// 	this.ball.cornerTopLeft.y + this.ball.width,
				// 	this.paddle2.cornerTopLeft.y,
				// 	this.paddle2.cornerTopLeft.y + this.paddle1.width)) {}
				if (this.isPaddleHit()) {
						finalPosX = 2 * this.paddle2.cornerTopLeft.x - nextPosX -  2 * this.ball.length;
						finalSpeedX = -this.ball.speedX;
				} else {
					finalPosX = nextPosX;
					finalPosY = nextPosY;
				}
			} else {
				finalPosX = nextPosX;
				finalPosY = nextPosY;
			}
		}
		this.ball.cornerTopLeft.x = finalPosX;
		this.ball.cornerTopLeft.y = finalPosY;
		this.ball.speedX = finalSpeedX;
		this.ball.speedY = finalSpeedY;
		return goal;
	}

	public calcScene(p1Command: string, p2Command: string): Array<number> {
		this.movePaddle(this.paddle1, p1Command);
		this.movePaddle(this.paddle2, p2Command);
		const goal: Array<number> = this.moveBall();
		return goal;
	}

	public isPaddleHit(): boolean {
		let dxEntry, dxExit, dyEntry, dyExit: number;
		let paddle: Paddle;
		if (this.ball.speedX > 0) {
			paddle = this.paddle2;
			dxEntry = paddle.cornerTopLeft.x - this.ball.cornerTopLeft.x - this.ball.length;
			dxExit	= paddle.cornerTopLeft.x + paddle.length - this.ball.cornerTopLeft.x;
		} else if (this.ball.speedX < 0) {
			paddle = this.paddle1;
			dxEntry = this.ball.cornerTopLeft.x - paddle.cornerTopLeft.x - paddle.length;
			dxExit	= this.ball.cornerTopLeft.x + this.ball.width - paddle.cornerTopLeft.x;
		} else {
			return false;
		}

		if (this.ball.speedY > 0) {
			dyEntry = paddle.cornerTopLeft.y - this.ball.cornerTopLeft.y - this.ball.width;
			dyExit	= paddle.cornerTopLeft.y + paddle.width - this.ball.cornerTopLeft.y;
		} else if (this.ball.speedY < 0) {
			dyEntry = this.ball.cornerTopLeft.y - paddle.cornerTopLeft.y - paddle.width;
			dyExit = this.ball.cornerTopLeft.y + this.ball.width - paddle.cornerTopLeft.y;
		} else {
			return false;
		}

		const txEntry: number = dxEntry / Math.abs(this.ball.speedX);
		const txExit: number = dxExit / Math.abs(this.ball.speedX);
		const tyEntry: number = dyEntry / Math.abs(this.ball.speedY);
		const tyExit: number = dyExit / Math.abs(this.ball.speedY);

		const entryTime = Math.max(txEntry, tyEntry);
		const exitTime = Math.min(txExit, tyExit);

		if (entryTime > exitTime || dxEntry < 0 && dyEntry < 0 || entryTime > 1)
			return false;
		else
			return true;
	}
}
