<script lang="ts">
	import { onMount } from 'svelte'
	import { Wallet, TrendingDown, CreditCard, Banknote } from '@lucide/svelte'
	import { requirePermission } from '$lib/hooks/useGuard.svelte'
	import { useFinanceDashboard } from '$lib/hooks/useFinanceDashboard.svelte'
	import { formatRupiah } from '$lib/utils/format'
	import { PERMISSIONS } from '$lib/utils/permission-registry'
	import KpiCard from './KpiCard.svelte'
	import SpendingChartCard from './SpendingChartCard.svelte'
	import RecentTransactionsCard from './RecentTransactionsCard.svelte'
	import UnpaidDebtCard from './UnpaidDebtCard.svelte'
	import PocketListCard from './PocketListCard.svelte'

	requirePermission(PERMISSIONS.financePockets.read)

	const dashboard = useFinanceDashboard()

	onMount(() => {
		dashboard.loadAll()
	})
</script>

<div class="space-y-4 p-4">
	<div class="flex flex-col gap-1">
		<h1 class="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">Dashboard Finance</h1>
		<p class="text-sm text-surface-500 dark:text-surface-400">Ringkasan kondisi keuangan Anda</p>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<KpiCard title="Total Balance" icon={Wallet} value={formatRupiah(dashboard.balance)} subtitle="Saldo semua pocket aktif" />
		<KpiCard
			title="Total Spending"
			icon={TrendingDown}
			value={formatRupiah(dashboard.spendingThisMonth)}
			subtitle="Bulan ini"
			delta={dashboard.spendingDelta}
			tone="destructive"
		/>
		<KpiCard
			title="Total Debt"
			icon={CreditCard}
			value={formatRupiah(dashboard.debtPerMonth)}
			subtitle={`Cicilan aktif / bulan · ${dashboard.unpaidCount} belum bayar`}
			tone="warning"
		/>
		<KpiCard
			title="Total Income"
			icon={Banknote}
			value={formatRupiah(dashboard.incomeThisMonth)}
			subtitle="Bulan ini"
			delta={dashboard.incomeDelta}
			tone="success"
		/>
	</div>

	<div class="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<SpendingChartCard transactions={dashboard.transactions} />
		</div>
		<PocketListCard pockets={dashboard.pockets} />
	</div>

	<div class="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
		<RecentTransactionsCard transactions={dashboard.transactions} />
		<UnpaidDebtCard debts={dashboard.debts} />
	</div>
</div>
