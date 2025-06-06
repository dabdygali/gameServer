import Server from "./server";
import User from "./user";

type PaddleCommand = "STOP" | "UP" | "DOWN";

export default class Player extends User {
	public command: PaddleCommand = "STOP";
	private _isOnline: boolean = false;

	public constructor(user: User) {
		super(user.id);
		this.command = "STOP";
		this._isOnline = false;
	}

	public get isOnline(): boolean {
		return this._isOnline;
	}

	public set isOnline(status: boolean) {
		if (this._isOnline !== status)
			Server.playerStatusChanged(this);
		this._isOnline = status;
	}
}
