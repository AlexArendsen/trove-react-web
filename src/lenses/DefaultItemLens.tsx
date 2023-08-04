import { ItemInputForm } from "../components/ItemInputForm/ItemInputForm";
import { ItemLens } from "./ItemLens";
import { Text } from "../components/Text/Text";
import { useItem } from "../hooks/UseItem";
import { ItemList } from "../components/ItemList/ItemList";
import { DefaultItemEditorControls, DefaultItemEditorDisplay } from "../screens/ItemsScreen/SelectedItemDisplay/SelectedItemDisplay";
import { useWindowSize } from "../hooks/UseWindowSize";
import { CheckItemAction, UncheckItemAction } from "../redux/actions/ItemActions";
import { Item } from "../redux/models/Items/Item";

export const DefaultItemLens : ItemLens = {

    Name: 'DefaultItemLens',

    Default: {

        AsAncestor: {
            RenderHeader: (props: { itemId: string, onClick: () => void }) => {
                const { itemId, onClick } = props
                const { item } = useItem(itemId)
                return <Text bold mediumLarge onClick={ onClick } style={{ cursor: 'pointer' }}>{ item?.title }</Text>
            },
            RenderNewItemInputForm: (props: { itemId: string }) => <ItemInputForm darker itemId={ props.itemId } style={{ margin: '20px 0' }} />,
            RenderChildList: (props: { itemId: string, selectedItemId: string }) => {
                const { children } = useItem(props.itemId)
                return <ItemList selected={ props.selectedItemId } items={ children } display='compact-list' navOnClick />
            },
        },

        AsSelected: {
            RenderHeader: (props) => <DefaultItemEditorDisplay {...props} />,
            RenderEditor: (props) => <DefaultItemEditorControls { ...props } />,
            RenderNewItemInputForm: (props: { itemId: string }) => {
                const { isMobile } = useWindowSize()
                return <ItemInputForm itemId={ props.itemId } style={{ marginTop: 20, marginBottom: isMobile ? 20 : 60 }} />
            },
            RenderChildList: (props: { itemId: string }) => {
                const { children } = useItem(props.itemId)
                return <ItemList items={ children } navOnClick />
            }
        },

        OnCheck: async (dispatch: any, item: Item) => await dispatch(CheckItemAction(item._id)),
        OnUncheck: async (dispatch: any, item: Item) => await dispatch(UncheckItemAction(item._id)),


    }

}