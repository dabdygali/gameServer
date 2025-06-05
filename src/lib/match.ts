import { timingSafeEqual } from "crypto";
import Player from "./player";
import Scene from "./scene"
import User from "./user";

// Input parameters
const MAX_SCORE: number = 10;
const DISCONN_TIMEOUT: number = 30000; //in milliseconds

export default class Match {
	private readonly player1:	Player;
	private readonly player2:	Player;
	private readonly scene:		Scene;
	private			 timeoutId: number | null = null;
	private 		 intervalId: number | null = null;
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
}
