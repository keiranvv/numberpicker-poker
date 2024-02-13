type EventEmitterEventList = {
	[key: string]: ((...args: any[]) => void)[]
}

// A highly rudimentary eventemitter class for the browser, probably very error prone, but here we are.
// TODO: Come back to this if I have time and make this a generic so that events are known and autocompletable etc.
export abstract class EventEmitter {
	private events: EventEmitterEventList = {}

	protected emit(event: string, data?: any) {
		if (!this.events[event]) {
			return
		}

		this.events[event].forEach((h) => {
			h(data)
		})
	}

	public addListener(event: string, handler: (...args: any[]) => void) {
		if (!this.events[event]) {
			this.events[event] = []
		}

		this.events[event].push(handler)
	}

	public removeListener(event: string, handler: (...args: any[]) => void | undefined) {
		if (handler) {
			this.events[event].splice(this.events[event].indexOf(handler), 1)
		} else {
			delete this.events[event]
		}
	}
}
