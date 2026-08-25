import { ApiError } from './http'

/**
 * Extract field-level errors from an ApiError (Laravel 422 format).
 * Returns a Record keyed by field name, with the first error message for each field.
 *
 * @example
 * try {
 *   await service.create(payload)
 * } catch (e) {
 *   const fieldErrors = extractFieldErrors(e)
 *   if (fieldErrors.name) { /* show under name input *\/ }
 *   toastError(extractMessage(e))
 * }
 */
export function extractFieldErrors(error: unknown): Record<string, string> {
	if (error instanceof ApiError && error.errors) {
		const result: Record<string, string> = {}
		for (const [key, messages] of Object.entries(error.errors)) {
			if (messages?.length) {
				result[key] = messages[0]
			}
		}
		return result
	}
	return {}
}

/**
 * Extract a human-readable message from an error.
 * Prioritizes ApiError message, then generic fallback.
 */
export function extractMessage(error: unknown, fallback = 'Terjadi kesalahan, silakan coba lagi'): string {
	if (error instanceof ApiError) return error.message
	if (error instanceof Error) return error.message
	return fallback
}
