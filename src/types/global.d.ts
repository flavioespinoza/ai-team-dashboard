// Date: 2025-11-04
// Version: 1.0.0

declare global {
	var mongoose: {
		conn: typeof import('mongoose') | null
		promise: Promise<typeof import('mongoose')> | null
	}
}

export {}
