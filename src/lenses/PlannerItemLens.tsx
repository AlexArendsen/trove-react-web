import { PlannerView } from "../components/PlannerView/PlannerView";
import { TaskEditor } from "../components/TasksLens/TaskEditor/TaskEditor";
import { ItemLens } from "./ItemLens";

export const PlannerItemLens : ItemLens = {

    Name: 'PlannerItemLens',
    Test: (i) => /^#planner/.test(i.description || ''),

    Self: {
        AsSelected: {
            // RenderHeader: (props) => <TaskEditor />,
            RenderChildList: (props) => <PlannerView { ...props } />
        },
        FullWidthSelected: true
    }

}