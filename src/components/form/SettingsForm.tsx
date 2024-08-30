'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import { updateUserSettings, type State } from '@/app/actions'
import { Submitbutton } from '../shared/SubmitButtons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

interface iAppProps {
	firstName: string
	lastName: string
	email: string
}

export function SettingsForm({ firstName, lastName }: iAppProps) {
	const initalState: State = { message: '', status: undefined }
	const [state, formAction] = useFormState(updateUserSettings, initalState)

	useEffect(() => {
		if (state?.status === 'error') {
			toast.error(state.message)
		} else if (state?.status === 'success') {
			toast.success(state.message)
		}
	}, [state])

	return (
		<form action={formAction}>
			<CardHeader>
				<CardTitle>Settings</CardTitle>
				<CardDescription>
					Here you will find settings regarding your account
				</CardDescription>
			</CardHeader>

			<CardContent className='flex flex-col gap-y-5'>
				<div className='flex flex-col gap-y-2'>
					<Label>First Name</Label>
					<Input name='firstName' type='text' defaultValue={firstName} />
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Last Name</Label>
					<Input name='lastName' type='text' defaultValue={lastName} />
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Email</Label>
					<Input
						name='email'
						type='email'
						disabled
						defaultValue={'smart@smart-solutions.de'}
					/>
				</div>
			</CardContent>

			<CardFooter>
				<Submitbutton title='Update your Settings' />
			</CardFooter>
		</form>
	)
}
