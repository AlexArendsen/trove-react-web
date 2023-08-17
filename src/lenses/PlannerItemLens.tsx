import { PlannerView } from "../components/PlannerView/PlannerView";
import { ItemLens } from "./ItemLens";

export const PlannerItemLens : ItemLens = {

    Name: 'PlannerItemLens',
    Test: (i) => /^#planner/.test(i.description || ''),

    Self: {
        AsSelected: {
            RenderChildList: (props) => <PlannerView { ...props } />
        },
        FullWidthSelected: true
    }

}