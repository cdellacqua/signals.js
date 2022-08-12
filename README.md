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


## Migrating to V5

TL;DR: replace nOfSubscriptions to nOfSubscriptions().

The only major change is the refactoring of nOfSubscriptions.
Up until V4 it was a getter property, in V5 it's a function.

This change is meant to prevent common pitfalls that occur when composing signals in custom objects. As an example, when using {...signal$, myCustomExtension() { /* my code */ } }, the
object spread syntax would previously capture the current value returned by the
getter, making the field a regular object property that couldn't update on its own.
It's now possible to use the spread syntax, because it will capture the function
instead of the current value.

A positive side effect of this change is the reduced number of function calls necessary to reach the value hidden behind the getter (i.e. nOfSubscriptions doesn't need to be redefined as a getter in every composite object, it just needs to be a reference to the original function).

## Highlights

`Signal<T>` provides methods such as:

- `emit(value)`, to emit a value to all subscribers;
- `subscribe(subscriber)`, to attach subscribers;
- `subscribeOnce(subscriber)`, to attach subscribers for a single `emit` call.

When you subscribe to a signal, you get a unsubscribe function, e.g.:
```ts
import {makeSignal} from '@cdellacqua/signals';

const signal$ = makeSignal<number>();
const unsubscribe = signal$.subscribe((v) => console.log(v));
signal$.emit(3.14); // will trigger console.log, printing 3.14
unsubscribe();
signal$.emit(42); // won't do anything
```

The above code can be rewritten with `subscribeOnce`:
```ts
import {makeSignal} from '@cdellacqua/signals';

const signal$ = makeSignal<number>();
signal$.subscribeOnce((v) => console.log(v));
signal$.emit(3.14); // will trigger console.log, printing 3.14
signal$.emit(42); // won't do anything
```

`Signal<T>` also contains a getter (`nOfSubscriptions`) that lets you know how many active subscriptions
are active at a given moment (this could be useful if you are trying to optimize your code).

```ts
import {makeSignal} from '@cdellacqua/signals';

const signal$ = makeSignal<number>();
console.log(signal$.nOfSubscriptions()); // 0
const unsubscribe = signal$.subscribe(() => undefined); // empty subscriber
console.log(signal$.nOfSubscriptions()); // 1
unsubscribe();
console.log(signal$.nOfSubscriptions()); // 0
```

A nice feature of `Signal<T>` is that it deduplicates subscribers,
that is you can't accidentally add the same function more than
once to the same signal (just like the DOM addEventListener method):
```ts
import {makeSignal} from '@cdellacqua/signals';

const signal$ = makeSignal<number>();
const subscriber = (v: number) => console.log(v);
console.log(signal$.nOfSubscriptions()); // 0
const unsubscribe1 = signal$.subscribe(subscriber);
const unsubscribe2 = signal$.subscribe(subscriber);
const unsubscribe3 = signal$.subscribe(subscriber);
console.log(signal$.nOfSubscriptions()); // 1
unsubscribe3(); // will remove "subscriber"
unsubscribe2(); // won't do anything, "subscriber" has already been removed
unsubscribe1(); // won't do anything, "subscriber" has already been removed
console.log(signal$.nOfSubscriptions()); // 0
```

If you ever needed to add the same function
more than once you can still achieve that by simply wrapping it inside an arrow function:
```ts
import {makeSignal} from '@cdellacqua/signals';

const signal$ = makeSignal<number>();
const subscriber = (v: number) => console.log(v);
console.log(signal$.nOfSubscriptions()); // 0
const unsubscribe1 = signal$.subscribe(subscriber);
console.log(signal$.nOfSubscriptions()); // 1
const unsubscribe2 = signal$.subscribe((v) => subscriber(v));
console.log(signal$.nOfSubscriptions()); // 2
unsubscribe2();
console.log(signal$.nOfSubscriptions()); // 1
unsubscribe1();
console.log(signal$.nOfSubscriptions()); // 0
```

You can also have a signal that just triggers its subscribers without passing
any data:
```ts
import {makeSignal} from '@cdellacqua/signals';

const signal$ = makeSignal<void>();
signal$.emit();
```

## Coalescing and deriving signals

### Coalescing

Coalescing multiple signals into one consists of
creating a new signal that will emit the latest value emitted by any source
signal.

Example:
```ts
import {makeSignal, coalesceSignals} from '@cdellacqua/signals';

const lastUpdate1$ = makeSignal<number>();
const lastUpdate2$ = makeSignal<number>();
const latestUpdate$ = coalesceSignals([lastUpdate1$, lastUpdate2$]);
latestUpdate$.subscribe((v) => console.log(v));
lastUpdate1$.emit(1577923200000); // will log 1577923200000
lastUpdate2$.emit(1653230659450); // will log 1653230659450
```

### Deriving

Deriving a signal consists of creating a new signal
that emits a value mapped from the source signal.

Example:
```ts
import {makeSignal, deriveSignal} from '@cdellacqua/signals';

const signal$ = makeSignal<number>();
const derived$ = deriveSignal(signal$, (n) => n + 100);
derived$.subscribe((v) => console.log(v));
signal$.emit(3); // will trigger console.log, echoing 103
```

## Readonly signal

When you coalesce or derive a signal, you get back a `ReadonlySignal<T>`.
This type lacks the `emit` method.

A `Signal<T>` is in fact an extension of a `ReadonlySignal<T>` that adds the `emit` method.

As a rule of thumb, it is preferable to pass around `ReadonlySignal<T>`s,
to better encapsulate your signals and prevent unwanted `emit`s.
