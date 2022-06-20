import {expect} from 'chai';
import {makeSignal} from '../src/lib';

describe('signal', () => {
	it('creates a signal', () => {
		const signal$ = makeSignal<number>();
		let actual = -1;
		signal$.subscribe((v) => {
			actual = v;
		});
		signal$.emit(10);
		expect(actual).to.eq(10);
	});
	it('creates a void signal', () => {
		const signal$ = makeSignal<void>();
		let called = false;
		signal$.subscribe(() => {
			called = true;
		});
		signal$.emit();
		expect(called).to.be.true;
	});
	it('adds two subscribers', () => {
		const signal$ = makeSignal<number>();
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
	it('adds the same subscriber twice', () => {
		const signal$ = makeSignal<number>();
		let count = 0;
		const subscriber = () => {
			count++;
		};
		expect(signal$.nOfSubscriptions).to.eq(0);
		signal$.subscribe(subscriber);
		expect(signal$.nOfSubscriptions).to.eq(1);
		signal$.subscribe(subscriber);
		expect(signal$.nOfSubscriptions).to.eq(1);
		signal$.emit(10);
		expect(count).to.eq(1);
	});
	it('adds two subscribers and unsubscribes the second one after one notification', () => {
		const signal$ = makeSignal<number>();
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
		const signal$ = makeSignal<number>();
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
	it('tests subscribe once', () => {
		const signal$ = makeSignal<number>();
		expect(signal$.nOfSubscriptions).to.eq(0);
		let actual = -1;
		signal$.subscribeOnce((v) => (actual = v));
		expect(actual).to.eq(-1);
		expect(signal$.nOfSubscriptions).to.eq(1);
		signal$.emit(10);
		expect(actual).to.eq(10);
		expect(signal$.nOfSubscriptions).to.eq(0);
	});
	it('tests subscribe once', () => {
		const signal$ = makeSignal<number>();
		expect(signal$.nOfSubscriptions).to.eq(0);
		let actual = -1;
		signal$.subscribeOnce((v) => (actual = v));
		expect(actual).to.eq(-1);
		expect(signal$.nOfSubscriptions).to.eq(1);
		signal$.emit(10);
		expect(actual).to.eq(10);
		expect(signal$.nOfSubscriptions).to.eq(0);
	});
	it('tests calling subscribeOnce multiple times', () => {
		const signal$ = makeSignal<void>();
		expect(signal$.nOfSubscriptions).to.eq(0);
		let calls = 0;
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		signal$.subscribeOnce(() => calls++);
		expect(signal$.nOfSubscriptions).to.eq(9);
		signal$.emit();
		expect(signal$.nOfSubscriptions).to.eq(0);
	});
	it('unsubscribes from subscribeOnce before emitting', () => {
		const signal$ = makeSignal<number>();
		expect(signal$.nOfSubscriptions).to.eq(0);
		let actual = -1;
		const unsubscribe = signal$.subscribeOnce((v) => (actual = v));
		expect(actual).to.eq(-1);
		expect(signal$.nOfSubscriptions).to.eq(1);
		unsubscribe();
		expect(signal$.nOfSubscriptions).to.eq(0);
		signal$.emit(10);
		expect(actual).to.eq(-1);
		expect(signal$.nOfSubscriptions).to.eq(0);
	});
});
