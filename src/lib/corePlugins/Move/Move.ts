import { App } from '../../App';
import { Plugin } from '../../coreUtils';

export class Move extends Plugin {
	// events: string[] = ['loaded'];
	private currentMove: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0,
	};
	private imageInfo: {
		width: number;
		height: number;
		offsetX: number;
		offsetY: number;
	} = {
		width: 0,
		height: 0,
		offsetX: 0,
		offsetY: 0,
	};
	private bounds: {
		minY: number;
		minX: number;
		maxY: number;
		maxX: number;
	} = {
		minX: 0,
		minY: 0,
		maxX: 0,
		maxY: 0,
	};
	private startPosition: { x: number; y: number } | null = null;

	constructor(app: App) {
		super(app);
	}

	init() {
		this.dispatchEvent({
			type: 'loaded',
		});
		this.app.addEventListener('imageInfo', (e) => {
			this.imageInfo = e.detail;
			console.log(this.imageInfo);

			this.calcBounds();
			const changed = this.fixOutOfBounds();
			if (changed) this.move();
			console.log(this.bounds);
		});
		this.createListeners();
	}

	calcBounds() {
		const boundX = Math.abs(this.imageInfo.offsetX / 2);
		const boundY = Math.abs(this.imageInfo.offsetY / 2);
		this.bounds.minX = -boundX;
		this.bounds.maxX = boundX;
		this.bounds.minY = -boundY;
		this.bounds.maxY = boundY;
	}

	createListeners() {
		this.app.mainContainer.on('pointerdown', (e) => {
			this.startPosition = {
				x: e.clientX,
				y: e.clientY,
			};
		});

		this.app.mainContainer.on('pointerup', () => {
			this.startPosition = null;
		});

		this.app.mainContainer.on('pointermove', (e) => {
			if (this.startPosition) {
				const difX = e.clientX - this.startPosition.x;
				const difY = e.clientY - this.startPosition.y;
				this.currentMove.x += difX;
				this.currentMove.y += difY;
				this.startPosition = {
					x: e.clientX,
					y: e.clientY,
				};
				this.fixOutOfBounds();
				this.move();
			}
		});
	}

	move() {
		this.app.mainContainer.position.x = this.currentMove.x;
		this.app.mainContainer.position.y = this.currentMove.y;
	}

	fixOutOfBounds() {
		const init = {
			x: this.currentMove.x,
			y: this.currentMove.y,
		};
		if (this.currentMove.x <= this.bounds.minX) {
			this.currentMove.x = this.bounds.minX;
		}
		if (this.currentMove.x >= this.bounds.maxX) {
			this.currentMove.x = this.bounds.maxX;
		}
		if (this.currentMove.y <= this.bounds.minY) {
			this.currentMove.y = this.bounds.minY;
		}
		if (this.currentMove.y >= this.bounds.maxY) {
			this.currentMove.y = this.bounds.maxY;
		}
		return init.x !== this.currentMove.x || init.y !== this.currentMove.y;
	}
}
