import React, { useMemo } from "react";
import { useItem } from "../../hooks/UseItem";
import { Item } from "../../redux/models/Items/Item";
import { useItemStore } from "../../stores/ItemStore/useItemStore";
import { useItemEditor } from "../../stores/useItemEditor";
import { useMoveEditor } from "../../stores/useMoveEditor";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { Bump } from "../Bump/Bump";
import { Button } from "../Button/Button";
import { Flex } from "../Flex/Flex";
import { ItemList } from "../ItemList/ItemList";
import { ModalPopover } from "../Popover/ModalPopover";
import { TrText } from "../Text/Text";

export const MoveEditorModal = React.memo(() => {

    const ed = useMoveEditor()

    const subjectTitle = useMemo(() => {
        if (ed.subjectIds?.length === 1) return useItemStore.getState().byId[ed.subjectIds[0]]?.title || 'Item'
        else return `${ed.subjectIds?.length} items`
    }, [ ed.subjectIds ])

    const target = useItem(ed.targetId)?.item as Item | undefined

	const topLevels = useItemStore(s => [s.root].filter(x => !!x)) as Item[]
    const targetChildren = useItem(ed.targetId)?.children as Item[]
    const viewportItems = ed.targetId ? targetChildren : topLevels

    const handleTargetClick = (target: Item) => {
        ed.setTarget(target._id)
    }

    const handleSubmit = async () => {
        await ed.submitMove()
        ed.close()
        useItemEditor.getState().close()
    }

    return (
        <ModalPopover open={ ed.isOpen } onClose={ ed.close } title='Move Item' subtitle={ subjectTitle } scrollMode='fixed-max-height-container'>

            <Flex column style={{ flex: 1, minHeight: '100%', maxHeight: '100%', margin: '0 -15px' }}>

                <Breadcrumbs itemId={ ed.targetId } onSelectCrumb={ (i) => ed.setTarget(i?._id || '') } />

                <div style={{ flex: 1, overflowY: 'scroll' }}>
                    <ItemList
                        items={ viewportItems }
                        parentId={ ed.targetId || undefined }
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