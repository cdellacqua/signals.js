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
	/**
	 * Emit a value to a specific subscriber of this signal.
	 * @param subscriber the subscriber that will receive the value.
	 * @param v the value to emit.
	 */
	emitFor(subscriber: Subscriber<T>, v: T): void;
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
		for (const subscriber of subscribers) {
			subscriber(v);
		}
	}
	function emitFor(subscriber: Subscriber<T>, v: T) {
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
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

	return {
		emit,
		emitFor,
		subscribe,
		get nOfSubscriptions() {
			return subscribers.length;
		},
	};
}

export * from './composition';
