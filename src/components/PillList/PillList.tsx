import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { Colors } from "../../constants/Colors";

export interface PillListProps {
    options: { label: string, value: any }[],
    selected: any,
    startOffset?: number,
    endOffset?: number,
    onClick: (vaue: string) => void
}

export const PillList = React.memo((props: PillListProps) => {

    const { options, onClick, selected, startOffset, endOffset } = props

    return (
        <Flex row style={{
            overflowX: 'scroll',
            paddingLeft: startOffset,
            paddingRight: endOffset
        }}>
            {
                options.map(o => (
                    <Pill label={ o.label } onClick={ () => onClick(o.value) } selected={ selected === o.value } />
                ))
            }
        </Flex>
    )

})

const Pill = React.memo((props: {
    label: string
    onClick: () => void
    selected: boolean
}) => {

    const { label, onClick, selected } = props

    return (
        <div style={{
            borderRadius: 30,
            marginRight: 10,
            whiteSpace: 'nowrap',
            padding: '5px 20px 9px 20px',
            backgroundColor: selected ? Colors.Accent1 : '#efefef',
            cursor: 'pointer'
        }} onClick={ onClick }>
            <TrText medium bold white={ selected }>{label}</TrText>
        </div>
    )

})