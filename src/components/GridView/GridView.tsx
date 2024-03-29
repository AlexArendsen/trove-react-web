import React from "react";
import { useHistory } from "react-router-dom";
import { Routes } from "../../constants/Routes";
import { Item } from "../../redux/models/Items/Item";
import { MoreMath } from "../../utils/MoreMath";
import { Bump } from "../Bump/Bump";
import { Checkbox } from "../Checkbox/Checkbox";
import { Flex } from "../Flex/Flex";
import { ItemDropZone } from "../ItemDropZone/ItemDropZone";
import { TrText } from "../Text/Text";

const nonEmptyArrayOrDefault = (maybeArray: any, defaultValue: any) => (Array.isArray(maybeArray) && !!maybeArray.length) ? maybeArray : defaultValue
const pickBetween = (min: number, max: number) => MoreMath.Clamp(Math.round(min + (Math.random() * (max - min))), max, min)
const COL_WIDTH = 340
const EXPANDO_COL_WIDTH = 30
const DATA_KEY = '_gridView'

type ChildLookup = { [col: number]: { [row: number]: Item[] } }
type GridParentData = Partial<{ columns: string[], rows: string[] }>
type GridChildData = Partial<{ col: number, row: number }>
type GridEditContext = { item: Item | null, idx: number, type: 'column' | 'row' } | null

export const GridView = React.memo((props: { parentItemId: string }) => {

    // const { parentItemId } = props
    // const { item, children } = useItem(parentItemId)
    // const [ editContext, setEditContext ] = useState<GridEditContext>(null)

    // const { columns, rows, childLookup } = useMemo((): { columns: string[], rows: string[], childLookup: ChildLookup } => {

    //     const context = ItemData.get<GridParentData>(item, DATA_KEY, {})

    //     const childLookup: ChildLookup = {}
    //     for(const c of children) {
    //         const dat = ItemData.get<GridChildData>(c, DATA_KEY, {})
    //         const { col = 0, row = 0 } = dat
    //         if (!childLookup[col]) childLookup[col] = []
    //         if (!childLookup[col][row]) childLookup[col][row] = [c]
    //         else childLookup[col][row].push(c)
    //     }

    //     return {
    //         columns: nonEmptyArrayOrDefault(context.columns, ['Default']),
    //         rows: nonEmptyArrayOrDefault(context.rows, ['Default']),
    //         childLookup
    //     }
    // }, [ item, children ])

    // const handleAddColumn = useCallback(() => {
    //     if (!item) return
    //     ItemData.mutate<GridParentData>(item, DATA_KEY, {}, d => {
    //         if (!d.columns) d.columns = ['New Column']
    //         else d.columns.push('New Column')
    //     })
    //     useItemStore.getState().updateOne(item)
    // }, [item])

    // const handleAddRow = useCallback(() => {
    //     if (!item) return
    //     ItemData.mutate<GridParentData>(item, DATA_KEY, {}, d => {
    //         if (!d.rows) d.rows = ['New Row']
    //         else d.rows.push('New Row')
    //     })
    //     console.log(item.data)
    //     useItemStore.getState().updateOne(item)
    // }, [item])

    // const handleSubmitEditContext = useCallback((value: string) => {
    //     ItemData.mutate<GridParentData>(item, DATA_KEY, {}, d => {
    //         if (!editContext) return
    //         const subkey = editContext?.type === 'column' ? 'columns' : 'rows'
    //         if (!d[subkey]) return
    //         //@ts-ignore
    //         d[subkey][editContext.idx] = value
    //     })
    //     if (item) useItemStore.getState().updateOne(item)
    // }, [editContext])

    // const handleDeleteViaEditContext = useCallback(() => {
    //     ItemData.mutate<GridParentData>(item, DATA_KEY, {}, d => {
    //         if (!editContext) return
    //         const subkey = editContext?.type === 'column' ? 'columns' : 'rows'
    //         if (!d[subkey]) return
    //         d[subkey]?.splice(editContext.idx, 1)
    //     })
    //     if (item) useItemStore.getState().updateOne(item)
    // }, [editContext])

    // return (
    //     <div>

    //         {/* Column titles */}
    //         <Flex row>
    //             <Bump w={ EXPANDO_COL_WIDTH } />
    //             { columns.map((_, idx) => (
    //                 // <TrText medium bold style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}>{c}</TrText>
    //                 <GridColumnHeader idx={ idx } item={ item } onEdit={ () => setEditContext({ item, idx, type: 'column' }) } />
    //             )) }
    //             <Button variant='submit' onClick={ handleAddColumn }>+ Column</Button>
    //         </Flex>

    //         {
    //             // Separate into component with expanded state member, create Expando component, Spinny component
    //             rows.map((r, ridx) => (
    //                 <Flex row>

    //                     <div style={{ minWidth: EXPANDO_COL_WIDTH }}>
    //                         {/* Expando */}
    //                     </div>

    //                     <div>

    //                         <GridRowHeader idx={ ridx } item={ item } onEdit={ () => setEditContext({ item, idx: ridx, type: 'row' }) } />
    //                         {/* Expand this <Flex> */}
    //                         <Flex row>
    //                         { columns.map((c, cidx) => <GridCell parent={ item } items={ childLookup[cidx]?.[ridx] } col={ cidx } row={ ridx } />) }
    //                         </Flex>

    //                     </div>
    //                 </Flex>
    //             ))
    //         }

    //         <Button variant='submit' onClick={ handleAddRow }>+ Row</Button>

    //         <BottomSheetPopover
    //             open={ editContext !== null }
    //             onClose={ () => setEditContext(null) } title={ `Edit ${ editContext?.type === 'column' ? 'Column' : 'Row' }` }
    //             >
    //                 <GridFieldEditForm
    //                     context={ editContext }
    //                     onSubmit={ v => { handleSubmitEditContext(v); setEditContext(null); } }
    //                     onDelete={ () => { handleDeleteViaEditContext(); setEditContext(null); } }
    //                     />
    //         </BottomSheetPopover>

    //     </div>
    // )
    
    return null

})

