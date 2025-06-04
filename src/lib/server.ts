import Match from "./match"
import User from "./user";

export default class Server {
	static readonly #isInternalConstructing: boolean = false;

	static #matches:Array<Match> = [];
	static #participants:Map<User, Match> = new Map<User, Match>();

	private constructor() {
		throw new TypeError("Server is not constructable");
	}

	public static createMatch(matchId: number, user1Id: number, user2Id: number) {
		if (Server.findMatchByUserId(matchId))
			throw new Error(`Match with ID ${matchId} already exists`);
		if (Server.findUserByID(user1Id))
			throw new Error(`User with ID ${user1Id} already exists`);
		if (Server.findUserByID(user2Id))
			throw new Error(`User with ID ${user2Id} already exists`);
		const user1 = new User(user1Id);
		const user2 = new User(user2Id);
		const match = new Match(matchId, user1, user2);
		Server.#matches.concat(match);
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
}
