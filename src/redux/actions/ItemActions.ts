import { DataPlan } from "../../utils/DataPlan/DataPlan";
import { Actions } from "./Actions";
import { Item } from "../models/Items/Item";
import { GetConfig } from "../../utils/Config";
import { uuid } from "../../utils/Uuid";
import { Api } from "../Api";
import { ItemSort } from "../models/Items/ItemSort";

export const GetAllItemsAction = () => new DataPlan<Item[]>('items:get-all')
    .withReduxActions(Actions.Items.GetAll)
    .do(() => Api.get('/items'))
    //.withCached(() => {
        //const cached = localStorage.getItem('trove-items')
        //if (cached) return JSON.parse(cached)
    //})
    //.withDataHandler(list => {
        //localStorage.setItem('trove-items', JSON.stringify(list))
        //return list
    //})
    .run();

export const CheckItemAction = (itemId: string) => new DataPlan('items:check')
    .withReduxActions(Actions.Items.Check).withSubject(itemId).do(() => Api.put(`/item/${ itemId }/check`, null)).run()

export const UncheckItemAction = (itemId: string) => new DataPlan('items:uncheck')
    .withReduxActions(Actions.Items.Uncheck).withSubject(itemId).do(() => Api.put(`/item/${ itemId }/uncheck`, null)).run()

export const DeleteOneItemAction = (itemId: string) => new DataPlan('items:delete-one')
    .withSubject(GetConfig().Store?.getState().items.byId[itemId])
    .withReduxActions(Actions.Items.DeleteOne).do(() => Api.del(`/item/${ itemId }`)).run()

export const DeleteManyItemsAction = (itemIds: string[]) => new DataPlan('items:delete-many')
    .withSubject({ ids: itemIds })
    .withReduxActions(Actions.Items.DeleteMany)
    .do(() => Api.del(`/items`, null, { ids: itemIds.join(',') })).run()

export const MoveOneItemAction = (itemId: string, newParentId: string) => {
    const existing = GetConfig().Store?.getState().items.byId[itemId];
    return new DataPlan('items:move-one')
        .assert(() => itemId !== newParentId, 'Cannot make an item a parent of itself')
        .withReduxActions(Actions.Items.MoveOne)
        .withSubject({ child: itemId, oldParent: existing?.parent_id, newParent: newParentId })
        .do(() => Api.put(`/item`, { ...existing, parent_id: newParentId })).run()
}

export const MoveManyItemsAction = (itemIds: string[], newParentId: string) => new DataPlan('items:move-many')
    .withReduxActions(Actions.Items.MoveMany)
    .withSubject({ children: itemIds, newParent: newParentId })
    .do(() => Api.put(`/items/move`, { ids: itemIds, new_parent: newParentId })).run()

export const UpdateOneItemAction = (item: Item) => new DataPlan('items:update-one')
    .withSubject({ new: item, old: GetConfig().Store?.getState().items.byId[item._id] })
    .withReduxActions(Actions.Items.UpdateOne).do(() => Api.put('/item', item)).run()

export const SortItemsAction = (updates: ItemSort[]) => new DataPlan('items:sort')
    .withSubject(updates)
    .withReduxActions(Actions.Items.Sort)
    .do(() => Api.put('/items/sort', updates))
    .run()

export const AddItemAction = (title: string, parent_id: string | null, extras?: Partial<Item>) => new DataPlan('items:add-one')
    .withSubject({ title, parent_id, _id: uuid() })
    .withReduxActions(Actions.Items.Add).do(() => Api.post('/item', { title, parent_id, ...extras })).run()

export const SearchItemsAction = (query: string) => ({ type: Actions.Items.Search, data: query })