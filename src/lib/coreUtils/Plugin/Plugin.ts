import { CustomEventDispatcher } from '../CustomEventDispatcher/CustomEventDispatcher';
import { App } from '../../App';

export interface Options {
	[key: string]: any;
}

export class Plugin<IParent extends CustomEventDispatcher = CustomEventDispatcher> extends CustomEventDispatcher {
	private children: Set<Plugin> = new Set();
	private options: Options = {};
	protected app: App;
	parent: IParent | null = null;
	// events: string[] = [];

	constructor(app: App, parent?: IParent, options?: Options) {
		super();
		this.app = app;
		if (parent) this.parent = parent;
		if (options) this.options = options;
	}
	public init() {}
}
