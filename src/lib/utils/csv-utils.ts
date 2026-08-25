export function exportToCSV<T extends Record<string, unknown>>(
	data: T[],
	fields: { key: string; label: string }[],
	filename: string,
) {
	const header = fields.map((f) => f.label).join(',')
	const rows = data.map((item) =>
		fields
			.map((f) => {
				const val = getNestedValue(item, f.key)
				const str = String(val ?? '')
				return str.includes(',') || str.includes('"') || str.includes('\n')
					? `"${str.replace(/"/g, '""')}"`
					: str
			})
			.join(','),
	)

	const csv = [header, ...rows].join('\n')
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `${filename}.csv`
	link.click()
	URL.revokeObjectURL(url)
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
	return path.split('.').reduce<unknown>((acc, key) => {
		if (acc && typeof acc === 'object') {
			return (acc as Record<string, unknown>)[key]
		}
		return undefined
	}, obj)
}

export function parseCSV(text: string): Record<string, string>[] {
	const lines = text.trim().split('\n')
	if (lines.length < 2) return []

	const headers = parseLine(lines[0])
	return lines.slice(1).map((line) => {
		const values = parseLine(line)
		const obj: Record<string, string> = {}
		headers.forEach((h, i) => {
			obj[h.trim()] = values[i]?.trim() ?? ''
		})
		return obj
	})
}

function parseLine(line: string): string[] {
	const result: string[] = []
	let current = ''
	let inQuotes = false

	for (let i = 0; i < line.length; i++) {
		const char = line[i]
		if (char === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"'
				i++
			} else {
				inQuotes = !inQuotes
			}
		} else if (char === ',' && !inQuotes) {
			result.push(current)
			current = ''
		} else {
			current += char
		}
	}
	result.push(current)
	return result
}
