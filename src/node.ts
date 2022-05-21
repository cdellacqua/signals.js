import {makeCachedSignal} from './lib';

const counter$ = makeCachedSignal(0);

counter$.subscribe(console.log);

const interval = setInterval(() => {
	counter$.emit(counter$.lastEmitted + 1);
}, 600);

setTimeout(() => {
	clearInterval(interval);
}, 3000);
