# Matter.ts

This library is a TypeScript adaptation of [Matter.js](https://github.com/liabru/matter-js). The main usage is the same as [Matter.js](https://github.com/liabru/matter-js). See [the README of Matter.js](https://github.com/liabru/matter-js/blob/master/README.md) for details.

You can also see [TypeDoc](https://rozelin-dc.github.io/matter-ts)

## install
```bash
npm install @rozelin/matter-ts
```

## Type Declaration Usage
If you want to import and use interface definitions, etc., you can write as follows.
```ts
import Matter, { Body } from '@rozelin/matter-ts'

const body: Body.IBody = Matter.Body.create()
```

or

```ts
import * as MatterTypes from '@rozelin/matter-ts'
const Matter = MatterTypes.default

const body: MatterTypes.Body.IBody = Matter.Body.create()
```
