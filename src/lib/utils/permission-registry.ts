/**
 * Daftar permission — disalin PERSIS dari middleware route backend
 * (`be/routes/auth.php` dan `be/routes/api.php`). Sumber kebenaran = backend.
 *
 * CATATAN penamaan backend yang tidak konsisten, dipertahankan apa adanya:
 *   - "stocks-emiten"  (singular)
 *   - "stocks-fundmutations" (tanpa underscore)
 *   - "finance-pockets" / "finance-debts" (plural)
 */
export const PERMISSIONS = {
	dashboard: { read: 'dashboard:read' },

	users: {
		read: 'auth-users.read',
		update: 'auth-users.update',
		delete: 'auth-users.delete',
	},
	roles: {
		read: 'auth-roles.read',
		create: 'auth-roles.create',
		update: 'auth-roles.update',
		delete: 'auth-roles.delete',
	},
	permissions: {
		read: 'auth-permissions.read',
		create: 'auth-permissions.create',
		update: 'auth-permissions.update',
		delete: 'auth-permissions.delete',
	},

	stocksEmitens: {
		read: 'stocks-emiten.read',
		create: 'stocks-emiten.create',
		update: 'stocks-emiten.update',
		delete: 'stocks-emiten.delete',
	},
	stocksSekuritas: {
		read: 'stocks-sekuritas.read',
		create: 'stocks-sekuritas.create',
		update: 'stocks-sekuritas.update',
		delete: 'stocks-sekuritas.delete',
	},
	stocksPositions: {
		read: 'stocks-positions.read',
		update: 'stocks-positions.update',
	},
	stocksFundMutations: {
		read: 'stocks-fundmutations.read',
		create: 'stocks-fundmutations.create',
		delete: 'stocks-fundmutations.delete',
	},
	stocksTransactions: {
		read: 'stocks-transactions.read',
		create: 'stocks-transactions.create',
		delete: 'stocks-transactions.delete',
	},
	stocksRealizedPnl: {
		read: 'stocks-realized.read',
	},

	financePockets: {
		read: 'finance-pockets.read',
		create: 'finance-pockets.create',
		update: 'finance-pockets.update',
		delete: 'finance-pockets.delete',
	},
	financeDebts: {
		read: 'finance-debt.read',
		create: 'finance-debt.create',
		update: 'finance-debt.update',
		delete: 'finance-debt.delete',
	},
	financeIncomes: {
		read: 'finance-income.read',
		create: 'finance-income.create',
		update: 'finance-income.update',
		delete: 'finance-income.delete',
	},
	financeTransactions: {
		read: 'finance-transactions.read',
		create: 'finance-transactions.create',
		update: 'finance-transactions.update',
		delete: 'finance-transactions.delete',
	},
	financeAllocationConfigs: {
		read: 'finance-allocation.read',
		create: 'finance-allocation.create',
		update: 'finance-allocation.update',
		delete: 'finance-allocation.delete',
	},
} as const

export type PermissionSlug = (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]]
