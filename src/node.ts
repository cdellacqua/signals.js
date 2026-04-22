import {makeSignal} from './lib/index.js';

const random$ = makeSignal<number>();

random$.subscribe(console.log);

const interval = setInterval(() => {
	random$.emit(Math.random());
}, 600);

setTimeout(() => {
	clearInterval(interval);
}, 3000);
