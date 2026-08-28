import type { User } from '$lib/types/Auth'

/** Set slug permission milik user, di-flatten dari `user.permissions` (sudah di-backend). */
function getUserPermissionSlugs(user: User | null | undefined): Set<string> {
	const slugs = new Set<string>()
	if (!user) return slugs
	for (const slug of user.permissions ?? []) slugs.add(slug)
	return slugs
}

/** true kalau user punya minimal salah satu permission. Array kosong = selalu boleh. */
export function hasAnyPermission(user: User | null | undefined, slugs: string[]): boolean {
	if (slugs.length === 0) return true
	const owned = getUserPermissionSlugs(user)
	return slugs.some((slug) => owned.has(slug))
}
