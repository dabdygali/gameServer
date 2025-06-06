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
	private readonly scene:		Scene;
	private			 timeoutId: NodeJS.Timeout | null = null;
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
		this.intervalId = null;

		this.startFailTimer(TIME_TO_CONNECT);
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

	private fail() {
		this.stopInterval();
		this.stopFailTimer();
		if (this.status === "CREATED" || (!this.player1.isOnline && !this.player2.isOnline))
			this.result = "FAIL";
		else if (this.status === "STARTED") {
			if (this.player1.isOnline)
				this.result = "P1WIN";
			else
				this.result = "P2WIN";
		}
		this.status = "SETTLED";
		Server.settleMatch(this);
	}

	public playerStatusChanged(player: Player) {
		if (this.player1.isOnline && this.player2.isOnline && this.status !== "SETTLED")
		{
			this.play();
		} else if (this.status === "STARTED") {
			this.pause();
		}
	}

	private startFailTimer(delay?: number) {
		if (this.timeoutId)
			throw new Error(`Match ID ${this.id}: startFailTimer called while timer is already active`);
		this.timeoutId = setTimeout(() => this.fail(), delay ?? TIME_TO_RECONNECT);
	}

	private stopFailTimer() {
		if (this.timeoutId)
			clearTimeout(this.timeoutId);
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
		// update scores
		// if someone wins stopInterval
		// call gameOver;
	}

	private play() {
		this.stopFailTimer();
		this.startInterval(() => this.simulateTick, TICK_PERIOD);
	}

	private gameOver() {
		this.stopInterval();
		this.stopFailTimer();
		this.status = "SETTLED";
		if (this.score[0] > this.score[1])
			this.result = "P1WIN";
		else
			this.result = "P2WIN";
		Server.settleMatch(this);
	}

	private pause() {
		this.stopInterval();
		this.startFailTimer(TIME_TO_RECONNECT);
	}
}
