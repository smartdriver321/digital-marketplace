import { redirect } from 'next/navigation'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { unstable_noStore as noStore } from 'next/cache'

import prisma from '@/lib/db'
import { SellForm } from '@/components/form/SellForm'
import { Card } from '@/components/ui/card'

async function getData(userId: string) {
	const data = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			stripeConnectedLinked: true,
		},
	})

	if (data?.stripeConnectedLinked === false) {
		return redirect('/billing')
	}

	return null
}

export default async function SellPage() {
	//noStore()
	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user) {
		throw new Error('Unauthorized')
	}

	const data = await getData(user.id)

	return (
		<section className='max-w-7xl mx-auto px-4 md:px-8 mb-14'>
			<Card>
				<SellForm />
			</Card>
		</section>
	)
}
