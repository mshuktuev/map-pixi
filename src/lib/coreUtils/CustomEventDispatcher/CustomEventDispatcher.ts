export interface IList<E = any> {
	[name: string]: E;
}

export interface AppEvent {
	type: string;
	detail?: any;
}

export interface IListener<IEvent extends AppEvent = AppEvent> {
	(ev: IEvent): void;
}

export class CustomEventDispatcher {
	private _listeners: IList<Set<Function>> = {};
	private parent: CustomEventDispatcher | null = null;

	addEventListener<IEvent extends AppEvent = AppEvent>(type: string, fn: IListener<IEvent>): void {
		if (!this._listeners) this._listeners = {};
		const listeners = (this._listeners[type] = this._listeners?.[type] ?? new Set());
		if (listeners.has(fn)) return;
		listeners.add(fn);
	}

	removeEventListener<IEvent extends AppEvent = AppEvent>(type: string, fn: IListener<IEvent>): void {
		if (!this._listeners) this._listeners = {};
		const listeners = this._listeners[type];
		if (!listeners) return;
		listeners.delete(fn);
	}

	hasEventListener<IEvent extends AppEvent = AppEvent>(type: string, fn: IListener<IEvent>): boolean {
		if (!this._listeners) this._listeners = {};
		const listeners = this._listeners[type];
		if (!listeners) return false;
		return Boolean(Array.from(listeners).find((listener) => listener === fn));
	}

	dispatchEvent<E extends AppEvent = AppEvent>(e: E) {
		if (!this._listeners) this._listeners = {};
		if (this.parent) {
			this.parent.dispatchEvent(e);
		}

		const listeners = this._listeners[e.type];

		if (!listeners) return;

		for (const listener of Array.from(listeners)) {
			listener.call(this, e);
		}
	}
}
