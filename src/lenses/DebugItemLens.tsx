import React, { useState } from "react";
import { Bump } from "../components/Bump/Bump";
import { Button } from "../components/Button/Button";
import { Flex } from "../components/Flex/Flex";
import { TrText } from "../components/Text/Text";
import { TextInput } from "../components/TextInput/TextInput";
import { ItemLens } from "./ItemLens";

export const DebugItemLens: ItemLens = {

    Name: 'DebugItemLens',
    TypeId: 'debug',
    Test: i => /^#debug/.test(i.description || ''),

    Self: {
        AsSelected: {
            RenderNewItemInputForm: () => null,
            RenderChildList: (props) => <DebugItemList { ...props } />
        },
        FullWidthSelected: true
    }

}

const SPARS = 50
const DebugItemList = React.memo((props: {
    itemId: string
}) => {

    const [ oRank, setORank ] = useState('1000,1001,1010')
    const [ sFrom, setSFrom ] = useState('2')
    const [ sTo, setSTo ] = useState('0')
    const [ newRank, setNewRank ] = useState('')
    const [ working, setWorking ] = useState(false)

    const handleSwap = () => {
        setNewRank('')
        setWorking(true)
        let ranks = oRank.split(',').map(s => parseInt(s))
        const from = parseInt(sFrom)
        const to = parseInt(sTo)
        const actions: { idx: number, rank: number }[] = []

        const swap = (newRank?: number) => {
            const oldRank = ranks.splice(from, 1)[0]
            const adjTo = (from < to) ? to - 1 : to // If we just deleted something before the destination, we need to adjust our target
            ranks.splice(Math.max(0, adjTo), 0, typeof newRank === 'number'? newRank : oldRank)
        }

        const rerank = () => {
            let newRanks: number[] = []
            let last = -Infinity
            for(let i = 0; i < ranks.length; ++i) {
                if (i === 0) { actions.push({ idx: i, rank: SPARS * 20 }); last = SPARS * 20; }
                else if (ranks[i] - last > SPARS) { last = ranks[i] }
                else { actions.push({ idx: i, rank: last + SPARS }); last = last + SPARS }
            }
            ranks = newRanks
        }

        const write = () => {
            setNewRank(actions.map(a => `Update item ${a.idx}(${ranks[a.idx]}) to rank ${a.rank}`).join('\n'))
        }

        if (!ranks.length) { // Only item in the list
            write();
        } else if (to === from || (to === from + 1)) { // Not moving anywhere
            write();
        } else if (to <= 0) { // Sorting to beginning
            console.log('Adding to beginning')
            if (ranks[0] > SPARS) actions.push({ idx: from, rank: ranks[0] - SPARS })
            else { swap(); rerank(); }
            write();
        } else if (to >= ranks.length) {
            console.log('Adding to end')
            actions.push({ idx: from, rank: ranks[ranks.length - 1] + SPARS })
            write()
        } else {
            const right = ranks[to]
            const left = ranks[to - 1]
            console.log(`Putting ${ranks[from]} between ${left} and ${right}`)
            const space = right - left
            if (space <= 1) { swap(); rerank(); }
            else actions.push({ idx: from, rank: Math.round(ranks[to - 1] + (space / 2)) })
            //else { swap(Math.round(ranks[to - 1] + (space / 2))) }
            write()
        }

        setWorking(false)
    }

    return (
        <Flex column style={{ padding: 40, border: 'solid 1px #efefef', borderRadius: 30, margin: 20, maxWidth: 480 }}>
            <TrText small faded>Original rank list</TrText>
            <TextInput value={ oRank } onChange={ setORank } />
            <Bump h={ 20 } />
            <Flex row>
                <Flex column>
                    <TrText small faded>Swap From Index</TrText>
                    <TextInput value={ sFrom } onChange={ setSFrom } />
                </Flex>
                <Bump w={ 20 } />
                <Flex column>
                    <TrText small faded>Swap To Index</TrText>
                    <TextInput value={ sTo } onChange={ setSTo } />
                </Flex>
            </Flex>
            <Bump h={ 20 } />
            <Button onClick={ handleSwap } disabled={ working }>{ working ? 'Working...' : 'Run Swap' }</Button>
            <Bump h={ 20 } />
            <TrText small faded>Result</TrText>
            <TrText medium bold>{ newRank || '---' }</TrText>
        </Flex>
    )

})
