import React from "react";

interface AvatarProps {
	onClick?: () => void
}

export const Avatar = React.memo((props: AvatarProps) => {
	return (
		<div style={{ width: 39, height: 39, borderRadius: 20, background: '#eaeaea', cursor: 'pointer' }} onClick={ props.onClick }>
		</div>
	)
})