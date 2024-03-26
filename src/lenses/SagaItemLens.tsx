import React from "react";
import { ItemLens } from "./ItemLens";
import { useItem } from "../hooks/UseItem";
import { Flex } from "../components/Flex/Flex";
import { useWindowSize } from "../hooks/UseWindowSize";
import { ItemList } from "../components/ItemList/ItemList";
import { TrText } from "../components/Text/Text";
import { FlatListItem } from "../components/ItemList/FlatList/FlatListItem";
import { Checkbox } from "../components/Checkbox/Checkbox";
import { Bump } from "../components/Bump/Bump";
import { ProgressBar } from "../components/ProgressBar/ProgressBar";
import { ItemDropZone } from "../components/ItemDropZone/ItemDropZone";
import './SagaItemLens.css'
import { useHistory } from "react-router";
import { Routes } from "../constants/Routes";
import { useItemEditor } from "../stores/useItemEditor";

export const SagaLens: ItemLens = {

    Name: 'SagaItemLens',
    TypeId: 'saga',

    Self: {

        AsSelected: {
            RenderChildList: (props) => <SagaView itemId={ props.itemId } />
        },
        FullWidthSelected: true

    }


}

const SagaView = React.memo((props: {
    itemId: string
}) => {

    const { children } = useItem(props.itemId)

    return (
        <Flex column>
            {
                children.map(c => (
                    <SagaItem itemId={ c._id } />
                ))
            }
        </Flex>
    )

})

const SagaItem = React.memo((props: {
    itemId: string
}) => {

    const { children, item } = useItem(props.itemId)
    const { isMobile } = useWindowSize()

    return (
        <Flex row={ !isMobile } column={ isMobile } style={{ margin: '0 20px', maxWidth: 1600, marginBottom: 30 }}>

            <div style={{ flex: 3, maxWidth: isMobile ? undefined : 600 }}>
                <SagaParent itemId={ props.itemId } />
            </div>
            <div style={{ flex: 4, marginLeft: isMobile ? 30 : undefined }}>
                <ItemList items={ children } parentId={ props.itemId } navOnClick />
            </div>

        </Flex>
    )

})

const SagaParent = React.memo((props: { itemId: string }) => {

	const history = useHistory();
    const { item } = useItem(props.itemId)
    const ed = useItemEditor()

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        ed.open(props.itemId)
    }

    return (

        <ItemDropZone itemId={ props.itemId }>

            <Flex column className='saga-parent-item' onClick={ () => history.push(Routes.item(props.itemId)) } onContextMenu={ handleRightClick }>

                <Flex row align='center'>
                    <Checkbox itemId={ props.itemId } />
                    <Bump w={ 20 } />
                    <TrText mediumLarge bold style={{ flex: 5 }}>{ item?.title }</TrText>
                    <div style={{ flex: 3 }}>
                        <ProgressBar item={ item } floating />
                    </div>
                </Flex>

                <TrText small faded>{ item?.description }</TrText>

            </Flex>

        </ItemDropZone>

    )

})
