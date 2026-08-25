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
