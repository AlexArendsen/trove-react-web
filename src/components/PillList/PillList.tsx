import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { Colors } from "../../constants/Colors";

export const PillList = React.memo((props: {
    options: { label: string, value: any }[],
    selected: any,
    onClick: (vaue: string) => void
}) => {

    const { options, onClick, selected } = props

    return (
        <Flex row>
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
            height: 20,
            borderRadius: 10,
            marginRight: 10,
            backgroundColor: selected ? Colors.Accent1 : '#ccc'
        }} onClick={ onClick }>
            <TrText medium bold white={ selected }>{label}</TrText>
        </div>
    )

})