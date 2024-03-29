import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { allLenses } from "../../hooks/UseItemLens";
import { DefaultItemLens } from "../../lenses/DefaultItemLens";
import { LensConfigurationControls } from "../../lenses/Shared/LensConfigurationControls";
import { useItemEditor, useItemEditorLensIndex } from "../../stores/useItemEditor";
import { Bump } from "../Bump/Bump";
import { ModalPopover } from "../Popover/ModalPopover";
import { ItemEditorFrame } from "./ItemEditorFrame";
import { ItemEditorNewLensPage, LensConfiguration } from "./ItemEditorNewLensPage";

const noop = () => null
export const ItemEditorModal = React.memo(() => {

    const ed = useItemEditor()
    const itemId = ed.item?._id || ''

    const [ lensId, setLensId ] = useState<string | null>(null)
    const configuredLenses = useItemEditorLensIndex()
    const targetConfig = configuredLenses?.find(l => l.id === lensId)
    const history = useHistory()

    // Block "go back" if open to close editor
    useEffect(() => {

        const unblock = history.block((location, action) => {

            if (!ed.isOpen) return; // Allow navigation if editor is open

            if (action === 'POP') { // On back, don't allow navigation and instead just close the editor
                ed.close()
                return false
            }

            return;

        })

        return () => unblock()


    }, [ed.isOpen])

    //@ts-ignore
	const Content: ((props: any) => JSX.Element | null) = useMemo(() => {
        if (lensId === '%ADD') return ItemEditorNewLensPage
        if (!lensId) return DefaultItemLens.Default?.AsSelected?.RenderEditor || noop
        const match = allLenses.find(l => l.TypeId === targetConfig?.type)
        if (!match) return noop
        return match.Self?.AsSelected?.RenderEditor || noop
	}, [ lensId, targetConfig, configuredLenses ])

    const realLensSelected = !!lensId && lensId !== '%ADD';
    const handleUpdateLensConfig = (config: LensConfiguration) => {
        if (realLensSelected) ed.lenses.update(lensId, config)
    }

    // Flip to "General" tab when the modal opens
    useEffect(() => {
        if (ed.isOpen) setLensId(null)
        console.log({ item: ed.item })
    }, [ed.isOpen])

    return (
        <ModalPopover open={ ed.isOpen } onClose={ ed.close } title='Edit Item' subtitle={ ed.item?.title }>
            <ItemEditorFrame onSelectLens={ setLensId } selectedLens={ lensId }>
                <>
                    { realLensSelected && !!targetConfig ? (
                        <>
                            <LensConfigurationControls config={ targetConfig } onChange={ handleUpdateLensConfig } />
                            <Bump h={ 20 } />
                        </>
                    ) : null }
                    <Content itemId={ itemId } onDone={ noop } config={ targetConfig } />
                </>
            </ItemEditorFrame>
        </ModalPopover>
    )

})