[**@cdellacqua/signals**](../README.md)

***

[@cdellacqua/signals](../README.md) / deriveSignal

# Function: deriveSignal()

> **deriveSignal**\<`T`, `U`\>(`signal$`, `transform`): [`ReadonlySignal`](../type-aliases/ReadonlySignal.md)\<`U`\>

Defined in: [composition.ts:19](https://github.com/cdellacqua/signals.js/blob/main/src/lib/composition.ts#L19)

Create a signal that emits whenever the passed signal emits. The original
emitted value gets transformed by the passed function and the result gets
emitted.

Example:
```ts
const signal$ = makeSignal<number>();
const derived$ = deriveSignal(signal$, (n) => n + 100);
derived$.subscribe((v) => console.log(v));
signal$.emit(3); // will trigger console.log, echoing 103
```

## Type Parameters

### T

`T`

### U

`U`

## Parameters

### signal$

[`ReadonlySignal`](../type-aliases/ReadonlySignal.md)\<`T`\>

a signal.

### transform

(`data`) => `U`

a transformation function.

## Returns

[`ReadonlySignal`](../type-aliases/ReadonlySignal.md)\<`U`\>

a new signal that will emit the transformed data.
