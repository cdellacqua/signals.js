/** A generic subscriber that takes a value emitted by a signal as its only parameter. */
export type Subscriber<T> = (current: T) => void;
/** A function that's used to unsubscribe a subscriber from a signal. */
export type Unsubscribe = () => void;

/** A signal that can have subscribers and emit values to them. */
export type ReadonlySignal<T> = {
	/**
	 * Subscribe a function to this signal.
	 *
	 * Note: subscribers are deduplicated, if you need to subscribe the same
	 * function more than once wrap it in an arrow function, e.g.
	 * `signal$.subscribe((v) => myFunc(v));`
	 * @param subscriber a function that will be called when this signal emits.
	 */
	subscribe(subscriber: Subscriber<T>): Unsubscribe;
	/**
	 * Subscribe a function to this signal and automatically unsubscribe it after one emit occurs.
	 *
	 * @param subscriber a function that will be called when this signal emits.
	 */
	subscribeOnce(subscriber: Subscriber<T>): Unsubscribe;
	/**
	 * Return the current number of active subscriptions.
	 */
	get nOfSubscriptions(): number;
};

/** A signal that can have subscribers and emit values to them. */
export type Signal<T> = ReadonlySignal<T> & {
	/**
	 * Emit a value to all subscribers.
	 * @param v the value to emit.
	 */
	emit(v: T): void;
};

/**
 * Make a signal of type T.
 *
 * Example usage:
 * ```ts
 * const signal$ = makeSignal<number>();
 * signal$.emit(10);
 * ```
 * Example usage with no data:
 * ```ts
 * const signal$ = makeSignal<void>();
 * signal$.emit();
 * ```
 * @returns a signal.
 */
export function makeSignal<T>(): Signal<T> {
	const subscribers: Subscriber<T>[] = [];
	function emit(v: T): void {
		// Create a snapshot of all subscribers before emitting,
		// so that if subscriptions are added or removed
		// they won't affect the current emit loop.
		for (const subscriber of [...subscribers]) {
			subscriber(v);
		}
	}
	function unsubscribe(subscriber: Subscriber<T>) {
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
			subscribers.splice(index, 1);
		}
	}
	function subscribe(subscriber: Subscriber<T>) {
		const index = subscribers.indexOf(subscriber);
		if (index === -1) {
			subscribers.push(subscriber);
		}

		return () => unsubscribe(subscriber);
	}
	function subscribeOnce(subscriber: Subscriber<T>) {
		const unsubscribeWrapper = subscribe((v) => {
			// this must happen first to let the subscriber
			// know that it has already been removed from this signal
			// (this is used for example in composition.ts).
			unsubscribeWrapper();
			subscriber(v);
		});
		return unsubscribeWrapper;
	}

	return {
		emit,
		subscribe,
		subscribeOnce,
		get nOfSubscriptions() {
			return subscribers.length;
		},
	};
}

export * from './composition';
