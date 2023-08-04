import React from "react";

export const PopoverOverlay = React.memo((props: {
    onClick: () => void,
    opacity?: number
}) => {

    const { onClick, opacity } = props

    return (
        <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(125deg, rgba(74,50,172,1) 0%, rgba(156,34,158,1) 50%, rgba(0,194,255,1) 100%)',
            backdropFilter: 'blur(10px)',
            opacity: opacity || 0.2
        }} onClick={ onClick }>
        </div>
    )

})