import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { Bump } from "../Bump/Bump";
import classNames from "classnames";
import './PillList.css'

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
        <Flex row align='center' style={{
            overflowX: 'scroll',
            paddingLeft: startOffset,
            height: 60,
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

    const classes = classNames({
        'pill': true,
        'pill-selected': selected
    })

    return (
        <Flex row className={ classes } onClick={ onClick } align='center'>
            <TrText medium bold white={ selected }>{label}</TrText>
            { icon ? (<><Bump w={ 20 } />{icon}</>) : null }
        </Flex>
    )

})