export interface Listener {
	(...args: any[]): Promise<any>|void;
}

export abstract class ChangeTrigger {
	protected listeners: Listener[] = [];
	private isStarted: boolean = false;
	private isPaused: boolean = false;
	
	protected abstract _start();
	
	protected abstract _stop();
	
	protected _pause() {
		this._stop();
	}
	
	protected _resume() {
		this._start();
	}
	
	protected trigger(...args: any[]) {
		if (!this.isStarted) {
			console.error('triggered on a paused trigger.');
			return;
		}
		// console.log('trigger activated!');
		if (this.listeners.length === 0) {
			return Promise.resolve();
		}
		
		const handle = (e: Error) => {
			console.error('Error in listeners: ');
			console.error(e);
			return Promise.reject(e);
		};
		
		this.pause();
		
		let ps;
		try {
			ps = this.listeners.map((cb) => {
				return cb(...args);
			});
			return Promise.all(ps).catch(handle).then(() => {
				this.resume();
			});
		} catch (e) {
			this.resume();
			return handle(e);
		}
	}
	
	public on(listener: Listener) {
		this.listeners.push(listener);
	}
	
	public off(listener: Listener) {
		const id = this.listeners.indexOf(listener);
		this.listeners.splice(id, 1);
	}
	
	public start() {
		if (this.isStarted) {
			return;
		}
		this.isStarted = true;
		this._start();
	}
	
	public stop() {
		if (!this.isStarted) {
			return;
		}
		this.isStarted = false;
		this._stop();
	}
	
	get started() {
		return this.isStarted;
	}
	
	protected pause() {
		if (this.isPaused) {
			return;
		}
		this.isPaused = true;
		this._pause();
	}
	
	protected resume() {
		if (!this.isPaused) {
			return;
		}
		this.isPaused = false;
		this._resume();
	}
	
	get paused() {
		return this.isPaused;
	}
}
