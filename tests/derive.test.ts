import {expect} from 'chai';
import {deriveSignal, makeSignal} from '../src/lib';

describe('derive', () => {
	it('creates a derived signal', () => {
		const signal$ = makeSignal<number>();
		const derived$ = deriveSignal(signal$, (n) => n + 100);
		let actual = -1;
		derived$.subscribe((v) => {
			actual = v;
		});
		expect(actual).to.eq(-1);
		signal$.emit(1);
		expect(actual).to.eq(101);
		signal$.emit(2);
		expect(actual).to.eq(102);
	});
	it('checks that the number of subscriptions is consistent', () => {
		const signal$ = makeSignal<number>();
		const derived$ = deriveSignal(signal$, (n) => n + 100);
		expect(signal$.nOfSubscriptions).to.eq(0);
		expect(derived$.nOfSubscriptions).to.eq(0);

		const unsubscribe = derived$.subscribe(() => undefined);
		expect(signal$.nOfSubscriptions).to.eq(1);
		expect(derived$.nOfSubscriptions).to.eq(1);
		signal$.emit(10);
		expect(signal$.nOfSubscriptions).to.eq(1);
		expect(derived$.nOfSubscriptions).to.eq(1);
		unsubscribe();
		expect(signal$.nOfSubscriptions).to.eq(0);
		expect(derived$.nOfSubscriptions).to.eq(0);
	});
});
