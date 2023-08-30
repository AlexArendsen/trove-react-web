import React, { useMemo } from "react";
import { ItemData } from "../../utils/ItemData";
import { LensConfiguration } from "../../components/ItemEditor/ItemEditorNewLensPage";
import { useItem } from "../../hooks/UseItem";
import { PillList, PillListProps } from "../../components/PillList/PillList";
import { Item } from "../../redux/models/Items/Item";

export const ItemLensPillList = React.memo((props: {
    item?: Item | null,
    includeAdd?: boolean
} & Omit<PillListProps, 'options'>) => {

    const { item, includeAdd } = props

	const lenses = useMemo(() => {
		const fromItem = ItemData.get<LensConfiguration[]>(item || null, '__lenses', [])
			.map(c => ({ label: c.title, value: c.id }));
		return [
            { label: 'General', value: null },
            ...fromItem,
            includeAdd ? { label: '+', value: '%ADD' } : undefined
        ].filter(x => !!x) as { label: string, value: string }[]
	}, [ item?.data?.['__lenses'] ])

    return (
        <PillList options={ lenses } { ...props } />
    )


})