import {makeCachedSignal} from './lib';

const counter$ = makeCachedSignal(0);

const span = document.createElement('span');
counter$.subscribe((count) => {
	span.innerText = String(count);
});

const button = document.createElement('button');
button.innerText = '+';
button.addEventListener('click', () => {
	counter$.emit(counter$.lastEmitted + 1);
});

document.body.appendChild(button);
document.body.appendChild(span);
