import { ReactNode } from 'react'
import { ChefHat, Globe, PartyPopper } from 'lucide-react'

interface iAppProps {
	name: string
	title: string
	image: ReactNode
	id: number
}

export const categoryItems: iAppProps[] = [
	{
		id: 0,
		name: 'templates',
		title: 'Templates',
		image: <Globe />,
	},
	{
		id: 1,
		name: 'ui-kits',
		title: 'UI Kits',
		image: <ChefHat />,
	},
	{
		id: 2,
		name: 'icons',
		title: 'Icons',
		image: <PartyPopper />,
	},
]
