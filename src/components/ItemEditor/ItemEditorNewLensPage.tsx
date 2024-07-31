import React from "react";
import { useWindowSize } from "../../hooks/UseWindowSize";
import { DocumentsItemLens } from "../../lenses/DocumentItemLens";
import { GridLens } from "../../lenses/GridLens";
import { LayoutItemLens } from "../../lenses/LayoutLens/LayoutItemLens";
import { PlannerItemLens } from "../../lenses/PlannerItemLens";
import { SagaLens } from "../../lenses/SagaItemLens";
import { useItemEditor, useItemEditorLensIndex } from "../../stores/useItemEditor";
import { UniqueName } from "../../utils/UniqueName";
import { Bump } from "../Bump/Bump";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import './ItemEditorNewLensPage.css';

// TODO -- Move this somewhere
export type LensConfiguration = {
    id: string
    type: string
    title: string
}

type LensOption = {
    label: string
    value: string
    description: string
    tags?: string[]
}

const lensOptions: LensOption[] = [
    {
        label: 'Kanban',
        value: PlannerItemLens.TypeId,
        description: 'Group your items in a Kanban-style board where each direct child is a column'
    },
    {
        label: 'Saga',
        value: SagaLens.TypeId,
        description: 'Display item children alongside their parents'
    },
    {
        label: 'Documents',
        value: DocumentsItemLens.TypeId,
        description: 'Display items as documents with ability to easily copy conents'
    },
    {
        label: 'Grid',
        value: GridLens.TypeId,
        description: 'Organize your items in a grid with configurable rows and columns',
        tags: ['Preview']
    },
    {
        label: 'Layout',
        value: LayoutItemLens.TypeId,
        description: 'Create a custom dashboard using any items in your Trove using TXML',
        tags: ['Advanced']
    },
    {
        label: 'Other',
        value: '',
        description: 'Know something we don\'t? 🤨 Enter a custom lens id and see what happens!',
        tags: ['Advanced']
    },
]

export const ItemEditorNewLensPage = React.memo((props: {

}) => {

    const ed = useItemEditor()
    const lenses = useItemEditorLensIndex()

    const handleSelectLens = (l: LensOption) => {

        if (!ed.item) return;

        let type = l.value
        if (!l.value) {
            type = prompt('Enter custom lens type') || ''
            if (!type) return;
        }

        const lensNames = new Set(lenses.map(l => l.title))
        const title = UniqueName(l.label, lensNames)
        ed.lenses.add({ id: new Date().getTime().toString(), type, title })

    }

    return (

        <Flex column>

            <TrText small faded>Add Lens</TrText>
			<Bump h={ 5 } />
            <Flex row wrap>
                { lensOptions.map(l => <NewLensCard model={ l } onClick={ () => handleSelectLens(l) } />) }
            </Flex>

        </Flex>

    )

})

const NewLensCard = React.memo((props: {
    model: LensOption
    onClick: () => void
}) => {

    const { model, onClick } = props
    const { isMobile } = useWindowSize()

    return (
        <Flex onClick={ onClick } className='new-lens-card' style={{
            width: isMobile ? '100%' : 185
        }} column>
            <Flex row justify='space-between' align='center'>
                <TrText mediumLarge bold>{ model.label }</TrText>
                <Flex row>
                    { model.tags?.map(t => (
                        <Badge label={ t } />
                    )) }
                </Flex>
            </Flex>
            <Bump h={ 5 } />
            <TrText medium>{ model.description }</TrText>
        </Flex>
    )

})

const Badge = React.memo((props: {
    label: string
}) => {
    return (
        <div className='badge'>
            <TrText small bold style={{ opacity: 0.5, textTransform: 'uppercase' }}>{ props.label }</TrText>
        </div>
    )
})