[**@cdellacqua/signals**](../README.md)

***

[@cdellacqua/signals](../README.md) / makeSignal

# Function: makeSignal()

> **makeSignal**\<`T`\>(): [`Signal`](../type-aliases/Signal.md)\<`T`\>

Defined in: [index.ts:53](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L53)

Make a signal of type T.

Example usage:
```ts
const signal$ = makeSignal<number>();
signal$.emit(10);
```
Example usage with no data:
```ts
const signal$ = makeSignal<void>();
signal$.emit();
```

## Type Parameters

### T

`T`

## Returns

[`Signal`](../type-aliases/Signal.md)\<`T`\>

a signal.
