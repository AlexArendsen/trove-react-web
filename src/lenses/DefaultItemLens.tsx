import { ItemInputForm } from "../components/ItemInputForm/ItemInputForm";
import { ItemLens } from "./ItemLens";
import { TrText } from "../components/Text/Text";
import { useItem } from "../hooks/UseItem";
import { ItemList } from "../components/ItemList/ItemList";
import { DefaultItemEditorControls, DefaultItemEditorDisplay } from "../screens/ItemsScreen/SelectedItemDisplay/SelectedItemDisplay";
import { useWindowSize } from "../hooks/UseWindowSize";
import { Item } from "../redux/models/Items/Item";
import { useItemStore } from "../stores/ItemStore/useItemStore";

export const DefaultItemLens : ItemLens = {

    Name: 'DefaultItemLens',
    TypeId: 'default',

    Default: {

        AsAncestor: {
            RenderHeader: (props: { itemId: string, onClick: () => void }) => {
                const { itemId, onClick } = props
                const { item } = useItem(itemId)
                return <TrText bold mediumLarge onClick={ onClick } style={{ cursor: 'pointer' }}>{ item?.title }</TrText>
            },
            RenderNewItemInputForm: (props: { itemId: string }) => <ItemInputForm darker itemId={ props.itemId } style={{ margin: '20px 0' }} />,
            RenderChildList: (props: { itemId: string, selectedItemId: string, onClick: (item: Item) => void }) => {
                const { children } = useItem(props.itemId)
                return <ItemList selected={ props.selectedItemId } items={ children } parentId={ props.itemId } display='compact-list' onClick={ props.onClick } />
            },
        },

        AsSelected: {
            RenderHeader: (props) => <DefaultItemEditorDisplay {...props} />,
            RenderEditor: (props) => <DefaultItemEditorControls { ...props } />,
            RenderNewItemInputForm: (props: { itemId: string }) => {
                const { isMobile } = useWindowSize()
                return <ItemInputForm itemId={ props.itemId } style={{ marginTop: 20, marginBottom: isMobile ? 20 : 60 }} />
            },
            RenderChildList: (props: { itemId: string, onClick: (item: Item) => void }) => {
                const { children } = useItem(props.itemId)
                return <ItemList items={ children } parentId={ props.itemId } onClick={ props.onClick } />
            }
        },

        OnCheck: async (item: Item) => await useItemStore.getState().checkOne(item?._id),
        OnUncheck: async (item: Item) => await useItemStore.getState().uncheckOne(item?._id)


    }

}