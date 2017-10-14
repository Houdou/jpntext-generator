import * as createjs from 'createjs-module';

export class NoiseFilter extends createjs.Filter {
	constructor(public lambda: number) {

		super();
	}

	private nd(): number {
		let u, v, w, c;

		do {
			u = 2 * Math.random() - 1;
			v = 2 * Math.random() - 1;
			w = u * u + v * v;
		} while(w == 0.0 || w >= 1.0)

		c = Math.sqrt((-2 * Math.log(w)) / w);
		return u * c;
	}

	private _applyFilter(imageData: ImageData): boolean {
		let data = imageData.data;
		let l = data.length;
		for (let i = 0; i < l; i += 4) {
			let delta = this.lambda * this.nd();

			data[i] = data[i] + delta;
			data[i+1] = data[i+1] + delta / 2;
			data[i+2] = data[i+2] + delta;
			data[i+3] = data[i+3];
		}
		return true;
	}

	clone(): createjs.Filter{
		return new NoiseFilter(this.lambda);
	}

	getBounds(): createjs.Rectangle {
		return super.getBounds();
	}

	toString(): string {
		return "[NoiseFilter]";
	}
}