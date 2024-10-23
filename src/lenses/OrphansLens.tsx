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
import { MoreMath } from "../utils/MoreMath";

const MAX_DELETE_BATCH_SIZE = 500

export const OrphansLens: ItemLens = {

    Name: 'OrphansLens',
    TypeId: 'orphans',
    Test: (i) => /^#orphans/.test(i.description || ''),
    Self: {
        AsSelected: {
            RenderHeader: (props) => <OrphansItemHeader {...props} />,
            RenderNewItemInputForm: () => null,
            RenderChildList: (props) => <OrphansChildList {...props} />
        }
    }

}

const OrphansItemHeader = React.memo((props: {
    itemId: string,
    onClick: () => void
}) => {

    const { allItems, orphans, load, crunch, loading, cleanUpOrphans } = useOrphansStore()
    const nDeleting = MoreMath.Clamp(orphans.length, MAX_DELETE_BATCH_SIZE, 0);

    useEffect(() => { load() }, [])

    if (loading) return <TrText large>Loading...</TrText>

    return (
        <Flex column>
            <TrText small>Total Items</TrText>
            <TrText medium bold>{ allItems.length }</TrText>
            <Bump h={ 15 } />
            <TrText small>Total Orphans</TrText>
            <TrText medium bold>{ orphans.length }</TrText>

            <Bump h={ 50 } />

            <Button onClick={ load } style={{ maxWidth: 300 }}>Reload</Button>
            <Bump h={ 5 } />
            <Button onClick={ cleanUpOrphans } variant='danger' style={{ maxWidth: 300 }}>Delete {nDeleting} Orphan Items</Button>
        </Flex>
    )

})

const OrphansChildList = React.memo((props: { itemId: string }) => {

    const { orphans } = useOrphansStore()

    return (
        <Flex column style={{ margin: 10 }}>
            {orphans.map(o =>
                (
                    <Flex column>
                        <TrText small>{o.title}</TrText>
                        <TrText small faded>{o.description}</TrText>
                    </Flex>
                )
            )
            }
        </Flex>
    )

})

type OrphansStore = {

    allItems: Item[],
    orphans: Item[],
    topLevelOrphans: Item[],

    loading: boolean,
    load: () => Promise<void>,
    crunch: () => void,
    cleanUpOrphans: () => Promise<void>

}

const useOrphansStore = create<OrphansStore>((set, get) => ({

    allItems: [],
    orphans: [],
    topLevelOrphans: [],
    leafOrphans: [],

    loading: false,
    load: async () => {
        set({ loading: true })
        set({ allItems: (await ItemStoreDefaultStorageDriver.load()).data })
        get().crunch()
        set({ loading: false })
    },

    crunch: () => {
        // An orphan is an item which cannot be accessed via the root item
        // A "top-level" orphan is one whose parent is not an orphan

        // 0. Create the item tree
        const itemsFlat = get().allItems
        const allItemIds = new Set<string>(itemsFlat.map(i => i._id));
        const root = itemsFlat.find(i => !!i.isRoot);
        if (!root)
        {
            alert('Unable to locate root, cannot continue')
            return;
        }
        const itemsByParent = GroupBy(itemsFlat, i => i.parent_id || '_NULL')

        // 1. Create a set of item IDs that are found
        const linkedItems = new Set<string>();

        // 2. Flood fill the item tree, starting with the root
        const floodFillTree = (startId: string) => {

            // Add this item and any unindexed, undeleted children
            linkedItems.add(startId);
            itemsByParent[startId]?.filter(i => !linkedItems.has(i._id))
                .forEach(i => floodFillTree(i._id))
        }
        floodFillTree(root._id);

        // 3. All items whose ID is not in the set are orphans
        const orphans = itemsFlat.filter(i => !linkedItems.has(i._id))
        const topLevelOrphans = orphans.filter(o => o.parent_id && !allItemIds.has(o.parent_id));
        set({ orphans, topLevelOrphans });

    },

    cleanUpOrphans: async () => {

        const toDelete = get().orphans.slice(0, MAX_DELETE_BATCH_SIZE)
        const deletedIds = new Set(toDelete.map(x => x._id))
        const chunks = Chunk(toDelete, 50)

        let total = 0
        for(const c of chunks) {
            try {
                await useItemStore.getState().deleteMany(c.map(c => c._id))
                total += c.length
                console.log(`Deleted ${c.length} (total)...`)
            } catch (e) {
                alert('Failed to delete chunk')
                console.log(`[!] Failed to delete chunk`)
                console.error(e)
            }
        }

        set({ allItems: get().allItems.filter(i => !deletedIds.has(i._id)) })
        get().crunch()
        alert(`Deleted ${ total } leaf orphans`)

    }

}))