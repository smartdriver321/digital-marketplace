import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { unstable_noStore as noStore } from 'next/cache'

import { createStripeAccountLink, getStripeDashboardLink } from '../actions'
import prisma from '@/lib/db'
import { Submitbutton } from '@/components/shared/SubmitButtons'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

async function getData(userId: string) {
	const data = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			stripeConnectedLinked: true,
		},
	})

	return data
}

export default async function BillingPage() {
	//noStore()
	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user) {
		throw new Error('Unauthorized')
	}

	const data = await getData(user.id)
	return (
		<section className='max-w-7xl mx-auto px-4 md:px-8'>
			<Card>
				<CardHeader>
					<CardTitle>Billing</CardTitle>
					<CardDescription>
						Find all your details regarding your payments
					</CardDescription>
				</CardHeader>
				<CardContent>
					{data?.stripeConnectedLinked === false && (
						<form action={createStripeAccountLink}>
							<Submitbutton title='Link your Accout to stripe' />
						</form>
					)}

					{data?.stripeConnectedLinked === true && (
						<form action={getStripeDashboardLink}>
							<Submitbutton title='View Dashboard' />
						</form>
					)}
				</CardContent>
			</Card>
		</section>
	)
}
