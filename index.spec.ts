import test from 'ava';
import descriptors, { PropertyDescriptors } from './';

const input = {
  name: 'Vitor',
  birth: new Date(1996, 2, 28)
};

const output: PropertyDescriptors<typeof input> = {
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
  }
};

test('Module exposes a function', (context) => {
  context.is(typeof descriptors, 'function');
});

test('Returns property descriptors', (context) => {
  const value = descriptors(input);

  context.deepEqual(value, output);
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

test('Polyfills Object.getOwnPropertySymbols', (context) => {
  const getOwnKeys = Reflect.ownKeys;
  const getOwnPropertySymbols = Object.getOwnPropertySymbols;
  const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

  delete Reflect.ownKeys;
  delete Object.getOwnPropertySymbols;
  delete Object.getOwnPropertyDescriptors;

  const value = descriptors(input);

  Reflect.ownKeys = getOwnKeys;
  Object.getOwnPropertySymbols = getOwnPropertySymbols;
  Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;

  context.deepEqual(value, output);
});
