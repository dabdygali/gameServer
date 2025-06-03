
const COORDINATE_DEFAULT_X: number = 0;
const COORDINATE_DEFAULT_Y: number = 0;

export default class Coordinate {
	public x: number;
	public y: number;

	public constructor(x: number = COORDINATE_DEFAULT_X, y: number = COORDINATE_DEFAULT_Y) {
		this.x = x;
		this.y = y;
	}
}
