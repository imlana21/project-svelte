<script lang="ts">
	import { onMount } from 'svelte'
	import { requirePermission } from '$lib/hooks/useGuard.svelte'
	import { useStockDashboard } from '$lib/hooks/useStockDashboard.svelte'
	import { PERMISSIONS } from '$lib/utils/permission-registry'
	import EquityOverviewCard from './EquityOverviewCard.svelte'
	import PortfolioReturnCard from './PortfolioReturnCard.svelte'
	import EquityReturnTable from './EquityReturnTable.svelte'
	import PortfolioAllocationCard from './PortfolioAllocationCard.svelte'
	import TradeSummaryCard from './TradeSummaryCard.svelte'
	import TopGainerCard from './TopGainerCard.svelte'
	import RealizedGainCard from './RealizedGainCard.svelte'
	import PeriodSelect from './PeriodSelect.svelte'

	requirePermission(PERMISSIONS.stocksPositions.read)

	const dashboard = useStockDashboard()

	onMount(() => {
		dashboard.loadAll()
	})
</script>

<div class="space-y-4 p-4">
	<div class="flex flex-col gap-1">
		<h1 class="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">Dashboard</h1>
		<p class="text-sm text-surface-500 dark:text-surface-400">Ringkasan performa portofolio saham Anda</p>
	</div>

	<div class="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
		<div class="flex flex-col gap-4">
			<EquityOverviewCard
				points={dashboard.equityPoints}
				currentEquity={dashboard.totalEquity}
				range={dashboard.equityRange}
				onRangeChange={(v) => (dashboard.equityRange = v)}
			/>
			<PortfolioReturnCard
				points={dashboard.returnPoints}
				range={dashboard.returnRange}
				onRangeChange={(v) => (dashboard.returnRange = v)}
			/>
		</div>

		<EquityReturnTable points={dashboard.equity} />

		<PortfolioAllocationCard positions={dashboard.positions} />
	</div>

	<div class="space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Trade Summary</h2>
			<PeriodSelect value={dashboard.tradePeriod} onChange={(v) => (dashboard.tradePeriod = v)} />
		</div>

		<div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
			<div class="flex flex-col gap-4">
				<TradeSummaryCard summary={dashboard.tradeSummary} />
				<TopGainerCard topGainers={dashboard.tradeSummary.topGainers} />
			</div>
			<RealizedGainCard summary={dashboard.realizedGain} periodLabel={dashboard.periodLabel} />
		</div>
	</div>
</div>
