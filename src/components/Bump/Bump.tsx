import React from "react";

export const Bump = React.memo((props: {
    w?: number
    h?: number
}) => {

    const { w, h } = props

    return (
        <div style={{ width: w, minWidth: w, height: h, minHeight: h }}>
        </div>
    )


})