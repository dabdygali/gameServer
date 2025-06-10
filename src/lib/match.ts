import sendMatchOver from "../api/ws/serverSideHandlers/matchOver";
import sendMatchStart from "../api/ws/serverSideHandlers/matchStart";
import sendSync from "../api/ws/serverSideHandlers/syncData";
import Client from "../pkg/ws/client";
import Player from "./player";
import Scene from "./scene"
import Server from "./server";
import User from "./user";

// Input parameters
const POINTS_TO_WIN: number = 10;
const TIME_TO_CONNECT: number = 30000; // in milliseconds
const TIME_TO_RECONNECT: number = 30000; // in milliseconds
const TICK_RATE: number = 20; // times per second (Hz)

// Initializtion data
const TICK_PERIOD: number = 1000 / TICK_RATE; // in milliseconds

export default class Match {
	private readonly player1:	Player;
	private readonly player2:	Player;
	public readonly  scene:		Scene;
	private			 timeoutId: NodeJS.Timeout | null = null;
	private			 timeoutStamp: number | null = null;
	private 		 intervalId: NodeJS.Timeout | null = null;
	public readonly	id:			number;
	private			result:		"P1WIN" | "P2WIN" | "LIVE" | "FAIL" = "LIVE";
	private			score:		Array<number>;
	private			status:		"CREATED" | "STARTED" | "SETTLED" = "CREATED";

	constructor(id: number, user1: User, user2: User) {
		this.player1 = new Player(user1);
		this.player2 = new Player(user2);
		this.id = id;
		this.score = [0, 0];
		this.scene = new Scene();
		this.result = "LIVE";
		this.status = "CREATED";
		this.timeoutId = null;
		this.timeoutStamp = null;
		this.intervalId = null;

		this.startGameOverTimer(TIME_TO_CONNECT);
	}

	public getStatus() {
		return this.status;
	}

	public getPlayer1() {
		return this.player1;
	}

	public getPlayer2() {
		return this.player2;
	}

	public getResult() {
		return this.result;
	}
	
	public getScore() {
		return this.score;
	}

	public getPlayerByUserId(userId: number): Player | undefined {
		if (this.player1.id === userId)
			return this.player1;
		if (this.player2.id === userId)
			return this.player2;
		return undefined;
	}

	public playerStatusChanged(player: Player) {
		if (this.player1.isOnline && this.player2.isOnline && this.status !== "SETTLED")
			this.play();
		else if (this.status === "STARTED")
			this.pause();
	}

	private startGameOverTimer(delay?: number) {
		if (this.timeoutId)
			throw new Error(`Match ID ${this.id}: startGameOverTimer called while timer is already active`);
		this.timeoutStamp = Date.now() + (delay ?? TIME_TO_RECONNECT);
		this.timeoutId = setTimeout(() => this.gameOver(), delay ?? TIME_TO_RECONNECT);
	}

	private stopGameOverTimer() {
		if (this.timeoutId)
			clearTimeout(this.timeoutId);
		this.timeoutStamp = null;
		this.timeoutId = null;
	}

	private startInterval(callback: () => void, delay?: number) {
		if (this.intervalId)
			throw new Error(`Match ID ${this.id}: startInterval called while is already active`);
		this.intervalId = setInterval(callback, delay ?? TICK_PERIOD);
	}

	private stopInterval() {
		if (this.intervalId)
			clearInterval(this.intervalId);
		this.intervalId = null;
	}

	private simulateTick() {
		// TODO
		// scene calcs
		const goal: Array<number> = this.scene.calcScene(this.player1.command, this.player2.command);
		// update scores
		this.score[0] += goal[0];
		this.score[1] += goal[1];
		// sync front
		const gameState = this.getGameState();
		sendSync(this.player1.client as Client, gameState);
		sendSync(this.player2.client as Client, gameState);
		// if someone wins stopInterval
		// call gameOver;
	}

	private play() {
		this.stopGameOverTimer();
		sendMatchStart(this.player1.client as Client);
		sendMatchStart(this.player2.client as Client);
		this.startInterval(() => this.simulateTick, TICK_PERIOD);
	}

	private gameOver() {
		this.stopInterval();
		this.stopGameOverTimer();

		switch (this.status) {
			case "CREATED":
				this.result = "FAIL";
				break;
			case "STARTED":
				if (this.score[0] >= POINTS_TO_WIN)
					this.result = "P1WIN";
				else if (this.score[1] >= POINTS_TO_WIN)
					this.result = "P2WIN";
				else if (this.player1.isOnline && !this.player2.isOnline)
					this.result = "P1WIN";
				else if (!this.player1.isOnline && this.player2.isOnline)
					this.result = "P2WIN";
				else
					this.result = "FAIL";
				break;
			case "SETTLED":
				break;
			default:
				break;
		}
		this.status = "SETTLED";
		if (this.player1.isOnline)
			sendMatchOver(this.player1.client as Client, this.result);
		if (this.player2.isOnline)
			sendMatchOver(this.player2.client as Client, this.result);
		Server.settleMatch(this);
	}

	private pause() {
		this.stopInterval();
		this.startGameOverTimer(TIME_TO_RECONNECT);
	}

	public getTimoutStamp(): number | null {
		return this.timeoutStamp;
	}

	public getMatchInfo() {
		return {
			player1: {
				id: this.player1.id,
				score: this.score[0],
				isOnline: this.player1.isOnline,
			},
			player2: {
				id: this.player2.id,
				score: this.score[1],
				isOnline: this.player2.isOnline,
			},
			timeoutStamp: this.timeoutStamp,
			scene: {
				table: {
					length: this.scene.pongTable.length,
					width: this.scene.pongTable.width,
				},
				paddle1: {
					length: this.scene.paddle1.length,
					width: this.scene.paddle1.width,
					topLeftCornerPosX: this.scene.paddle1.cornerTopLeft.x,
					topLeftCornerPosY: this.scene.paddle1.cornerTopLeft.y,
					speed: this.scene.paddle1.speed,
				},
				paddle2: {
					length: this.scene.paddle2.length,
					width: this.scene.paddle2.width,
					topLeftCornerPosX: this.scene.paddle2.cornerTopLeft.x,
					topLeftCornerPosY: this.scene.paddle2.cornerTopLeft.y,
					speed: this.scene.paddle2.speed,
				},
				ball: {
					length: this.scene.ball.length,
					width: this.scene.ball.width,
					topLeftCornerPosX: this.scene.ball.cornerTopLeft.x,
					topLeftCornerPosY: this.scene.ball.cornerTopLeft.y,
					speedX: this.scene.ball.speedX,
					speedY: this.scene.ball.speedY
				},
			}
		}
	}

	public getGameState() {
		return {
			paddle1: {
				topLeftCornerPosX: this.scene.paddle1.cornerTopLeft.x,
				topLeftCornerPosY: this.scene.paddle1.cornerTopLeft.y,
			},
			paddle2: {
				topLeftCornerPosX: this.scene.paddle2.cornerTopLeft.x,
				topLeftCornerPosY: this.scene.paddle2.cornerTopLeft.y,
			},
			ball: {
				topLeftCornerPosX: this.scene.ball.cornerTopLeft.x,
				topLeftCornerPosY: this.scene.ball.cornerTopLeft.y,
				speedX: this.scene.ball.speedX,
				speedY: this.scene.ball.speedY
			},
		}
	}
}
