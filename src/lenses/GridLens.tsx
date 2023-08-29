import { GridView } from "../components/GridView/GridView";
import { ItemLens } from "./ItemLens";

export const GridLens: ItemLens = {

    Name: 'GridItemLens',
    TypeId: 'grid',
    Test: i => /^#grid/.test(i.description || ''),

    Self: {
        AsSelected: {
            RenderChildList: (props) => <GridView parentItemId={ props.itemId } />
        },
        FullWidthSelected: true
    }

}