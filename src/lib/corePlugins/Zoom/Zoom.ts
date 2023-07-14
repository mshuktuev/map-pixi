import { App } from '../../App';
import { Plugin } from '../../coreUtils';

export class Zoom extends Plugin {
	private currentZoom: number;
	private minZoom: number;
	private maxZoom: number;
	constructor(app: App) {
		super(app);
		this.minZoom = app.config.minZoom;
		this.maxZoom = app.config.maxZoom;
		this.currentZoom = this.minZoom;
	}

	public init(): void {
		this.createListeners();
		this.dispatchEvent({
			type: 'loaded',
		});
	}

	private createListeners(): void {
		this.app.mainContainer.on('wheel', this.handleZoom.bind(this));
	}

	private handleZoom(e: WheelEvent): void {
		let delta = e.deltaY;
		if (e.deltaMode > 0) delta *= 100;
		const scaleMultiplier = this.getScaleMultiplier(delta);

		if (scaleMultiplier !== 1) {
			this.zoom(scaleMultiplier);
		}
	}

	private zoom(scale: number) {
		const newZoom = this.fixZoomValue(this.currentZoom * scale);

		if (newZoom >= this.minZoom && newZoom <= this.maxZoom && newZoom !== this.currentZoom) {
			this.currentZoom = newZoom;
			this.app.mainContainer.scale.set(this.currentZoom);
			this.app.dispatchEvent({
				type: 'zoom',
				detail: {
					zoom: this.currentZoom,
				},
			});
		}
	}

	private fixZoomValue(value: number): number {
		if (value > this.maxZoom) return this.maxZoom;
		if (value < this.minZoom) return this.minZoom;
		return value;
	}

	private getScaleMultiplier(delta: number) {
		const sign = Math.sign(delta),
			deltaAdjustedSpeed = Math.min(0.25, Math.abs((0.1 * delta) / 128));

		return 1 - sign * deltaAdjustedSpeed;
	}
}
