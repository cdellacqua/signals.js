[**@cdellacqua/signals**](../README.md)

***

[@cdellacqua/signals](../README.md) / ReadonlySignal

# Type Alias: ReadonlySignal\<T\>

> **ReadonlySignal**\<`T`\> = `object`

Defined in: [index.ts:7](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L7)

A signal that can have subscribers and emit values to them.

## Type Parameters

### T

`T`

## Methods

### nOfSubscriptions()

> **nOfSubscriptions**(): `number`

Defined in: [index.ts:26](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L26)

Return the current number of active subscriptions.

#### Returns

`number`

***

### subscribe()

> **subscribe**(`subscriber`): [`Unsubscribe`](Unsubscribe.md)

Defined in: [index.ts:16](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L16)

Subscribe a function to this signal.

Note: subscribers are deduplicated, if you need to subscribe the same
function more than once wrap it in an arrow function, e.g.
`signal$.subscribe((v) => myFunc(v));`

#### Parameters

##### subscriber

[`Subscriber`](Subscriber.md)\<`T`\>

a function that will be called when this signal emits.

#### Returns

[`Unsubscribe`](Unsubscribe.md)

***

### subscribeOnce()

> **subscribeOnce**(`subscriber`): [`Unsubscribe`](Unsubscribe.md)

Defined in: [index.ts:22](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L22)

Subscribe a function to this signal and automatically unsubscribe it after one emit occurs.

#### Parameters

##### subscriber

[`Subscriber`](Subscriber.md)\<`T`\>

a function that will be called when this signal emits.

#### Returns

[`Unsubscribe`](Unsubscribe.md)
