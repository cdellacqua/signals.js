[**@cdellacqua/signals**](../README.md)

***

[@cdellacqua/signals](../README.md) / Signal

# Type Alias: Signal\<T\>

> **Signal**\<`T`\> = [`ReadonlySignal`](ReadonlySignal.md)\<`T`\> & `object`

Defined in: [index.ts:30](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L30)

A signal that can have subscribers and emit values to them.

## Type Declaration

### emit()

> **emit**(`v`): `void`

Emit a value to all subscribers.

#### Parameters

##### v

`T`

the value to emit.

#### Returns

`void`

## Type Parameters

### T

`T`
