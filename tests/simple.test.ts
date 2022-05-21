import {expect} from 'chai';
import {makeSimpleSignal} from '../src/lib';

describe('simple signal', () => {
	it('creates a signal', () => {
		const signal$ = makeSimpleSignal<number>();
		let actual = -1;
		signal$.subscribe((v) => {
			actual = v;
		});
		signal$.emit(10);
		expect(actual).to.eq(10);
	});
	it('creates a void signal', () => {
		const signal$ = makeSimpleSignal<void>();
		let called = false;
		signal$.subscribe(() => {
			called = true;
		});
		signal$.emit();
		expect(called).to.be.true;
	});
	it('adds two subscribers', () => {
		const signal$ = makeSimpleSignal<number>();
		let actual1 = -1;
		let actual2 = -1;
		signal$.subscribe((v) => {
			actual1 = v;
		});
		signal$.subscribe((v) => {
			actual2 = v;
		});
		signal$.emit(10);
		expect(actual1).to.eq(10);
		expect(actual2).to.eq(10);
	});
	it('adds two subscribers, but only one gets notified', () => {
		const signal$ = makeSimpleSignal<number>();
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
		signal$.emitFor(sub2, 10);
		expect(actual1).to.eq(-1);
		expect(actual2).to.eq(10);
	});
	it('adds two subscribers and uses emitFor after unsubscribe', () => {
		const signal$ = makeSimpleSignal<number>();
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
		unsub2();
		signal$.emitFor(sub2, 10);
		expect(actual1).to.eq(-1);
		expect(actual2).to.eq(-1);
	});
	it('adds two subscribers and unsubscribes the second one after one notification', () => {
		const signal$ = makeSimpleSignal<number>();
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
		signal$.emit(10);
		unsub2();
		signal$.emit(20);
		expect(actual1).to.eq(20);
		expect(actual2).to.eq(10);
	});
	it('checks that the number of subscriptions is up-to-date', () => {
		const signal$ = makeSimpleSignal<number>();
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
		const signal$ = makeSimpleSignal<number>();
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
		expect(actual).to.eq(-1);
	});
});
