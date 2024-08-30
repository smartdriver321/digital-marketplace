'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import { SelectCategory } from '../shared/SelectCategory'
import { TipTapEditor } from '../shared/Editor'
import { Submitbutton } from '../shared/SubmitButtons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export function SellForm() {
	return (
		<form action=''>
			<CardHeader>
				<CardTitle>Sell your product with ease</CardTitle>
				<CardDescription>
					Please describe your product here in detail so that it can be sold
				</CardDescription>
			</CardHeader>

			<CardContent className='flex flex-col gap-y-10'>
				<div className='flex flex-col gap-y-2'>
					<Label>Name</Label>
					<Input
						name='name'
						type='text'
						placeholder='Name of your product'
						required
						minLength={3}
					/>
				</div>
				<div className='flex flex-col gap-y-2'>
					<Label>Category</Label>
					<SelectCategory />
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Price</Label>
					<Input
						placeholder='29$'
						type='number'
						name='price'
						required
						min={1}
					/>
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Small Summary</Label>
					<Textarea
						name='smallDescription'
						placeholder='Please describe your product shortly right here...'
						required
						minLength={10}
					/>
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Description</Label>
					<TipTapEditor />
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Product Images</Label>
					<UploadDropzone endpoint='imageUploader' />
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Product File</Label>
					<UploadDropzone endpoint='productFileUpload' />
				</div>
			</CardContent>

			<CardFooter className='mt-5'>
				<Submitbutton title='Create your Product' />
			</CardFooter>
		</form>
	)
}
