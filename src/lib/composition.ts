import {makeSignal, Subscriber, Unsubscribe, ReadonlySignal} from './index';

/**
 * Create a new signal that observes all the passed signals.
 * The merged signal will emit each time one of the passed signals emit,
 * sending an array of changes to all subscribers, that is
 * an array filled with undefined except for the position
 * corresponding to the signal that emitted last.
 *
 * Example:
 * ```ts
 * const year$ = makeSignal<number>();
 * const month$ = makeSignal<string>();
 * const merged$ = mergeSignals([year$, month$]);
 * merged$.subscribe(([year, month]) => console.log(`${month} ${year}`));
 * year$.emit(2020); // undefined 2020
 * month$.emit('July'); // July undefined
 * ```
 * @param signals$ array of signals to observe.
 * @returns a signal that will emit the observed changes in the signal array.
 */
export function mergeSignals<T extends unknown[]>(signals$: {[P in keyof T]: ReadonlySignal<T[P]>}): ReadonlySignal<unknown[] & {[P in keyof T]: T[P] | undefined}> {
	const base$ = makeSignal<unknown[] & {[P in keyof T]: T[P] | undefined}>();
	const makeSubscriber = (i: number) => (data: T[number]) => {
		const changes = new Array(signals$.length).fill(undefined) as {[P in keyof T]: T[P] | undefined};
		changes[i] = data;
		base$.emit(changes);
	};
	const handleUnsubscribe = () => {
		if (unsubscribeOriginals && base$.nOfSubscriptions === 0) {
			unsubscribeOriginals.forEach((unsub) => unsub());
			unsubscribeOriginals = null;
		}
	};
	let unsubscribeOriginals: Array<Unsubscribe> | null = null;
	return {
		get nOfSubscriptions() {
			return base$.nOfSubscriptions;
		},
		subscribe: (s) => {
			const unsubscribe = base$.subscribe(s);
			if (!unsubscribeOriginals) {
				unsubscribeOriginals = signals$.map((signal$, i) => signal$.subscribe(makeSubscriber(i) as Subscriber<unknown>));
			}
			return () => {
				unsubscribe();
				handleUnsubscribe();
			};
		},
	};
}

/**
 * Create a signal that emits whenever the passed signal emits. The original
 * emitted value gets transformed by the passed function and the result gets
 * emitted.
 *
 * Example:
 * ```ts
 * const signal$ = makeSignal<number>();
 * const derived$ = deriveSignal(signal$, (n) => n + 100);
 * derived$.subscribe((v) => console.log(v));
 * signal$.emit(3); // will trigger console.log, echoing 103
 * ```
 * @param signal$ a signal.
 * @param transform a transformation function.
 * @returns a new signal that will emit the transformed data.
 */
export function deriveSignal<T, U>(signal$: ReadonlySignal<T>, transform: (data: T) => U): ReadonlySignal<U> {
	const base$ = makeSignal<U>();
	const emitTransformed: Subscriber<T> = (data: T) => {
		base$.emit(transform(data));
	};
	const handleUnsubscribe = () => {
		if (unsubscribeOriginal && base$.nOfSubscriptions === 0) {
			unsubscribeOriginal();
			unsubscribeOriginal = null;
		}
	};
	let unsubscribeOriginal: Unsubscribe | null = null;
	return {
		get nOfSubscriptions() {
			return base$.nOfSubscriptions;
		},
		subscribe: (s) => {
			const unsubscribe = base$.subscribe(s);
			if (!unsubscribeOriginal) {
				unsubscribeOriginal = signal$.subscribe(emitTransformed);
			}
			return () => {
				unsubscribe();
				handleUnsubscribe();
			};
		},
	};
}

/**
 * Create a signal that emits whenever one of the passed signals emits.
 *
 * Example:
 * ```ts
 * const signal1$ = makeSignal<number>();
 * const signal2$ = makeSignal<number>();
 * let sum = 0;
 * const derived$ = deriveSignals([signal1$, signal2$], ([n1, n2]) => sum += n1 ?? n2 ?? 0);
 * derived$.subscribe((v) => console.log(v));
 * signal1$.emit(3); // will trigger console.log, echoing 3
 * signal2$.emit(2); // will trigger console.log, echoing 5
 * ```
 * @param signals$ an array of signals.
 * @param transform a transformation function that takes an array of changes (see {@link mergeSignals}).
 * @returns a new signal.
 */
export function deriveSignals<T extends unknown[], U>(
	signals$: {[P in keyof T]: ReadonlySignal<T[P]>},
	transform: (data: {[P in keyof T]: T[P] | undefined}) => U,
): ReadonlySignal<U> {
	const merged$ = mergeSignals<{[P in keyof T]: T[P]}>(signals$);
	return deriveSignal(merged$, transform);
}

/**
 * Coalesce multiple signals into one that will emit the latest value emitted
 * by any of the source signals.
 *
 * Example:
 * ```ts
 * const year$ = makeSignal<number>();
 * const month$ = makeSignal<string>();
 * const coalesced$ = coalesceSignals([year$, month$]);
 * coalesced$.subscribe((v) => console.log(v));
 * year$.emit(2020); // 2020
 * month$.emit('July'); // July
 * ```
 * @param signals$ an array of signals to observe.
 * @returns a new signal that emits whenever one of the source signals emits.
 */
export function coalesceSignals<T extends unknown[]>(signals$: {[P in keyof T]: ReadonlySignal<T[P]>}): ReadonlySignal<T[keyof T]> {
	return deriveSignals(signals$, (changes) => changes.find((x) => x !== undefined)) as ReadonlySignal<T[keyof T]>;
}
