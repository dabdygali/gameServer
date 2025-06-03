import Coordinate from "./coordinate";

// Input Parameters
const SQUAREBALL_DFT_LENGTH: number	= 10;
const SQUAREBALL_DFT_CORNER_TOP_LEFT_X: number = 0;
const SQUAREBALL_DFT_CORNER_TOP_LEFT_Y: number = 0;
const SQUAREBALL_DFT_SPEED_X: number = 0;
const SQUAREBALL_DFT_SPEED_Y: number = 0;

// Initializing data

export default class SquareBall {
	public readonly	length: number;
	public readonly width: number;
	public			cornerTopLeft: Coordinate;
	public			speedX: number;
	public			speedY: number;

	public constructor(	options?: { length?: number;
									cornerTopLeft?: Coordinate;
									originX?: number;
									originY?: number;
									speedX?: number;
									speedY?: number }) {
		this.length = options?.length ?? SQUAREBALL_DFT_LENGTH;
		this.width = this.length;
		this.cornerTopLeft = new Coordinate(options?.originX ?? options?.cornerTopLeft?.x ?? SQUAREBALL_DFT_CORNER_TOP_LEFT_X,
											options?.originY ?? options?.cornerTopLeft?.y ?? SQUAREBALL_DFT_CORNER_TOP_LEFT_Y)
		this.speedX = options?.speedX ?? SQUAREBALL_DFT_SPEED_X;
		this.speedY = options?.speedY ?? SQUAREBALL_DFT_SPEED_Y;
	}
}
