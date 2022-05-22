import {expect} from 'chai';
import {makeSignal, mergeSignals} from '../src/lib';

describe('merge', () => {
	it('creates a merged signal', () => {
		const signal1$ = makeSignal<number>();
		const signal2$ = makeSignal<number>();
		const merged$ = mergeSignals([signal1$, signal2$]);
		let actual = -1;
		merged$.subscribe(([v1, v2]) => {
			actual = v1 ?? v2 ?? -2;
		});
		expect(actual).to.eq(-1);
		signal1$.emit(1);
		expect(actual).to.eq(1);
		signal2$.emit(2);
		expect(actual).to.eq(2);
	});
	it('tests that there is always at least a value inside the array of changes', () => {
		const signal1$ = makeSignal<number>();
		const signal2$ = makeSignal<number>();
		const signal3$ = makeSignal<number>();
		const merged$ = mergeSignals([signal1$, signal2$, signal3$]);
		merged$.subscribe((changes) => {
			expect(changes.some((c) => c !== undefined)).to.be.true;
		});
		signal1$.emit(1);
		signal2$.emit(2);
		signal3$.emit(3);
	});
	it('checks that the number of subscriptions is consistent', () => {
		const signal1$ = makeSignal<number>();
		const signal2$ = makeSignal<number>();
		const merged$ = mergeSignals([signal1$, signal2$]);
		expect(signal1$.nOfSubscriptions).to.eq(0);
		expect(signal2$.nOfSubscriptions).to.eq(0);
		expect(merged$.nOfSubscriptions).to.eq(0);

		const unsubscribe = merged$.subscribe(() => undefined);
		expect(signal1$.nOfSubscriptions).to.eq(1);
		expect(signal2$.nOfSubscriptions).to.eq(1);
		expect(merged$.nOfSubscriptions).to.eq(1);
		signal1$.emit(10);
		signal2$.emit(10);
		expect(signal1$.nOfSubscriptions).to.eq(1);
		expect(signal2$.nOfSubscriptions).to.eq(1);
		expect(merged$.nOfSubscriptions).to.eq(1);
		unsubscribe();
		expect(signal1$.nOfSubscriptions).to.eq(0);
		expect(signal2$.nOfSubscriptions).to.eq(0);
		expect(merged$.nOfSubscriptions).to.eq(0);
	});
});
