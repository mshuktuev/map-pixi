import { App } from '../../App';
import { Plugin } from '../../coreUtils/Plugin';
import * as PIXI from 'pixi.js';

export class Image extends Plugin {
	private texture!: PIXI.Texture;
	private sprite!: PIXI.Sprite;
	private view!: PIXI.ICanvas;
	private naturalWidth: number | undefined;
	private naturalHeight: number | undefined;
	private ratio: number | undefined;

	constructor(app: App) {
		super(app);
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
			window.addEventListener('resize', () => {
				this.updateSizes();
			});
		});
	}

	private updateSizes() {
		const sizes = this.cover(this.view.width, this.view.height, this.ratio);
		if (sizes) {
			this.sprite.width = sizes.width;
			this.sprite.height = sizes.height;
		}
		this.calcOffsets();
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
		if (this.naturalWidth && this.view.width < this.naturalWidth) {
			offset.x = (this.view.width - this.naturalWidth) / -2;
		} else if (this.naturalWidth && this.view.width > this.naturalWidth) {
			offset.x = (this.naturalWidth - this.view.width) / -2;
		}
		console.log(this.view.width, this.naturalWidth);

		console.log(offset);
	}

	cover(width?: number, height?: number, ratio?: number) {
		if (width === undefined || height === undefined || ratio === undefined) return false;

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
