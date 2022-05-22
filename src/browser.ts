import {makeSignal} from './lib';

const random$ = makeSignal<number>();

const span = document.createElement('span');
random$.subscribe((random) => {
	span.innerText = String(random);
});

const button = document.createElement('button');
button.innerText = 'random';
button.addEventListener('click', () => {
	random$.emit(Math.random());
});

document.body.appendChild(button);
document.body.appendChild(span);
