'use client'

import StarterKit from '@tiptap/starter-kit'
import { type JSONContent, useEditor, EditorContent } from '@tiptap/react'

export function ProductDescription({ content }: { content: JSONContent }) {
	const editor = useEditor({
		editable: false,
		extensions: [StarterKit],
		content: content,
		editorProps: {
			attributes: {
				class: 'prose prose-sm sm:prose-base',
			},
		},
	})

	if (!editor) {
		return null
	}

	return (
		<>
			<EditorContent editor={editor} />
		</>
	)
}
