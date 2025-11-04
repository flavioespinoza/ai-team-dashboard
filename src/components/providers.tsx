// Date: 2025-11-04
// Version: 1.0.0

'use client'

import { Provider } from 'jotai'

export function Providers({ children }: { children: React.ReactNode }) {
	return <Provider>{children}</Provider>
}
