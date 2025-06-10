import Client from "../pkg/ws/client";
import Match from "./match"
import Player from "./player";
import User from "./user";

export default class Server {
	static readonly #isInternalConstructing: boolean = false;

	//static #matches:Array<Match> = [];
	static #participants:Map<User, Match> = new Map<User, Match>();

	private constructor() {
		throw new TypeError("Server is not constructable");
	}

	public static createMatch(matchId: number, user1Id: number, user2Id: number) {
		if (Server.findMatchById(matchId))
			throw new Error(`Match with ID ${matchId} already exists`);
		if (Server.findUserByID(user1Id))
			throw new Error(`User with ID ${user1Id} already exists`);
		if (Server.findUserByID(user2Id))
			throw new Error(`User with ID ${user2Id} already exists`);
		const user1 = new User(user1Id);
		const user2 = new User(user2Id);
		const match = new Match(matchId, user1, user2);
		//Server.#matches.concat(match);
		Server.#participants.set(user1, match);
		Server.#participants.set(user2, match);
	}

	public static findUserByID(userId: number): User | undefined {
		for (const user of Server.#participants.keys()) {
			if (user.id === userId)
				return user;
		}
		return undefined;
	}

	public static findMatchByUserId(userId: number): Match | undefined {
		const user: User = Server.findUserByID(userId) as User;
		if (user === undefined)
			throw new Error(`User with ID ${userId} not found`);
		return Server.#participants.get(user);
	}

	public static findMatchById(matchId: number): Match | undefined {
		for (const match of Server.#participants.values()) {
			if (match.id === matchId)
				return match;
		}
		return undefined;
	}

	public static joinClient(client: Client) {
		const userId: number = client.getUserId() as number;
		if (userId === undefined)
			throw new Error(`User with ID ${userId} not found`);
		const match: Match = Server.findMatchByUserId(userId) as Match;
		if (match === undefined)
			throw new Error(`Match for user ID ${userId} not found`);
		const player: Player = match.getPlayerByUserId(userId) as Player;
		if (player === undefined)
			throw new Error(`Player entity for user ID ${userId} in match ID ${match.id} not found`);
		player.client = client;
		player.isOnline = true;
	}

	public static playerStatusChanged(player: Player) {
		const match: Match = Server.findMatchByUserId(player.id) as Match;
		if (match === undefined)
			throw new Error(`Match for user ID ${player.id} not found`);
		match.playerStatusChanged(player);
	}

	public static deleteMatch(match: Match) {
		const keysToDelete: Array<User> = [];
		for (const [key, value] of Server.#participants) {
			if (value === match)
				keysToDelete.push(key);
		}
		for (const key of keysToDelete)
			Server.#participants.delete(key);
	}

	public static async postMatchResult(match: Match) {
		const status: number = (match.getResult() === "P1WIN" || match.getResult() === "P2WIN") ? 1 : 2;
		const results: Array<{userId: number, place: number}> = [
			{
				userId: match.getPlayer1().id,
				place: match.getResult() === "P1WIN" ? 0 : 1
			}, 
			{
				userId: match.getPlayer2().id,
				place: match.getResult() === "P2WIN" ? 0 : 1
			}
		];
		try {
			const response = await fetch(`http://localhost:5001/mmrs/internal/match/${match.id}/rate`, {
				headers: { 'Content-Type': 'application/json' },
				method: "POST",
				body: JSON.stringify({	
					status,
					results
				})
			});
			} catch (e) {
				console.log("Error trying to post match results to MMRS", e);
			}
	}

	public static settleMatch(match: Match) {
		Server.postMatchResult(match);
		match.getPlayer1().client?.close();
		match.getPlayer2().client?.close();
		Server.deleteMatch(match);
	}
}
