
const PONG_TABLE_LENGTH: number	= 1000;
const PONG_TABLE_WIDTH:	number	= 600;

export default class PongTable {
	public readonly length: number = PONG_TABLE_LENGTH;
	public readonly width:	number = PONG_TABLE_WIDTH;

	public constructor (length: number = PONG_TABLE_LENGTH, width: number = PONG_TABLE_WIDTH) {
		this.length = length;
		this.width = width;
	}
}
