# object-descriptors

[![Build Status](https://travis-ci.org/VitorLuizC/object-descriptors.svg?branch=master)](https://travis-ci.org/VitorLuizC/object-descriptors)

A pretty well typed `Object.getOwnPropertyDescriptors` polyfill.

## Install

This module is published under NPM registry, so you can install from any package manager.

```sh
npm install object-descriptors --save

# Use the command below if you're using Yarn.
yarn add object-descriptors
```

## Usage

Import `getDescriptors` function and get property descriptors from any object.

> I'm exporting `PropertyDescriptors` type too, so you can use on your TypeScript/JSDoc types.

```ts
import getDescriptors, { PropertyDescriptors } from 'object-descriptors';

const value = {
  name: 'Ryan',
  sayName() {
    console.log(this.name);
  },
};

let descriptors: PropertyDescriptors<{ name: string; sayName: () => void }>;

descriptors = getDescriptors(value);

console.log(descriptors);
// => {
//   name: {
//     value: 'Ryan',
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   sayName: {
//     value: ƒ sayName(),
//     writable: true,
//     enumerable: true,
//     configurable: true
//   }
// }
```

## License

Released under [MIT License](./LICENSE).
