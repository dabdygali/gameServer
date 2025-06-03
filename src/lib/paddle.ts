import Coordinate from "./coordinate";

const PADDLE_DFT_LENGTH: number	= 1;
const PADDLE_DFT_WIDTH: number	= 100;
const PADDLE_DFT_CORNER_TOP_LEFT_X: number = 0;
const PADDLE_DFT_CORNER_TOP_LEFT_Y: number = 0;
const PADDLE_DFT_SPEED: number = 2;

export default class Paddle {
	public readonly	length: number;
	public readonly width: number;
	public			cornerTopLeft: Coordinate;
	public			speed: number;

	public constructor(	options?: { length?: number;
									width?: number;
									cornerTopLeft?: Coordinate;
									originX?: number;
									originY?: number;
									speed?: number }) {
		this.length = options?.length ?? PADDLE_DFT_LENGTH;
		this.width = options?.width ?? PADDLE_DFT_WIDTH;
		this.cornerTopLeft = new Coordinate(options?.originX ?? options?.cornerTopLeft?.x ?? PADDLE_DFT_CORNER_TOP_LEFT_X,
											options?.originY ?? options?.cornerTopLeft?.y ?? PADDLE_DFT_CORNER_TOP_LEFT_Y)
		this.speed = options?.speed ?? PADDLE_DFT_SPEED;
	}
}
