import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'

import './globals.css'
import { ourFileRouter } from './api/uploadthing/core'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Digital Marketplace',
	description: 'A place for your digital products',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
				<Navbar />
				{children}
				<Toaster richColors theme='light' closeButton />
			</body>
		</html>
	)
}
