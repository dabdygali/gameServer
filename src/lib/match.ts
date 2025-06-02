import Scene from "./scene"

export default class Match {
	public readonly	player1:	number;
	public readonly	player2:	number;
	public readonly	scene:		Scene;
	public readonly	id:			number;
	private			result:		"P1WIN" | "P2WIN" | "LIVE" | "FAIL" = "LIVE";
	private			score:		Array<number>;

	constructor(id: number, player1: number, player2: number) {
		this.player1 = player1;
		this.player2 = player2;
		this.id = id;
		this.score = [0, 0];
		this.scene = new Scene();
		this.result = "LIVE";
	}

	public getResult() {
		return this.result;
	}
	
	public getScore() {
		return this.score;
	}
}
