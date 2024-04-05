import { LensConfiguration } from "../components/ItemEditor/ItemEditorNewLensPage"
import { Item } from "../redux/models/Items/Item"

type El = JSX.Element | null

export interface ItemLens {

    Name: string
    TypeId: string
    Test?: (item: Item) => boolean

    Default?: ItemLensItemSpec // How to display anything, should only be defined by DefaultItemLens
    Self?: ItemLensItemSpec // How to display the lensed item
    Children?: ItemLensItemSpec // How to display the lensed item's direct children

}

export interface ItemLensItemSpec {

    AsSelected?: ItemLensDisplaySpec // How to show this item when it is the selected item
    AsAncestor?: ItemLensDisplaySpec // How to show this item when it is the parent / grandparent of the selected item
    OnCheck?: (item: Item) => Promise<void>
    OnUncheck?: (item: Item) => Promise<void>

    FullWidthSelected?: boolean

}

export interface ItemLensDisplaySpec {
    RenderHeader?: (props: { itemId: string, onClick: () => void, config: LensConfiguration }) => El,
    RenderEditor?: (props: { itemId: string, onDone: () => void, config: LensConfiguration }) => El,
    RenderNewItemInputForm?: (props: { itemId: string, config: LensConfiguration }) => El,
    RenderChildList?: (props: { itemId: string, selectedItemId: string, onClick: (item: Item) => void, config: LensConfiguration }) => El,
}