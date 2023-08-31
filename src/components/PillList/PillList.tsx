import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { Colors } from "../../constants/Colors";
import { Bump } from "../Bump/Bump";

export interface PillListProps {
    options: { label: string, value: any, icon?: JSX.Element }[],
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
                    <Pill label={ o.label } onClick={ () => onClick(o.value) } selected={ selected === o.value } icon={ o.icon } />
                ))
            }
        </Flex>
    )

})

const Pill = React.memo((props: {
    label: string
    onClick: () => void
    selected: boolean
    icon?: JSX.Element
}) => {

    const { label, onClick, selected, icon } = props

    return (
        <Flex row style={{
            borderRadius: 30,
            marginRight: 10,
            height: 25,
            whiteSpace: 'nowrap',
            padding: '5px 20px 9px 20px',
            backgroundColor: selected ? Colors.Accent1 : '#efefef',
            color: selected ? 'white' : undefined,
            cursor: 'pointer'
        }} onClick={ onClick } align='center'>
            <TrText medium bold white={ selected }>{label}</TrText>
            { icon ? (<><Bump w={ 20 } />{icon}</>) : null }
        </Flex>
    )

})