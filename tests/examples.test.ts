import {expect} from 'chai';
import {coalesceSignals, deriveSignal, makeSignal, ReadonlySignal} from '../src/lib';

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
	it('readme 1-alt', () => {
		const signal$ = makeSignal<number>();
		let actual = -1;
		signal$.subscribeOnce((v) => (actual = v));
		signal$.emit(3.14); // will trigger console.log, printing 3.14
		expect(actual).to.eq(3.14);
		signal$.emit(42); // won't do anything
		expect(actual).to.eq(3.14);
	});
	it('readme 2', () => {
		const signal$ = makeSignal<number>();
		expect(signal$.nOfSubscriptions()).to.eq(0); // 0
		const unsubscribe = signal$.subscribe(() => undefined); // empty subscriber
		expect(signal$.nOfSubscriptions()).to.eq(1); // 1
		unsubscribe();
		expect(signal$.nOfSubscriptions()).to.eq(0); // 0
	});
	it('readme 3', () => {
		const signal$ = makeSignal<number>();
		const subscriber = (v: number) => console.log(v);
		expect(signal$.nOfSubscriptions()).to.eq(0); // 0
		const unsubscribe1 = signal$.subscribe(subscriber);
		const unsubscribe2 = signal$.subscribe(subscriber);
		const unsubscribe3 = signal$.subscribe(subscriber);
		expect(signal$.nOfSubscriptions()).to.eq(1); // 1
		unsubscribe3(); // will remove "subscriber"
		unsubscribe2(); // won't do anything, "subscriber" has already been removed
		unsubscribe1(); // won't do anything, "subscriber" has already been removed
		expect(signal$.nOfSubscriptions()).to.eq(0); // 0
	});
	it('readme 3', () => {
		const signal$ = makeSignal<number>();
		const subscriber = (v: number) => console.log(v);
		expect(signal$.nOfSubscriptions()).to.eq(0); // 0
		const unsubscribe1 = signal$.subscribe(subscriber);
		expect(signal$.nOfSubscriptions()).to.eq(1); // 1
		const unsubscribe2 = signal$.subscribe((v) => subscriber(v));
		expect(signal$.nOfSubscriptions()).to.eq(2); // 2
		unsubscribe2();
		expect(signal$.nOfSubscriptions()).to.eq(1); // 1
		unsubscribe1();
		expect(signal$.nOfSubscriptions()).to.eq(0); // 0
	});
	it('signal', () => {
		const signal$ = makeSignal<number>();
		signal$.emit(10);
	});
	it('void signal', () => {
		const signal$ = makeSignal<void>();
		signal$.emit();
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
		const lastUpdate1$ = makeSignal<number>();
		const lastUpdate2$ = makeSignal<number>();
		const latestUpdate$ = coalesceSignals([lastUpdate1$, lastUpdate2$]);
		let actual = 0;
		latestUpdate$.subscribe((v) => (actual = v));
		lastUpdate1$.emit(1577923200000); // will log 1577923200000
		expect(actual).to.eq(1577923200000);
		lastUpdate2$.emit(1653230659450); // will log 1653230659450
		expect(actual).to.eq(1653230659450);
	});
	it('spread syntax', () => {
		const baseSignal$ = makeSignal<number>();
		const compositeSignal$ = {
			...baseSignal$,
			emitOne() {
				baseSignal$.emit(1);
			},
		};
		let actual = 0;
		expect(compositeSignal$.nOfSubscriptions()).to.eq(0);
		const unsubscribe = compositeSignal$.subscribe((v) => (actual = v));
		compositeSignal$.emitOne();
		expect(actual).to.eq(1);
		expect(compositeSignal$.nOfSubscriptions()).to.eq(1);
		unsubscribe();
		expect(compositeSignal$.nOfSubscriptions()).to.eq(0);
	});
	it('readme countdown', async () => {
		const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

		function makeCountdown(from: number): ReadonlySignal<number> & {run(): Promise<void>} {
			const {subscribe, subscribeOnce, emit, nOfSubscriptions} = makeSignal<number>();
			return {
				subscribe,
				subscribeOnce,
				nOfSubscriptions,
				async run() {
					emit(from);
					for (let i = from - 1; i >= 0; i--) {
						await sleep(1);
						emit(i);
					}
				},
			};
		}
		const values: number[] = [];
		const collect = (v: number) => values.push(v);
		const countdown$ = makeCountdown(5);
		countdown$.subscribe(collect);
		let output = '';
		await countdown$.run().then(() => (output = 'launch!')); // will trigger the above console.log 6 times, printing the numbers from 5 to 0.
		expect(values).to.eqls([5, 4, 3, 2, 1, 0]);
		expect(output).to.eq('launch!');
	});
});
