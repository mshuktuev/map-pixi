import * as PIXI from 'pixi.js';
import { AppConfig } from './types/appConfig';
import { Image } from './corePlugins/Image/Image';
import { Plugin } from './coreUtils/Plugin';

export const defaultConfig: AppConfig = {
	rootElement: document.body,
	imageUrl: '',
};

export class App {
	config: AppConfig;
	pixiApp: PIXI.Application;
	private corePlugins: Plugin[] = [];
	mainContainer: PIXI.Container;

	constructor(props: Partial<AppConfig>) {
		this.config = { ...defaultConfig, ...props };

		this.pixiApp = this.init();
		this.mainContainer = new PIXI.Container();

		this.loadPlugins().then(() => {
			this.pixiApp.stage.addChild(this.mainContainer);
		});
	}

	init() {
		const app = new PIXI.Application({ antialias: true, resizeTo: window });
		if (typeof this.config.rootElement === 'string') {
			const element = document.querySelector(this.config.rootElement);
			if (element) element.appendChild(app.view as any);
		} else if (this.config.rootElement instanceof HTMLElement) {
			this.config.rootElement.appendChild(app.view as any);
		}
		return app;
	}

	async loadPlugins() {
		const corePlugins: Plugin[] = [new Image(this)];

		for await (const plugin of corePlugins) {
			new Promise((resolve) => {
				plugin.init();
				plugin.addEventListener('loaded', () => {
					corePlugins.push(plugin);
					resolve(true);
				});
			});
		}
	}
}
