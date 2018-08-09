import test from 'ava';
import descriptors from './';

const input = {
  name: 'Vitor',
  birth: new Date(1996, 2, 28)
};

const symbol = Symbol('SECRET');

Object.defineProperty(input, symbol, {
  configurable: false,
  enumerable: false,
  writable: false,
  value: 0
});

const output = {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 'Vitor'
  },
  birth: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: new Date(1996, 2, 28)
  },
  [symbol]: {
    configurable: false,
    enumerable: false,
    writable: false,
    value: 0
  }
};

test('Module exposes a function', (context) => {
  context.is(typeof descriptors, 'function');
});

test('Returns property descriptors', (context) => {
  context.deepEqual(descriptors(input), output);
});

test('Polyfills Object.getOwnPropertyDescriptors', (context) => {
  const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

  delete Object.getOwnPropertyDescriptors;

  const value = descriptors(input);

  Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;

  context.deepEqual(value, output);
});

test('Polyfills Reflect.ownKeys', (context) => {
  const getOwnKeys = Reflect.ownKeys;
  const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

  delete Reflect.ownKeys;
  delete Object.getOwnPropertyDescriptors;

  const value = descriptors(input);

  Reflect.ownKeys = getOwnKeys;
  Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;

  context.deepEqual(value, output);
});

test('Polyfills Object.getOwnPropertySymbols + not work for symbols', (context) => {
  const getOwnKeys = Reflect.ownKeys;
  const getOwnPropertySymbols = Object.getOwnPropertySymbols;
  const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

  delete Reflect.ownKeys;
  delete Object.getOwnPropertySymbols;
  delete Object.getOwnPropertyDescriptors;

  const value = descriptors(input);
  const expected = { ...output };

  delete expected[symbol];

  Reflect.ownKeys = getOwnKeys;
  Object.getOwnPropertySymbols = getOwnPropertySymbols;
  Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;

  context.false(value.hasOwnProperty(symbol));
  context.deepEqual(value, expected);
});
