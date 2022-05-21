import {expect} from 'chai';
import {makeSimpleCachedSignal} from '../src/lib';

describe('cached signal', () => {
	it('creates a signal', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		let actual = -1;
		signal$.subscribe((v) => {
			actual = v;
		});
		expect(actual).to.eq(0);
		signal$.emit(10);
		expect(actual).to.eq(10);
	});
	it('adds two subscribers', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		let actual1 = -1;
		let actual2 = -2;
		signal$.subscribe((v) => {
			actual1 = v;
		});
		signal$.subscribe((v) => {
			actual2 = v;
		});
		expect(actual1).to.eq(0);
		expect(actual2).to.eq(0);
		signal$.emit(10);
		expect(actual1).to.eq(10);
		expect(actual2).to.eq(10);
	});
	it('adds two subscribers, but only one gets notified', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		let actual1 = -1;
		let actual2 = -1;
		const sub1 = (v: number) => {
			actual1 = v;
		};
		const sub2 = (v: number) => {
			actual2 = v;
		};
		signal$.subscribe(sub1);
		signal$.subscribe(sub2);
		expect(actual1).to.eq(0);
		expect(actual2).to.eq(0);
		signal$.emitFor(sub2, 10);
		expect(actual1).to.eq(0);
		expect(actual2).to.eq(10);
	});
	it('adds two subscribers and uses emitFor after unsubscribe', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		let actual1 = -1;
		let actual2 = -1;
		const sub1 = (v: number) => {
			actual1 = v;
		};
		const sub2 = (v: number) => {
			actual2 = v;
		};
		signal$.subscribe(sub1);
		const unsub2 = signal$.subscribe(sub2);
		expect(actual1).to.eq(0);
		expect(actual2).to.eq(0);
		unsub2();
		signal$.emitFor(sub2, 10);
		expect(actual1).to.eq(0);
		expect(actual2).to.eq(0);
	});
	it('adds two subscribers and unsubscribes the second one after one notification', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		let actual1 = -1;
		let actual2 = -1;
		const sub1 = (v: number) => {
			actual1 = v;
		};
		const sub2 = (v: number) => {
			actual2 = v;
		};
		signal$.subscribe(sub1);
		const unsub2 = signal$.subscribe(sub2);
		expect(actual1).to.eq(0);
		expect(actual2).to.eq(0);
		signal$.emit(10);
		unsub2();
		signal$.emit(20);
		expect(actual1).to.eq(20);
		expect(actual2).to.eq(10);
	});
	it('checks that the number of subscriptions is up-to-date', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		expect(signal$.nOfSubscriptions).to.eq(0);
		const sub1 = () => undefined;
		const sub2 = () => undefined;
		const sub3 = () => undefined;
		const unsub1a = signal$.subscribe(sub1);
		expect(signal$.nOfSubscriptions).to.eq(1);
		const unsub1b = signal$.subscribe(sub1);
		expect(signal$.nOfSubscriptions).to.eq(1);

		unsub1a();
		expect(signal$.nOfSubscriptions).to.eq(0);
		unsub1b();
		expect(signal$.nOfSubscriptions).to.eq(0);
		const unsub2 = signal$.subscribe(sub2);
		expect(signal$.nOfSubscriptions).to.eq(1);
		const unsub3 = signal$.subscribe(sub3);
		expect(signal$.nOfSubscriptions).to.eq(2);
		unsub2();
		expect(signal$.nOfSubscriptions).to.eq(1);
		unsub3();
		expect(signal$.nOfSubscriptions).to.eq(0);
	});
	it('clears all active subscriptions', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		expect(signal$.nOfSubscriptions).to.eq(0);
		let actual = -1;
		const sub1 = (v: number) => {
			actual = v;
		};
		const sub2 = (v: number) => {
			actual = v;
		};
		const sub3 = (v: number) => {
			actual = v;
		};
		signal$.subscribe(sub1);
		signal$.subscribe(sub2);
		signal$.subscribe(sub3);
		expect(signal$.nOfSubscriptions).to.eq(3);
		signal$.clearSubscriptions();
		expect(signal$.nOfSubscriptions).to.eq(0);
		signal$.emit(10);
		expect(actual).to.eq(0);
	});
	it('checks that the lastEmitted property is up-to-date', () => {
		const signal$ = makeSimpleCachedSignal<number>(0);
		let lastEmitted = -1;
		signal$.subscribe((v) => {
			lastEmitted = v;
		});
		expect(lastEmitted).to.eq(0);
		expect(signal$.lastEmitted).to.eq(lastEmitted);
		signal$.emit(10);
		expect(lastEmitted).to.eq(10);
		expect(signal$.lastEmitted).to.eq(lastEmitted);
		signal$.emit(20);
		expect(lastEmitted).to.eq(20);
		expect(signal$.lastEmitted).to.eq(lastEmitted);
	});
});
