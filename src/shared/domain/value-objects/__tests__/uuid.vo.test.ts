import { InvalidUuidError, Uuid } from "../uuid.vo"
import {validate as uuidValidate} from 'uuid'

describe('Uuid Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')
  it('should throw an error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid')
    }).toThrow(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  it('should create a valid uuid', () => {
    const uuid = new Uuid()
    expect(uuid.id).toBeDefined()
    expect(uuidValidate(uuid.id)).toBe(true)
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  it('should accept a valid uuid', () => {
    const uuid = new Uuid('37ae1aa7-1e90-408f-b874-e74c9c1ec0a3')
    expect(uuid.id).toBe('37ae1aa7-1e90-408f-b874-e74c9c1ec0a3')
    expect(validateSpy).toHaveBeenCalledTimes(1)

  })
})