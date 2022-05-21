@cdellacqua/signals

# @cdellacqua/signals

## Table of contents

### Type aliases

- [CachedSignal](README.md#cachedsignal)
- [Signal](README.md#signal)
- [SimpleCachedSignal](README.md#simplecachedsignal)
- [SimpleSignal](README.md#simplesignal)
- [Subscriber](README.md#subscriber)
- [Unsubscribe](README.md#unsubscribe)

### Functions

- [makeCachedSignal](README.md#makecachedsignal)
- [makeSignal](README.md#makesignal)
- [makeSimpleCachedSignal](README.md#makesimplecachedsignal)
- [makeSimpleSignal](README.md#makesimplesignal)

## Type aliases

### CachedSignal

Ƭ **CachedSignal**<`T`\>: [`Signal`](README.md#signal)<`T`\> & { `lastEmitted`: `T`  }

A signal that can have subscribers and emit values to them.
It has all the same properties as the Signal,
but it also caches the last emitted value and emits it
immediately to all new subscribers.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

index.ts:66

___

### Signal

Ƭ **Signal**<`T`\>: [`SimpleSignal`](README.md#simplesignal)<`T`\> & { `nOfSubscriptions$`: [`SimpleCachedSignal`](README.md#simplecachedsignal)<`number`\>  }

A signal that can have subscribers and emit values to them.
It has all the same properties as the SimpleSignal, but it
also exposes a signal for its current number of subscriptions.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

index.ts:56

___

### SimpleCachedSignal

Ƭ **SimpleCachedSignal**<`T`\>: [`SimpleSignal`](README.md#simplesignal)<`T`\> & { `lastEmitted`: `T`  }

A simple signal that can have subscribers and emit values to them.
It has all the same properties as the SimpleSignal,
but it also caches the last emitted value and emits it
immediately to all new subscribers.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

index.ts:44

___

### SimpleSignal

Ƭ **SimpleSignal**<`T`\>: `Object`

A simple signal that can have subscribers and emit values to them.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| ``get` **nOfSubscriptions**(): `number`` | `Object` |
| `clearSubscriptions` | () => `void` |
| `emit` | (`v`: `T`) => `void` |
| `emitFor` | (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>, `v`: `T`) => `void` |
| `subscribe` | (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>) => [`Unsubscribe`](README.md#unsubscribe) |

#### Defined in

index.ts:7

___

### Subscriber

Ƭ **Subscriber**<`T`\>: (`current`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`current`): `void`

A generic subscriber that takes a value emitted by a signal as its only parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `T` |

##### Returns

`void`

#### Defined in

index.ts:2

___

### Unsubscribe

Ƭ **Unsubscribe**: () => `void`

#### Type declaration

▸ (): `void`

A function that's used to unsubscribe a subscriber from a signal.

##### Returns

`void`

#### Defined in

index.ts:4

## Functions

### makeCachedSignal

▸ **makeCachedSignal**<`T`\>(`initialValue`): [`CachedSignal`](README.md#cachedsignal)<`T`\>

Make a cached signal.

Example usage:
```ts
const signal$ = makeCachedSignal(0);
signal$.emit(10);
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialValue` | `T` |

#### Returns

[`CachedSignal`](README.md#cachedsignal)<`T`\>

a cached signal

#### Defined in

index.ts:203

___

### makeSignal

▸ **makeSignal**<`T`\>(): [`Signal`](README.md#signal)<`T`\>

Make a signal of type T.

Example usage:
```ts
const signal$ = makeSignal<number>();
signal$.emit(10);
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

[`Signal`](README.md#signal)<`T`\>

a signal

#### Defined in

index.ts:167

___

### makeSimpleCachedSignal

▸ **makeSimpleCachedSignal**<`T`\>(`initialValue`): [`SimpleCachedSignal`](README.md#simplecachedsignal)<`T`\>

Make a simple cached signal.

Example usage:
```ts
const signal$ = makeSimpleCachedSignal(0);
signal$.emit(10);
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialValue` | `T` |

#### Returns

[`SimpleCachedSignal`](README.md#simplecachedsignal)<`T`\>

a simple cached signal

#### Defined in

index.ts:130

___

### makeSimpleSignal

▸ **makeSimpleSignal**<`T`\>(): [`SimpleSignal`](README.md#simplesignal)<`T`\>

Make a simple signal of type T.

Example usage:
```ts
const signal$ = makeSimpleSignal<number>();
signal$.emit(10);
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

[`SimpleSignal`](README.md#simplesignal)<`T`\>

a simple signal

#### Defined in

index.ts:80
