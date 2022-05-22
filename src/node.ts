import {makeSignal} from './lib';

const random$ = makeSignal<number>();

random$.subscribe(console.log);

const interval = setInterval(() => {
	random$.emit(Math.random());
}, 600);

setTimeout(() => {
	clearInterval(interval);
}, 3000);
