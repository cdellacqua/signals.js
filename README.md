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

`Signal<T>` provides methods such as:

- `subscribe(subscriber)`, to attach listeners;
- `emit(value)`, to emit a value to all subscribers;
- `emitFor(subscriber, value)`, to emit a value to a specific subscriber;

When you subscribe to a signal, you get a unsubscribe function, e.g.:
```ts
import {makeSignal} from '@cdellacqua/signals';
const signal$ = makeSignal<number>();
const unsubscribe = signal$.subscribe((v) => console.log(v));
signal$.emit(3.14); // will trigger console.log, printing 3.14
unsubscribe();
signal$.emit(42); // won't do anything
```

`Signal<T>` also contains a getter (`nOfSubscriptions`) that lets you know how many active subscriptions
are active at a given moment (this could be useful if you are trying to optimize your code).

```ts
import {makeSignal} from '@cdellacqua/signals';
const signal$ = makeSignal<number>();
console.log(signal$.nOfSubscriptions); // 0
const unsubscribe = signal$.subscribe(() => undefined); // empty subscriber
console.log(signal$.nOfSubscriptions); // 1
unsubscribe();
console.log(signal$.nOfSubscriptions); // 0
```

A nice feature of `Signal<T>` is that it deduplicates subscribers,
that is you can't accidentally add the same function more than
once to the same signal (just like the DOM addEventListener method):
```ts
import {makeSignal} from '@cdellacqua/signals';
const signal$ = makeSignal<number>();
const subscriber = (v: number) => console.log(v);
console.log(signal$.nOfSubscriptions); // 0
const unsubscribe1 = signal$.subscribe(subscriber);
const unsubscribe2 = signal$.subscribe(subscriber);
const unsubscribe3 = signal$.subscribe(subscriber);
console.log(signal$.nOfSubscriptions); // 1
unsubscribe3(); // will remove "subscriber"
unsubscribe2(); // won't do anything, "subscriber" has already been removed
unsubscribe1(); // won't do anything, "subscriber" has already been removed
console.log(signal$.nOfSubscriptions); // 0
```

If you ever needed to add the same function
more than once you can still achieve that by simply wrapping it inside an arrow function:
```ts
import {makeSignal} from '@cdellacqua/signals';
const signal$ = makeSignal<number>();
const subscriber = (v: number) => console.log(v);
console.log(signal$.nOfSubscriptions); // 0
const unsubscribe1 = signal$.subscribe(subscriber);
console.log(signal$.nOfSubscriptions); // 1
const unsubscribe2 = signal$.subscribe((v) => subscriber(v));
console.log(signal$.nOfSubscriptions); // 2
unsubscribe2();
console.log(signal$.nOfSubscriptions); // 1
unsubscribe1();
console.log(signal$.nOfSubscriptions); // 0
```

## Coalescing and deriving signals

### Coalescing

Similar to merging, coalescing multiple signals into one consists of
creating a new signal that will emit the latest value emitted by any source
signal.

Example:
```ts
const year$ = makeSignal<number>();
const month$ = makeSignal<string>();
const coalesced$ = coalesceSignals([year$, month$]);
coalesced$.subscribe((v) => console.log(v));
year$.emit(2020); // 2020
month$.emit('July'); // July
```

### Deriving

Deriving a signal consists of creating a new signal
that emits a value mapped from the source signal.

Example:
```ts
const signal$ = makeSignal<number>();
const derived$ = deriveSignal(signal$, (n) => n + 100);
derived$.subscribe((v) => console.log(v));
signal$.emit(3); // will trigger console.log, echoing 103
```

## Readonly signal

When you merge, coalesce or derive a signal (or signals), you get back a `ReadonlySignal<T>`.
This type lacks the `emit` and `emitFor` methods.

A `Signal<T>` is in fact an extension of a `ReadonlySignal<T>` that adds the aforementioned methods.

As a rule of thumb, it should be preferable to pass around `ReadonlySignal<T>`,
to better encapsulate your signals and prevent unwanted `emit`s.
