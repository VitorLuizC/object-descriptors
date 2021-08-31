import descriptors from './';

const input = {
  name: 'Vitor',
  birth: new Date(1996, 2, 28),
};

const symbol = Symbol('SECRET');

Object.defineProperty(input, symbol, {
  configurable: false,
  enumerable: false,
  writable: false,
  value: 0,
});

const output = {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 'Vitor',
  },
  birth: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: new Date(1996, 2, 28),
  },
  [symbol]: {
    configurable: false,
    enumerable: false,
    writable: false,
    value: 0,
  },
};

it('Throws TypeError if value is `null`', () => {
  expect(() => {
    descriptors((null as unknown) as object);
  }).toThrow(new TypeError('Cannot convert undefined or null to object'));
});

it('Throws TypeError if value is `undefinned`', () => {
  expect(() => {
    descriptors((undefined as unknown) as object);
  }).toThrow(new TypeError('Cannot convert undefined or null to object'));
});

it('Returns property descriptors', () => {
  const value = descriptors(input);
  expect(value).toEqual(output);
});

it('Polyfills Object.getOwnPropertyDescriptors', () => {
  const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

  // @ts-expect-error
  delete Object.getOwnPropertyDescriptors;

  const value = descriptors(input);

  Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;

  expect(value).toEqual(output);
});

it('Polyfills Reflect.ownKeys', () => {
  const getOwnKeys = Reflect.ownKeys;
  const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

  // @ts-expect-error
  delete Reflect.ownKeys;
  // @ts-expect-error
  delete Object.getOwnPropertyDescriptors;

  const value = descriptors(input);

  Reflect.ownKeys = getOwnKeys;
  Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;

  expect(value).toEqual(output);
});

it('Polyfills Object.getOwnPropertySymbols + not work for symbols', () => {
  const getOwnKeys = Reflect.ownKeys;
  const getOwnPropertySymbols = Object.getOwnPropertySymbols;
  const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

  // @ts-expect-error
  delete Reflect.ownKeys;
  // @ts-expect-error
  delete Object.getOwnPropertySymbols;
  // @ts-expect-error
  delete Object.getOwnPropertyDescriptors;

  const value = descriptors(input);
  const { [symbol]: _, ...outputWithoutSymbol } = output;

  Reflect.ownKeys = getOwnKeys;
  Object.getOwnPropertySymbols = getOwnPropertySymbols;
  Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;

  expect(value).not.toHaveProperty([symbol]);
  expect(value).toEqual(outputWithoutSymbol);
});
