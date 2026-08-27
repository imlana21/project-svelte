import type { Component } from 'svelte'
import {
	Archive,
	ArrowLeftRight,
	Banknote,
	BarChart3,
	Building2,
	Clipboard,
	CreditCard,
	Gauge,
	KeyRound,
	Layers,
	LayoutDashboard,
	PieChart,
	Receipt,
	ShieldCheck,
	TrendingUp,
	Users,
	Wallet,
} from '@lucide/svelte'
import { PERMISSIONS } from '$lib/utils/permission-registry'

interface NavItem {
	title: string
	href?: string
	icon?: Component
	label?: boolean
	permission?: string
}

export const mainNav: NavItem[] = [
	{ title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: PERMISSIONS.dashboard.read },
	{ title: 'MARKET DATA', label: true },
	{
		title: 'Stocks Dashboard',
		href: '/stocks/dashboard',
		icon: Gauge,
		permission: PERMISSIONS.stocksTransactions.read,
	},
	{
		title: 'Transactions',
		href: '/stocks/transactions',
		icon: Building2,
		permission: PERMISSIONS.stocksTransactions.read,
	},
	{
		title: 'Realized PnL',
		href: '/stocks/realized-pnl',
		icon: TrendingUp,
		permission: PERMISSIONS.stocksRealizedPnl.read,
	},
	{
		title: 'Positions',
		href: '/stocks/positions',
		icon: Receipt,
		permission: PERMISSIONS.stocksPositions.read,
	},
	{
		title: 'Emiten List',
		href: '/stocks/emitens',
		icon: Receipt,
		permission: PERMISSIONS.stocksEmitens.read,
	},
	{
		title: 'Analisis',
		href: '/stocks/analisis',
		icon: BarChart3,
		permission: PERMISSIONS.stocksAnalyses.read,
	},
	{ title: 'PORTFOLIO', label: true },
	{
		title: 'Sekuritas',
		href: '/stocks/sekuritas',
		icon: Clipboard,
		permission: PERMISSIONS.stocksSekuritas.read,
	},
	{
		title: 'Fund Mutations',
		href: '/stocks/fund-mutations',
		icon: Archive,
		permission: PERMISSIONS.stocksFundMutations.read,
	},
	{ title: 'FINANCE', label: true },
	{
		title: 'Finance Dashboard',
		href: '/finance/dashboard',
		icon: Gauge,
		permission: PERMISSIONS.financePockets.read,
	},
	{ title: 'Pockets', href: '/finance/pockets', icon: Wallet, permission: PERMISSIONS.financePockets.read },
	{ title: 'Debts', href: '/finance/debts', icon: CreditCard, permission: PERMISSIONS.financeDebts.read },
	{ title: 'Incomes', href: '/finance/incomes', icon: Banknote, permission: PERMISSIONS.financeIncomes.read },
	{
		title: 'Finance Transactions',
		href: '/finance/transactions',
		icon: ArrowLeftRight,
		permission: PERMISSIONS.financeTransactions.read,
	},
	{
		title: 'Allocation Configs',
		href: '/finance/allocation-configs',
		icon: PieChart,
		permission: PERMISSIONS.financeAllocationConfigs.read,
	},
	{
		title: 'Income Distributions',
		href: '/finance/income-distributions',
		icon: Layers,
		permission: PERMISSIONS.financeIncomes.read,
	},
	{ title: 'ACCESS CONTROL', label: true },
	{ title: 'User Management', href: '/users', icon: Users, permission: PERMISSIONS.users.read },
	{ title: 'Roles & Permissions', href: '/roles', icon: ShieldCheck, permission: PERMISSIONS.roles.read },
	{ title: 'Permissions', href: '/permissions', icon: KeyRound, permission: PERMISSIONS.permissions.read },
]
