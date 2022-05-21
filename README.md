# @cdellacqua/signals

A simple signal pattern implementation that enables reactive programming.

Signals are event emitters with specific purposes. For example:

```js
button.addEventListener('click', () => console.log('click'));
input.addEventListener('change', (e) => console.log(e));
```

...could be rewritten with signals as:

```js
button.clicked.subscribe(() => console.log('click'));
input.changed.subscribe((e) => console.log(e));
```


[NPM Package](https://www.npmjs.com/package/@cdellacqua/signals)

`npm install @cdellacqua/signals`

[Documentation](./docs/README.md)

## Highlights

This library provides 2 kinds of signals:

- `Signal<T>` (and `SimpleSignal<T>`);
- `CachedSignal<T>` (and `SimpleCachedSignal<T>`).

`Signal<T>` provides methods such as:

- `subscribe(subscriber)`, to attach listeners;
- `emit(value)`, to emit a value to all subscribers;
- `emitFor(subscriber, value)`, to emit a value to a specific subscriber;
- `clearSubscriptions()`, to remove all active subscriptions.

When you subscribe to a signal, you get a unsubscribe function, e.g.:
```ts
import {makeSignal} from '@cdellacqua/signals';
const signal$ = makeSignal<number>();
const unsubscribe = signal$.subscribe((v) => console.log(v));
signal$.emit(3.14); // will trigger console.log, printing 3.14
unsubscribe();
signal$.emit(42); // won't do anything
```

Example: "a random number every second"
```ts
import {makeSignal} from '@cdellacqua/signals';
const random$ = makeSignal<number>();

random$.subscribe((random) => {
	console.log(random);
});

setInterval(() => random$.emit(Math.random()), 1000);
```

A `CachedSignal<T>` inherits all the behavior of a `Signal<T>`,
but it also stores the latest value and emits it
to all new subscribers.

Example: "a number immediately and a random one every second"
```ts
import {makeCachedSignal} from '@cdellacqua/signals';
const random$ = makeCachedSignal(42);

console.log(random$.lastEmitted); // 42

// will immediately print 42
random$.subscribe((random) => {
	console.log(random);
});

setInterval(() => random$.emit(Math.random()), 1000);
```

### Simple variants

`Signal<T>` and `CachedSignal<T>` expose a nested signal `nOfSubscriptions$`,
that can be used to monitor the amount of subscriptions in a reactive
manner.

The `SimpleSignal<T>` and `SimpleCachedSignal<T>` variants are the same, except
they don't provide a nested signal, they provide a simple property `nOfSubscriptions`.

Comparison:
```ts
import {makeSignal, makeSimpleSignal} from '@cdellacqua/signals';
const random$ = makeSignal<number>();
const randomSimple$ = makeSimpleSignal<number>();

random$.nOfSubscriptions$.subscribe(console.log) // 0
console.log(randomSimple$.nOfSubscriptions); // 0

// the following will trigger the subscribed console.log, echoing 1
random$.subscribe(() => {});

// the following won't trigger anything, nOfSubscriptions is a simple getter
randomSimple$.subscribe(() => {});
```
