import React, { useEffect } from "react";
import { create } from "zustand";
import { Bump } from "../components/Bump/Bump";
import { Flex } from "../components/Flex/Flex";
import { ItemList } from "../components/ItemList/ItemList";
import { TrText } from "../components/Text/Text";
import { Api } from "../redux/Api";
import { Item } from "../redux/models/Items/Item";
import { DefaultItemEditorDisplay } from "../screens/ItemsScreen/SelectedItemDisplay/SelectedItemDisplay";
import { Chunk, GroupBy } from "../utils/Arrays";
import { ItemLens } from "./ItemLens";
import { Button } from "../components/Button/Button";
import { ItemStoreDefaultStorageDriver } from "../stores/ItemStore/ItemStore.StorageDriver";
import { useItemStore } from "../stores/ItemStore/useItemStore";

const MAX_DELETE_BATCH_SIZE = 2000

export const OrphansLens: ItemLens = {

    Name: 'OrphansLens',
    TypeId: 'orphans',
    Test: (i) => /^#orphans/.test(i.description || ''),
    Self: {
        AsSelected: {
            RenderHeader: (props) => <OrphansItemHeader {...props} />,
            RenderChildList: (props) => <OrphansChildList {...props} />
        }
    }

}

const OrphansItemHeader = React.memo((props: {
    itemId: string,
    onClick: () => void
}) => {

    const { allItems, orphans, load, cleanUpLeaves, leafOrphans, topLevelOrphans } = useOrphansStore()
    const nToDelete = Math.min(MAX_DELETE_BATCH_SIZE, leafOrphans?.length || Infinity)

    useEffect(() => { load() }, [])

    return (
        <Flex column>

            <DefaultItemEditorDisplay {...props} />

            <Bump h={ 20 } />

            <Flex row>

                <Flex row style={{ border: 'solid 1px #ccc', padding: 20, marginRight: 10, borderRadius: 30, flex: 1 }}>
                    <TrText medium style={{ flex: 1 }}>Total Items</TrText>
                    <TrText medium bold>{ allItems?.length || 'Loading...' }</TrText>
                </Flex>

                <Flex row style={{ border: 'solid 1px #ccc', padding: 20, marginRight: 10, borderRadius: 30, flex: 1 }}>
                    <TrText medium style={{ flex: 1 }}>Total Orphans</TrText>
                    <TrText medium bold>{ orphans?.length || '...' }</TrText>
                </Flex>

                <Flex row style={{ border: 'solid 1px #ccc', padding: 20, marginRight: 10, borderRadius: 30, flex: 1 }}>
                    <TrText medium style={{ flex: 1 }}>Leaves</TrText>
                    <TrText medium bold>{ leafOrphans?.length || '...' }</TrText>
                </Flex>

                <Flex row style={{ border: 'solid 1px #ccc', padding: 20, marginRight: 10, borderRadius: 30, flex: 1 }}>
                    <TrText medium style={{ flex: 1 }}>Top</TrText>
                    <TrText medium bold>{ topLevelOrphans?.length || '...' }</TrText>
                </Flex>

                <Button onClick={ cleanUpLeaves } label={`Clean Up (${nToDelete})`} />

            </Flex>

        </Flex>
    )

})

const OrphansChildList = React.memo((props: { itemId: string }) => {

    const { topLevelOrphans } = useOrphansStore()

    return <ItemList items={ topLevelOrphans } navOnClick />

})

type OrphansStore = {

    allItems: Item[],
    orphans: Item[],
    topLevelOrphans: Item[],
    leafOrphans: Item[],

    load: () => Promise<void>,
    crunch: () => void,
    cleanUpLeaves: () => Promise<void>

}

const useOrphansStore = create<OrphansStore>((set, get) => ({

    allItems: [],
    orphans: [],
    topLevelOrphans: [],
    leafOrphans: [],

    load: async () => {
        set({ allItems: (await ItemStoreDefaultStorageDriver.load()).data })
        get().crunch()
    },

    crunch: () => {

        const itemsFlat = get().allItems

        //const nItems = itemsFlat.data?.length || 0
        const topLevelItems = itemsFlat.filter(i => !i.parent_id)
        const itemsByParent = GroupBy(itemsFlat, i => i.parent_id || '_NULL')

        // Locate Orphans
        const embodiedIds = new Set<string>()
        const addIds = (items: Item[]) => {

            items?.forEach(i => {

                // Loop prevention: if already added, skip it
                if (embodiedIds.has(i._id)) return;

                // Count supplied item...
                embodiedIds.add(i._id)

                // ...and its children
                addIds(itemsByParent[i._id] || [])
            })

        }
        addIds(topLevelItems)

        const orphans = itemsFlat.filter(i => !embodiedIds.has(i._id))
        console.log({ orphans })
        const orphanIds = new Set(orphans?.map(o => o._id) || [])
        const orphanParentIds = new Set(get().orphans.map(o => o.parent_id || '_NULL'))

        // Locate top-level orphans, ordered by number of descendants
        const topLevelOrphans = orphans?.filter(o => !!o.parent_id && !orphanIds.has(o.parent_id))

        // Note leaf orphans too
        const leafOrphans = orphans?.filter(o => !orphanParentIds.has(o._id))

        set({ orphans, topLevelOrphans, leafOrphans })
    },

    cleanUpLeaves: async () => {

        const toDelete = get().leafOrphans.slice(0, MAX_DELETE_BATCH_SIZE)
        const deletedIds = new Set(toDelete.map(x => x._id))
        const chunks = Chunk(toDelete, 50)

        let total = 0
        for(const c of chunks) {
            try {
                await useItemStore.getState().deleteMany(c.map(c => c._id))
                total += c.length
                console.log(`Deleted ${c.length} (total)...`)
            } catch (e) {
                console.log(`[!] Failed to delete chunk`)
                console.error(e)
            }
        }

        set({ allItems: get().allItems.filter(i => !deletedIds.has(i._id)) })
        get().crunch()
        alert(`Deleted ${ total } leaf orphans`)

    }

}))