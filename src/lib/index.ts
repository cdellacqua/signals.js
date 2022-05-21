/** A generic subscriber that takes a value emitted by a signal as its only parameter. */
export type Subscriber<T> = (current: T) => void;
/** A function that's used to unsubscribe a subscriber from a signal. */
export type Unsubscribe = () => void;

/** A simple signal that can have subscribers and emit values to them. */
export type SimpleSignal<T> = {
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
	 * Remove all subscriptions from this signal.
	 */
	clearSubscriptions(): void;
	/**
	 * Return the current number of active subscriptions.
	 */
	get nOfSubscriptions(): number;
};

/**
 * A simple signal that can have subscribers and emit values to them.
 * It has all the same properties as the SimpleSignal,
 * but it also caches the last emitted value and emits it
 * immediately to all new subscribers.
 */
export type SimpleCachedSignal<T> = SimpleSignal<T> & {
	/**
	 * The last emitted value.
	 */
	lastEmitted: T;
};

/**
 * A signal that can have subscribers and emit values to them.
 * It has all the same properties as the SimpleSignal, but it
 * also exposes a signal for its current number of subscriptions.
 */
export type Signal<T> = SimpleSignal<T> & {
	nOfSubscriptions$: SimpleCachedSignal<number>;
};

/**
 * A signal that can have subscribers and emit values to them.
 * It has all the same properties as the Signal,
 * but it also caches the last emitted value and emits it
 * immediately to all new subscribers.
 */
export type CachedSignal<T> = Signal<T> & {
	lastEmitted: T;
};

/**
 * Make a simple signal of type T.
 *
 * Example usage:
 * ```ts
 * const signal$ = makeSimpleSignal<number>();
 * signal$.emit(10);
 * ```
 * @returns a simple signal
 */
export function makeSimpleSignal<T>(): SimpleSignal<T> {
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
		clearSubscriptions: () => subscribers.splice(0, subscribers.length),
		get nOfSubscriptions() {
			return subscribers.length;
		},
	};
}

/**
 * Make a simple cached signal.
 *
 * Example usage:
 * ```ts
 * const signal$ = makeSimpleCachedSignal(0);
 * signal$.emit(10);
 * ```
 * @returns a simple cached signal
 */
export function makeSimpleCachedSignal<T>(initialValue: T): SimpleCachedSignal<T> {
	let lastEmitted = initialValue;
	const base$ = makeSimpleSignal<T>();
	return {
		clearSubscriptions: base$.clearSubscriptions,
		emit: (v) => {
			lastEmitted = v;
			base$.emit(v);
		},
		get lastEmitted() {
			return lastEmitted;
		},
		emitFor: (s, v) => {
			lastEmitted = v;
			base$.emitFor(s, v);
		},
		get nOfSubscriptions() {
			return base$.nOfSubscriptions;
		},
		subscribe: (s) => {
			const unsubscribe = base$.subscribe(s);
			s(lastEmitted);
			return unsubscribe;
		},
	};
}

/**
 * Make a signal of type T.
 *
 * Example usage:
 * ```ts
 * const signal$ = makeSignal<number>();
 * signal$.emit(10);
 * ```
 * @returns a signal
 */
export function makeSignal<T>(): Signal<T> {
	const base$ = makeSimpleSignal<T>();
	const nOfSubscriptions$ = makeSimpleCachedSignal(0);

	return {
		clearSubscriptions: () => {
			base$.clearSubscriptions();
			nOfSubscriptions$.emit(base$.nOfSubscriptions);
		},
		emit: base$.emit,
		emitFor: base$.emitFor,
		get nOfSubscriptions() {
			return base$.nOfSubscriptions;
		},
		subscribe: (s) => {
			const unsubscribe = base$.subscribe(s);
			nOfSubscriptions$.emit(base$.nOfSubscriptions);
			return () => {
				unsubscribe();
				nOfSubscriptions$.emit(base$.nOfSubscriptions);
			};
		},
		nOfSubscriptions$,
	};
}

/**
 * Make a cached signal.
 *
 * Example usage:
 * ```ts
 * const signal$ = makeCachedSignal(0);
 * signal$.emit(10);
 * ```
 * @returns a cached signal
 */
export function makeCachedSignal<T>(initialValue: T): CachedSignal<T> {
	let lastEmitted = initialValue;
	const base$ = makeSignal<T>();
	return {
		clearSubscriptions: base$.clearSubscriptions,
		emit: (v) => {
			lastEmitted = v;
			base$.emit(v);
		},
		get lastEmitted() {
			return lastEmitted;
		},
		emitFor: (s, v) => {
			lastEmitted = v;
			base$.emitFor(s, v);
		},
		get nOfSubscriptions() {
			return base$.nOfSubscriptions;
		},
		subscribe: (s) => {
			const unsubscribe = base$.subscribe(s);
			s(lastEmitted);
			return unsubscribe;
		},
		nOfSubscriptions$: base$.nOfSubscriptions$,
	};
}
