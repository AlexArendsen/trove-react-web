import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { useItemEditor } from "../../stores/useItemEditor";
import { ItemData } from "../../utils/ItemData";
import { Item } from "../../redux/models/Items/Item";
import { UniqueName } from "../../utils/UniqueName";
import { PlannerItemLens } from "../../lenses/PlannerItemLens";
import { GridLens } from "../../lenses/GridLens";
import { LayoutItemLens } from "../../lenses/LayoutLens/LayoutItemLens";
import { Bump } from "../Bump/Bump";
import { useWindowSize } from "../../hooks/UseWindowSize";

// TODO -- Move this somewhere
export type LensConfiguration = {
    id: string
    type: string
    title: string
    default?: boolean
    data?: any
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
    const handleSelectLens = (l: LensOption) => {

        if (!ed.item) return;

        let type = l.value
        if (!l.value) {
            type = prompt('Enter custom lens type') || ''
            if (!type) return;
        }

        const i = { ...ed.item }
        const lensNames = new Set(ItemData.get<LensConfiguration[]>(i, '__lenses', []).map(c => c.title))
        const title = UniqueName(l.label, lensNames)

        ItemData.mutate<LensConfiguration[]>(i, '__lenses', [], list => list.push({
            id: new Date().getTime().toString(),
            type,
            title: title
        }))

        ed.updateItem({ data: i.data })

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
        <Flex onClick={ onClick } style={{
            border: 'solid 1px #ccc',
            padding: 20,
            width: isMobile ? '100%' : 185,
            maxWidth: '100vw',
            borderRadius: 15,
            marginBottom: 20,
            marginRight: 10
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
        <div style={{
            backgroundColor: '#efefef',
            padding: '2px 8px 2px 8px',
            borderRadius: 6
        }}>
            <TrText small bold style={{ opacity: 0.5, textTransform: 'uppercase' }}>{ props.label }</TrText>
        </div>
    )
})