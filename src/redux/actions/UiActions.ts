import { Actions } from "./Actions";

export const SelectItemAction = (itemId: string) => ({ type: Actions.Ui.SelectItem, data: itemId })
