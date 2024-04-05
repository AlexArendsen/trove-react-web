import React from "react";
import { ItemLens } from "./ItemLens";
import { Flex } from "../components/Flex/Flex";
import { GalleryListItem } from "../components/ItemList/GalleryList/GalleryListItem";
import { useHistory } from "react-router";
import { Routes } from "../constants/Routes";
import { useItem } from "../hooks/UseItem";
import { Checkbox } from "../components/Checkbox/Checkbox";
import { Bump } from "../components/Bump/Bump";
import { TrText } from "../components/Text/Text";
import { Markdown } from "../components/Markdown/Markdown";
import { Button } from "../components/Button/Button";
import copy from 'copy-to-clipboard'

export const DocumentsItemLens : ItemLens = {

    Name: 'DocumentItemLens',
    TypeId: 'docs',

    Self: {

        AsSelected: {
            RenderChildList: (props) => <DocumentsList itemId={ props.itemId } />,
        },
        FullWidthSelected: true

    }

}

const DocumentsList = React.memo((props: { itemId: string }) => {

    const { children, item } = useItem(props.itemId)

    const folders = children.filter(c => !!c.descendants)
    const docs = children.filter(c => !c.descendants)

    return (

        <Flex column>
            <Flex row wrap>
                <UpButton targetId={ item?.parent_id || '' } />
                { folders.map(c => <FolderCard itemId={ c._id } />) }
            </Flex>
            <Flex row wrap>
                { docs.map(c => <DocumentCard itemId={ c._id } />) }
            </Flex>
        </Flex>

    )

})

const UpButton = React.memo((props: { targetId: string }) => {

    const history = useHistory()

    return (
        <div style={{
            border: 'solid 1px rgba(0,0,0,0.07)',
            cursor: 'pointer',
            borderRadius: 20,
            padding: 15,
            margin: 15,
            maxWidth: '100vw',
            overflowX: 'hidden',
        }} onClick={ () => history.push(Routes.item(props.targetId)) }>

            <Flex row>
                <TrText mediumLarge bold>⬆ Up</TrText>
            </Flex>

        </div>
    )
})

const FolderCard = React.memo((props: { itemId: string }) => {

    const history = useHistory()
    const { item } = useItem(props.itemId)

    return (
        <div style={{
            border: 'solid 1px rgba(0,0,0,0.07)',
            cursor: 'pointer',
            width: 300,
            borderRadius: 20,
            padding: 15,
            margin: 15,
            maxWidth: '100vw',
            overflowX: 'hidden',
            minWidth: 300
        }} onClick={ () => history.push(Routes.item(props.itemId)) }>

            <Flex row>
                <Checkbox itemId={ props.itemId } />
                <Bump w={ 20 } />
                <TrText mediumLarge bold>📂 { item?.title }</TrText>
            </Flex>

        </div>
    )

})

const DocumentCard = React.memo((props: { itemId: string }) => {

    const history = useHistory()
    const { item } = useItem(props.itemId)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        copy(item?.description || 'Unable to copy item contents')
    }

    return (
        <div style={{
            border: 'solid 1px rgba(0,0,0,0.07)',
            cursor: 'pointer',
            width: 600,
            borderRadius: 20,
            padding: 15,
            margin: 15,
            maxWidth: '100vw',
            overflowX: 'hidden',
            minWidth: 600
        }} onClick={ () => history.push(Routes.item(props.itemId)) }>

            <Flex row>
                <Checkbox itemId={ props.itemId } />
                <Bump w={ 20 } />
                <TrText mediumLarge bold>{ item?.title }</TrText>
            </Flex>

            <Markdown src={ item?.description } />

            <Flex row justify='flex-end'>
                <Button onClick={ handleCopy } label='Copy' />
            </Flex>

        </div>
    )

})