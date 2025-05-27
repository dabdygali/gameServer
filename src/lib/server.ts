class Server {
	static #instance: Server;
	static #isInternalConstructing: boolean = false;

	private constructor() {
		if (!Server.#isInternalConstructing)
			throw new TypeError("Server is not constructable");
		Server.#isInternalConstructing = false;
	}

	static getInstance() :Server {
		if (Server.#instance === undefined) {
			Server.#isInternalConstructing = true;
			Server.#instance = new Server();
		}
		return Server.#instance;
	}
}
