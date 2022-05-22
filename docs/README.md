@cdellacqua/signals

# @cdellacqua/signals

## Table of contents

### Type aliases

- [ReadonlySignal](README.md#readonlysignal)
- [Signal](README.md#signal)
- [Subscriber](README.md#subscriber)
- [Unsubscribe](README.md#unsubscribe)

### Functions

- [coalesceSignals](README.md#coalescesignals)
- [deriveSignal](README.md#derivesignal)
- [deriveSignals](README.md#derivesignals)
- [makeSignal](README.md#makesignal)
- [mergeSignals](README.md#mergesignals)

## Type aliases

### ReadonlySignal

Ƭ **ReadonlySignal**<`T`\>: `Object`

A signal that can have subscribers and emit values to them.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| ``get` **nOfSubscriptions**(): `number`` | `Object` |
| `subscribe` | (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>) => [`Unsubscribe`](README.md#unsubscribe) |

#### Defined in

[index.ts:7](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L7)

___

### Signal

Ƭ **Signal**<`T`\>: [`ReadonlySignal`](README.md#readonlysignal)<`T`\> & { `emit`: (`v`: `T`) => `void` ; `emitFor`: (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>, `v`: `T`) => `void`  }

A signal that can have subscribers and emit values to them.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[index.ts:24](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L24)

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

[index.ts:2](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L2)

___

### Unsubscribe

Ƭ **Unsubscribe**: () => `void`

#### Type declaration

▸ (): `void`

A function that's used to unsubscribe a subscriber from a signal.

##### Returns

`void`

#### Defined in

[index.ts:4](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L4)

## Functions

### coalesceSignals

▸ **coalesceSignals**<`T`\>(`signals$`): [`ReadonlySignal`](README.md#readonlysignal)<`T`[keyof `T`]\>

Coalesce multiple signals into one that will emit the latest value emitted
by any of the source signals.

Example:
```ts
const year$ = makeSignal<number>();
const month$ = makeSignal<string>();
const coalesced$ = coalesceSignals([year$, month$]);
coalesced$.subscribe((v) => console.log(v));
year$.emit(2020); // 2020
month$.emit('July'); // July
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signals$` | { [P in string \| number \| symbol]: ReadonlySignal<T[P]\> } | an array of signals to observe. |

#### Returns

[`ReadonlySignal`](README.md#readonlysignal)<`T`[keyof `T`]\>

a new signal that emits whenever one of the source signals emits.

#### Defined in

[composition.ts:139](https://github.com/cdellacqua/signals.js/blob/main/src/lib/composition.ts#L139)

___

### deriveSignal

▸ **deriveSignal**<`T`, `U`\>(`signal$`, `transform`): [`ReadonlySignal`](README.md#readonlysignal)<`U`\>

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

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signal$` | [`ReadonlySignal`](README.md#readonlysignal)<`T`\> | a signal. |
| `transform` | (`data`: `T`) => `U` | a transformation function. |

#### Returns

[`ReadonlySignal`](README.md#readonlysignal)<`U`\>

a new signal that will emit the transformed data.

#### Defined in

[composition.ts:69](https://github.com/cdellacqua/signals.js/blob/main/src/lib/composition.ts#L69)

___

### deriveSignals

▸ **deriveSignals**<`T`, `U`\>(`signals$`, `transform`): [`ReadonlySignal`](README.md#readonlysignal)<`U`\>

Create a signal that emits whenever one of the passed signals emits.

Example:
```ts
const signal1$ = makeSignal<number>();
const signal2$ = makeSignal<number>();
let sum = 0;
const derived$ = deriveSignals([signal1$, signal2$], ([n1, n2]) => sum += n1 ?? n2 ?? 0);
derived$.subscribe((v) => console.log(v));
signal1$.emit(3); // will trigger console.log, echoing 3
signal2$.emit(2); // will trigger console.log, echoing 5
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown`[] |
| `U` | `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signals$` | { [P in string \| number \| symbol]: ReadonlySignal<T[P]\> } | an array of signals. |
| `transform` | (`data`: { [P in string \| number \| symbol]: undefined \| T[P] }) => `U` | a transformation function that takes an array of changes (see [mergeSignals](README.md#mergesignals)). |

#### Returns

[`ReadonlySignal`](README.md#readonlysignal)<`U`\>

a new signal.

#### Defined in

[composition.ts:115](https://github.com/cdellacqua/signals.js/blob/main/src/lib/composition.ts#L115)

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

a signal.

#### Defined in

[index.ts:48](https://github.com/cdellacqua/signals.js/blob/main/src/lib/index.ts#L48)

___

### mergeSignals

▸ **mergeSignals**<`T`\>(`signals$`): [`ReadonlySignal`](README.md#readonlysignal)<`unknown`[] & { [P in keyof T]: T[P] \| undefined }\>

Create a new signal that observes all the passed signals.
The merged signal will emit each time one of the passed signals emit,
sending an array of changes to all subscribers, that is
an array filled with undefined except for the position
corresponding to the signal that emitted last.

Example:
```ts
const year$ = makeSignal<number>();
const month$ = makeSignal<string>();
const merged$ = mergeSignals([year$, month$]);
merged$.subscribe(([year, month]) => console.log(`${month} ${year}`));
year$.emit(2020); // undefined 2020
month$.emit('July'); // July undefined
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signals$` | { [P in string \| number \| symbol]: ReadonlySignal<T[P]\> } | array of signals to observe. |

#### Returns

[`ReadonlySignal`](README.md#readonlysignal)<`unknown`[] & { [P in keyof T]: T[P] \| undefined }\>

a signal that will emit the observed changes in the signal array.

#### Defined in

[composition.ts:22](https://github.com/cdellacqua/signals.js/blob/main/src/lib/composition.ts#L22)
