import { describe, it, expect } from 'vitest'
import { ApiError } from './http'

describe('ApiError', () => {
	it('creates an error with status and message', () => {
		const err = new ApiError(404, 'Not found')
		expect(err.status).toBe(404)
		expect(err.message).toBe('Not found')
		expect(err.name).toBe('ApiError')
	})

	it('is an instance of Error', () => {
		const err = new ApiError(500, 'Server error')
		expect(err).toBeInstanceOf(Error)
		expect(err).toBeInstanceOf(ApiError)
	})

	it('has optional errors property', () => {
		const errors = { email: ['already taken'] }
		const err = new ApiError(422, 'Validation failed', errors)
		expect(err.errors).toEqual(errors)
	})

	it('errors is undefined when not provided', () => {
		const err = new ApiError(400, 'Bad request')
		expect(err.errors).toBeUndefined()
	})
})
