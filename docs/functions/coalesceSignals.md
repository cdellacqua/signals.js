[**@cdellacqua/signals**](../README.md)

***

[@cdellacqua/signals](../README.md) / coalesceSignals

# Function: coalesceSignals()

> **coalesceSignals**\<`T`\>(`signals$`): [`ReadonlySignal`](../type-aliases/ReadonlySignal.md)\<`T`\[`number`\]\>

Defined in: [composition.ts:75](https://github.com/cdellacqua/signals.js/blob/main/src/lib/composition.ts#L75)

Coalesce multiple signals into one that will emit the latest value emitted
by any of the source signals.

Example:
```ts
const lastUpdate1$ = makeSignal<number>();
const lastUpdate2$ = makeSignal<number>();
const latestUpdate$ = coalesceSignals([lastUpdate1$, lastUpdate2$]);
latestUpdate$.subscribe((v) => console.log(v));
lastUpdate1$.emit(1577923200000); // will log 1577923200000
lastUpdate2$.emit(1653230659450); // will log 1653230659450
```

## Type Parameters

### T

`T` *extends* `unknown`[]

## Parameters

### signals$

\{ \[P in string \| number \| symbol\]: ReadonlySignal\<T\[P\]\> \}

an array of signals to observe.

## Returns

[`ReadonlySignal`](../type-aliases/ReadonlySignal.md)\<`T`\[`number`\]\>

a new signal that emits whenever one of the source signals emits.
