import {expect} from 'chai';
import {coalesceSignals, deriveSignal, makeSignal} from '../src/lib';

describe('examples', () => {
	it('readme 1', () => {
		const signal$ = makeSignal<number>();
		let calls = 0;
		const unsubscribe = signal$.subscribe(() => calls++);
		signal$.emit(3.14); // will trigger console.log, printing 3.14
		expect(calls).to.eq(1);
		unsubscribe();
		signal$.emit(42); // won't do anything
		expect(calls).to.eq(1);
	});
	it('readme 2', () => {
		const signal$ = makeSignal<number>();
		expect(signal$.nOfSubscriptions).to.eq(0); // 0
		const unsubscribe = signal$.subscribe(() => undefined); // empty subscriber
		expect(signal$.nOfSubscriptions).to.eq(1); // 1
		unsubscribe();
		expect(signal$.nOfSubscriptions).to.eq(0); // 0
	});
	it('readme 3', () => {
		const signal$ = makeSignal<number>();
		const subscriber = (v: number) => console.log(v);
		expect(signal$.nOfSubscriptions).to.eq(0); // 0
		const unsubscribe1 = signal$.subscribe(subscriber);
		const unsubscribe2 = signal$.subscribe(subscriber);
		const unsubscribe3 = signal$.subscribe(subscriber);
		expect(signal$.nOfSubscriptions).to.eq(1); // 1
		unsubscribe3(); // will remove "subscriber"
		unsubscribe2(); // won't do anything, "subscriber" has already been removed
		unsubscribe1(); // won't do anything, "subscriber" has already been removed
		expect(signal$.nOfSubscriptions).to.eq(0); // 0
	});
	it('readme 3', () => {
		const signal$ = makeSignal<number>();
		const subscriber = (v: number) => console.log(v);
		expect(signal$.nOfSubscriptions).to.eq(0); // 0
		const unsubscribe1 = signal$.subscribe(subscriber);
		expect(signal$.nOfSubscriptions).to.eq(1); // 1
		const unsubscribe2 = signal$.subscribe((v) => subscriber(v));
		expect(signal$.nOfSubscriptions).to.eq(2); // 2
		unsubscribe2();
		expect(signal$.nOfSubscriptions).to.eq(1); // 1
		unsubscribe1();
		expect(signal$.nOfSubscriptions).to.eq(0); // 0
	});
	it('signal', () => {
		const signal$ = makeSignal<number>();
		signal$.emit(10);
	});
	it('derive', () => {
		const signal$ = makeSignal<number>();
		const derived$ = deriveSignal(signal$, (n) => n + 100);
		let actual: unknown;
		derived$.subscribe((v) => (actual = v));
		signal$.emit(3); // will trigger console.log, echoing 103
		expect(actual).to.eq(103);
	});
	it('coalesce', () => {
		const year$ = makeSignal<number>();
		const month$ = makeSignal<string>();
		const coalesced$ = coalesceSignals([year$, month$]);
		let actual: unknown;
		coalesced$.subscribe((v) => (actual = v));
		year$.emit(2020); // 2020
		expect(actual).to.eq(2020);
		month$.emit('July'); // July
		expect(actual).to.eq('July');
	});
});
