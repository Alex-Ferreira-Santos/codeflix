import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject{
  constructor(readonly value: string) {
    super()
  }
}

class ComplexValueObject extends ValueObject{
  constructor(readonly prop1: string, readonly prop2: number) {
    super()
  }
}

describe('ValueObject Unit tests', () => {
  it('should be equals', () => {
    const valueObject1 = new StringValueObject('test')
    const valueObject2 = new StringValueObject('test')
    expect(valueObject1.equals(valueObject2)).toBe(true)
    expect(valueObject2.equals(valueObject1)).toBe(true)

    const complexValueObject1 = new ComplexValueObject("test", 1)
    const complexValueObject2 = new ComplexValueObject("test", 1)
    expect(complexValueObject1.equals(complexValueObject2)).toBe(true)
    expect(complexValueObject2.equals(complexValueObject1)).toBe(true)
  })

  it('should not be equals', () => {
    const valueObject1 = new StringValueObject('test')
    const valueObject2 = new StringValueObject('test2')
    expect(valueObject1.equals(valueObject2)).toBe(false)
    expect(valueObject2.equals(valueObject1)).toBe(false)
    expect(valueObject2.equals(null as any)).toBe(false)
    expect(valueObject2.equals(undefined as any)).toBe(false)

    const complexValueObject1 = new ComplexValueObject("test", 1)
    const complexValueObject2 = new ComplexValueObject("test", 2)
    expect(complexValueObject1.equals(complexValueObject2)).toBe(false)
    expect(complexValueObject2.equals(complexValueObject1)).toBe(false)
    expect(complexValueObject1.equals(null as any)).toBe(false)
    expect(complexValueObject2.equals(undefined as any)).toBe(false)
  })
})