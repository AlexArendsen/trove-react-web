import React, { useMemo } from "react";
import { LensConfiguration } from "../../components/ItemEditor/ItemEditorNewLensPage";
import { PillList, PillListProps } from "../../components/PillList/PillList";
import { Item } from "../../redux/models/Items/Item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export const ItemLensPillList = React.memo((props: {
    item?: Item | null,
    generalLensLabel?: string,
    includeAdd?: boolean
    onDelete?: (lensId: string) => void
} & Omit<PillListProps, 'options'>) => {

    const { item, includeAdd, onDelete, generalLensLabel } = props

    const lenses = useMemo(() => {
        const fromItem = item?.data?.__lenses.map((c: LensConfiguration) => ({
            label: c.title,
            value: c.id,
            icon: (onDelete) ? <FontAwesomeIcon icon={faClose} onClick={() => onDelete?.(c.id)} /> : undefined,
        })) || []
        return [
            { label: generalLensLabel || 'General', value: null },
            ...fromItem,
            includeAdd ? { label: '+', value: '%ADD' } : undefined
        ].filter(x => !!x) as { label: string, value: string }[]
    }, [item, generalLensLabel])

    return (
        <PillList options={lenses} {...props} />
    )


})