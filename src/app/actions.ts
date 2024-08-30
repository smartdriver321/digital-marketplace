'use server'

import { redirect } from 'next/navigation'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { CategoryTypes } from '@prisma/client'
import { z } from 'zod'

import prisma from '@/lib/db'

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
