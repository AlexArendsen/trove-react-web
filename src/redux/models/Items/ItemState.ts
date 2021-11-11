import { ApiData } from "../ApiData";
import { Item } from "./Item";

export class ItemState {

	all: ApiData<Item[]>
	byId: { [itemId: string]: Item }
	byParent: { [itemId: string]: Item[] }
	topLevel: Item[]

	constructor() {
		this.all = new ApiData([])
		this.byId = {}
		this.byParent = {}
		this.topLevel = []
	}

}