const GridFieldEditForm = React.memo((props: {
    onSubmit: (value: string) => void
    onDelete: () => void
    context: GridEditContext
}) => {

    // const [ value, setValue ] = useState<string>('')

    // const { context, onSubmit, onDelete } = props
    // useEffect(() => {
    //     const defaultValue = ItemData.get<GridParentData>(context?.item || null, DATA_KEY, {})?.[context?.type === 'column' ? 'columns' : 'rows']?.[context?.idx || 0]
    //     setValue(defaultValue || '')
    // }, [props.context])

    // const handleSubmit = () => onSubmit(value)

    // return (
    //     <Flex column>

    //         <TextInput onEnter={ handleSubmit } value={ value } onChange={ setValue } />
    //         <Bump h={ 20 } />

    //         <Flex row justify='flex-end'>
    //             <Button onClick={ onDelete }>Delete</Button>
    //             <Bump w={ 20 } />
    //             <Button variant='submit' onClick={ handleSubmit }>Save</Button>
    //         </Flex>

    //     </Flex>
    // )

    return null

})

const GridColumnHeader = React.memo((props: { item: Item | null, idx: number, onEdit: () => void }) => {

    // const { item, idx, onEdit } = props
    // const title = ItemData.get<GridParentData>(item, DATA_KEY, {}).columns?.[idx] || 'Unnamed Column'

    // return (
    //     <Flex row style={{ width: COL_WIDTH, minWidth: COL_WIDTH }} align='center'>
    //         <TrText medium bold>{title}</TrText>
    //         <Bump w={ 10 } />
    //         <FontAwesomeIcon icon={ faPencil } onClick={ onEdit } size={ 'sm' } style={{ cursor: 'pointer', opacity: 0.2 }} />
    //     </Flex>
    // )

    return null

})

const GridRowHeader = React.memo((props: { item: Item | null, idx: number, onEdit: () => void }) => {

    // const { item, idx, onEdit } = props
    // const title = ItemData.get<GridParentData>(item, DATA_KEY, {}).rows?.[idx] || 'Unnamed Row'

    // return (
    //     <Flex row align='center' style={{ borderBottom: 'solid 1px #efefef', paddingBottom: 10, marginBottom: 10 }}>
    //         <TrText medium>{title}</TrText>
    //         <Bump w={ 10 } />
    //         <FontAwesomeIcon icon={ faPencil } onClick={ onEdit } size={ 'sm' } style={{ cursor: 'pointer', opacity: 0.2 }} />
    //     </Flex>
    // )

    return null

})

const GridCell = React.memo((props: {
    parent: Item | null
    items: Item[]
    col: number
    row: number
}) => {

    return null

    // const { parent, items, col, row } = props

    // const handleDrop = (dropped: Item) => {
    //     ItemData.mutate<GridChildData>(dropped, DATA_KEY, {}, d => {
    //         d.col = col
    //         d.row = row
    //     })
    //     useItemStore.getState().updateOne(dropped)
    // }

    // return (
    //     <ItemDropZone noDrag onDrop={ handleDrop }>
    //         <div style={{ width: COL_WIDTH, minWidth: COL_WIDTH, minHeight: 50, paddingBottom: 50 }}>
    //             {/* TODO -- Progress bar */}
    //             { items?.map(item => <GridItem item={ item } />) }
    //         </div>
    //     </ItemDropZone>
    // )

})

const GridItem = React.memo((props: { item: Item }) => {

    const h = useHistory()
    const { item } = props

    return (
        <ItemDropZone itemId={ item?._id } noDrop>
            <Flex onClick={ () => h.push(Routes.item(item?._id)) } style={{ cursor: 'pointer' }}>
                <Checkbox itemId={ item._id } />
                <Bump w={ 10 } />
                <TrText>{ item.title }</TrText>
            </Flex>
        </ItemDropZone>
    )

})