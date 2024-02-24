import React, { useMemo } from "react";
import { useItem } from "../../hooks/UseItem";
import { useStore } from "../../hooks/UseStore";
import { Item } from "../../redux/models/Items/Item";
import { useMoveEditor } from "../../stores/useMoveEditor";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { Bump } from "../Bump/Bump";
import { Button } from "../Button/Button";
import { Flex } from "../Flex/Flex";
import { ItemList } from "../ItemList/ItemList";
import { ModalPopover } from "../Popover/ModalPopover";
import { TrText } from "../Text/Text";
import { useItemEditor } from "../../stores/useItemEditor";
import { GetConfig } from "../../utils/Config";

export const MoveEditorModal = React.memo(() => {

    const ed = useMoveEditor()

    const subjectTitle = useMemo(() => {
        if (ed.subjectIds?.length === 1) return GetConfig().Store?.getState().items.byId[ed.subjectIds[0]]?.title || 'Item'
        else return `${ed.subjectIds?.length} items`
    }, [ ed.subjectIds ])

    const target = useItem(ed.targetId)?.item as Item | undefined

	const topLevels = useStore(s => s.items.topLevel)
    const targetChildren = useItem(ed.viewportParentId)?.children as Item[]
    const viewportItems = ed.viewportParentId ? targetChildren : topLevels

    const handleTargetClick = (target: Item) => {
        ed.setTarget(target._id)
        ed.setViewportParent(target._id)
    }

    const handleSubmit = async () => {
        await ed.submitMove()
        ed.close()
        useItemEditor.getState().close()
    }

    return (
        <ModalPopover open={ ed.isOpen } onClose={ ed.close } title='Move Item' subtitle={ subjectTitle } scrollMode='fixed-max-height-container'>

            <Flex column style={{ flex: 1, minHeight: '100%', maxHeight: '100%', margin: '0 -15px' }}>

                <Breadcrumbs itemId={ ed.viewportParentId } onSelectCrumb={ (i) => ed.setViewportParent(i?._id || '') } />

                <div style={{ flex: 1, overflowY: 'scroll' }}>
                    <ItemList
                        items={ viewportItems }
                        parentId={ ed.viewportParentId || undefined }
                        onClick={ handleTargetClick }
                        display="picker-list"
                        />
                </div>

                <Flex row justify="space-between" style={{
                    padding: 20,
                    boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
                    margin: '0 -15px'
                }}>

                    <TrText>Moving <strong>{ subjectTitle }</strong> to <strong>{ target?.title || 'root' }</strong>.</TrText>

                    <div style={{ flex: 1 }}></div>

                    <Button onClick={ ed.close }>Cancel</Button>
                    <Bump w={ 20 } />
                    <Button variant="submit" onClick={ handleSubmit } disabled={ ed.isLoading }>Move</Button>

                </Flex>

            </Flex>

        </ModalPopover>
    )

})