import * as PIXI from 'pixi.js';
import { AppConfig } from './types/appConfig';
import { CustomEventDispatcher, Plugin } from './coreUtils';
import { Image, Move } from './corePlugins';
import { Zoom } from './corePlugins/Zoom/Zoom';

export const defaultConfig: AppConfig = {
	rootElement: document.body,
	imageUrl: '',
	minZoom: 1,
	maxZoom: 1,
};

export class App extends CustomEventDispatcher {
	config: AppConfig;
	pixiApp: PIXI.Application;
	private corePlugins: Plugin[] = [];
	mainContainer: PIXI.Container;

	constructor(props: Partial<AppConfig>) {
		super();
		this.config = { ...defaultConfig, ...props };

		this.pixiApp = this.init();
		this.mainContainer = new PIXI.Container();
		this.mainContainer.eventMode = 'dynamic';
		this.createEvents();

		this.loadPlugins().then(() => {
			this.pixiApp.stage.addChild(this.mainContainer);
		});
	}

	init() {
		const container = document.querySelector('#app') as HTMLDivElement;
		const app = new PIXI.Application({ antialias: true, resizeTo: container });
		if (typeof this.config.rootElement === 'string') {
			const element = document.querySelector(this.config.rootElement);
			if (element) element.appendChild(app.view as any);
		} else if (this.config.rootElement instanceof HTMLElement) {
			this.config.rootElement.appendChild(app.view as any);
		}
		return app;
	}

	async loadPlugins() {
		const corePlugins: Plugin[] = [new Image(this, this), new Move(this), new Zoom(this)];

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

	createEvents() {
		window.addEventListener('resize', () => {
			//FIXME Поправить ебаный костыль
			setTimeout(() => {
				this.dispatchEvent({ type: 'resize' });
			}, 0);
		});
	}
}
