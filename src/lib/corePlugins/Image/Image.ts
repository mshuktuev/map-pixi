import { App } from '../../App';
import * as PIXI from 'pixi.js';
import { CustomEventDispatcher, Plugin } from '../../coreUtils';

export class Image extends Plugin {
	private texture!: PIXI.Texture;
	private sprite!: PIXI.Sprite;
	private view!: PIXI.ICanvas;
	private naturalWidth: number | undefined;
	private naturalHeight: number | undefined;
	private ratio: number | undefined;
	private sizes: { width: number; height: number } | undefined;
	events = ['loaded', 'imageInfo'];

	constructor(app: App, parent?: CustomEventDispatcher) {
		super(app, parent);
		this.view = this.app.pixiApp.view;
	}

	public init() {
		this.texture = PIXI.Texture.from(this.app.config.imageUrl);
		this.sprite = new PIXI.Sprite(this.texture);
		this.texture.addListener('update', () => {
			this.calcSizes();
			this.updateSizes();

			this.app.mainContainer.addChild(this.sprite);
			this.dispatchEvent({
				type: 'loaded',
			});
			this.app.addEventListener('resize', () => {
				this.updateSizes();
			});
		});
	}

	private updateSizes() {
		this.sizes = this.cover(this.view.width, this.view.height, this.ratio);
		if (this.sizes) {
			this.sprite.width = this.sizes.width;
			this.sprite.height = this.sizes.height;
		}
		const offsets = this.calcOffsets();

		if (offsets) {
			this.sprite.x = offsets.x;
			this.sprite.y = offsets.y;
		}
		console.log({
			width: this.sizes?.width,
			height: this.sizes?.height,
			offsetX: offsets.x,
			offsetY: offsets.y,
		});

		this.dispatchEvent({
			type: 'imageInfo',
			detail: {
				width: this.sizes?.width,
				height: this.sizes?.height,
				offsetX: offsets.x,
				offsetY: offsets.y,
			},
		});
	}

	calcSizes() {
		this.naturalWidth = this.texture.baseTexture.width;
		this.naturalHeight = this.texture.baseTexture.height;
		this.ratio = this.naturalWidth / this.naturalHeight;
	}
	calcOffsets() {
		const offset = {
			x: 0,
			y: 0,
		};
		if (!this.sizes) return offset;

		if (this.sizes.width < this.view.width) {
			offset.x = (this.sizes.width - this.view.width) / 2;
		} else if (this.sizes.width > this.view.width) {
			offset.x = (this.view.width - this.sizes.width) / 2;
		}

		if (this.sizes.height < this.view.height) {
			offset.y = (this.sizes.height - this.view.height) / 2;
		} else if (this.sizes.height > this.view.height) {
			offset.y = (this.view.height - this.sizes.height) / 2;
		}

		return offset;
	}

	cover(width?: number, height?: number, ratio?: number) {
		if (width === undefined || height === undefined || ratio === undefined) return undefined;

		if (width > height) {
			return {
				width: width / ratio >= height ? width : height * ratio,
				height: width / ratio >= height ? width / ratio : height,
			};
		} else {
			return {
				width: height * ratio >= width ? height * ratio : width,
				height: height * ratio >= width ? height : width / ratio,
			};
		}
	}
}
