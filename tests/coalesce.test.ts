import {expect} from 'chai';
import {makeSignal, coalesceSignals} from '../src/lib';

describe('coalesce', () => {
	it('creates a coalesced signal', () => {
		const signal1$ = makeSignal<number>();
		const signal2$ = makeSignal<number>();
		const coalesced$ = coalesceSignals([signal1$, signal2$]);
		let actual = -1;
		coalesced$.subscribe((v) => {
			actual = v;
		});
		expect(actual).to.eq(-1);
		signal1$.emit(1);
		expect(actual).to.eq(1);
		signal2$.emit(2);
		expect(actual).to.eq(2);
	});
	it('checks that the number of subscriptions is consistent', () => {
		const signal1$ = makeSignal<number>();
		const signal2$ = makeSignal<number>();
		const coalesced$ = coalesceSignals([signal1$, signal2$]);
		expect(signal1$.nOfSubscriptions).to.eq(0);
		expect(signal2$.nOfSubscriptions).to.eq(0);
		expect(coalesced$.nOfSubscriptions).to.eq(0);

		const unsubscribe = coalesced$.subscribe(() => undefined);
		expect(signal1$.nOfSubscriptions).to.eq(1);
		expect(signal2$.nOfSubscriptions).to.eq(1);
		expect(coalesced$.nOfSubscriptions).to.eq(1);
		signal1$.emit(10);
		signal2$.emit(10);
		expect(signal1$.nOfSubscriptions).to.eq(1);
		expect(signal2$.nOfSubscriptions).to.eq(1);
		expect(coalesced$.nOfSubscriptions).to.eq(1);
		unsubscribe();
		expect(signal1$.nOfSubscriptions).to.eq(0);
		expect(signal2$.nOfSubscriptions).to.eq(0);
		expect(coalesced$.nOfSubscriptions).to.eq(0);
	});
});
