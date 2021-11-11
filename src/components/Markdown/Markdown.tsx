import React from "react";
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
	src?: string
	edit?: boolean
	onChange?: (value: string) => void
	onClick?: () => void
	onKeyDown?: (ev: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export const Markdown = React.memo((props: MarkdownProps) => {

	return (
		<div onClick={ props.onClick } style={{ fontSize: 18 }}>
			<ReactMarkdown>{ props.src || '' }</ReactMarkdown>
		</div>
	)

})