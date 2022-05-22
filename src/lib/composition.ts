import {makeSignal, Subscriber, Unsubscribe, ReadonlySignal} from './index';

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
export function coalesceSignals<T extends unknown[]>(signals$: {[P in keyof T]: ReadonlySignal<T[P]>}): ReadonlySignal<T[number]> {
	const base$ = makeSignal<T[number]>();
	const emit = (data: T[number]) => {
		base$.emit(data);
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
				unsubscribeOriginals = signals$.map((signal$) => (signal$ as ReadonlySignal<T[number]>).subscribe(emit));
			}
			return () => {
				unsubscribe();
				handleUnsubscribe();
			};
		},
	};
}
