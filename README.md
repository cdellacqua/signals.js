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
are active at a given moment (this could be useful if are trying to optimize your code).

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
that is you can't accidentally subscribe the same function more than
once (just like the DOM addEventListener method):
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

Of course there might be cases where you need to subscribe the same function
more than once. That's still achievable by simply wrapping it inside an arrow function:
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

## Merge, coalesce and derive signals

### Merging
Merging two or more signals consists of creating a new signals
that emits an array of changes.
The array of changes has the same length as the array of source signals
and it's filled with undefined except for the element
at the index corresponding to the source signal that emitted last.

Example:
```ts
const year$ = makeSignal<number>();
const month$ = makeSignal<string>();
const merged$ = mergeSignals([year$, month$]);
merged$.subscribe(([year, month]) => console.log(`${month} ${year}`));
year$.emit(2020); // undefined 2020
month$.emit('July'); // July undefined
```

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

Deriving a signal (or signals) consists of creating a new signal
that emits a value mapped from the source signal.

Example:
```ts
const signal$ = makeSignal<number>();
const derived$ = deriveSignal(signal$, (n) => n + 100);
derived$.subscribe((v) => console.log(v));
signal$.emit(3); // will trigger console.log, echoing 103
```

Example with multiple signals:
```ts
const signal1$ = makeSignal<number>();
const signal2$ = makeSignal<number>();
let sum = 0;
const derived$ = deriveSignals([signal1$, signal2$], ([n1, n2]) => sum += n1 ?? n2 ?? 0);
derived$.subscribe((v) => console.log(v));
signal1$.emit(3); // will trigger console.log, echoing 3
signal2$.emit(2); // will trigger console.log, echoing 5
```

## Readonly signal

When you merge, coalesce or derive a signal (or signals), you get back a `ReadonlySignal<T>`.
This type lacks the `emit` and `emitFor` methods.

A `Signal<T>` is in fact an extension of a `ReadonlySignal<T>` that adds the aforementioned methods.

As a rule of thumb, it should be preferable to pass around `ReadonlySignal<T>`,
to better encapsulate your signals and prevent unwanted `emit`s.
