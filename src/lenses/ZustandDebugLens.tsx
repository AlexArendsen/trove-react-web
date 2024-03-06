import { useEffect, useImperativeHandle, useState } from "react";
import { Flex } from "../components/Flex/Flex";
import { useItemStore } from "../stores/ItemStore/useItemStore";
import { ItemLens } from "./ItemLens";
import { Item } from "../redux/models/Items/Item";

const useSelectedItem = (selectedId: string) => useItemStore(s => s.byId[selectedId] || s.root)

export const ZustandDebugLens: ItemLens = {

    Name: 'ZustandDebugLens',
    TypeId: 'Zustand',

    Self: {
        AsSelected: {
            RenderChildList: (props) => {

                const [ _selectedIdRaw, setSelected ] = useState<string>('')
                const selected = useItemStore(s => s.byId[_selectedIdRaw] || s.root)
                const selectedId = selected?._id
                const items = useItemStore(s => s.byParent[selectedId])
                const atRoot = selected?.isRoot || false || false
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
                    useItemStore.getState().updateOne({ _id: selectedId, title: `Updated title ${new Date().getTime()}` })
                }

                const handleMoveItem = () => {
                    const toId = prompt('Enter ID of item to move this to')
                    if (!toId) return;
                    useItemStore.getState().moveOne(selectedId, toId)
                }

                const handleMoveAllChildren = () => {
                    const toId = prompt('Enter ID of item to move this to')
                    if (!toId) return;
                    const ids = items.map(i => i._id)
                    useItemStore.getState().moveMany(ids, toId)
                }

                const handleDeleteThisItem = () => {
                    useItemStore.getState().deleteOne(selectedId)
                }

                const handleDeleteAllChildren = () => {
                    const ids = items.map(i => i._id)
                    useItemStore.getState().deleteMany(ids)
                }

                const handleDeleteCheckedChildren = () => {
                    const ids = items.filter(i => i.checked).map(i => i._id)
                    useItemStore.getState().deleteMany(ids)
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
                        <button onClick={ handleUpdateItem }>Update This Item</button>
                        <button onClick={ handleDeleteThisItem }>Delete This Item</button>
                        { !atRoot ? <button onClick={ handleMoveItem }>Move Item</button> : null }
                        { !atRoot ? <button onClick={ handleMoveAllChildren }>Move All Children</button> : null }
                        { !atRoot ? <button onClick={ handleDeleteAllChildren }>Delete All Children</button> : null }
                        { !atRoot ? <button onClick={ handleDeleteCheckedChildren }>Delete Checked Children</button> : null }
                        { !atRoot ? <button onClick={ () => setSelected(selected?.parent_id || '') }>Up</button> : null }
                        <span>Viewing { selected?.title || '(Unknown)' } #{selected?._id} // { selected?.completed } of { selected?.descendants }</span>
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
