import { describe, expect, test } from '@jest/globals'
import Common from '../../src/core/Common'

interface IMockObject {
  a?: string
  b?: {
    x?: number
    y?: number
  }
}

describe('Common.extend', () => {
  const a: IMockObject = { a: 'a', b: { x: 1 } }
  const b: IMockObject = { b: { x: 1, y: 2 } }
  const c: IMockObject = { a: 'c' }

  test('deep copy', () => {
    expect(Common.extend(a, b)).toEqual({ ...a, b: b.b })
    expect(Common.extend(b, a)).toEqual({ ...a, b: a.b })
    expect(Common.extend(c, b)).toEqual({ ...c, b: b.b })
  })

  test('shallow copy', () => {
    expect(Common.extend(a, false, b)).toEqual({ ...a, b: a.b })
    expect(Common.extend(b, false, a)).toEqual({ ...a, b: a.b })
    expect(Common.extend(c, false, b)).toEqual({ ...c, b: b.b })
  })
})

describe('Common.colorToNumber', () => {
  test('6 digits', () => {
    expect(Common.colorToNumber('#000000')).toBe(0)
    expect(Common.colorToNumber('#ff482a')).toBe(0xff482a)
  })

  test('3 digits', () => {
    expect(Common.colorToNumber('#000')).toBe(0)
    expect(Common.colorToNumber('#f4a')).toBe(0xff44aa)
  })

  test('invalid code', () => {
    expect(Common.colorToNumber('#$')).toBe(NaN)
    expect(Common.colorToNumber('')).toBe(NaN)
  })
})

describe('Common.clamp', () => {
  expect(Common.clamp(1, 2, 3)).toBe(2)
  expect(Common.clamp(2, 2, 3)).toBe(2)
  expect(Common.clamp(2.1, 2, 3)).toBe(2.1)
  expect(Common.clamp(3, 2, 3)).toBe(3)
  expect(Common.clamp(4, 2, 3)).toBe(3)
})

describe('Common.sign', () => {
  expect(Common.sign(-1)).toBe(-1)
  expect(Common.sign(0)).toBe(1)
  expect(Common.sign(1)).toBe(1)
})

describe('Common.isArray', () => {
  expect(Common.isArray(1)).toBe(false)
  expect(Common.isArray([1])).toBe(true)
  expect(Common.isArray({ a: 1 })).toBe(false)
  expect(Common.isArray([{ a: 1 }])).toBe(true)
})

describe('Common.isObject', () => {
  expect(Common.isObject(1)).toBe(false)
  expect(Common.isObject([1])).toBe(false)
  expect(Common.isObject({ a: 1 })).toBe(true)
  expect(Common.isObject({ 1: 1 })).toBe(true)
  expect(Common.isObject([{ a: 1 }])).toBe(false)
})
