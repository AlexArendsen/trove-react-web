import { useEffect, useState } from "react";
import { Flex } from "../components/Flex/Flex";
import { useItemStore } from "../stores/ItemStore/useItemStore";
import { ItemLens } from "./ItemLens";
import { Item } from "../redux/models/Items/Item";

export const ZustandDebugLens: ItemLens = {

    Name: 'ZustandDebugLens',
    TypeId: 'Zustand',

    Self: {
        AsSelected: {
            RenderChildList: (props) => {

                const [ selectedId, setSelected ] = useState<string>('')
                const items = useItemStore(s => s.byParent[selectedId])
                const selected = useItemStore(s => s.byId[selectedId])
                const [ json, setJson ] = useState('')

                useEffect(() => {
                    setJson(`Loading ${ new Date().getTime() }...`)
                    useItemStore.getState().load()
                }, [])

                const handleCreateItem = () => {
                    useItemStore.getState().create(`New Item ${new Date().getTime()}`, selectedId)
                }

                const handleUpdateItem = () => {
                    if (!selectedId) return
                    useItemStore.getState().updateOne(selectedId, { title: `Updated title ${new Date().getTime()}` })
                }

                const handleToggleCheck = (ev: React.MouseEvent, item: Item) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    if (!selectedId) return
                    if (item.checked) useItemStore.getState().uncheckOne(item._id)
                    else useItemStore.getState().checkOne(item._id)
                }

                const checkLocalStorage = () => {
                    setJson(localStorage.getItem('ITEMS') || '(nothing)')
                }

                return (
                    <Flex column>
                        <button onClick={ () => useItemStore.getState().load() }>Load</button>
                        <button onClick={ handleCreateItem }>Create Random Item</button>
                        { selectedId ? <button onClick={ handleUpdateItem }>Update This Item</button> : null }
                        { selectedId ? <button onClick={ () => setSelected(selected?.parent_id || '') }>Up</button> : null }
                        <span>Viewing { selected?.title || 'Root' } #{selected?._id} // { selected?.completed } of { selected?.descendants }</span>
                        <ul>
                            { items?.map(i => (
                                <li onClick={ () => setSelected(i._id) } onContextMenu={ (e) => handleToggleCheck(e, i) }>{(i.checked ? '[x]' : '[ ]')} {i.title} // { i.completed } of { i.descendants }</li>
                            )) }
                        </ul>
                        <hr />
                        <button onClick={ checkLocalStorage }>Check Local Storage</button>
                        <pre>{ json }</pre>
                    </Flex>
                )

            },
        }

    }


}
