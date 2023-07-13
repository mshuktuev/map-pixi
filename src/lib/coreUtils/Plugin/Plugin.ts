import { App } from '../../App';
import { CustomEventDispatcher } from '../CustomEventDispatcher';

export interface Options {
	[key: string]: any;
}

export class Plugin<IParent extends Plugin<any> = Plugin<any>> extends CustomEventDispatcher {
	private children: Set<Plugin> = new Set();
	private options: Options = {};
	private _parent: IParent | null = null;
	protected app: App;

	constructor(app: App, parent?: IParent, options?: Options) {
		super();
		this.app = app;
		if (parent) this._parent = parent;
		if (options) this.options = options;
	}
	public init() {}
}
