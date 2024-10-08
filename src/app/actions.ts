'use server'

import { redirect } from 'next/navigation'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { CategoryTypes } from '@prisma/client'
import { z } from 'zod'

import prisma from '@/lib/db'
import { stripe } from '@/lib/stripe'

export type State = {
	status: 'error' | 'success' | undefined
	errors?: {
		[key: string]: string[]
	}
	message?: string | null
}

const productSchema = z.object({
	name: z.string().min(3, { message: 'Minimal length of name is 3 character' }),
	category: z.string().min(1, { message: 'Category is required' }),
	price: z.number().min(1, { message: 'Price has to be bigger than 1' }),
	smallDescription: z
		.string()
		.min(10, { message: 'Please summarize your product more' }),
	description: z.string().min(10, { message: 'Description is required' }),
	images: z.array(z.string(), { message: 'Images are required' }),
})

const userSettingsSchema = z.object({
	firstName: z
		.string()
		.min(3, { message: 'Minimal 3 characters required for first name' })
		.or(z.literal(''))
		.optional(),

	lastName: z
		.string()
		.min(3, { message: 'Minimal 3 characters required for last name' })
		.or(z.literal(''))
		.optional(),
})

export async function sellProduct(prevState: any, formData: FormData) {
	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user) {
		throw new Error('Something went wrong')
	}

	const validateFields = productSchema.safeParse({
		name: formData.get('name'),
		category: formData.get('category'),
		price: Number(formData.get('price')),
		smallDescription: formData.get('smallDescription'),
		description: formData.get('description'),
		images: JSON.parse(formData.get('images') as string),
	})

	if (!validateFields.success) {
		const state: State = {
			status: 'error',
			errors: validateFields.error.flatten().fieldErrors,
			message: 'Oops, I think there is a mistake with your inputs.',
		}

		return state
	}

	const data = await prisma.product.create({
		data: {
			name: validateFields.data.name,
			category: validateFields.data.category as CategoryTypes,
			smallDescription: validateFields.data.smallDescription,
			price: validateFields.data.price,
			images: validateFields.data.images,
			userId: user.id,
			description: JSON.parse(validateFields.data.description),
		},
	})

	return redirect(`/product/${data.id}`)
}

export async function updateUserSettings(prevState: any, formData: FormData) {
	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user) {
		throw new Error('Something went wrong')
	}

	const validateFields = userSettingsSchema.safeParse({
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
	})

	if (!validateFields.success) {
		const state: State = {
			status: 'error',
			errors: validateFields.error.flatten().fieldErrors,
			message: 'Oops, I think there is a mistake with your inputs.',
		}

		return state
	}

	const data = await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			firstName: validateFields.data.firstName,
			lastName: validateFields.data.lastName,
		},
	})

	const state: State = {
		status: 'success',
		message: 'Your settings have been updated',
	}

	return state
}

export async function buyProduct(formData: FormData) {
	const id = formData.get('id') as string
	const data = await prisma.product.findUnique({
		where: {
			id: id,
		},
		select: {
			name: true,
			smallDescription: true,
			price: true,
			images: true,
			User: {
				select: {
					connectedAccountId: true,
				},
			},
		},
	})

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: Math.round((data?.price as number) * 100),
					product_data: {
						name: data?.name as string,
						description: data?.smallDescription,
						images: data?.images,
					},
				},
				quantity: 1,
			},
		],
		payment_intent_data: {
			application_fee_amount: Math.round((data?.price as number) * 100) * 0.1,
			transfer_data: {
				destination: data?.User?.connectedAccountId as string,
			},
		},
		success_url:
			process.env.NODE_ENV === 'development'
				? 'http://localhost:3000/payment/success'
				: 'https://digital-marketplace-web-app.vercel.app/payment/success',
		cancel_url:
			process.env.NODE_ENV === 'development'
				? 'http://localhost:3000/payment/success'
				: 'https://digital-marketplace-web-app.vercel.app/payment/cancel',
	})

	return redirect(session.url as string)
}

export async function createStripeAccountLink() {
	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user) {
		throw new Error()
	}

	const data = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
		select: {
			connectedAccountId: true,
		},
	})

	const accountLink = await stripe.accountLinks.create({
		account: data?.connectedAccountId as string,
		refresh_url:
			process.env.NODE_ENV === 'development'
				? `http://localhost:3000/billing`
				: `https://digital-marketplace-web-app.vercel.app/billing`,
		return_url:
			process.env.NODE_ENV === 'development'
				? `http://localhost:3000/return/${data?.connectedAccountId}`
				: `https://digital-marketplace-web-app.vercel.app/return/${data?.connectedAccountId}`,
		type: 'account_onboarding',
	})

	return redirect(accountLink.url)
}

export async function getStripeDashboardLink() {
	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user) {
		throw new Error()
	}

	const data = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
		select: {
			connectedAccountId: true,
		},
	})

	const loginLink = await stripe.accounts.createLoginLink(
		data?.connectedAccountId as string
	)

	return redirect(loginLink.url)
}
