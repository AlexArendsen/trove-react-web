import { ItemLens } from "../ItemLens";
import { LayoutItemEditor } from "./LayoutItemEditor";
import { LayoutItemView } from "./LayoutView";

export const LayoutItemLens : ItemLens = {

    Name: 'LayoutItemLens',
    Test: i => /^#layout/.test(i.description || ''),

    Self: {
        AsSelected: {
            RenderNewItemInputForm: () => null,
            RenderEditor: (props) => <LayoutItemEditor { ...props } />,
            RenderChildList: (props) => <LayoutItemView { ...props } />
        },
        FullWidthSelected: true
    }

}