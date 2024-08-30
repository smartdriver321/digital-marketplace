'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { type JSONContent } from '@tiptap/react'
import { toast } from 'sonner'

import { sellProduct, State } from '@/app/actions'
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
	const [json, setJson] = useState<null | JSONContent>(null)
	const [images, setImages] = useState<null | string[]>(null)
	const [productFile, setProductFile] = useState<null | string>(null)

	const initalState: State = { message: '', status: undefined }
	const [state, formAction] = useFormState(sellProduct, initalState)

	useEffect(() => {
		if (state.status === 'success') {
			toast.success(state.message)
		} else if (state.status === 'error') {
			toast.error(state.message)
		}
	}, [state])

	return (
		<form action={formAction}>
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
					{state?.errors?.['name']?.[0] && (
						<p className='text-destructive'>{state?.errors?.['name']?.[0]}</p>
					)}
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Category</Label>
					<SelectCategory />
					{state?.errors?.['category']?.[0] && (
						<p className='text-destructive'>
							{state?.errors?.['category']?.[0]}
						</p>
					)}
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
					{state?.errors?.['price']?.[0] && (
						<p className='text-destructive'>{state?.errors?.['price']?.[0]}</p>
					)}
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Small Summary</Label>
					<Textarea
						name='smallDescription'
						placeholder='Please describe your product shortly right here...'
						required
						minLength={10}
					/>
					{state?.errors?.['smallDescription']?.[0] && (
						<p className='text-destructive'>
							{state?.errors?.['smallDescription']?.[0]}
						</p>
					)}
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Description</Label>
					<input
						type='hidden'
						name='description'
						value={JSON.stringify(json)}
					/>
					<TipTapEditor json={json} setJson={setJson} />
					{state?.errors?.['description']?.[0] && (
						<p className='text-destructive'>
							{state?.errors?.['description']?.[0]}
						</p>
					)}
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Product Images</Label>
					<input type='hidden' name='images' value={JSON.stringify(images)} />
					<UploadDropzone
						endpoint='imageUploader'
						onClientUploadComplete={(res) => {
							setImages(res.map((item) => item.url))
							toast.success('Your images have been uploaded')
						}}
						onUploadError={(error: Error) => {
							toast.error('Something went wrong, try again')
						}}
					/>
					{state?.errors?.['images']?.[0] && (
						<p className='text-destructive'>{state?.errors?.['images']?.[0]}</p>
					)}
				</div>

				{/* Not working */}
				{/* <div className='flex flex-col gap-y-2'>
					<Label>Product File</Label>
					<input type='hidden' name='productFile' value={productFile ?? ''} />
					<UploadDropzone
						endpoint='productFileUpload'
						onClientUploadComplete={(res) => {
							setProductFile(res[0].url)
							toast.success('Your Product file has been uploaded!')
						}}
						onUploadError={(error: Error) => {
							toast.error('Something went wrong, try again')
						}}
					/>
					{state?.errors?.['productFile']?.[0] && (
						<p className='text-destructive'>
							{state?.errors?.['productFile']?.[0]}
						</p>
					)}
				</div> */}
			</CardContent>

			<CardFooter className='mt-5'>
				<Submitbutton title='Create your Product' />
			</CardFooter>
		</form>
	)
}
